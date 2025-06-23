/* eslint-disable import/no-anonymous-default-export */
import { DurableObject } from "cloudflare:workers";
import { jwtVerify } from "jose";
import { default as handler } from "./.open-next/worker.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    let path = url.pathname.slice(1).split("/");

    if (path[0] == "api" && path[1] == "rooms") {
      let id = env.REGISTRY.idFromName("main");
      let registryObject = env.REGISTRY.get(id);
      return registryObject.fetch(request);
    }

    if (path[0] == "api" && path[1] == "room") {
      let id = env.ROOMS.idFromName(path[2]);
      let roomObject = env.ROOMS.get(id);
      return roomObject.fetch(request);
    }

    return handler.fetch(request, env, ctx);
  },
};

export class Registry extends DurableObject {
  constructor(state, env) {
    super(state, env);
    this.env = env;
    this.state = state;
    this.storage = state.storage;
    this.state.blockConcurrencyWhile(async () => {
      this.rooms = (await this.storage.get("rooms")) || [];
    });
    this.sessions = new Map();
    this.state.getWebSockets().forEach((webSocket) => {
      let meta = webSocket.deserializeAttachment();
      this.sessions.set(webSocket, { ...meta });
    });
  }

  async fetch(request) {
    let pair = new WebSocketPair();

    await this.handleSession(pair[1]);

    return new Response(null, {
      status: 101,
      webSocket: pair[0],
      headers: {
        Upgrade: "websocket",
        Connection: "Upgrade",
      },
    });
  }

  async saveRooms() {
    try {
      await this.storage.put("rooms", this.rooms);
    } catch (error) {
      console.error("Failed to save rooms to storage:", error);
    }
  }

  async handleSession(ws) {
    this.state.acceptWebSocket(ws);
    this.sessions.set(ws);
    const enabledRooms = this.rooms.filter((room) => room.enabled);
    const message = JSON.stringify({
      event: "roomList",
      rooms: enabledRooms,
    });
    ws.send(message);
  }

  async webSocketClose(ws, code, reason, wasClean) {
    this.sessions.delete(ws);
  }

  async webSocketError(ws, error) {
    this.sessions.delete(ws);
  }

  async webSocketMessage(ws, message, env) {
    const { event } = JSON.parse(message);

    switch (event) {
      case "newRoom": {
        const { token } = JSON.parse(message);

        const username = await verifyToken(token, this.env);

        if (!username) {
          return;
        }

        const code = generateRoomCode(this.rooms);

        this.rooms.push({
          name: `${username}'s Room`,
          code,
          enabled: false,
          owner: username,
        });

        ws.send(JSON.stringify({ event: "roomCode", code }));
      }
    }
  }

  async enableRoom(code) {
    const index = this.rooms.findIndex((r) => r.code == code);

    this.rooms[index].enabled = true;

    this.broadcastRoomList();
  }

  async disableRoom(code) {
    const index = this.rooms.findIndex((r) => r.code == code);

    this.rooms[index].enabled = false;

    this.broadcastRoomList();
  }

  async deleteRoom(code) {
    const index = this.rooms.findIndex((r) => r.code == code);

    this.rooms.splice(index, 1);

    this.broadcastRoomList();
  }

  async getRoomDetails(code) {
    return this.rooms.find((r) => r.code == code);
  }

  broadcastRoomList() {
    this.saveRooms();
    const enabledRooms = this.rooms.filter((room) => room.enabled);
    const message = JSON.stringify({
      event: "roomList",
      rooms: enabledRooms,
    });

    this.sessions.forEach((_, ws) => {
      try {
        ws.send(message);
      } catch (error) {
        this.sessions.delete(ws);
      }
    });
  }
}

function generateRoomCode(rooms) {
  let code = Math.random().toString(36).substring(2, 8).toUpperCase();
  if (rooms.find((r) => r.code == code)) {
    return generateRoomCode(rooms);
  }
  return code;
}

async function verifyToken(token, env) {
  try {
    const secret = new TextEncoder().encode(env.TOKEN_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      console.log("Token has expired.");
      return;
    }

    return payload.username;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return false;
  }
}

export class Room extends DurableObject {
  constructor(state, env) {
    super(state, env);
    this.env = env;
    this.state = state;
    this.storage = state.storage;
    this.state.blockConcurrencyWhile(async () => {
      this.code = (await this.storage.get("code")) || null;
      this.owner = (await this.storage.get("owner")) || null;
      this.name = (await this.storage.get("name")) || null;
      this.player1Health = (await this.storage.get("player1Health")) || 100;
      this.player2Health = (await this.storage.get("player2Health")) || 100;
      this.player1Xp = (await this.storage.get("player1Xp")) || 0;
      this.player2Xp = (await this.storage.get("player2Xp")) || 0;
      this.started = (await this.storage.get("started")) || false;
    });
    this.sessions = new Map();
    this.state.getWebSockets().forEach((webSocket) => {
      let meta = webSocket.deserializeAttachment();
      this.sessions.set(webSocket, { ...meta });
    });
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") != "websocket") {
      return new Response("expected websocket", { status: 400 });
    }

    const url = new URL(request.url);
    const path = url.pathname.slice(1).split("/");
    const roomCode = path[2];

    if (!this.code) {
      await this.initializeRoom(roomCode);
    }

    let pair = new WebSocketPair();

    await this.handleSession(pair[1]);

    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async saveRoomDetails() {
    try {
      await this.storage.put("code", this.code);
      await this.storage.put("owner", this.owner);
      await this.storage.put("name", this.name);
    } catch (error) {
      console.error("Failed to save details to storage:", error);
    }
  }

  async broadcastMessage(message) {
    this.sessions.forEach((_, ws) => {
      try {
        ws.send(message);
      } catch (error) {
        this.sessions.delete(ws);
      }
    });
  }

  async handleSession(ws) {
    this.state.acceptWebSocket(ws);
    this.sessions.set(ws, {});
  }

  async closeOrError(ws) {
    const session = this.sessions.get(ws);
    const username = session?.username;

    this.sessions.delete(ws);

    if (!username || !this.owner) {
      return;
    }

    const registryId = this.env.REGISTRY.idFromName("main");
    const registryStub = this.env.REGISTRY.get(registryId);

    if (this.owner == username) {
      registryStub.deleteRoom(this.code);
      return;
    }

    await registryStub.enableRoom(this.code);
  }

  async webSocketClose(ws) {
    this.closeOrError(ws);
  }

  async webSocketError(ws) {
    this.closeOrError(ws);
  }

  async webSocketMessage(ws, message) {
    const { event } = JSON.parse(message);

    if (!this.started) {
      switch (event) {
        case "join": {
          const { token } = JSON.parse(message);

          const username = await verifyToken(token, this.env);

          if (!username) {
            return;
          }

          let session = this.sessions.get(ws) || {};
          session.username = username;
          this.sessions.set(ws, session);

          ws.serializeAttachment({ username });

          ws.send(
            JSON.stringify({
              event: "details",
              owner: this.owner,
              name: this.name,
            })
          );

          const registryId = this.env.REGISTRY.idFromName("main");
          const registryStub = this.env.REGISTRY.get(registryId);

          if (username == this.owner) {
            await registryStub.enableRoom(this.code);

            ws.send(JSON.stringify({ event: "owner" }));

            return;
          }

          await registryStub.disableRoom(this.code);
        }
        case "start": {
          const session = this.sessions.get(ws);
          const username = session?.username;

          if (this.owner == username) {
            const { cards } = JSON.parse(message);
            this.start(cards);
          }
        }
      }
    } else {
      switch (event) {
        case "attack": {
          const session = this.sessions.get(ws);
          const username = session?.username;

          if (this.owner == username) {
            if (this.player1Xp > 0) {
              this.setHealth(2, this.player2Health - 10);
              this.setXp(1, this.player1Xp - 1);
            }
            return;
          }
          if (this.player2Xp > 0) {
            this.setHealth(1, this.player1Health - 10);
            this.setXp(2, this.player2Xp - 1);
          }
          break;
        }
        case "heal": {
          const session = this.sessions.get(ws);
          const username = session?.username;

          if (this.owner == username) {
            if (this.player1Xp > 0 && this.player1Health < 100) {
              this.setHealth(1, this.player1Health + 10);
              this.setXp(1, this.player1Xp - 1);
            }
            return;
          }
          if (this.player2Xp > 0 && this.player2Health < 100) {
            this.setHealth(2, this.player2Health + 10);
            this.setXp(2, this.player2Xp - 1);
          }
          break;
        }
        case "correct": {
          const session = this.sessions.get(ws);
          const username = session?.username;

          if (this.owner == username) {
            this.setXp(1, this.player1Xp + 1);
            return;
          }
          this.setXp(2, this.player2Xp + 1);
          break;
        }
      }
    }
  }

  async start(cards) {
    this.setHealth(1, 100);
    this.setHealth(2, 100);
    this.setXp(1, 0);
    this.setXp(2, 0);
    this.started = true;
    this.storage.put("started", true);

    let nonOwnerPlayer = null;
    for (const [ws, session] of this.sessions) {
      if (session.username && session.username !== this.owner) {
        nonOwnerPlayer = session.username;
        break;
      }
    }
    this.broadcastMessage(
      JSON.stringify({
        event: "start",
        cards,
        owner: this.owner,
        player: nonOwnerPlayer,
      })
    );
  }

  async setHealth(player, health) {
    let nonOwnerPlayer = null;
    for (const [ws, session] of this.sessions) {
      if (session.username && session.username !== this.owner) {
        nonOwnerPlayer = session.username;
        break;
      }
    }
    if (player == 1) {
      this.player1Health = health;
      await this.storage.put("player1Heath", health);
      this.broadcastMessage(
        JSON.stringify({
          event: "healths",
          one: [this.owner, this.player1Health],
          two: [nonOwnerPlayer, this.player2Health],
        })
      );
      if (this.player1Health <= 0) {
        this.broadcastMessage(
          JSON.stringify({
            event: "end",
            one: [this.owner, "lose"],
            two: [nonOwnerPlayer, "win"],
          })
        );
      }
      return;
    }
    this.player2Health = health;
    await this.storage.put("player2Heath", health);
    this.broadcastMessage(
      JSON.stringify({
        event: "healths",
        one: [this.owner, this.player1Health],
        two: [nonOwnerPlayer, this.player2Health],
      })
    );
    if (this.player2Health <= 0) {
      this.broadcastMessage(
        JSON.stringify({
          event: "end",
          one: [this.owner, "win"],
          two: [nonOwnerPlayer, "lose"],
        })
      );
    }
  }

  async setXp(player, xp) {
    let nonOwnerPlayer = null;
    for (const [ws, session] of this.sessions) {
      if (session.username && session.username !== this.owner) {
        nonOwnerPlayer = session.username;
        break;
      }
    }
    if (player == 1) {
      this.player1Xp = xp;
      await this.storage.put("player1Xp", xp);
      this.broadcastMessage(
        JSON.stringify({
          event: "xps",
          one: [this.owner, this.player1Xp],
          two: [nonOwnerPlayer, this.player2Xp],
        })
      );
      return;
    }
    this.player2Xp = xp;
    await this.storage.put("player2Xp", xp);
    this.broadcastMessage(
      JSON.stringify({
        event: "xps",
        one: [this.owner, this.player1Xp],
        two: [nonOwnerPlayer, this.player2Xp],
      })
    );
  }

  async initializeRoom(roomCode) {
    const registryId = this.env.REGISTRY.idFromName("main");
    const registryStub = this.env.REGISTRY.get(registryId);

    try {
      const roomDetails = await registryStub.getRoomDetails(roomCode);
      if (roomDetails) {
        this.code = roomDetails.code;
        this.owner = roomDetails.owner;
        this.name = roomDetails.name;
        this.saveRoomDetails();
      }
    } catch (error) {
      console.error("Failed to initialize room details:", error);
    }
  }
}

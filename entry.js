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

  async handleSession(ws) {
    this.state.acceptWebSocket(ws);
    this.sessions.set(ws, {});
  }

  async closeOrError(ws) {
    const session = this.sessions.get(ws);
    const username = session?.username;

    console.log(username);
    console.log(this.owner);

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
    }
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

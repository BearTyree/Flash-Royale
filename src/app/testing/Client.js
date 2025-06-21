"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MultiplayerClient({ token }) {
  const router = useRouter();

  const ws = new WebSocket(
    (process.env.NEXT_PUBLIC_WS_SERVER || "") + "/rooms"
  );
  ws.addEventListener("open", (event) => {
    ws.send(JSON.stringify({ event: "newRoom", token }));
  });

  ws.addEventListener("message", (message) => {
    const { event } = JSON.parse(message.data);

    switch (event) {
      case "roomCode": {
        const { code } = JSON.parse(message.data);
        router.push(`/room/${code}`);
        break;
      }
      case "roomList": {
        const { rooms } = JSON.parse(message.data);
        console.log(rooms);
      }
    }
  });

  return <></>;
}

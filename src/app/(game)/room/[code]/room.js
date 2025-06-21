"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function RoomClient({ token }) {
  const params = useParams();
  const code = params.code;

  const ws = new WebSocket(
    (process.env.NEXT_PUBLIC_WS_SERVER || "") + "/room" + `/${code}`
  );

  ws.addEventListener("open", (event) => {
    ws.send(JSON.stringify({ event: "join", token }));
  });

  ws.addEventListener("message", (message) => {
    const { event } = JSON.parse(message.data);

    switch (event) {
      case "roomCode": {
        const { code } = JSON.parse(message.data);
        router.push(`/room/${code}`);
        break;
      }
    }
  });

  return <>Room {}</>;
}

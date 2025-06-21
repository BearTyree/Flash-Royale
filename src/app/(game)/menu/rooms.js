"use client";

import styles from "@/styles/menu.module.css";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Rooms({ token }) {
  const [rooms, setRooms] = useState([]);
  const wsRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const ws = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_SERVER || "") + "/rooms"
    );

    wsRef.current = ws;

    ws.addEventListener("message", (message) => {
      const { event } = JSON.parse(message.data);

      switch (event) {
        case "roomCode": {
          const { code } = JSON.parse(message.data);
          router.push(`/room/${code}`);
          break;
        }
        case "roomList": {
          const { rooms: roomList } = JSON.parse(message.data);
          setRooms(roomList);
          break;
        }
      }
    });

    // Cleanup WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, [router]);

  return (
    <>
      <div className={styles.roomsList}>
        {rooms?.map((room) => (
          <div key={room.code} className={styles.room}>
            <p className={styles.roomName}>{room.name}</p>
            <button onClick={() => router.push(`/room/${room.code}`)}>
              Join Room
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ event: "newRoom", token }));
          }
        }}
      >
        Create Room
      </button>
    </>
  );
}

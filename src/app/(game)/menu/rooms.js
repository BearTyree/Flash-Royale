"use client";

import styles from "@/styles/menu.module.css";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Rooms({ token, cardSetsLength }) {
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
        {rooms.length == 0 && (
          <p className={styles.noRoomsText}>no rooms available</p>
        )}
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
            if (cardSetsLength > 0) {
              wsRef.current.send(JSON.stringify({ event: "newRoom", token }));
            } else {
              alert(
                "You must have at least one flashcard set created in order to start a room."
              );
              router.push("/sets");
            }
          }
        }}
      >
        Create Room
      </button>
    </>
  );
}

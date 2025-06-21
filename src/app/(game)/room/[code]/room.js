"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomClient({ token, cardSets }) {
  const [owner, setOwner] = useState(null);
  const [name, setName] = useState(null);
  const [ownRoom, setOwnRoom] = useState(false);

  const params = useParams();
  const code = params.code;
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_SERVER || "") + "/room" + `/${code}`
    );

    wsRef.current = ws;

    ws.addEventListener("open", (event) => {
      ws.send(JSON.stringify({ event: "join", token }));
    });

    ws.addEventListener("message", (message) => {
      const { event } = JSON.parse(message.data);

      switch (event) {
        case "details": {
          const { owner: ownerData, name: nameData } = JSON.parse(message.data);

          setOwner(ownerData);
          setName(nameData);
          break;
        }
        case "owner": {
          setOwnRoom(true);
          break;
        }
      }
    });
  }, [code, token]);

  return (
    <>
      {name}
      <br />
      {ownRoom && (
        <div>
          {cardSets.map((set) => (
            <div key={set.id}>
              {JSON.parse(set.cards).name}
              <br />
              <button>Use Set</button>
            </div>
          ))}
          <button>Start</button>
        </div>
      )}
    </>
  );
}

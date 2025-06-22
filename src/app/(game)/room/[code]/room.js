"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import Play from "@/components/play/play.js";

export default function RoomClient({ token, cardSets }) {
  const [owner, setOwner] = useState(null);
  const [name, setName] = useState(null);
  const [ownRoom, setOwnRoom] = useState(false);
  const [started, setStarted] = useState(false);
  const [cards, setCards] = useState(
    cardSets[0] ? JSON.parse(cardSets[0].cards) : null
  );
  const [me, setMe] = useState(null);
  const [opponent, setOpponent] = useState(null);

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
        case "start": {
          const {
            cards: cardsData,
            owner: ownerData,
            player: playerData,
          } = JSON.parse(message.data);
          setMe(ownRoom ? ownerData : playerData);
          setOpponent(ownRoom ? playerData : ownerData);
          setCards(cardsData);
          setStarted(true);
        }
      }
    });
  }, [code, token, ownRoom]);

  if (!started) {
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
                <button
                  onClick={() => {
                    setCards(JSON.parse(set.cards));
                  }}
                >
                  Use Set
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                wsRef.current.send(
                  JSON.stringify({ event: "start", cards: cards })
                )
              }
            >
              Start
            </button>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <Play
        me={me}
        opponent={opponent}
        ws={wsRef.current}
        flashcards={cards.flashcards}
      />
    </>
  );
}

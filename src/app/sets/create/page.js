"use client";

import { useEffect, useState } from "react";
import { Flashcard, Set } from "./logic";
import styles from "@/styles/create.module.css";
import { createCardSet } from "@/actions/cards.js";

export default function Create() {
  const [cardSet, setCardSet] = useState(
    new Set("", [new Flashcard("", "", 0)])
  );

  function addCard() {
    setCardSet((prevSet) => {
      const newFlashcard = new Flashcard("", "", 0);
      return new Set(prevSet.name, [...prevSet.flashcards, newFlashcard]);
    });
  }

  function setCardSetName(name) {
    setCardSet((prevSet) => new Set(name, [...prevSet.flashcards]));
  }

  function updateCard(id, changes) {
    const newCard = cardSet.flashcards.find((c) => c.id == id);
    const index = cardSet.flashcards.findIndex((c) => c.id == id);

    if (changes.term) {
      newCard.term = changes.term;
    }

    if (changes.definition) {
      newCard.definition = changes.definition;
    }

    if (changes.value) {
      newCard.value = changes.value;
    }

    setCardSet((prevSet) => {
      let oldSet = prevSet;
      oldSet.flashcards.splice(index, 1, newCard);
      return new Set(prevSet.name, [...oldSet.flashcards]);
    });
  }

  async function publishCards() {
    await createCardSet(JSON.stringify(cardSet));
  }

  return (
    <>
      <div className={styles.flashcardCreationHeader}>
        <h1>Create a Set</h1>
        <div onClick={publishCards} className={styles.publishButton}>
          Publish
        </div>
      </div>
      <div className={styles.flashcardCreationContainer}>
        <form action="">
          <div className={styles.flashcardInput}>
            <input
              onChange={(e) => setCardSetName(e.target.value)}
              type="text"
              name="set-name"
              id="set-name"
            />
            <label htmlFor="set-name">Set Name</label>
          </div>
          {cardSet.flashcards?.map((card) => (
            <div key={card.id} className={styles.flashcardCreation}>
              <div className={styles.flashcardInput}>
                <textarea
                  onChange={(e) =>
                    updateCard(card.id, { term: e.target.value })
                  }
                  name="term"
                  id="term"
                ></textarea>
                <label htmlFor="term">Term</label>
              </div>
              <div className={styles.flashcardInput}>
                <textarea
                  onChange={(e) =>
                    updateCard(card.id, { definition: e.target.value })
                  }
                  name="definition"
                  id="definition"
                ></textarea>
                <label htmlFor="definition">Definition</label>
              </div>
              <div className={styles.flashcardInput}>
                <input
                  onChange={(e) =>
                    updateCard(card.id, { value: e.target.value })
                  }
                  type="number"
                  id="value"
                  name="value"
                  min="1"
                  max="9"
                />
                <label htmlFor="value">Value</label>
              </div>
            </div>
          ))}
        </form>
        <div onClick={addCard} className={styles.newFlashcard}>
          + New Flashcard
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Flashcard, Set } from "./logic";
import styles from "@/styles/edit.module.css";
import { createCardSet, updateCardSet } from "@/actions/cards.js";

export default function EditSetClient({ initialSet, id }) {
  const [cardSet, setCardSet] = useState(initialSet);

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
        <h1>Edit {cardSet.name}</h1>
        <div
          onClick={() => updateCardSet(id, JSON.stringify(cardSet))}
          className={styles.updateButton}
        >
          Update
        </div>
      </div>
      <div className={styles.flashcardCreationContainer}>
        <form action="">
          <div className={styles.flashcardInput}>
            <input
              value={cardSet.name}
              onChange={(e) => setCardSetName(e.target.value)}
              type="text"
              name="set-name"
              id="set-name"
            />
            <label htmlFor="set-name">Set Name</label>
          </div>
          {cardSet.flashcards?.map((card, index) => (
            <div key={card.id} className={styles.flashcardCreation}>
              <div className={styles.flashcardInput}>
                <textarea
                  onChange={(e) =>
                    updateCard(card.id, { term: e.target.value })
                  }
                  value={cardSet.flashcards[index].term}
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
                  value={cardSet.flashcards[index].definition}
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
                  value={cardSet.flashcards[index].value}
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

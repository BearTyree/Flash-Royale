"use client";

import { Flashcard, Set } from "./logic";
import styles from "@/styles/create.module.css"

export default function Create() {
    return (
        <>
            <div className={styles.flashcardCreationHeader}>
            <h1>Create a Set</h1>
            <div className={styles.publishButton}>Publish</div>
        </div>
        <div className={styles.flashcardCreationContainer}>
            <form action="">
            <div className={styles.flashcardInput}>
                <input type="text" name="set-name" id="set-name" />
                <label htmlFor="set-name">Set Name</label>
            </div>
            <div className={styles.flashcardCreation}>
                <div className={styles.flashcardInput}>
                <textarea name="term" id="term"></textarea>
                <label htmlFor="term">Term</label>
                </div>
                <div className={styles.flashcardInput}>
                <textarea name="definition" id="definition"></textarea>
                <label htmlFor="definition">Definition</label>
                </div>
                <div className={styles.flashcardInput}>
                <input type="number" id="value" name="value" min="1" max="9" />
                <label htmlFor="value">Value</label>
                </div>
            </div>
            </form>
            <div className={styles.newFlashcard}>+ New Flashcard</div>
        </div>
        </>
    );
}
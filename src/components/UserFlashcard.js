import styles from "@/styles/user-flashcard.module.css";


export default function UserFlashcard({flashcard}) {

  return (
    <div className={styles.flashcard}>
      <p className={styles.questionValue}>{flashcard.value}</p>
      <p className={styles.question}>{flashcard.term}</p>
    </div>
  );
}

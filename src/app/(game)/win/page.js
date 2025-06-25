import Link from "next/link";
import styles from "@/styles/result.module.css";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default function Win() {
  return (
    <>
      <div className={styles.Container}>
        <div className={styles.messageContainer}>
          <div className={styles.winMessage}>
            <h1>Victory</h1>
            <h3>You Won!</h3>
          </div>
          <Link href="/menu">
            <button>Return to Menu</button>
          </Link>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import styles from "@/styles/result.module.css"

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default function Lose() {
  return (
    <>
      <div className={styles.Container}>
        <div className={styles.messageContainer}>
          <div className={styles.loseMessage}>
            <h1>Defeat</h1>
            <h3>You Lost!</h3>
          </div>
          <Link href="/menu">
            <button>Return to Menu</button>
          </Link>
        </div>
      </div>
    </>
  );
}

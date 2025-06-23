import Header from "@/components/Header.js";
import styles from "@/styles/home.module.css";
import Link from "next/link";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.titleContainer}>
        <h1>Flash Royale</h1>
        <h3>A flashcard based learning game.</h3>
        <p>
          <Link href="/signup">Signup</Link> or <Link href="login">Login</Link>{" "}
          to start playing!
        </p>
      </div>
    </>
  );
}

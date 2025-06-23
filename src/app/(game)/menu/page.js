import styles from "@/styles/menu.module.css";

import { cookies } from "next/headers";

import Header from "@/components/Header";
import Rooms from "./rooms";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default async function Menu() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return (
    <>
      <Header />
      <div id={styles.menuContent}>
        <h1>Flash Royale</h1>
        <div className={styles.roomsContainer}>
          <div className={styles.roomsHeading}>
            <h2>Rooms</h2>
            <p>find a room</p>
          </div>
          <Rooms token={token} />
        </div>
      </div>
    </>
  );
}

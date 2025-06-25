import styles from "@/styles/menu.module.css";

import { cookies } from "next/headers";

import Header from "@/components/Header";
import Rooms from "./rooms";
import { getDbAsync } from "@/lib/drizzle";
import { authenticated } from "@/controllers/auth";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default async function Menu() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const db = await getDbAsync();
  const username = await authenticated();

  if (!username) {
    return <div>Error</div>;
  }

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  const cardSets = await db.query.cardSetsTable.findMany({
    where: (cardSets, { eq }) => eq(cardSets.ownerId, user.id),
  });

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
          <Rooms token={token} cardSetsLength={cardSets.length} />
        </div>
      </div>
    </>
  );
}

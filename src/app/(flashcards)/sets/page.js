import styles from "@/styles/sets.module.css";

import { authenticated } from "@/controllers/auth.js";
import SetsList from "./SetsList";
import Link from "next/link";

import { getDbAsync } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default async function Sets() {
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
    <div className={styles.setsContainer}>
      <div className={styles.setViewerHeader}>
        <h1>View Your Sets</h1>
        <form action="">
          <input
            type="text"
            placeholder="search sets"
            className={styles.setSearch}
          />
        </form>
        <Link href="/create" className={styles.setButton}>
          Create New Set
        </Link>
      </div>

      <div className={styles.setViewerContainer}>
        <SetsList cardSets={cardSets} />
      </div>
    </div>
  );
}

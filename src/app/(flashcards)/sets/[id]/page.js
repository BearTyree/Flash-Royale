import { authenticated } from "@/controllers/auth";
import styles from "@/styles/edit.module.css";
import EditSetClient from "./EditSetClient";
import { notFound } from "next/navigation";

import { getDbAsync } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default async function Edit({ params }) {
  const db = await getDbAsync();

  let { id } = await params;

  const numericId = parseInt(id);

  if (isNaN(numericId) || numericId.toString() !== id) {
    console.log("Invalid ID, not a number:", id);
    return notFound();
  }

  id = numericId;

  const username = await authenticated();

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  let cardSet = await db.query.cardSetsTable.findFirst({
    where: (cardSets, { eq }) => eq(cardSets.id, id),
  });

  if (cardSet.ownerId == user.id) {
    cardSet = JSON.parse(cardSet.cards);
  } else {
    cardSet = null;
  }

  return (
    <>
      <div className={styles.setContainer}>
        <EditSetClient id={id} initialSet={cardSet} />
      </div>
    </>
  );
}

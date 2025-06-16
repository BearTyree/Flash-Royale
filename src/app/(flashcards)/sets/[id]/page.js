import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/prisma";
import styles from "@/styles/edit.module.css";
import EditSetClient from "./EditSetClient";
import { notFound } from "next/navigation";

export default async function Edit({ params }) {
  const prisma = await getDbAsync();

  let { id } = await params;

  const numericId = parseInt(id);

  if (isNaN(numericId) || numericId.toString() !== id) {
    console.log("Invalid ID, not a number:", id);
    return notFound();
  }

  id = numericId;

  const username = await authenticated();

  const user = await prisma.user.findFirst({ where: { username } });

  let cardSet = await prisma.cardSet.findFirst({ where: { id } });

  if (cardSet.ownerId == user.id) {
    cardSet = JSON.parse(cardSet.cards);
  } else {
    cardSet = null;
  }

  console.log(cardSet);

  return (
    <>
      <div className={styles.setContainer}>
        <div className={styles.flashcardCreationHeader}>
          <h1>Edit {cardSet.name}</h1>
          <div className={styles.publishButton}>Update</div>
        </div>
        <EditSetClient initialSet={cardSet} />
      </div>
    </>
  );
}

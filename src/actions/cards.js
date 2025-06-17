"use server";

import { authenticated } from "@/controllers/auth.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getDbAsync } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { cardSetsTable, usersTable } from "@/lib/schema";

export async function createCardSet(cardSet) {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  try {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    await db.insert(cardSetsTable).values({
      cards: cardSet,
      ownerId: user.id,
    });
  } catch (err) {
    console.log(err);
    return;
  }

  redirect("/sets");
}

export async function updateCardSet(id, updatedCardSet) {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  id = parseInt(id);

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  let cardSet = await db.query.cardSetsTable.findFirst({
    where: (cardSets, { eq }) => eq(cardSets.id, id),
  });

  if (cardSet.ownerId != user.id) {
    return;
  }

  try {
    const update = await db
      .update(cardSetsTable)
      .set({ cards: updatedCardSet })
      .where(eq(cardSetsTable.id, id))
      .returning();

    if (!update || update.length === 0) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  redirect("/sets");
}

export async function deleteSet(id) {
  const db = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  id = parseInt(id);
  try {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    const cardSet = await db.query.cardSetsTable.findFirst({
      where: (cardSets, { eq }) => eq(cardSets.id, id),
    });

    if (cardSet.ownerId != user.id) {
      return;
    }

    let deleted = await db
      .delete(cardSetsTable)
      .where(eq(cardSetsTable.id, id))
      .returning();

    if (!deleted) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  revalidatePath("/sets");
}

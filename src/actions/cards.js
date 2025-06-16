"use server";

import { authenticated } from "@/controllers/auth.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getDbAsync } from "@/lib/prisma.js";

export async function createCardSet(cardSet) {
  const prisma = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  try {
    let user = await prisma.user.findFirst({ where: { username } });

    await prisma.cardSet.create({
      data: {
        cards: cardSet,
        owner: {
          connect: { id: user.id },
        },
      },
    });
  } catch (err) {
    console.log(err);
    return;
  }

  redirect("/sets");
}

export async function updateCardSet(id, updatedCardSet) {
  const prisma = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  id = parseInt(id);

  const user = await prisma.user.findFirst({ where: { username } });

  let cardSet = await prisma.cardSet.findFirst({ where: { id } });

  if (cardSet.ownerId != user.id) {
    return;
  }

  try {
    let update = await prisma.cardSet.update({
      where: { id },
      data: { cards: updatedCardSet },
    });

    if (!update) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  redirect("/sets");
}

export async function deleteSet(id) {
  const prisma = await getDbAsync();

  const username = await authenticated();

  if (!username) {
    return;
  }

  id = parseInt(id);
  try {
    const user = await prisma.user.findFirst({ where: { username } });

    let cardSet = await prisma.cardSet.findFirst({ where: { id } });

    if (cardSet.ownerId != user.id) {
      return;
    }

    let deleted = await prisma.cardSet.delete({ where: { id } });

    if (!deleted) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  revalidatePath("/sets");
}

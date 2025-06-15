"use server";

import { authenticated } from "@/controllers/auth.js";
import { redirect } from "next/navigation";

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

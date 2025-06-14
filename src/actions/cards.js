import { authenticated } from "@/controllers/auth.js";

export async function createCardSet(_, formData) {
  const username = await authenticated();

  if (!username) {
    return;
  }

  const cardSet = formData.get("cardSet");

  try {
    let user = await prisma.user.findFirst({ where: { username } });

    await prisma.cardSet.create({
      data: {
        cards: JSON.stringify(cardSet),
        owner: username,
      },
    });
  } catch (err) {}
}

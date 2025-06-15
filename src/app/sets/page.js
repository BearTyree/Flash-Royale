import { getDbAsync } from "@/lib/prisma.js";
import { authenticated } from "@/controllers/auth.js";

export default async function Sets() {
  const prisma = await getDbAsync();
  const username = await authenticated();

  if (!username) {
    return <div>Error</div>;
  }

  const user = await prisma.user.findFirst({ where: { username } });
  const cardSets = await prisma.cardSet.findMany({
    where: { ownerId: user.id },
  });

  return (
    <div>
      <h1>Your Flashcard Sets</h1>
      <ul>
        {cardSets.map((set) => (
          <li key={set.id}>
            <pre>{JSON.stringify(set.cards, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

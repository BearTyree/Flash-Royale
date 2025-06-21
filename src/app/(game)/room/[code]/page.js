import { cookies } from "next/headers";
import RoomClient from "./room";

export default async function Room() {
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

  return <RoomClient cardSets={cardSets} token={token} />;
}

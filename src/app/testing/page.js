import { cookies } from "next/headers";
import MultiplayerClient from "./Client";

export default async function MultiplayerTest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return <MultiplayerClient token={token} />;
}

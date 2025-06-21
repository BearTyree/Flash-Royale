import { cookies } from "next/headers";
import RoomClient from "./room";

export default async function Room() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return <RoomClient token={token} />;
}

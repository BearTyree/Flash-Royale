import { cookies } from "next/headers";

export async function authenticated(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    return true;
  }
}

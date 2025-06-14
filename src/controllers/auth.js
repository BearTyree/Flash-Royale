import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function authenticated(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return false;
  }

  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      console.log("Token has expired.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return false;
  }
}

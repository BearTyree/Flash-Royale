import { SignJWT } from "jose";

export default async function generateToken(username) {
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
  const alg = "HS256";

  const jwt = await new SignJWT({ username })
    .setProtectedHeader({ alg })
    .setExpirationTime("2h")
    .sign(secret);

  return jwt;
}

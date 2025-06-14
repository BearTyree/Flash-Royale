"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDbAsync } from "@/lib/prisma.js";
import hash from "@/lib/hash.js";
import generateToken from "@/lib/generateToken";

export async function authenticate(previousState, formData) {
  const cookieStore = await cookies();

  const prisma = await getDbAsync();

  const username = formData.get("username");
  const password = formData.get("password");

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return;
  }

  const salt = user.passwordSalt;

  const passwordHash = await hash(password + salt);

  if (passwordHash !== user.passwordHash) {
    return;
  }

  cookieStore.set({
    name: "token",
    value: await generateToken(username),
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 2, // 2 days
    path: "/",
  });

  redirect("/menu");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  redirect("/login");
}

export async function createUser(previousState, formData) {
  const cookieStore = await cookies();

  const prisma = await getDbAsync();

  const username = formData.get("username");
  const password = formData.get("password");

  const arrayBuffer = new Uint8Array(16);
  crypto.getRandomValues(arrayBuffer);
  let salt = Array.from(arrayBuffer, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  const passwordHash = await hash(password + salt);

  try {
    await prisma.user.create({
      data: {
        username,
        passwordHash,
        passwordSalt: salt,
      },
    });

    cookieStore.set({
      name: "token",
      value: await generateToken(username),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2, // 2 days
      path: "/",
    });
  } catch (error) {
    console.log(error);
    return;
  }
  redirect("/menu");
}

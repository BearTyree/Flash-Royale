import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// Create a new Prisma client for each invocation (cached per request in SSR).
export const getDb = cache(() => {
  const { env } = getCloudflareContext();
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
});

// For ISR/SG contexts (where async context needed)
export async function getDbAsync() {
  const { env } = await getCloudflareContext({ async: true });
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
}

// export async function getDbAsync() {
//   const { env } = await getCloudflareContext({ async: true });
//   const db = env.DB;
//   let functions = {};

//   functions.findFirst = (finder) => {
//     const conditions = Object.keys(finder.where);
//   };
// }

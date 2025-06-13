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

// import { PrismaClient } from "@/generated/prisma/";
// import { PrismaD1 } from "@prisma/adapter-d1";

// // The `runtime` export is a hint for Next.js.
// // It allows this module to be used in both Node.js and Edge runtimes.
// // When running `next dev` or `next start`, it'll be in a Node.js context.
// // When deployed to Cloudflare Workers, it'll be in an Edge context.
// export const runtime = "edge";

// let internalPrismaInstance = null;

// /**
//  * Initializes Prisma Client for the Edge runtime (e.g., Cloudflare Workers) using a D1 binding.
//  * This function MUST be called from your Cloudflare Worker entry script.
//  * @param {any} d1Binding - The D1 database binding from the Cloudflare worker environment (e.g., env.DB).
//  */
// export function initializeGlobalPrisma(d1Binding) {
//   if (internalPrismaInstance) {
//     // console.warn("Prisma Client (Edge) is already initialized.");
//     return internalPrismaInstance;
//   }
//   if (!d1Binding) {
//     console.error("initializeGlobalPrisma: D1 binding is undefined or null.");
//     throw new Error(
//       "Prisma Client (D1) initialization failed: D1 binding was not provided. " +
//         "Ensure this function is called with a valid binding from your Worker script."
//     );
//   }
//   try {
//     const adapter = new PrismaD1(d1Binding);
//     internalPrismaInstance = new PrismaClient({ adapter });
//     console.log("Prisma Client initialized successfully with D1 binding for Edge runtime.");
//   } catch (error) {
//     console.error("Failed to initialize Prisma Client with D1 adapter:", error);
//     // Re-throw the error to make it visible and prevent silent failures
//     throw new Error(`Prisma Client (D1) adapter initialization failed: ${error.message}`);
//   }
//   return internalPrismaInstance;
// }

// const prisma = new Proxy(
//   {},
//   {
//     get: function (target, prop, receiver) {
//       if (!internalPrismaInstance) {
//         // Attempt to determine if we are in a Cloudflare Worker-like environment.
//         // `navigator.userAgent` is one way, but not perfectly foolproof.
//         // A more reliable indicator for *this specific setup* is whether initializeGlobalPrisma
//         // was intended to be called.
//         // For simplicity, we'll assume if it's not a CF worker, it's Node.js for local dev.
//         const isLikelyEdgeRuntime = typeof navigator !== "undefined" && navigator.userAgent?.includes("Cloudflare-Worker");
//         // Or, if using Vercel Edge: typeof EdgeRuntime !== 'undefined'

//         if (isLikelyEdgeRuntime) {
//           // If it looks like an Edge environment where initializeGlobalPrisma *should* have been called.
//           console.error(
//             "Prisma Client (Edge) accessed before initialization. " +
//               "This usually means `initializeGlobalPrisma(env.YOUR_D1_BINDING_NAME)` was not called or failed " +
//               "in your Cloudflare Worker entry script."
//           );
//           throw new Error(
//             "Prisma Client (Edge) has not been initialized. " +
//               "Check worker logs. Ensure `initializeGlobalPrisma` is called correctly."
//           );
//         } else {
//           // Assume Node.js environment (e.g., `next dev`, `next start` locally)
//           console.log(
//             "Prisma Client not initialized. Attempting Node.js fallback initialization (uses DATABASE_URL from .env)."
//           );
//           try {
//             // In Node.js, PrismaClient without an adapter uses the `url` from the `datasource` block in your schema,
//             // which typically resolves to `process.env.DATABASE_URL`.
//             // Your schema (provider="sqlite", engineType="library") is compatible.
//             internalPrismaInstance = new PrismaClient();
//             console.log("Prisma Client initialized successfully for Node.js environment.");
//           } catch (error) {
//             console.error("Failed to initialize Prisma Client for Node.js environment:", error);
//             throw new Error(
//               "Prisma Client (Node.js) failed to initialize. " +
//                 "Check your DATABASE_URL environment variable, Prisma schema, and ensure your database is accessible. " +
//                 `Original error: ${error.message}`
//             );
//           }
//         }
//       }

//       // If internalPrismaInstance is still null here, it means the Node.js fallback also failed and threw an error.
//       // If it's set (either by Edge init or Node.js init), proceed.
//       if (!internalPrismaInstance) {
//         // This case should ideally not be reached if the logic above is correct,
//         // as failures should throw. But as a safeguard:
//         throw new Error("Prisma Client is not available after attempting initialization.");
//       }

//       return Reflect.get(internalPrismaInstance, prop, receiver);
//     },
//   }
// );

// export default prisma;

// // Cleanup old globalThis.prismaGlobal if it was part of a previous setup,
// // as this pattern doesn't rely on it for singleton management within this file.
// // if (process.env.NODE_ENV !== "production") {
// //   if (globalThis.prismaGlobal) {
// //     console.log("Cleaning up old globalThis.prismaGlobal");
// //     delete globalThis.prismaGlobal;
// //   }
// // }
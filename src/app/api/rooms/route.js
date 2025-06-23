import { getCloudflareContext } from "@opennextjs/cloudflare";

export const GET = async (request) => {
  const ctx = getCloudflareContext();

  const durableObject = ctx.env.REGISTRY;
  const id = durableObject.idFromName("main");
  const roomObject = durableObject.get(id);

  return roomObject.fetch(request);
};

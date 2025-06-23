import { getCloudflareContext } from "@opennextjs/cloudflare";

export const GET = async (request, { params }) => {
  const ctx = getCloudflareContext();
  const { code } = params;

  const durableObject = ctx.env.ROOMS;
  const id = durableObject.idFromName(code);
  const roomObject = durableObject.get(id);

  return roomObject.fetch(request);
};

import type { RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ url }) => {
  const code = url.searchParams.get("code");
  console.log(code);
  throw new Error("Not implemented");
}) satisfies RequestHandler;


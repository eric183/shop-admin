import prismaClient from "~base/prismaClient";

export async function GET(request: Request) {
  // const { pathname } = new URL(request.url);
  // const id = pathname.split("/").pop();

  // // prismaClient.user
  // const product = await getProduct(id);
  return new Response(
    JSON.stringify({
      message: "Hello World",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

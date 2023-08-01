import { sanityMutationClient } from "~base/sanity/client";

export const createAccount = async ({ username }: { username: string }) => {
  const { results } = await sanityMutationClient({
    mutations: [
      {
        create: {
          _type: "account",
          username: username,
          password: "123456",
        },
      },
    ],
  });
  return results;
};

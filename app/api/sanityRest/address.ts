import { sanityMutationClient } from "~base/sanity/client";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "~types/product";
import { omit } from "lodash";
// create images
export const createAddress = async (data: { _id?: string }) => {
  const _id = data._id ? data._id : uuidv4();

  return await sanityMutationClient({
    mutations: [
      {
        createOrReplace: {
          _type: "address",
          _id,
          ...omit(data, ["_id"]),
        },
      },
    ],
  });
};

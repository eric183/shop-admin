import { sanityClient } from "~base/sanity/client";
import globalQuery from "../groqs/global";

export const fetchGlobal = async () => {
  const response = await sanityClient.fetch<any>(globalQuery);
  return response;
};

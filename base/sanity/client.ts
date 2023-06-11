import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: "2021-10-21",
  useCdn: process.env.NODE_ENV !== "production",
});

export default sanityClient;

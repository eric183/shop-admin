import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_SANITY_DATASET,
  useCdn: process.env.NODE_ENV !== "production",
});

export default sanityClient;

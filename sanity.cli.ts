// sanity.cli.js
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID as string, // replace value with your own
    dataset: process.env.SANITY_STUDIO_DATASET as string, // replace value with your own
  },
});

import { ISanityDocument } from "../old/typings/sanity";

export const SanityUploader = async (file: File): Promise<ISanityDocument> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const arrayBuffer = reader.result;
      const response = await fetch(import.meta.env.VITE_SANITY_URL, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${import.meta.env.VITE_SANITY_TOKEN}`,
        },
        body: arrayBuffer,
      });
      const { document } = await response.json();

      resolve(document);
    };
  });
};

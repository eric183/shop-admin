import { ISanityDocument } from "~types/sanityDocument";

export const SanityUploader = async (
  fileList: File[]
): Promise<ISanityDocument[]> => {
  const promiseArray = fileList.map((file) => {
    return new Promise<Promise<ISanityDocument>>((resolve) => {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const arrayBuffer = reader.result;
        const response = await fetch(
          process.env.NEXT_PUBLIC_SANITY_STUDIO_ASSETS_URL!,
          {
            method: "POST",
            headers: {
              "Content-Type": file.type,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
            },
            body: arrayBuffer,
          }
        );
        const { document } = await response.json();

        resolve(document);
      };
    });
  });
  const res = await Promise.all(promiseArray);
  debugger;
  return Promise.all(promiseArray);
};

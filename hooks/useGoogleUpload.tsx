import axios from "axios";
import mainStore from "../stores";
import { RcFile } from "antd/es/upload";

export interface IGoogleResponse {
  kind: string;
  id: string;
  selfLink: string;
  mediaLink: string;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  storageClass: string;
  size: string;
  md5Hash: string;
  crc32c: string;
  etag: string;
  timeCreated: string;
  updated: string;
  timeStorageClassUpdated: string;
  url: string;
}

const useGoogleUpload = () => {
  const { accessToken } = mainStore();

  // const upload = async ({fileType,file,}: any): Promise<IGoogleResponse & { url: string }> => {
  const upload = async (fileList: RcFile[]): Promise<IGoogleResponse[]> => {
    const configHeader = {
      Authorization: `Bearer ${accessToken}`,
    };

    let fileDir = fileList[0].type.split("/")[0];
    const bucketName = `cherry_shop_asia`;

    const fileListPromise = fileList.map((file) => {
      const tempEx = file.name.split(".").slice(-1)[0];
      fileDir = file.type ? fileDir : tempEx;
      const objectLocation = `shop-admin/${fileDir}/${file.name}`;
      const objectContentType = file.type;
      const objectName = encodeURIComponent(objectLocation);
      const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${objectName}`;
      return axios.post<IGoogleResponse>(url, file, {
        headers: {
          ...configHeader,
          "Content-Type": objectContentType,
        },
      });
    });

    const response = await Promise.all(fileListPromise);
    return response.map((res) => ({
      ...res.data,
      url: `https://storage.cloud.google.com/${bucketName}/${res.data.name}`,
    }));
  };

  return [upload];
};

export default useGoogleUpload;

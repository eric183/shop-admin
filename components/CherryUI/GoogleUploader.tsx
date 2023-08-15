import { Upload, Modal, UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import useGoogleImage from "../../hooks/useGoogleUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { create } from "zustand";
import { SanityUploader } from "~base/UploadSanity";
import { ISanityDocument } from "~types/sanityDocument";
import { IProduct } from "~types/product";

interface IGoogleUploaderProps {
  uploading: boolean;
  setUpload: (uploading: boolean) => void;
  imageUrls: UploadFile[] & IProduct["imageURLs"] & ISanityDocument[];
  setImageUrls: (
    imageUrls: UploadFile[] & IProduct["imageURLs"] & ISanityDocument[]
  ) => void;
  clearImageUrls: () => void;
}

export const useUploadingStore = create<IGoogleUploaderProps>()((set) => ({
  uploading: false,
  setUpload: (uploading) => set({ uploading }),
  imageUrls: [],
  setImageUrls: (_imageUrls) =>
    set(() => {
      return {
        imageUrls: _imageUrls,
      };
    }),
  clearImageUrls: () => set({ imageUrls: [] }),
}));

const GoogleUploader = forwardRef((props, ref) => {
  const { uploading, setUpload, imageUrls, setImageUrls, clearImageUrls } =
    useUploadingStore();
  const [loading, setLoading] = useState(false);
  // const [imageUrls, setImageUrls] = useState<UploadFile[]>();
  const [upload] = useGoogleImage();
  const [previewImage, setPreviewImage] = useState("");
  const [uploadList, setUploadList] = useState<RcFile[]>([]);
  const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    setUploadList(fileList);
    return false;
  };

  const uploadHandler = async (fileList: RcFile[]) => {
    setLoading(true);

    if (!fileList || fileList.length === 0) return;
    // const documents = await upload(fileList);
    const documents = await SanityUploader(fileList);
    setLoading(false);
    const docs = documents.map((document) => ({
      ...document,
      url: document.url,
      name: document.name,
      uid: document.id,
      status: "done" as unknown as undefined,
      response: '{"status": "success"}', // 服务端响应内容
    }));

    // const imagesLength = docs.length;

    // imageUrls.splice(-imagesLength);

    setImageUrls([...imageUrls, ...docs] as any);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
  };

  const onChange = ({ fileList }: any) => {
    clearImageUrls();
    setImageUrls(fileList.filter((f: ISanityDocument) => f._id));
  };

  useEffect(() => {
    if (uploadList.length > 0) {
      uploadHandler(uploadList);
    }
  }, [uploadList]);

  useImperativeHandle(ref, () => ({
    uploadHandler,
  }));

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined rev={undefined} />
      ) : (
        <PlusOutlined rev={undefined} />
      )}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  console.log(imageUrls, "imageUrls....");
  return (
    <div>
      <Upload
        multiple
        listType="picture-card"
        showUploadList
        action={undefined}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        fileList={imageUrls}
        onChange={onChange}
      >
        {uploadButton}
      </Upload>
      <Modal
        open={!!previewImage}
        title={"预览"}
        footer={null}
        onCancel={() => setPreviewImage("")}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
});
GoogleUploader.displayName = "GoogleUploader";
export default GoogleUploader;

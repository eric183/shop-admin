"use client";

import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { IOrder } from "~types/order";
import { IProduct } from "~types/product";
import { Button, Image, Tooltip } from "antd";
import { useState } from "react";
import { modalStore } from "~components/CherryUI/Modal";
import { sanityClient } from "~base/sanity/client";
import { getProductId } from "~app/api/groqs/product";

const useColumns = () => {
  // const [record, setEditRecord] = useState<IProduct | null>(null);
  const { setOpen, setRecord, setModalType } = modalStore();
  const columns: any = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "国家",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "城市",
      dataIndex: "addressLevel1",
      key: "addressLevel1",
    },
    {
      title: "区域",
      dataIndex: "addressLevel2",
      key: "addressLevel2",
    },
    {
      title: "邮编",
      dataIndex: "postalCode",
      key: "postalCode",
    },
    {
      title: "电话号码",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "操作",
      dataIndex: "_",
      key: "_",
      render: (_: any, record: any) => {
        return (
          <div>
            <Button
              // type="link"
              onClick={async () => {
                // debugger;
                // await sanityClient.fetch(getProductId, { id: record._id });
                setRecord(record);
                setOpen(true);
                setModalType("update");
              }}
              className="text-blue-900"
            >
              编辑
            </Button>
          </div>
        );
      },
    },
  ];

  return [columns];
};

const ImagePreviewTool: React.FC<{ images: IProduct["imageURLs"] }> = ({
  images,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {images && (
        <Image
          preview={{ visible: false }}
          width={50}
          alt="Preview Image"
          src={images[0].asset.url}
          onClick={() => setVisible(true)}
        />
      )}
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          {images?.map((image, index) => (
            <Image src={image?.asset?.url} key={index} alt="previewer" />
          ))}
        </Image.PreviewGroup>
      </div>
    </>
  );
};

export default useColumns;

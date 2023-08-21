"use client";

import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { IOrder } from "~types/order";
import { IProduct } from "~types/product";
import { Button, Image, Popconfirm, Tooltip } from "antd";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useState,
} from "react";
import { modalStore } from "~components/CherryUI/Modal";
import { sanityClient } from "~base/sanity/client";
import { getProductId } from "~app/api/groqs/product";
import { deleteProduct } from "~app/api/sanityRest/product";
import { Inventory } from "~types/inventory";

const useColumns = (refetch: () => void) => {
  // const [record, setEditRecord] = useState<IProduct | null>(null);
  const { setOpen, setRecord, setModalType } = modalStore();
  const columns: ColumnsType<Inventory> = [
    // {
    //   title: "id",
    //   dataIndex: "_id",
    //   key: "_id",
    //   render: (name) => (
    //     <Tooltip title={name}>
    //       {name}
    //       {/* {record.name.slice(0, 20) + "..."} */}
    //     </Tooltip>
    //   ),
    // },
    {
      title: "品牌",
      dataIndex: "skuDetail",
      key: "skuDetail",
      render: (skuDetail) => (
        <p className="font-extrabold">{skuDetail?.brand?.name}</p>
      ),
    },
    {
      title: "品类信息",
      dataIndex: "skuDetail",
      key: "skuDetail",
      render: (skuDetail) => <p>{skuDetail?.productName}</p>,
    },
    {
      title: "商品图片",
      dataIndex: "skuDetail",
      key: "skuDetail",
      render: (skuDetail) => (
        <ImagePreviewTool images={skuDetail?.spu?.imageURLs}></ImagePreviewTool>
      ),
    },
    {
      title: "预计库存",
      dataIndex: "preQuantity",
      key: "preQuantity",
    },
    {
      title: "实际库存",
      dataIndex: "actualQuantity",
      key: "actualQuantity",
    },
    {
      title: "剩余库存",
      dataIndex: "remainQuantity",
      key: "remainQuantity",
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
          src={images[0]?.asset?.url ? images[0]?.asset?.url : ""}
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

"use client";

import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { IOrder } from "~types/order";
import { IProduct } from "~types/product";
import { Button, Image } from "antd";
import { useState } from "react";
import { modalStore } from "./modal";

const useColumns = () => {
  // const [record, setEditRecord] = useState<IProduct | null>(null);
  const { setOpen, setRecord } = modalStore();
  const columns: ColumnsType<IProduct> = [
    {
      title: "商品图片",
      dataIndex: "imageURLs",
      key: "imageURLs",
      render(images: IProduct["imageURLs"], record, index) {
        return (
          <ImagePreviewTool images={images} />

          // <ul className="flex flex-row">
          //   {images?.map((image, index) => {
          //     return (
          //       <li className="w-8 h8" key={index}>
          //         <Image width={32} height={32} src={image.asset.url} alt="" />
          //       </li>
          //     );
          //   })}
          // </ul>
        );
      },
    },
    {
      title: "品牌",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "商品名",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "商品规格 / 价格 ",
      dataIndex: "skus",
      key: "skus",
      render(skus: IProduct["skus"], record, index) {
        return (
          <ul>
            {skus.map((sku, index) => {
              return (
                <li key={index}>
                  [{sku.attribute.color.toLocaleLowerCase()} -{" "}
                  {sku.attribute.size.toLocaleUpperCase()}] / ${sku.price}
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      title: "链接",
      dataIndex: "link",
      key: "link",
      render: (text, record) => {
        return (
          <p className="w-60 overflow-hidden whitespace-nowrap">
            <Link
              href={text}
              target="_blank"
              className="inline-block truncat text-ellipsis "
            >
              {text}
            </Link>
          </p>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => {
        return (
          <div>
            <Button
              // type="link"
              onClick={() => {
                setRecord(record);
                setOpen(true);
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
          src={images[0]?.asset?.url}
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

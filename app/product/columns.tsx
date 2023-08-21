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

const useColumns = (refetch: () => void) => {
  // const [record, setEditRecord] = useState<IProduct | null>(null);
  const { setOpen, setRecord, setModalType } = modalStore();
  const columns: ColumnsType<IProduct> = [
    {
      title: "品类名称",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Tooltip title={name}>
          {name}
          {/* {record.name.slice(0, 20) + "..."} */}
        </Tooltip>
      ),
    },
    {
      title: "商品图片",
      dataIndex: "images",
      key: "images",
      render(images, record, index) {
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
      render: (brand) => {
        return <span>{brand?.name}</span>;
      },
    },
    {
      title: "商品规格 / 价格 ",
      dataIndex: "skus",
      key: "skus",
      render(skus: IProduct["skus"], record, index) {
        return (
          <ul>
            {skus?.map((sku) => {
              return (
                <li key={index}>
                  [{sku.attribute.color.toLocaleLowerCase()} -{"  "}
                  {sku.attribute.size.toLocaleUpperCase()}] / ${sku.price} /{" "}
                  [计划库存：
                  {sku?.inventory?.preQuantity}]
                </li>
              );
            })}
          </ul>
        );
      },
    },
    // {
    //   title: "链接",
    //   dataIndex: "link",
    //   key: "link",
    //   render: (text, record) => {
    //     return (
    //       <p className="w-60 overflow-hidden whitespace-nowrap">
    //         <Link
    //           href={text}
    //           target="_blank"
    //           className="inline-block truncat text-ellipsis "
    //         >
    //           {text}
    //         </Link>
    //       </p>
    //     );
    //   },
    // },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => {
        return (
          <div>
            <button
              // type="link"
              onClick={async () => {
                // debugger;
                // await sanityClient.fetch(getProductId, { id: record._id });
                setRecord(record);
                setOpen(true);
                setModalType("update");
              }}
              className="text-blue-900 mr-2 inline-block px-5 py-1 rounded-md border-blue-600 border-2 border-solid"
            >
              编辑
            </button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={async () => {
                await deleteProduct(record);
                refetch();
              }}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <button
                // type="link"

                className="text-white bg-red-700 !hover:text-white inline-block px-5 py-1 rounded-md border-2 border-solid border-red-700"
              >
                删除
              </button>
            </Popconfirm>
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

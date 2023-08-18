"use client";

import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { IOrder } from "~types/order";
import { Button, Drawer, Image, Popconfirm, Tooltip } from "antd";
import { useState } from "react";

import { deleteOrder } from "~app/api/sanityRest/order";
import { useQueryClient } from "@tanstack/react-query";
import { drawStore } from "./drawer";
import dayjs from "dayjs";
import { modalStore } from "~components/CherryUI/Modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IBrandOrder } from "~types/brandOrder";
import user from "~base/sanity/schemas/user";
import { IProduct } from "~types/product";
// import { usePathname } from "next/navigation";

const useBrandColumns = (
  refetch: () => void,
  brandOrderId: string,
  data: any
) => {
  const queryClient = useQueryClient();
  // const [record, setEditRecord] = useState<IOrder | null>(null);
  const { setOpen, setRecord, setModalType, setOrderOpen } = modalStore();
  const { drawInfo, setDrawInfo, setDrawOpen } = drawStore();
  const onClose = () => {
    setDrawOpen(false);
  };
  const pathname = usePathname();
  const querySearch = useSearchParams();

  const columns: ColumnsType<IBrandOrder & IBrandOrder["userOrders"][0]> =
    brandOrderId
      ? [
          {
            title: "买家",
            dataIndex: "account",
            key: "account",
            render: (account) => {
              return <p>{account?.username}</p>;
            },
          },
          {
            title: "商品图片",
            dataIndex: "orderItems",
            key: "orderItems",
            render: (orderItems) => {
              return (
                <ImagePreviewTool images={orderItems[0]?.sku?.spu?.images} />
              );
            },
          },
          {
            align: "center",
            title: "商品清单",
            dataIndex: "orderItems",
            key: "orderItems",
            render: (
              orderItems: IBrandOrder["userOrders"][0]["orderItems"]
            ) => {
              return (
                <ul>
                  {orderItems?.map((item, index) => {
                    // return item.skus.map((sku) => {
                    return (
                      <li key={index}>
                        <span>{item?.sku?.spuColorSize}</span>
                      </li>
                    );
                    // });
                  })}
                </ul>
              );
            },
          },
          {
            align: "center",
            title: "定金",
            dataIndex: "deposit",
            key: "deposit",
          },
          {
            align: "center",
            title: "折扣",
            dataIndex: "discount",
            key: "discount",
          },
          {
            align: "center",
            title: "尾款",
            dataIndex: "finalPayment",
            key: "finalPayment",
          },
          {
            align: "center",
            title: "订单状态",
            dataIndex: "orderStatus",
            key: "orderStatus",
            render: (orderStatus) => {
              switch (orderStatus) {
                case "UNPAID":
                  return <span className="text-yellow-500">待付款</span>;
                case "HALFPAID":
                  return <span className="text-green-500">已付定金</span>;
                case "PAID":
                  return <span className="text-blue-500">已支付尾款</span>;
                case "CANCELLED":
                  return <span className="text-red-500">已取消</span>;
                default:
                  return <span className="text-red-500">未知状态</span>;
              }
            },
          },
          {
            title: "操作",
            dataIndex: "_id",
            key: "_id",
            align: "center",
            render: (id, record) => {
              return (
                <div>
                  {/* <Button
                    type="link"
                    onClick={() => {
                      setDrawOpen(true);
                      setDrawInfo(record.orderItems);
                    }}
                    className="text-green-400"
                  >
                    商品预览
                  </Button> */}
                  <Button
                    type="link"
                    onClick={() => {
                      const currentOrder = data.brandOrders.find(
                        (x: { userOrders: IBrandOrder["userOrders"] }) =>
                          x.userOrders.find((u) => u._id === id)
                      );

                      setRecord({
                        _id: currentOrder._id,
                        brand: {
                          _id: data._id,
                          name: data.name,
                        },
                        userOrders: [record],
                        // brandOrders: ,
                      });
                      setModalType("update");
                      setOrderOpen(true);
                    }}
                  >
                    编辑
                  </Button>
                  {/* <Popconfirm
                    title="确定删除吗？"
                    onConfirm={async () => {
                      await deleteOrder(id);
                      await refetch();
                    }}
                  >
                    <Button type="link" className="text-red-500">
                      删除
                    </Button>
                  </Popconfirm> */}
                </div>
              );
            },
          },
        ]
      : [
          {
            title: "品牌",
            dataIndex: "name",
            key: "name",
            render: (name: string, record) => {
              return (
                <Link
                  prefetch={false}
                  href={
                    pathname +
                    "?" +
                    querySearch.toString() +
                    "&brandOrderId=" +
                    record._id
                    // "&userOrderId=" +
                    // record._id
                  }
                  className="font-bold"
                >
                  {name} -{" "}
                  {dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </Link>
              );
            },
          },
          {
            title: "买家数量",
            dataIndex: "userOrders",
            key: "userOrders",
            render: (userOrders: IBrandOrder["userOrders"], record) => (
              <Tooltip
                key={record._id}
                title={
                  <ul>
                    {userOrders?.map((item, index) => {
                      return <li key={index}>{item?.account?.username}</li>;
                    })}
                  </ul>
                }
              >
                <p>{userOrders.length}人</p>
              </Tooltip>
            ),
          },
          {
            title: "更新日期",
            dataIndex: "updatedAt",
            key: "updatedAt",
            align: "center",
            render: (text) => {
              // YYYY-MM-DD HH:mm:ss
              return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
            },
          },
        ];

  return [columns];
  // return [userOrderId ? userOrderColumns : columns];
};

const ImagePreviewTool: React.FC<{ images: string[] }> = ({ images }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {images && (
        <Image
          preview={{ visible: false }}
          width={50}
          alt="Preview Image"
          src={images[0] ? images[0] : ""}
          onClick={() => setVisible(true)}
        />
      )}
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          {images?.map((image, index) => (
            <Image
              src={image as unknown as string}
              key={index}
              alt="previewer"
            />
          ))}
        </Image.PreviewGroup>
      </div>
    </>
  );
};

export default useBrandColumns;

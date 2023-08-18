"use client";

import type { ColumnsType } from "antd/es/table";
import { IOrder } from "~types/order";
import { Button, Popconfirm } from "antd";
import { deleteOrder } from "~app/api/sanityRest/order";
import { useQueryClient } from "@tanstack/react-query";
import { drawStore } from "./drawer";
import dayjs from "dayjs";
import { modalStore } from "~components/CherryUI/Modal";
import { IBrandOrder } from "~types/brandOrder";
const useColumns = (refetch: () => void) => {
  const queryClient = useQueryClient();
  // const [record, setEditRecord] = useState<IOrder | null>(null);
  const { setOpen, setRecord, setModalType, setTitle } = modalStore();
  const { drawInfo, setDrawInfo, setDrawOpen } = drawStore();
  const onClose = () => {
    setDrawOpen(false);
  };

  const columns: ColumnsType<IBrandOrder["userOrders"][0]> = [
    // {
    //   title: "订单号",
    //   dataIndex: "_id",
    //   key: "_id",
    //   render: (text, record) => {
    //     return (
    //       <Tooltip title="点击右键复制" color="#108ee9">
    //         <span>{`${text.slice(0, 8)}...`}</span>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: "买家",
      dataIndex: "account",
      key: "account",
      render: (account: IOrder["account"], record) => {
        return <span className="font-bold">{account?.username}</span>;
      },
    },
    {
      title: "定金",
      dataIndex: "deposit",
      key: "deposit",
    },
    // {
    //   title: "优惠活动",
    //   dataIndex: "discount",
    //   key: "discount",
    // },
    {
      title: "尾款",
      dataIndex: "finalPayment",
      key: "finalPayment",
    },
    {
      title: "快递信息",
      dataIndex: "shipments",
      key: "shipments",
      render: (object: IOrder["shipments"], record) => {
        return object ? (
          <ul>
            {object.map((item, index) => {
              return (
                <li key={index}>
                  {item.carrier} - {item.address}
                </li>
              );
            })}
          </ul>
        ) : (
          "暂无信息"
        );
      },
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        // YYYY-MM-DD
        return dayjs(text).format("YYYY-MM-DD");
      },
    },
    {
      title: "状态",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (text, record) => {
        switch (text) {
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
      dataIndex: "orderItems",
      key: "orderItems",
      align: "center",
      render: (orderItems, record) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                setDrawOpen(true);
                setDrawInfo(orderItems!);
              }}
              className="text-green-400"
            >
              商品预览
            </Button>
            <Button
              type="link"
              onClick={() => {
                setTitle("编辑订单");
                setRecord(record);
                setModalType("update");

                setOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除吗？"
              onConfirm={async () => {
                await deleteOrder(
                  record as unknown as IBrandOrder["userOrders"][0]
                );
                await refetch();
              }}
            >
              <Button type="link" className="text-red-500">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return [columns];
};

export default useColumns;

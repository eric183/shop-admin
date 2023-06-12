"use client";

import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { IOrder } from "~types/cherryVision";

const orderColumns: ColumnsType<IOrder> = [
  {
    title: "接龙号",
    dataIndex: "sortNumber",
    key: "sortNumber",
    render: (text) => {
      return <span>{text}</span>;
    },
  },
  {
    title: "预订人",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "购买商品列表",
    dataIndex: "orderItems",
    key: "orderItems",
    render(orderItems: IOrder["orderItems"], record, index) {
      return (
        <ul>
          {orderItems.map(({ sku, quantity }, index) => {
            return (
              <li key={index}>
                <Link href={`/product?spu=${sku.spu.name}`} target="_blank">
                  {`${sku.spu.name} - ${sku.color} - ${sku.size} * ${quantity}`}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    title: "定金",
    dataIndex: "deposit",
    key: "deposit",
  },
  {
    title: "优惠活动",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "尾款",
    dataIndex: "finalPayment",
    key: "finalPayment",
  },
  {
    title: "订单状态",
    dataIndex: "orderStatus",
    key: "orderStatus",
  },
  {
    title: "快递详情",
    dataIndex: "shipments",
    key: "shipments",
    render(shipments: IOrder["shipments"], record, index) {
      return (
        <>
          {shipments.map((item, index) => (
            <p key={index}>{item.carrier}</p>
          ))}
        </>
      );
    },
  },
];

export default orderColumns;

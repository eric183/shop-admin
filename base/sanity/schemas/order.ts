import { defineType } from "sanity";

export default defineType({
  title: "Order",
  type: "document",
  name: "order",
  fields: [
    {
      type: "reference",
      name: "account",
      title: "Account",
      to: [
        {
          type: "account",
        },
      ],
    },
    {
      type: "number",
      name: "sortNumber",
      title: "Sort Number",
    },
    {
      type: "array",
      name: "orderItems",
      title: "Order Items",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "orderItem",
            },
          ],
        },
      ],
    },
    {
      type: "array",
      name: "shipments",
      title: "Shipments",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "shipment",
            },
          ],
        },
      ],
    },
    {
      type: "number",
      name: "deposit",
      title: "Deposit",
      description: "定金",
    },

    {
      type: "number",
      name: "finalPayment",
      title: "Final Payment",
      initialValue: 0,
      description: "尾款",
    },

    {
      type: "string",
      name: "orderStatus",
      title: "Order Status",
      initialValue: "UNPAID",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          // 未支付
          {
            title: "Unpaid",
            value: "UNPAID",
          },
          // 定金
          {
            title: "HalfPaid",
            value: "HALFPAID",
          },
          // 尾款
          {
            title: "Paid",
            value: "PAID",
          },
          // 已发货
          // {
          //   title: "Shipped",
          //   value: "SHIPPED",
          // },
          // // 已收货
          // {
          //   title: "Received",
          //   value: "RECEIVED",
          // },
          // 已取消
          {
            title: "Cancelled",
            value: "CANCELLED",
          },
        ],
      },
    },
  ],
  preview: {
    select: {
      subtitle: "orderStatus",
      title: "account.username",
      Image: "account.avatar",
    },
  },
});

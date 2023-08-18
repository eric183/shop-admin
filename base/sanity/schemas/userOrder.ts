import { defineType } from "sanity";

export default defineType({
  title: "UserOrder",
  type: "document",
  name: "userOrder",
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
      type: "reference",
      name: "brandOrder",
      title: "Brand Order",
      to: [
        {
          type: "brandOrder",
        },
      ],
    },
    {
      type: "number",
      name: "discount",
      title: "Discount",
      initialValue: 0,
      description: "折扣",
    },

    {
      type: "number",
      name: "finalPayment",
      title: "Final Payment",
      initialValue: 0,
      description: "尾款",
    },

    {
      type: "number",
      name: "deposit",
      title: "Deposit",
      description: "定金",
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

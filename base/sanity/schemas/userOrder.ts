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
  ],
  preview: {
    select: {
      subtitle: "orderStatus",
      title: "account.username",
      Image: "account.avatar",
    },
  },
});

import { defineType, defineField } from "sanity";

export default defineType({
  name: "orderItem",
  title: "Order Item",
  type: "document",
  fields: [
    // {
    //   type: "reference",
    //   name: "account",
    //   title: "Account",
    //   description: "用户",
    //   to: [{ type: "account" }],
    // },
    {
      type: "reference",
      name: "userOrder",
      title: "User Order",
      description: "用户订单",
      to: [{ type: "userOrder" }],
    },
    {
      name: "sku",
      title: "Order Sku",
      type: "reference",
      description: "订单商品",
      to: [{ type: "sku" }],
      weak: true,
    },
    {
      type: "number",
      name: "quantity",
      title: "Quantity",
      description: "数量",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "number",
      name: "preOrderPrice",
      title: "Pre Order Price",
      initialValue: 0,
      description: "预订价格",
    },

    // 该用户订购商品是否买到
    {
      type: "boolean",
      name: "isProductionPurchased",
      title: "Is Purchased",
      initialValue: false,
      description: "该用户订购商品是否买到",
    },
  ],
  preview: {
    select: {
      name: "sku.spu.name",
      size: "sku.attribute.size",
      color: "sku.attribute.color",
      quantity: "quantity",
    },
    prepare(selection, viewOptions) {
      const { name, size, color, quantity } = selection;

      return {
        subtitle: "Order Item",
        title: `${name} - ${size}.[${color}] * ${quantity}`,
        name: `${name} - ${size}.[${color}] * ${quantity}`,
      };
    },
  },
});

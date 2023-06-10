import { defineType, defineField } from "sanity";

export default defineType({
  name: "orderItem",
  title: "Order Item",
  type: "document",
  fields: [
    {
      name: "sku",
      title: "Order Sku",
      type: "reference",
      to: [{ type: "sku" }],
    },
    {
      type: "number",
      name: "quantity",
      title: "Quantity",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "number",
      name: "prePrice",
      title: "Pre Price",
      initialValue: 0,
    },
    {
      type: "boolean",
      name: "isReceived",
      title: "Is Received",
      initialValue: false,
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

import { defineField, defineType } from "sanity";
import MyCustomStringInput from "./myCustomStringInput";

export default defineType({
  name: "sku",
  title: "SKU",
  type: "document",
  fields: [
    defineField({
      type: "reference",
      name: "spu",
      title: "SPU",
      // hidden: true,
      to: [
        {
          type: "spu",
        },
      ],
    }),

    defineField({
      type: "number",
      name: "price",
      title: "Price",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      type: "object",
      name: "attribute",
      title: "Attribute",
      fields: [
        {
          type: "string",
          name: "color",
          title: "Color",
          validation: (Rule) => Rule.required(),
        },
        {
          type: "string",
          name: "size",
          title: "Size",
          validation: (Rule) => Rule.required(),
        },
      ],
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
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
    }),

    defineField({
      type: "reference",
      name: "inventory",
      title: "Inventory",
      weak: true,

      to: [
        {
          type: "inventory",
        },
      ],
    }),
  ],
  preview: {
    select: {
      name: "spu.name", // <-- this is the field that will be used in the title
      size: "attribute.size",
      color: "attribute.color",
      price: "price",
    },
    prepare(selection) {
      const { name, price, size, color } = selection;

      return {
        title: `${name ? name + " - " : ""}${size} - ${color} - $${price}`,
        name: `${name ? name + " - " : ""}${size} - ${color} - $${price}`,
      };
    },
  },
});

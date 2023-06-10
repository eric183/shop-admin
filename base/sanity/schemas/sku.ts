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
    // defineField({
    //   type: "array",
    //   name: "Inventories",
    //   title: "inventories",
    //   of: [
    //     {
    //       type: "reference",
    //       to: [
    //         {
    //           type: "inventory",
    //         },
    //       ],
    //     },
    //   ],
    // }),

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

    // defineField({
    //   type: "reference",
    //   name: "inventory",
    //   title: "Inventory",
    //   to: [
    //     {
    //       type: "inventory",
    //     },
    //   ],
    // }),
  ],
  preview: {
    select: {
      name: "spu.name",
      size: "attribute.size",
      color: "attribute.color",
    },
    prepare(selection) {
      const { name, size, color } = selection;

      return {
        title: `${name} - ${size}.[${color}]`,
        name: `${name} - ${size}.[${color}]`,
      };
    },
  },
});

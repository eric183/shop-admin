import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "inventory",
  title: "Inventory",
  fields: [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    // {
    //   type: "reference",
    //   name: "spu",
    //   title: "SPU",
    //   to: [
    //     {
    //       type: "spu",
    //     },
    //   ],
    // },
    {
      // type: "array",
      type: "reference",
      name: "sku",
      title: "sku",
      to: [
        {
          type: "sku",
          // to: [
          //   {
          //     type: "sku",
          //   },
          // ],
        },
      ],
    },
    {
      type: "number",
      name: "quantity",
      title: "Quantity",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "number",
      name: "preQuantity",
      title: "Pre Quantity",
      readOnly: true,
    },
    {
      type: "number",
      name: "remainQuantity",
      title: "Remain Quantity",
      readOnly: true,
    },
    {
      type: "number",
      name: "actualQuantity",
      title: "Actual Quantity",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      name: "sku.spu.name",
      size: "sku.attribute.size",
      color: "sku.attribute.color",
    },
    prepare(selection) {
      const { name, size, color } = selection;

      return {
        title: `${name} - ${size}.[${color}]`,
      };
    },
  },
});

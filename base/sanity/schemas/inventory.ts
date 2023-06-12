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
      name: "preQuantity",
      title: "Pre Quantity",
      description: "预购（计划）库存",
      options: {
        default: 0,
      },
    },
    {
      type: "number",
      name: "actualQuantity",
      title: "Actual Quantity",
      description: "实际入库库存 = 有效订单 sku  + 剩余库存",
      options: {
        default: 0,
      },
    },
    {
      type: "number",
      name: "remainQuantity",
      title: "Remain Quantity",
      description: "剩余库存 = 实际入库库存 - 有效订单 sku",
      options: {
        default: 0,
      },
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

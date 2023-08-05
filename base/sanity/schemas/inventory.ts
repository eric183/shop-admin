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
    //   // weak: true,
    //   to: [
    //     {
    //       type: "spu",
    //     },
    //   ],
    // },
    // {
    //   type: "array",
    //   name: "skus",
    //   title: "SKUs",
    //   of: [
    // {
    //   type: "object",
    //   name: "inventorySku",
    //   title: "Inventory Sku",
    //   fields: [
    {
      // type: "array",
      type: "reference",
      name: "skuDetail",
      title: "Sku Detail",
      to: [
        {
          type: "sku",
        },
      ],
      // weak: true,
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
    //   ],
    // },
    //   ],
    // },
  ],
  preview: {
    select: {
      name: "skuDetail.spu.name",
      size: "skuDetail.attribute.size",
      color: "skuDetail.attribute.color",
      preQuantity: "preQuantity",
      actualQuantity: "actualQuantity",
      remainQuantity: "remainQuantity",
    },
    prepare(selection) {
      const { name, size, color, preQuantity, actualQuantity, remainQuantity } =
        selection;

      return {
        title: `${name} - ${size}.[${color}]`,
        subtitle: `预购:${preQuantity} | 实际:${actualQuantity} | 剩余:${remainQuantity}`,
        // title: `${name}`,
      };
    },
  },
});

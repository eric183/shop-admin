import { defineType } from "sanity";
import dayjs from "dayjs";

export default defineType({
  title: "BrandOrder",
  type: "document",
  name: "brandOrder",
  fields: [
    {
      type: "reference",
      name: "brand",
      title: "Brand",
      to: [
        {
          type: "brand",
        },
      ],
    },
    // {
    //   type: "array",
    //   name: "userOrders",
    //   title: "UserOrders",
    //   of: [
    //     {
    //       type: "reference",
    //       to: [
    //         {
    //           type: "userOrder",
    //         },
    //       ],
    //     },
    //   ],
    // },
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
  ],
  preview: {
    select: {
      name: "brand.name",
      createAt: "brand._createdAt",
      // size: "attribute.size",
      // color: "attribute.color",
    },
    prepare(selection) {
      const { name, createAt } = selection;

      return {
        title: `${name} - ${dayjs(createAt).format("YYYY-MM-DD")}`,
      };
    },
  },
});

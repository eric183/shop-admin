import { defineField, defineType } from "sanity";

export default defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      // hidden: true,
    }),
    defineField({
      type: "string",
      name: "logo",
      title: "Logo",
      // hidden: true,
    }),
    defineField({
      type: "string",
      name: "officialSite",
      title: "OfficialSite",
      hidden: true,
    }),

    defineField({
      type: "array",
      name: "spus",
      title: "SPUs",
      // hidden: true,
      of: [
        {
          type: "reference",
          to: [
            {
              type: "spu",
            },
          ],
        },
      ],
    }),

    defineField({
      type: "array",
      name: "brandOrders",
      title: "BrandOrders",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "brandOrder",
            },
          ],
        },
      ],
    }),
  ],
});

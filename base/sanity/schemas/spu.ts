import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "spu",
  title: "SPU",
  fields: [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    {
      type: "string",
      name: "name",
      title: "Name",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "string",
      name: "category",
      title: "Category",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "array",
      name: "images",
      title: "Images",
      options: {
        isHighlighted: true,
        hotspot: true,
      },
      of: [
        {
          type: "image",
        },
      ],
    },
    {
      type: "string",
      name: "link",
      title: "Link",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "string",
      name: "brand",
      title: "Brand",
      validation: (Rule) => Rule.required(),
    },
    {
      type: "array",
      name: "skus",
      title: "SKUs",
      of: [
        {
          type: "reference",
          weak: false,
          to: [
            {
              type: "sku",
            },
          ],

          // inverse: "spu",
        },
      ],
    },
  ],
});

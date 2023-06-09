import { defineType } from "sanity";

export default defineType({

  "type": "document",
  "name": "sku",
  "title": "SKU",
  "fields": [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    {
      "type": "number",
      "name": "price",
      "title": "Price",
      "validation": Rule => Rule.required()
    },
    // {
    //   "type": "number",
    //   "name": "stock",
    //   "title": "Stock",
    //   "validation": Rule => Rule.required()
    // },
    {
      "type": "string",
      "name": "image",
      "title": "Image"
    },
    {
      "type": "reference",
      "name": "spu",
      "title": "SPU",
      "to": [
        {
          "type": "spu"
        }
      ]
    },
    {
      "type": "object",
      "name": "attribute",
      "title": "Attribute",
      "fields": [
        {
          "type": "string",
          "name": "color",
          "title": "Color"
        },
        {
          "type": "string",
          "name": "size",
          "title": "Size"
        }
      ],
      "validation": Rule => Rule.required()
    },
    {
      "type": "array",
      "name": "orderItems",
      "title": "Order Items",
      "of": [
        {
          "type": "reference",
          "to": [
            {
              "type": "orderItem"
            }
          ]
        }
      ]
    },
    {
      "type": "array",
      "name": "stock",
      "title": "Stock",
      "of": [
        {
          "type": "reference",
          "to": [
            {
              "type": "stock"
            }
          ]
        }
      ]
    }
  ]

})



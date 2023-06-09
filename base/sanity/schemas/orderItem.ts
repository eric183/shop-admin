import { defineType } from "sanity";

export default defineType({
  "title": "Order Item",
  "name": "orderItem",
  "type": "document",
  "fields": [
    {
      "type": "reference",
      "name": "order",
      "title": "Order",
      "to": [
        {
          "type": "order"
        }
      ]
    },
    {
      "type": "reference",
      "name": "sku",
      "title": "SKU",
      "to": [
        {
          "type": "sku"
        }
      ]
    },
    {
      "type": "number",
      "name": "quantity",
      "title": "Quantity",
      "validation": Rule => Rule.required()
    },
    {
      "type": "number",
      "name": "prePrice",
      "title": "Pre Price",
      "initialValue": 0
    },
    {
      "type": "boolean",
      "name": "isReceived",
      "title": "Is Received",
      "initialValue": false
    }
  ],
  "preview": {
    "select": {
      "title": "sku.id",
      "subtitle": "quantity"
    }
  }
})
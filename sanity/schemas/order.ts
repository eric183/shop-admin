import { defineType } from "sanity";

export default defineType({
  "title": "Order",
  "type": "document",
  "name": "order",
  "fields": [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    {
      "type": "reference",
      "name": "account",
      "title": "Account",
      "to": [
        {
          "type": "account"
        }
      ]
    },
    {
      "type": "number",
      "name": "sortNumber",
      "title": "Sort Number"
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
      "name": "shipments",
      "title": "Shipments",
      "of": [
        {
          "type": "reference",
          "to": [
            {
              "type": "shipment"
            }
          ]
        }
      ]
    },
    {
      "type": "number",
      "name": "deposit",
      "title": "Deposit"
    },
    {
      "type": "string",
      "name": "orderStatus",
      "title": "Order Status",
      "initialValue": "UNPAID",
      "validation": Rule => Rule.required(),
      "options": {
        "list": [
          {
            "title": "Unpaid",
            "value": "UNPAID"
          },
          {
            "title": "Paid",
            "value": "PAID"
          },
          {
            "title": "Shipped",
            "value": "SHIPPED"
          },
          {
            "title": "Received",
            "value": "RECEIVED"
          },
          {
            "title": "Cancelled",
            "value": "CANCELLED"
          }
        ]
      }
    },
    {
      "type": "number",
      "name": "finalPayment",
      "title": "Final Payment",
      "initialValue": 0
    }
  ]
})



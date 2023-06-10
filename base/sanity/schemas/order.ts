import { defineType } from "sanity";
import MyCustomStringInput from "./myCustomStringInput";

export default defineType({
  title: "Order",
  type: "document",
  name: "order",
  fields: [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    {
      type: "reference",
      name: "account",
      title: "Account",
      to: [
        {
          type: "account",
        },
      ],
    },
    {
      type: "number",
      name: "sortNumber",
      title: "Sort Number",
    },
    {
      type: "array",
      name: "orderItems",
      title: "Order Items",

      of: [
        {
          type: "reference",

          to: [
            {
              type: "orderItem",
              // preview: {
              //   select: {
              //     title: "sku",
              //     quantity: "quantity",
              //   },
              //   prepare(value, viewOptions) {
              //     const { title, quantity } = value;
              //     return {
              //       title: `${title} (${quantity})`,
              //     };
              //   },
              // },
            },
          ],
        },
      ],
    },
    // {
    //   type: "array",
    //   name: "orderItems",
    //   title: "Order Items",

    //   of: [
    //     {
    //       type: "reference",
    //       to: [
    //         {
    //           type: "orderItem",
    //         },
    //       ],
    //     },
    //     // {
    //     //   type: "object",
    //     //   name: "myObject",
    //     //   title: "Order Item",
    //     //   // components: {
    //     //   //   input: MyCustomStringInput,
    //     //   // },
    //     //   // preview: {
    //     //   //   select: {
    //     //   //     // name: "sku",
    //     //   //     title: "sku",
    //     //   //     quantity: "quantity",
    //     //   //     // title: "myObject.size",
    //     //   //   },
    //     //   //   prepare(selection) {
    //     //   //     return {
    //     //   //       title: selection.title,
    //     //   //     };
    //     //   //   },
    //     //   // },
    //     //   fields: [
    //     //     {
    //     //       type: "reference",
    //     //       name: "sku",
    //     //       title: "SKU",
    //     //       weak: false,
    //     //       validation: (Rule) => Rule.required(),
    //     //       to: [
    //     //         {
    //     //           type: "sku",
    //     //         },
    //     //       ],
    //     //     },
    //     //     {
    //     //       type: "number",
    //     //       name: "quantity",
    //     //       title: "Quantity",
    //     //       validation: (Rule) => Rule.required(),
    //     //     },
    //     //     {
    //     //       type: "number",
    //     //       name: "prePrice",
    //     //       title: "Pre Price",
    //     //       initialValue: 0,
    //     //     },
    //     //     {
    //     //       type: "boolean",
    //     //       name: "isReceived",
    //     //       title: "Is Received",
    //     //       initialValue: false,
    //     //     },
    //     //   ],
    //     // },
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
    {
      type: "number",
      name: "deposit",
      title: "Deposit",
    },
    {
      type: "string",
      name: "orderStatus",
      title: "Order Status",
      initialValue: "UNPAID",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {
            title: "Unpaid",
            value: "UNPAID",
          },
          {
            title: "HalfPaid",
            value: "UNPAID",
          },
          {
            title: "Paid",
            value: "PAID",
          },
          {
            title: "Shipped",
            value: "SHIPPED",
          },
          {
            title: "Received",
            value: "RECEIVED",
          },
          {
            title: "Cancelled",
            value: "CANCELLED",
          },
        ],
      },
    },
    {
      type: "number",
      name: "finalPayment",
      title: "Final Payment",
      initialValue: 0,
    },
  ],
});

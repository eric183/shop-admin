import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "shipment",
  title: "Shipment",
  fields: [
    // 快递类型： 国际、国内
    {
      type: "string",
      name: "trackingNumber",
      title: "Tracking Number",
      description: "快递单号",
    },
    {
      type: "string",
      name: "carrier",
      title: "Carrier",
      description: "快递公司",
    },
    {
      type: "string",
      name: "type",
      title: "Type",
      description: "快递类型： 国际、国内",
      options: {
        list: [
          { title: "国际", value: "international" },
          { title: "国内", value: "domestic" },
        ],
      },
    },
    {
      type: "reference",
      name: "brandOrder",
      title: "BrandOrder",
      description: "订单",
      // weak: false,
      to: [
        {
          type: "userOrder",
        },
      ],
    },
    {
      type: "string",
      name: "address",
      title: "Address",
      description: "地址",
    },
    {
      type: "string",
      name: "url",
      title: "URL",
      description: "快递单号查询网址",
    },
  ],
  preview: {
    select: {
      title: "address",
      subtitle: "order._id",
    },
  },
});

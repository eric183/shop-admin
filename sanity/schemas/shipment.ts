import { defineType } from "sanity";

export default defineType({
  "type": "document",
  "name": "shipment",
  "title": "Shipment",
  "fields": [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    {
      "type": "string",
      "name": "officialId",
      "title": "Official ID"
    },
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
      "type": "string",
      "name": "address",
      "title": "Address"
    },
    {
      "type": "string",
      "name": "url",
      "title": "URL"
    }
  ] 
});
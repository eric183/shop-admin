import { defineType } from "sanity";

  
export default defineType({    
  "type": "document",
  "name": "stock",
  "title": "Stock",
  "fields": [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
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
      "name": "preQuantity",
      "title": "Pre Quantity",
      "readOnly": true
    },
    {
      "type": "number",
      "name": "remainQuantity",
      "title": "Remain Quantity",
      "readOnly": true
    },
    {
      "type": "number",
      "name": "actualQuantity",
      "title": "Actual Quantity",
      "readOnly": true
    }
  ]
});


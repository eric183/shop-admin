import { defineType } from "sanity";

export default defineType({
  title: "Address",
  name: "address",
  type: "document",
  fields: [
    {
      type: "string",
      name: "type",
      title: "地址类型",
      initialValue: "转运",

      options: {
        list: [
          {
            title: "transship",
            value: "TRANS_SHIP",
          },
          {
            title: "billing",
            value: "BILLING",
          },
        ],
      },
    },
    {
      type: "string",
      name: "email",
      title: "email",
    },
    {
      type: "string",
      name: "name",
      title: "Name",
    },
    {
      type: "string",
      name: "familyName",
      title: "family name",
    },
    // billing given-name
    {
      type: "string",
      name: "givenName",
      title: "given name",
    },
    {
      type: "string",
      name: "addressLine1",
      title: "address-line1",
    },
    {
      type: "string",
      name: "addressLine2",
      title: "address-line2",
    },
    {
      type: "string",
      name: "addressLevel1",
      title: "address-level1",
    },
    {
      type: "string",
      name: "addressLevel2",
      title: "address-level2",
    },
    {
      type: "string",
      name: "postalCode",
      title: "postalCode",
    },
    {
      type: "string",
      name: "country",
      title: "Country",
    },
    {
      type: "string",
      name: "tel",
      title: "tel",
    },
    {
      type: "boolean",
      name: "default",
      title: "Default",
      initialValue: false,
    },
    {
      type: "string",
      name: "label",
      title: "Label",
    },
    {
      type: "string",
      name: "note",
      title: "Note",
    },
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
  ],
});

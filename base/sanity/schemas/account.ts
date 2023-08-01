import { defineType } from "sanity";

export default defineType({
  title: "Account",
  name: "account",
  type: "document",
  fields: [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true
    // },
    {
      type: "boolean",
      name: "verified",
      title: "Verified",
      initialValue: false,
    },
    {
      type: "image",
      name: "avatar",
      title: "Avatar",
      options: {
        hotspot: true,
      },
    },
    {
      type: "string",
      name: "role",
      title: "Role",
      validation: (Rule) => Rule.required(),
      options: {
        defaultValue: "GUEST",
        list: [
          {
            title: "Admin",
            value: "ADMIN",
          },
          {
            title: "User",
            value: "USER",
          },
          {
            title: "Guest",
            value: "GUEST",
          },
        ],
      },
    },
    {
      type: "reference",
      name: "user",
      title: "User",
      to: [
        {
          type: "user",
        },
      ],
    },
    {
      type: "string",
      name: "username",
      title: "Username",
    },
    {
      type: "string",
      name: "email",
      title: "Email",
    },
    {
      type: "string",
      name: "authToken",
      title: "Auth Token",
    },
    {
      type: "boolean",
      name: "isValidate",
      title: "Is Validated",
      initialValue: false,
    },
    {
      type: "string",
      name: "validateToken",
      title: "Validate Token",
    },
    {
      type: "string",
      name: "accessToken",
      title: "Access Token",
    },
    {
      type: "datetime",
      name: "accessTokenExpiredAt",
      title: "Access Token Expired At",
    },
    {
      type: "string",
      name: "password",
      title: "Password",
    },
    {
      type: "array",
      name: "userOrders",
      title: "UserOrders",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "userOrder",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "username",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title,
      };
    },
  },
});

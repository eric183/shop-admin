import {defineField, defineType} from 'sanity'

export default defineType({    
  "type": "document",
  "title": "User",
  "name": "user",
  "fields": [
    // {
    //   "type": "string",
    //   "name": "id",
    //   "title": "ID",
    //   "readOnly": true,
    //   "hidden": true,
    //   // auto create id
      
    // },
    {
      "type": "string",
      "name": "email",
      "title": "Email",
      "validation": Rule => Rule.required()
    },
    {
      "type": "string",
      "name": "name",
      "title": "Name"
    },
    {
      "type": "string",
      "name": "status",
      "title": "Status",
      "initialValue": "ACTIVE",
      "validation": Rule => Rule.required(),
      "options": {
        "list": [
          {
            "title": "Active",
            "value": "ACTIVE"
          },
          {
            "title": "Inactive",
            "value": "INACTIVE"
          },
          {
            "title": "Deleted",
            "value": "DELETED"
          }
        ]
      }
    },
    {
      "type": "array",
      "name": "accounts",
      "title": "Accounts",
      "of": [
        {
          "type": "reference",
          "to": [
            {
              "type": "account"
            }
          ]
        }
      ]
    }
  ]
})

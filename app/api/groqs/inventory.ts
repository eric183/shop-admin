import { groq } from "next-sanity";

export const getInventoryItem = groq`*[_type == "inventory" && skus[]._ref == $skuId] {
  _id,
  "skuDetail": *[_type == "sku" && references(^._id)],
  preQuantity,
  actualQuantity,
  remainQuantity
}`;

export const getInventories = groq`*[_type == "inventory"]{
  _id,
  skuDetail-> {
    _id,
    spu-> {
      _id,
      "imageURLs": images[]{asset->{_id, _ref, url}},
    },
    "brand": *[_type == "brand" && _ref == ^.spu._id][0]{ name},
    "productName": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0].name + " : " + attribute.color + " - " + attribute.size,
  },
  preQuantity,
  actualQuantity,
  remainQuantity
}`;

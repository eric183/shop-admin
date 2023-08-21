import { groq } from "next-sanity";

const productQuery = groq`*[_type == "spu"][$start... $limit]{
  _id,
  name,
  "images": images[]{asset->{_id, _ref, url}}, 
  link,
  "skus": *[_type == "sku" && references(^._id)] {
    _id,
    price,
    attribute,
    "inventory": *[_type == "inventory" && references(^._id)][0] {
      _id,
      remainQuantity,
      preQuantity,
      actualQuantity
    } 
  },
  "brand": brand->{_id, name},
  _createdAt,
  _updatedAt,
}`;

export const getProductId = groq`*[_type == "spu" && _id == $id][0]{
  _id,
  name,
  "spu": *[_type == "spu" && references(^._id)][0]{
    _id,
    name,
    category,
    link,
    "skus": *[_type == "sku" && references(^._id)] {
      _id,
      _ref,
      attribute,
      price,
      "inventory": *[_type == "inventory"] {
        _id,
        _ref,
        remainQuantity,
        preQuantity,
        actualQuantity
      },
    },
    "imageURLs": images[]{asset->{_id, _ref, url}},
  },
  _createdAt,
  _updatedAt,
}`;

export const productRootQuery = groq`*[_type == "brand"][$start... $limit]{
  _id,
  name,
  "spu": *[_type == "spu" && references(^._id)][0]{
    _id,
    name,
    category,
    link,
    "skus": *[_type == "sku" && references(^._id)] {
      _id,
      _ref,
      attribute,
      price,
      "inventory": *[_type == "inventory" && _id == ^.inventory._ref][0] {
        _id,
        _ref,
        remainQuantity,
        preQuantity,
        actualQuantity
      },
    },
    "imageURLs": images[]{asset->{_id, _ref, url}},
  },
  _createdAt,
  _updatedAt,
}`;

export const getProductName = groq`*[_type == "brand" && _id == $id][0]{
  _id,
  name,
  _createdAt,
  _updatedAt
}`;

// const productQuery = groq`*[_type == "spu"][$start... $limit]{
//   _id,
//   name,
//   category,
//   "brand": *[_type == "brand" && _id == ^.brand._ref][0] {
//     _id,
//     _ref,
//     name,
//   },
//   link,
//   "imageURLs": images[]{asset->{_id, _ref, url}},
//   "skus": *[_type == "sku" && references(^._id)] {
//     _id,
//     _ref,
//     attribute,
//     price,
//     "inventory": *[_type == "inventory" && _id == ^.inventory._ref][0] {
//       _id,
//       _ref,
//       remainQuantity,
//       preQuantity,
//       actualQuantity
//     },
//   },
//   _createdAt,
//   _updatedAt,
// }`;

// const productQuery = groq`*[_type == "spu"][$start... $limit]{
//   _id,
//   name,
//   category,
//   brand,
//   link,
//   "imageURLs": images[]{asset->{_id, _ref, url}},
//   "skus": *[_type == "sku" && references(^._id)] {
//     _id,
//     _ref,
//     attribute,
//     price,
//     inventory,
//     "remainQuantity": *[_type == "inventory" && _id == ^.inventory._ref][0].remainQuantity,
//     "preQuantity": *[_type == "inventory" && _id == ^.inventory._ref][0].preQuantity,
//     "actualQuantity": *[_type == "inventory" && _id == ^.inventory._ref][0].actualQuantity,
//   },
//   _createdAt,
//   _updatedAt,
// }`;

// "remainQuantity": quantity - sum(*[_type == "orderItem" && references(^._id)] -> quantity),

// "orderItems": orderItems[]-> {..., "sku": sku->, "spu": sku->spu},
// "account": account-> {..., "avatar": avatar.asset->url},
// "finalPayment": sum(orderItems[]->sku->price),
// "deposit": sum(orderItems[]->sku->price * orderItems[]->quantity),

export default productQuery;
// *[_type=='movie' && title == 'Arrival']{title,'posterUrl': poster.asset->url}

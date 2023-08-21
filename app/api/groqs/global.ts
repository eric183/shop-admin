import { groq } from "next-sanity";

const globalQuery = groq`*[_type == "user"]{
  _id,
  "accounts": *[_type == "account"] { _id, username },
  "skus": *[_type == "sku"] { 
    _id, 
    attribute, 
    "inventory": *[_type == "inventory" && references(^._id)][0] {
      _id,
      remainQuantity,
      preQuantity,
      actualQuantity
    }, 
    "spu": *[_type == "spu" && _id == ^.spu._ref][0]{ "spuId": _id, name }  
  },
  "username": account->username,
  "brands": *[_type == "brand"]{ 
    _id,
    name,
    logo,
    brandOrders,
    "spus": *[_type == "spu" &&  references(^._id)]{ _id, name },
  },
  "inventories": *[_type == "inventory"]{
    _id,
    _ref,
    _key,
    spu,
    skus
  },
}[0]`;

export const orderBrandsWithDateRange = groq`*[_type == 'brandOrder' && _createdAt >= $from && _createdAt < $to] {
  _id,
  _createdAt,
  _updatedAt,
  userOrders,
  brand->{
    _id,
    name, 
    logo,
    "spus": *[_type == "spu" &&  references(^._id)]{ _id, name },
  },
}`;
// export const orderWithBrandsQuery = groq`*[_type == "brandOrder" && brand._ref == $brandId && _createdAt >= $dateRange.from && _createdAt < $dateRange.to]{
export const orderWithBrandsQuery = groq`*[_type == "brandOrder" && _id== $orderId]{
  _id,
  userOrders[]-> {
    _id,
    _ref,
  }
}`;
// "orderItems": orderItems[]-> {..., "sku": sku->, "spu": sku->spu},
// "account": account-> {..., "avatar": avatar.asset->url},
// "finalPayment": sum(orderItems[]->sku->price),
// "deposit": sum(orderItems[]->sku->price * orderItems[]->quantity),
// : orderItems[]-> {
//   _id,
//   quantity,
//   preOrderPrice,
//   "sku": *[_type == "sku" && _id == ^.sku._ref] {
//     _id,
//     "color": attribute.color,
//     "size": attribute.size,
//     "spu": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0]
//   }[0]
// },
export default globalQuery;

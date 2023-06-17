import { groq } from "next-sanity";

const globalQuery = groq`*[_type == "user"]{
  _id,
  "accounts": *[_type == "account"] { _id, username },
  "skus": *[_type == "sku"] { _id, attribute, "spu": *[_type == "spu" && _id == ^.spu._ref][0]{ "spuId": _id, name }  },
  "username": account->username,
}[0]`;
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

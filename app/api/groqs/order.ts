import { groq } from "next-sanity";
// const orderQuery = groq`*[_type == "order" & ${"orderStatus == 'paid' || orderStatus == 'shipped' || orderStatus == 'delivered'"}] | order(orderStatus asc, _updatedAt desc) {

export const userOrderQuery = groq`*[_type == "userOrder" && _createdAt >= $dateRange.gte && _createdAt < $dateRange.lt]{
  _id,
  "account": account-> { _id, username },
  "orderItems": orderItems[]-> {
    _id,
    quantity,
    _ref,
  },
  discount,
  finalPayment,
  deposit,
  orderStatus
}`;

export const brandOrderQuery = groq`*[_type == "brand" && _createdAt >= $dateRange.gte && _createdAt < $dateRange.lt]{
  _id,
  name,
  "brandOrders": *[_type == "brandOrder" && brand._ref == ^._id]{
    _id,
    "userOrders": *[ _type == "userOrder" && brandOrder._ref == ^._id] {
      _id,
      "account": account-> { _id, username },
      "orderItems": *[ _type == "orderItem" && userOrder._ref == ^._id] {
        _id,
        quantity,
        preOrderPrice,
        "_ref": ^._id,
        "sku": *[_type == "sku" && _id == ^.sku._ref][0] {
          _id,
          "attribute": {
            "color": attribute.color,
            "size": attribute.size,
          },
          "spuColorSize": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0].name + " : " + attribute.color + " - " + attribute.size,
          "spu": *[_type == "spu" && _id == ^.spu._ref][0] {
            _id, 
            "spuId": _id,
            name,
            "images": images[].asset->url, 
          }
        }
      },
      discount,
      finalPayment,
      deposit,
      orderStatus
    },
  },
  "createdAt": _createdAt,
  "updatedAt": _updatedAt,
}`;
// export const brandOrderQuery = groq`*[_type == "brandOrder" && _createdAt >= $dateRange.gte && _createdAt < $dateRange.lt]{
//   _id,
//   "brand": brand-> { _id, name },
//   "userOrders": userOrders[]-> {
//     _id,
//     "account": account-> { _id, username },
//     "orderItems": orderItems[]-> {
//       _id,
//       quantity,
//       "_ref": ^._id,
//       "skus": *[_type == "sku" && _id == ^.sku._ref] {
//         _id,
//         "color": attribute.color,
//         "size": attribute.size,
//         "spuColorSize": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0].name + " : " + attribute.color + " - " + attribute.size,
//         "spu": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0]

//       }
//     },
//     discount,
//     finalPayment,
//     deposit,
//     orderStatus
//   },

//   "createdAt": _createdAt,
//   "updatedAt": _updatedAt,
// }`;
// export const brandOrderQuery = groq`*[_type == "brandOrder" && _createdAt >= $dateRange.gte && _createdAt < $dateRange.lt]{
//   _id,

//   "brand": brand-> { _id, name },
//   "userOrders": userOrders[]-> {
//     _id,
//     "account": account-> { _id, username },
//     "orderItems": orderItems[]-> {
//       _id,
//       quantity,
//       "_ref": ^._id,
//       "skus": *[_type == "sku" && _id == ^.sku._ref] {
//         _id,
//         "color": attribute.color,
//         "size": attribute.size,
//         "spuColorSize": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0].name + " : " + attribute.color + " - " + attribute.size,
//         "spu": *[_type == "spu" && _id == ^.spu._ref] {_id, name}[0]

//       }
//     },
//     discount,
//     finalPayment,
//     deposit,
//     orderStatus
//   },

//   "createdAt": _createdAt,
//   "updatedAt": _updatedAt,
// }`;

// _id,
// "brand": brand-> { _id, name },
// "userOrders": userOrders[]-> {
//   _id,
//   "account": account-> { _id, username },
//   "orderItems": orderItems[]-> {
//     _id,
//     quantity,
//     _ref,
//   },
//   discount,
//   finalPayment,
//   deposit,
//   orderStatus
// },
// "createdAt": _createdAt,
// "updatedAt": _updatedAt,

// export const branndOrderDetailQuery = groq`*[_type == "brandOrder" && _createdAt >= $dateRange.gte && _createdAt < $dateRange.lt]{
//   _id,
//   "brand": brand-> { _id, name, _ref },
//   "userOrders": userOrders[]-> {
//     _id,
//     "account": account-> { _id, username },
//     "orderItems": orderItems[]-> {
//       _id,
//       quantity,
//       _ref,
//     },
//     discount,
//     finalPayment,
//     deposit,
//     orderStatus
//   },
//   "createdAt": _createdAt,
//   "updatedAt": _updatedAt,
// }`;
// "shipments": shipments[]-> { _id, carrier, url, address, trackingNumber, type },
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

// sortNumber,
// orderStatus,
// deposit,
// finalPayment,
// quantity,
// discount,
// "skus": *[_type == "sku"] {
//   _id,
//   attribute,
//   "spu": *[_type == "spu" && _id == ^.spu._ref][0]{
//     "spuId": _id,
//     name,
//   }
// },
// "orderItems": orderItems[]-> {
//   _id,
//   quantity,
//   _ref,
//   preOrderPrice,
//   isProductionPurchased,
//   discount,
//   sku-> {
//     _id,
//     "color": attribute.color,
//     "size": attribute.size,
//     "spu": *[_type == "spu" && _id == ^.spu._ref][0] {_id, name, "imageURLs": images[]{asset->{_id, _ref, url}}}
//   }
// },
// "account": account-> { _id, username },
// "shipments": shipments[]-> { _id, carrier, url, address, trackingNumber, type },
// "createdAt": _createdAt,
// "updatedAt": _updatedAt,

import { groq } from "next-sanity";

const productQuery = groq`*[_type == "spu"][$start... $limit]{
  _id,
  name,
  category,
  brand,
  link,
  "imageURLs": images[]{asset->{_id, _ref, url}},
  "skus": *[_type == "sku" && references(^._id)] {
    _id,
    _ref,
    attribute,
    price,
    "remainQuantity": *[_type == "inventory" && _id == ^.inventory._ref][0].remainQuantity,
  },
  _createdAt,
  _updatedAt,
}`;

// "remainQuantity": quantity - sum(*[_type == "orderItem" && references(^._id)] -> quantity),

// "orderItems": orderItems[]-> {..., "sku": sku->, "spu": sku->spu},
// "account": account-> {..., "avatar": avatar.asset->url},
// "finalPayment": sum(orderItems[]->sku->price),
// "deposit": sum(orderItems[]->sku->price * orderItems[]->quantity),

export default productQuery;
// *[_type=='movie' && title == 'Arrival']{title,'posterUrl': poster.asset->url}

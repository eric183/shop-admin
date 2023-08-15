import { groq } from "next-sanity";
// const orderQuery = groq`*[_type == "order" & ${"orderStatus == 'paid' || orderStatus == 'shipped' || orderStatus == 'delivered'"}] | order(orderStatus asc, _updatedAt desc) {

export const addressListQuery = groq`*[_type == "address"]{
  _id,
  email,
  name,
  familyName,
  givenName,
  addressLine1,
  addressLine2,
  addressLevel1,
  addressLevel2,
  postalCode,
  country,
  tel,
  _createdAt,
  _updatedAt,
  type,
}`;

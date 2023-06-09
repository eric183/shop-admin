import { groq } from "next-sanity";

const authGROQ = groq`*[_type == 'account'&& email == $email && password == $password]{
  _id,
  username,
  email,
  "image": avatar.asset->url
}`;

export default authGROQ;

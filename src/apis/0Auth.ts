// fetch("https://oauth2.googleapis.com/token", {
//   client_id:
//     "823168178672-92nb5vmcg80m1nqhsgeoo7gq92p5qp2d.apps.googleusercontent.com",
//   grant_type: "refresh_token",
//   grant_type: "refresh_token", // authorization_code
//   client_secret: "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",
//   refresh_token: "", // code: ""
//   redirect_uri: "http://localhost:5173",

import axios from "axios";

// import { request } from "../App";

// });
const VITE_AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH_REDIRECT_URI;
const VITE_AUTH_RESPONSE_TYPE = import.meta.env.VITE_AUTH_RESPONSE_TYPE;
const VITE_AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;
const VITE_AUTH_CLIENT_SECRET = import.meta.env.VITE_AUTH_CLIENT_SECRET;
const VITE_AUTH_SCOPE = import.meta.env.VITE_AUTH_SCOPE;
const VITE_AUTH_URL = import.meta.env.VITE_AUTH_URL;
export const Auth_URL = `${VITE_AUTH_URL}?redirect_uri=${VITE_AUTH_REDIRECT_URI}&response_type=${VITE_AUTH_RESPONSE_TYPE}&client_id=${VITE_AUTH_CLIENT_ID}&scope=${VITE_AUTH_SCOPE}`;

export const signInWithGoogle = async ({
  code = "",
  grantType = "refresh_token",
}) => {
  const codeORrefresh_token =
    grantType === "refresh_token"
      ? {
          refresh_token: code,
        }
      : {
          code,
        };

  const response = await axios.post<{
    status: string;
    message: string;
  }>("https://oauth2.googleapis.com/token", {
    client_id: VITE_AUTH_CLIENT_ID,
    client_secret: VITE_AUTH_CLIENT_SECRET,
    grant_type: grantType,
    redirect_uri: VITE_AUTH_REDIRECT_URI,
    ...codeORrefresh_token,
  });

  return response.data;
};

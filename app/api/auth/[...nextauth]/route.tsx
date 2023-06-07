import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendVerificationRequest } from "../../../../utils/helpers/mailRequest";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_SENDER,
    //   sendVerificationRequest,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials, "...!!!.");

        return null;
      },
    }),

    // ...add more providers here
  ],
};

// identifier: process.env.EMAIL_SENDER,
// url: "test",
// auth: {
//   user: process.env.EMAIL_SERVER,
//   pass: process.env.EMAIL_PWD,
// },
// provider: {
//   server: process.env.EMAIL_SERVER,
//   from: process.env.EMAIL_SENDER,
// },

// sendVerificationRequest({
//   identifier: email,
//   url,
//   token,
//   baseUrl,
//   provider,
// }) {
//   console.log("80", email, url, token, baseUrl, provider);
// },
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// transport: {
//   host: 'smtp.gmail.com',
//   secure: true,
//   auth: {
//     user: 'kk297466058@gmail.com',
//     pass: 'ixxuzqwxxxvlfogo',
//   },
// }, // デフォルトでの送信元メールアドレスの設定
// defaults: {
//   from: 'kk297466058@gmail.com',
// },
// // テンプレートの設定
// template: {
//   dir: join(__dirname, '/templates'),
//   adapter: new HandlebarsAdapter(),
//   options: {
//     strict: true,
//   },
// },

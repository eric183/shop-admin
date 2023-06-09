import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { media } from "sanity-plugin-media";

export default defineConfig({
  name: "default",
  title: "shop-sanity-database",

  // projectId: "6x7pryly",
  // dataset: "production",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,

  plugins: [deskTool(), visionTool(), media()],

  schema: {
    types: schemaTypes,
  },
});

// next-auth 是一款基于 Node.js 的身份验证库，它可以帮助你在 Next.js 应用程序中添加用户认证和授权功能。

// 下面是使用 next-auth 的基本步骤：

// 安装 next-auth：
// npm install next-auth
// 创建一个 auth.js 文件，用于配置和实现认证：
// import NextAuth from 'next-auth'
// import Providers from 'next-auth/providers'

// const options = {
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET
//     })
//   ]
// }

// export default (req, res) => NextAuth(req, res, options)
// 在这个文件中，我们使用了 Google 作为身份验证提供商，并且使用了环境变量来存储我们的 Google 客户端 ID 和客户端秘钥。

// 在页面中使用 next-auth 提供的组件：
// import {signIn, signOut, useSession} from "next-auth/client";

// function MyComponent() {
//   const [session, loading] = useSession();

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!session) {
//     return <div>
//       <button onClick={signIn}>Sign in</button>
//     </div>
//   }

//   return <div>
//       <p>Signed in as {session.user.email}</p>
//       <button onClick={signOut}>Sign out</button>
//     </div>
// }
// 在这个示例中，我们使用 useSession 钩子来获取用户的当前会话状态，如果用户已经登录，则显示他的电子邮件地址和一个“登出”按钮。如果用户未登录，则显示一个“登录”按钮。

// 以上就是使用 next-auth 实现身份验证的基本步骤。需要注意的是，我们还可以使用其他身份验证提供商，如 Amazon、Facebook、Twitter 等，还可以在 auth.js 文件中添加其他配置，例如存储方式、电子邮件和密码策略等。

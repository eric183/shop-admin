import Layout from "./components/Layout";
import loadable from "@loadable/component";
import { Router } from "@reach/router";
import { signInWithGoogle } from "./apis/Auth";
import { useEffect } from "react";
import { io } from "socket.io-client";

import mainStore from "./stores";

const routes: Record<string, any> = import.meta.glob("./routes/*.tsx");

// export const socket = io("https://whiteboard-w7z33mbs4q-an.a.run.app", {
export const socket = io("http://localhost:8888", {
  transports: ["websocket"],
});

function App() {
  const { setAccessToken } = mainStore();
  const pageKeys = Object.keys(routes).filter(
    (path) => path !== "./routes/index.tsx"
  );
  const onConnect = (_socket) => {
    console.log("hio");
    _socket.on("disconnect", (reason) => {
      // ...
      debugger;
    });
  };
  useEffect(() => {
    socket.on("connection", onConnect);

    return () => {
      socket.off("connection", onConnect);
    };
  }, []);
  const SignIn = async () => {
    const searchQuery = new URLSearchParams(window.location.search);
    const code = searchQuery.get("code");
    const scope = searchQuery.get("scope");
    if (code) {
      const response = await signInWithGoogle({
        code,
        grantType: "authorization_code",
      });

      setAccessToken(response.access_token);
    }
  };
  useEffect(() => {
    SignIn();
  }, []);

  return (
    <Router>
      <Layout path="/" pageKeys={pageKeys}>
        {pageKeys.map((path) => {
          const pageName = path.match(/[\w-]+(?=\.tsx$)/)![0];

          // typescript remake
          const Page: any = loadable(routes[path]);
          return <Page path={`/${pageName}`} key={path} />;
        })}
      </Layout>
    </Router>
  );
}

export default App;

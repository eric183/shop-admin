import Layout from "./components/Layout";
import loadable, {
  ExtraComponentProps,
  LoadableComponent,
} from "@loadable/component";
import { Router } from "@reach/router";
import { useQuery } from "@tanstack/react-query";
import { Auth_URL, signInWithGoogle } from "./apis/0Auth";
import { useEffect, useLayoutEffect } from "react";
// import initRequest from "./base/Request";

// export const request = initRequest();

const routes: Record<string, any> = import.meta.glob("./routes/*.tsx");
function App() {
  // useEffect(() => {
  //   window.open(Auth_URL, "_blank", "width=500,height=600");
  // }, []);
  // useQuery({
  //   queryKey: [""],
  //   queryFn: () => signInWithGoogle(),
  // });

  const pageKeys = Object.keys(routes).filter(
    (path) => path !== "./routes/index.tsx"
  );

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

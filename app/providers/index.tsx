import { NextAuthProvider } from "./nextAuth";
import ReactQuery from "./reactQuery";

const InjectProviders = ({ children }: { children: React.ReactNode }) => (
  <ReactQuery>
    <NextAuthProvider>{children}</NextAuthProvider>
  </ReactQuery>
);

export default InjectProviders;

import { ConfigProvider } from "antd";
import DarKThemeProvider from "./darkTheme";
import { NextAuthProvider } from "./nextAuth";
import ReactQuery from "./reactQuery";
import AntdConfig from "./antdConfig";
import ToastProvider from "./toast";

const InjectProviders = ({ children }: { children: React.ReactNode }) => (
  <DarKThemeProvider>
    <ToastProvider>
      <ReactQuery>
        <NextAuthProvider>{children}</NextAuthProvider>
      </ReactQuery>
    </ToastProvider>
  </DarKThemeProvider>
);

export default InjectProviders;

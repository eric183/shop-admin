import { ConfigProvider } from "antd";
import DarKThemeProvider from "./darkTheme";
import { NextAuthProvider } from "./nextAuth";
import ReactQuery from "./reactQuery";
import AntdConfig from "./antdConfig";

const InjectProviders = ({ children }: { children: React.ReactNode }) => (
  <DarKThemeProvider>
    <AntdConfig>
      <ReactQuery>
        <NextAuthProvider>{children}</NextAuthProvider>
      </ReactQuery>
    </AntdConfig>
  </DarKThemeProvider>
);

export default InjectProviders;

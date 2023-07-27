"use client";

import { ConfigProvider } from "antd";

import React from "react";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/zh_CN";
import { Locale } from "antd/es/locale";
dayjs.locale("zh-cn");

const AntdConfig = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider locale={locale as unknown as Locale}>
      {children}
    </ConfigProvider>
  );
};

export default AntdConfig;

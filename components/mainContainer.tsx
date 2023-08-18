"use client";

import AuthContainer from "./authContainer";
import PageContainer from "./pageContainer";
import { useSession } from "next-auth/react";

const MainConainer = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  return status === "authenticated" ? (
    // return status === "authenticated" ? (
    <PageContainer>{children}</PageContainer>
  ) : (
    <AuthContainer />
  );
  // return <PageContainer>{children}</PageContainer>;
};

export default MainConainer;

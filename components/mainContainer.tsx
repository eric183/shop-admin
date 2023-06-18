"use client";

import { getServerSession } from "next-auth";
import AuthContainer from "./authContainer";
import PageContainer from "./pageContainer";
import { useSession } from "next-auth/react";

const MainConainer = ({ children }: { children: React.ReactNode }) => {
  const { data, status } = useSession();

  return status === "authenticated" ? (
    <PageContainer>{children}</PageContainer>
  ) : (
    <AuthContainer />
  );
};

export default MainConainer;

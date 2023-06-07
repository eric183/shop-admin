import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Avatar from "~components/Layout/Avatar";
import SideNav from "~components/Layout/SideNav";

export const metadata: Metadata = {
  title: "My Page Title",
};

const Page = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Page;

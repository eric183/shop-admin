"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Avatar from "~components/Layout/Avatar";
import SideNav from "~components/Layout/SideNav";
const PageContainer = ({ children }: { children: React.ReactNode }) => {
  // console.log("reRender");
  const { data, status } = useSession();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     redirect("/auth");
  //   }
  // }, [status]);

  // console.log(data, " user");
  return (
    <main className="App w-screen h-screen flex flex-col">
      {/* Header */}
      <header
        role="banner"
        className="flex items-center px-4 bg-sky-200 text-white py-3 text-sm font-medium flex-shrink-0"
      >
        {data?.user && (
          <Avatar
            onClick={signOut}
            className="rounded-full self-end cursor-pointer"
            src={data?.user?.image ? data?.user?.image : ""}
          ></Avatar>
        )}
        <span className="font-extrabold text-gray-500 text-base ml-4">
          骷髅樱桃电商后台惹
        </span>
      </header>

      {/* Main Content */}
      <section className="main-content flex flex-1 w-full bg-slate-200 px-4 py-5">
        {/* Sidebar */}
        <aside role="complementary" className="w-64 flex-shrink-0 flex-.5 mr-4">
          <SideNav />
        </aside>

        {/* Content */}
        <section className="router-enter flex-1 flex-shrink-0 bg-white rounded-3xl shadow-md hover:shadow-2xl ease-in duration-200">
          {children}
        </section>
      </section>
    </main>
  );
};

export default PageContainer;

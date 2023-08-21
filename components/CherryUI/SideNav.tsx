"use client";

import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RoutePaths from "~base/NavPaths";
import OrderCreateButton from "~components/CherryUI/Buttons/orderCreateButton";

const SideNav = () => {
  const pathname = usePathname();
  return (
    <div className="w-full h-full">
      <div className="mx-auto w-full h-full max-w-md rounded-2xl bg-white py-2 shadow-md hover:shadow-2xl ease-in duration-200">
        <OrderCreateButton className="!justify-start ml-3" />
        {RoutePaths.map((r, key) => (
          <Disclosure key={key} as="div" className={`px-2`}>
            {({ open }) => (
              <>
                {r.children.length === 0 && !r.parent && (
                  <Disclosure defaultOpen as="div" className="px-2 pt-2">
                    <Disclosure.Panel
                      // `w-full px-4 pt-2 pb-2 rounded-md text-sm text-gray-500 ${
                      //   pathname.includes(r.path)
                      //     ? "bg-blue-700 text-white"
                      //     : ""
                      // } `

                      className={clsx({
                        "w-full px-4 pt-2 pb-2 rounded-md text-sm text-gray-500 cursor-pointer":
                          true,
                        "bg-blue-700 text-white": pathname.includes(r.path),
                      })}
                    >
                      <Link
                        href={r.path}
                        prefetch={false}
                        className={clsx({
                          "w-full inline-block": true,
                          "text-white": pathname.includes(r.path),
                        })}
                      >
                        {r.linkLabel}
                      </Link>
                    </Disclosure.Panel>
                  </Disclosure>
                )}
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default SideNav;

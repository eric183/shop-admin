import { Disclosure, Transition, Menu } from "@headlessui/react";
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { Link } from "@reach/router";
import RoutePaths from "../../base/NavPaths";
import usePathname from "../../hooks/usePathname";

const SideNav = () => {
  const pathname = usePathname();
  console.log(pathname, "...", RoutePaths);
  return (
    <div className="w-full h-full">
      <div className="mx-auto w-full h-full max-w-md rounded-2xl bg-white py-2">
        {RoutePaths.map((r, key) => (
          <Disclosure key={key} as="div" className={`px-2`}>
            {({ open }) => (
              <>
                {r.children.length === 0 && !r.parent && (
                  <Disclosure defaultOpen as="div" className="px-2 pt-2">
                    <Disclosure.Panel
                      className={`w-full px-4 pt-2 pb-2 rounded-md text-sm text-gray-500 ${
                        pathname.includes(r.path)
                          ? "bg-blue-700 text-white"
                          : ""
                      } `}
                    >
                      <Link to={r.path} className="w-full inline-block">
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

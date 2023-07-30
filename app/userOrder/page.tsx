import { sanityClient } from "~base/sanity/client";
import Root from "./root";
import orderQuery from "~app/api/groqs/order";
import { IOrder } from "~types/order";
import Link from "next/link";
import { YearPicker } from "./Picker";

const Order = async (props: {
  searchParams: { month: string; year: string };
}) => {
  const { month, year = new Date().getFullYear().toString() } =
    props.searchParams;

  return (
    <div className="w-full h-full px-3 pt-3">
      <Breadcrumb month={month} year={year} />
      <div className="actions mb-3 flex justify-end">
        <YearPicker year={year} month={month} className="-translate-x-3/4" />
      </div>
      {month ? (
        <Root year={year} month={month} />
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {new Array(12).fill(0).map((_, index) => (
            <Link
              href={`/userOrder?year=${year}&month=${index + 1}`}
              key={index}
            >
              <div className="h-48 rounded-md bg-sky-200 text-gray-600 font-extrabold text-4xl flex items-center justify-center">
                {index + 1} 月
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Breadcrumb = ({ month, year }: { month: string; year: string }) => {
  return (
    <nav className="flex mb-3" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-[.2rem] md:space-[.2rem]">
        <li className="inline-flex items-center">
          <Link
            href={`/userOrder?year=${year}`}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="w-2 h-2 mr-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            {year}年采购订单汇总
          </Link>
        </li>
        {month && (
          <>
            <li>
              <div className="flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="#"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {month} 月
                </a>
              </div>
            </li>
            {/* <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-2 h-2 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  Flowbite
                </span>
              </div>
            </li> */}
          </>
        )}
      </ol>
    </nav>
  );
};

export default Order;

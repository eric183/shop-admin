import Link from "next/link";
import React from "react";
import dayjs from "dayjs";

const Breadcrumb = ({
  month,
  year,
  brandId,
  brandInfo,
}: {
  month: string;
  year: string;
  brandId?: string;
  brandInfo?: {
    name: string;
    _createdAt: string;
    _updatedAt: string;
    _id: string;
  };
}) => {
  console.log(brandInfo, "brandInfo");
  return (
    <nav className="flex mb-3" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-[.2rem] md:space-[.2rem]">
        <li className="inline-flex items-center">
          <Link
            href={`/brandOrder?year=${year}`}
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
            {year}年用户订单汇总
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
                <Link
                  href={`/brandOrder?year=${year}&month=${month}`}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {month} 月
                </Link>
              </div>
            </li>
            {brandId && (
              <li aria-current="page">
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
                    {brandInfo?.name}
                  </span>
                </div>
              </li>
            )}
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

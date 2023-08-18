import Root from "./root";
import Link from "next/link";
import { YearPicker } from "./Picker";
import BrandRoot from "./brandRoot";
import { sanityClient } from "~base/sanity/client";
import { getProductName } from "~app/api/groqs/product";
import Breadcrumb from "./Bread";

const BrandOrder = async (props: {
  searchParams: {
    month: string;
    year: string;
    brandId: string;
    brandOrderId?: string;
  };
}) => {
  const {
    month,
    year = new Date().getFullYear().toString(),
    brandId,
    brandOrderId,
  } = props.searchParams;

  const brandInfo = await sanityClient.fetch(getProductName, {
    id: brandId ? brandId : "",
  });

  return (
    <div className="w-full h-full px-3 pt-3">
      <Breadcrumb
        month={month}
        year={year}
        brandId={brandId}
        brandInfo={brandInfo}
      />
      <div className="actions mb-3 flex justify-end">
        <YearPicker year={year} month={month} className="-translate-x-3/4" />
      </div>
      {month ? (
        brandId ? (
          <BrandRoot
            year={year}
            month={month}
            brandId={brandId}
            brandOrderId={brandOrderId}
          />
        ) : (
          <Root year={year} month={month} brandId={brandId} />
        )
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {new Array(12).fill(0).map((_, index) => (
            <Link
              key={index}
              href={`/brandOrder?year=${year}&month=${index + 1}`}
              prefetch={false}
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

export default BrandOrder;

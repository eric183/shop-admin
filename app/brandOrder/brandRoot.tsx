"use client";

import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import { IOrder } from "~types/order";
import OrderForm from "./form";
import { fetchGlobal } from "~app/api/sanityRest/global";
import OrderProductionDrawer from "./drawer";
import { brandOrderQuery } from "~app/api/groqs/order";
import { sanityClient } from "~base/sanity/client";
import CherryVisionModal from "~components/CherryUI/Modal";
import CherryTable from "~components/CherryUI/Table";
import useBrandColumns from "./brandColumn";
import { IBrandOrder } from "~types/brandOrder";
import { omit } from "lodash";
import { Select } from "antd";
import { useState } from "react";

const BrandRoot = ({
  year,
  month,
  brandId,
  brandOrderId,
}: {
  year: string;
  month: string;
  brandId?: string;
  brandOrderId?: string;
}) => {
  const [filterValue, setFilterValue] = useState("account");
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const { data, status } = useQuery({
    queryKey: ["brandOrder"],
    queryFn: async () =>
      await sanityClient.fetch<any>(brandOrderQuery, {
        dateRange: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(`${year}-${Number(month) + 1}-01`),
        },
        // brandId,
        // date: `${year}-${month}`,
        // year: year,
        // month: month,
        start: 0,
        limit: 5,
        // start: 0,
      }),
  });

  const [column] = useBrandColumns(
    reponseGlobal.refetch,
    brandOrderId as string,
    data?.find((b: any) => b?._id === brandId)
  );

  if (status !== "success" || reponseGlobal.status !== "success") return null;

  const brandOrderInfo = data.find((b: any) => b?._id === brandId);

  const brandOrders = brandOrderInfo.brandOrders.map((b) => ({
    ...b,
    name: brandOrderInfo.name,
    _id: b._id,
  }));

  const datasource = brandOrderId
    ? brandOrders.find((x) => x._id === brandOrderId).userOrders
    : brandOrders;

  return (
    <>
      {/* <MonthPicker month={month} /> */}
      {/* <CreateButton datasource={data} /> */}
      {/* <div className="w-full flex mb-5 justify-end"></div> */}
      {brandId && (
        <>
          {/* <CherryVisionModal>
            <OrderForm datasource={data} />
          </CherryVisionModal> */}
          {/* <OrderProductionDrawer /> */}

          <section>
            <CherryTable<IBrandOrder & IBrandOrder["userOrders"][0]>
              datasource={datasource}
              columns={column}
              keyIndex={"_id"}
              status={status}
            ></CherryTable>
          </section>
        </>
      )}
    </>
  );
};

export default BrandRoot;

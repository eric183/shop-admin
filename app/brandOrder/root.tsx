"use client";

import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import { IOrder, IOrderCreateSource } from "~types/order";
import OrderForm from "./form";
import { fetchGlobal } from "~app/api/sanityRest/global";
import OrderProductionDrawer from "./drawer";
import { brandOrderQuery } from "~app/api/groqs/order";
import { sanityClient } from "~base/sanity/client";
import CherryVisionModal from "~components/CherryUI/Modal";
import CherryTable from "~components/CherryUI/Table";
import { IBrandOrder } from "~types/brandOrder";

const Root = ({
  year,
  month,
  brandId,
  userOrderId,
}: {
  year: string;
  month: string;
  brandId?: string;
  userOrderId?: string;
}) => {
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const { data, status } = useQuery({
    queryKey: ["brandOrder"],
    queryFn: async () =>
      await sanityClient.fetch<IBrandOrder[]>(brandOrderQuery, {
        dateRange: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(`${year}-${Number(month) + 1}-01`),
        },

        // date: `${year}-${month}`,
        // year: year,
        // month: month,
        start: 0,
        limit: 5,
        // start: 0,
      }),
  });
  console.log(status, "status.....");
  const [column] = useColumns(reponseGlobal.refetch);
  if (status !== "success" || reponseGlobal.status !== "success") return null;

  return (
    <>
      {/* <MonthPicker month={month} /> */}
      {/* <CreateButton datasource={data} /> */}
      {!brandId && (
        <>
          <CherryVisionModal>
            <OrderForm
              datasource={data}
              // createSource={
              //   {
              //     accounts: reponseGlobal.data.accounts,
              //     skus: reponseGlobal.data.skus,
              //     brands: reponseGlobal.data.brands,
              //   } as const as IOrderCreateSource
              // }
            />
          </CherryVisionModal>

          <OrderProductionDrawer />
          <section>
            <CherryTable<IBrandOrder>
              datasource={data}
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

export default Root;

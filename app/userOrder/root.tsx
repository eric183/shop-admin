"use client";

import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import CreateButton from "./createButton";
import { IOrder, IOrderCreateSource } from "~types/order";
import OrderForm from "./form";
import { fetchGlobal } from "~app/api/sanityRest/global";
import OrderProductionDrawer from "./drawer";
import { userOrderQuery } from "~app/api/groqs/order";
import { sanityClient } from "~base/sanity/client";
import CherryTable from "~components/CherryUI/Table";
import CherryVisionModal from "~components/CherryUI/Modal";

const Root = ({ year, month }: { year: string; month: string }) => {
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const { data, status } = useQuery({
    queryKey: ["userOrder"],
    queryFn: async () =>
      await sanityClient.fetch<IOrder[]>(userOrderQuery, {
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

  const [column] = useColumns(reponseGlobal.refetch);
  if (status !== "success" || reponseGlobal.status !== "success") return null;

  console.log(reponseGlobal.data, "....");
  console.log(data);
  return (
    <>
      {/* <MonthPicker month={month} /> */}
      <CreateButton datasource={data} />

      <CherryVisionModal>
        <OrderForm
          datasource={data}
          createSource={
            {
              accounts: reponseGlobal.data.accounts,
              skus: reponseGlobal.data.skus,
              brands: reponseGlobal.data.brands,
            } as const as IOrderCreateSource
          }
        />
      </CherryVisionModal>

      <OrderProductionDrawer />
      <section>
        <CherryTable<IOrder>
          datasource={data}
          columns={column}
          keyIndex={"_id"}
          status={status}
        ></CherryTable>
      </section>
    </>
  );
};

export default Root;

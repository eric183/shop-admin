import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toYMD, toYMD_Short } from "../../base/Timeformat";
import { useQuery } from "@tanstack/react-query";
import sanityClient from "~base/sanity/client";
import CherryTable from "~components/CherryViews/Table";
import orderQuery from "~app/api/groqs/order";
import { IOrder } from "~types/cherryVision";
import orderColumns from "./columns";

const Order = async () => {
  const response = await sanityClient.fetch(orderQuery);

  console.log(JSON.stringify(response));
  const datasource = response as IOrder[];
  return (
    <>
      <CherryTable<IOrder>
        datasource={datasource}
        columns={orderColumns}
      ></CherryTable>
    </>
  );
};

export default Order;

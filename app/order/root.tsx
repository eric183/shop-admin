"use client";

import { useState } from "react";
import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import ProductModal from "../../components/Layout/Modal";
import CreateButton from "./createButton";
import { IOrder } from "~types/order";
import OrderForm from "./form";
import CherryTable from "~components/CherryViews/Table";

const Root: React.FC<{
  response: IOrder[];
}> = ({ response }) => {
  const [teststate, setTeststate] = useState("test");
  const { data, status } = useQuery({
    queryKey: ["order"],
    queryFn: () => response,
  });
  const [column] = useColumns();
  if (status !== "success") return null;

  console.log(data);
  return (
    <>
      <CreateButton datasource={data} />

      <ProductModal>
        <OrderForm datasource={data} />
      </ProductModal>
      <section>
        <CherryTable<IOrder> datasource={data} columns={column}></CherryTable>
      </section>
    </>
  );
};

export default Root;

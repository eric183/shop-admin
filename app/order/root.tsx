"use client";

import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import CherryTable from "~components/CherryViews/Table";
import { IProduct } from "~types/product";
import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import ProductModal, { modalStore } from "../../components/Layout/Modal";
import CreateButton from "./createButton";
import GoogleUploader from "~components/Layout/GoogleUploader";
import { Select } from "antd";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import ProductForm from "./form";
import { IOrder } from "~types/order";
import OrderForm from "./form";

const Root: React.FC<{
  response: Promise<IOrder>;
}> = ({ response }) => {
  const [teststate, setTeststate] = useState("test");
  const { data, status } = useQuery({
    queryKey: ["product"],
    queryFn: () => response,
  });
  const [column] = useColumns();
  if (status !== "success") return null;
  return (
    <>
      <CreateButton<IOrder> datasource={data} />

      <ProductModal>
        <OrderForm<IOrder> datasource={data} />
      </ProductModal>
      <section>
        {/* <CherryTable<IOrder>
          datasource={data}
          columns={column as ColumnsType<IOrder>}
        ></CherryTable> */}
      </section>
    </>
  );
};

export default Root;

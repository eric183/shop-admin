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

const Root: React.FC<{
  response: IProduct[];
}> = ({ response }) => {
  const [teststate, setTeststate] = useState("test");
  const { data, status } = useQuery({
    queryKey: ["product"],
    queryFn: () => response,
  });
  const [column] = useColumns();
  if (status !== "success") return null;

  console.log(data, "product");
  return (
    <>
      <CreateButton datasource={data} />

      <ProductModal>
        <ProductForm datasource={data} />
      </ProductModal>
      <section>
        <CherryTable<IProduct>
          datasource={data}
          columns={column as ColumnsType<IProduct>}
          keyIndex={"_id"}
        ></CherryTable>
      </section>
    </>
  );
};

export default Root;

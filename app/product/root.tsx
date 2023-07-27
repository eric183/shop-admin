"use client";

import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import CherryTable from "~components/CherryUI/Table";
import { IProduct } from "~types/product";
import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import CreateButton from "./createButton";
import ProductForm from "./form";
import productQuery from "~app/api/groqs/product";
import { sanityClient } from "~base/sanity/client";
import CherryVisionModal from "~components/CherryUI/Modal";

const Root = () => {
  const { data, status, refetch } = useQuery({
    queryKey: ["product"],
    queryFn: async () =>
      await sanityClient.fetch<IProduct[]>(productQuery, {
        start: 0,
        limit: 50,
        // start: 0,
      }),
  });
  const [column] = useColumns();

  return (
    <>
      <CreateButton datasource={data ? data : []} />

      <CherryVisionModal>
        <ProductForm datasource={data ? data : []} refetch={refetch} />
      </CherryVisionModal>
      <section>
        <CherryTable<IProduct>
          datasource={data ? data : []}
          columns={column as ColumnsType<IProduct>}
          keyIndex={"_id"}
          status={status}
        ></CherryTable>
      </section>
    </>
  );
};

export default Root;

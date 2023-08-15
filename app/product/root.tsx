"use client";

import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import CherryTable from "~components/CherryUI/Table";
import { IProduct } from "~types/product";
import useColumns from "./columns";
import { useQuery } from "@tanstack/react-query";
import CreateButton from "./createButton";
import ProductForm from "./form";
import productQuery, { productRootQuery } from "~app/api/groqs/product";
import { sanityClient } from "~base/sanity/client";
import CherryVisionModal from "~components/CherryUI/Modal";
import { fetchGlobal } from "~app/api/sanityRest/global";
import { IOrderCreateSource } from "~types/order";

const Root = () => {
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const { data, status, refetch } = useQuery({
    queryKey: ["product"],
    queryFn: async () =>
      await sanityClient.fetch<IProduct[]>(productQuery, {
        start: 0,
        limit: 50,
        // start: 0,
      }),
  });
  const [column] = useColumns(refetch);
  if (status !== "success" || reponseGlobal.status !== "success") return null;

  return (
    <>
      <CreateButton datasource={data ? data : []} />

      <CherryVisionModal>
        <ProductForm
          datasource={data ? data : []}
          refetch={refetch}
          createSource={
            {
              accounts: reponseGlobal.data.accounts,
              globalSkus: reponseGlobal.data.skus,
              brands: reponseGlobal.data.brands,
              inventories: reponseGlobal.data.inventories,
            } as const as IOrderCreateSource
          }
        />
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

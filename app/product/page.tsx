import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toYMD, toYMD_Short } from "../../base/Timeformat";
import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "~base/sanity/client";
import CherryTable from "~components/CherryViews/Table";
import orderQuery from "~app/api/groqs/order";
import productQuery from "~app/api/groqs/product";
import productColumns from "./columns";
import { IProduct } from "~types/product";
import CreateButton from "./createButton";
import { useState } from "react";

const Product = async () => {
  const products = await sanityClient.fetch(productQuery);

  const datasource = products as IProduct[];

  return (
    <div className="w-full h-full px-3">
      <CreateButton datasource={datasource} />

      <section>
        <CherryTable<IProduct>
          datasource={datasource}
          columns={productColumns}
        ></CherryTable>
      </section>
    </div>
  );
};

export default Product;

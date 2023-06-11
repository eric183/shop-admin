import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toYMD, toYMD_Short } from "../../base/Timeformat";
import { useQuery } from "@tanstack/react-query";
import sanityClient from "~base/sanity/client";
import CherryTable from "~components/CherryViews/Table";
import orderQuery from "~app/api/groqs/order";
import productQuery from "~app/api/groqs/product";
import productColumns from "./columns";
import { IProduct } from "~types/product";

const Product = async () => {
  const response = await sanityClient.fetch(productQuery);

  const datasource = response as IProduct[];
  return (
    <>
      <CherryTable<IProduct>
        datasource={datasource}
        columns={productColumns}
      ></CherryTable>
    </>
  );
};

export default Product;

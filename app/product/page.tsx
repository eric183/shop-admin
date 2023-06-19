import { sanityClient } from "~base/sanity/client";
import productQuery from "~app/api/groqs/product";
import Root from "./root";
import { IProduct } from "~types/product";

const Product = async () => {
  const response = await sanityClient.fetch<IProduct[]>(productQuery, {
    start: 0,
    limit: 5,
    // start: 0,
  });
  console.log(response);
  return (
    <div className="w-full h-full px-3">
      <Root response={response} />
      {/* <CreateButton datasource={data} /> */}
    </div>
  );
};

export default Product;

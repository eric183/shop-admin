import { sanityClient } from "~base/sanity/client";
import productQuery from "~app/api/groqs/product";
import Root from "./root";

const Product = async () => {
  const response = sanityClient.fetch(productQuery, {
    start: 0,
    limit: 5,
    // start: 0,
  });
  return (
    <div className="w-full h-full px-3">
      <Root response={response} />
      {/* <CreateButton datasource={data} /> */}
    </div>
  );
};

export default Product;

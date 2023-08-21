import { sanityClient } from "~base/sanity/client";
import productQuery from "~app/api/groqs/product";
import Root from "./root";
import { IProduct } from "~types/product";

const Product = async () => {
  return (
    <div className="w-full h-full px-3">
      <Root />
    </div>
  );
};

export default Product;

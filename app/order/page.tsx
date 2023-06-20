import { sanityClient } from "~base/sanity/client";
import Root from "./root";
import orderQuery from "~app/api/groqs/order";
import { IOrder } from "~types/order";

const Order = async () => {
  return (
    <div className="w-full h-full px-3">
      <Root />
      {/* <CreateButton datasource={data} /> */}
    </div>
  );
};

export default Order;

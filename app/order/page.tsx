import { sanityClient } from "~base/sanity/client";
import Root from "./root";
import orderQuery from "~app/api/groqs/order";
import { IOrder } from "~types/order";

const Order = async () => {
  const response = await sanityClient.fetch<IOrder[]>(orderQuery, {
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

export default Order;

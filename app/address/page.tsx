import React from "react";
import Root from "./root";
import { sanityClient } from "~base/sanity/client";
import { addressListQuery } from "~app/api/groqs/address";

const page = async () => {
  const addressList = await sanityClient.fetch(addressListQuery);
  return (
    <div className="w-full h-full px-3">
      <Root addressList={addressList} />
    </div>
  );
};

export default page;

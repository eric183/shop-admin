import { sanityClient, sanityMutationClient } from "~base/sanity/client";
import { getInventoryItem } from "../groqs/inventory";

export interface InventoryMutation {
  skuDetail: {
    _id: string;
  };
  preQuantity: number;
  actualQuantity: number;
}

const getInventory = async (skuId) => {
  const response = await sanityClient.fetch(getInventoryItem, {
    skuId,
  });

  return response;
};

export const createOrUpdateInventory = async (inventory: InventoryMutation) => {
  const { skuDetail, preQuantity, actualQuantity } = inventory;
  const { _id } = skuDetail;

  // const res = await getInventory(_id);

  debugger;
  return;
  const response = await sanityMutationClient({
    mutations: [
      {
        createOrReplace: {
          id: _id,
          _type: "inventory",
          skuDetail: {
            _type: "reference",
            _ref: _id,
          },
          // 预购（计划）库存
          preQuantity,
          // 实际入库库存 = 有效订单 sku  + 剩余库存
          // actualQuantity,
          // 剩余库存
          // remainQuantity,
        },
      },
    ],
  });

  return response;
};

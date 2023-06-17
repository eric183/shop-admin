import { IOrderFormDto } from "~app/order/form";
import { sanityMutationClient } from "~base/sanity/client";
import { IOrderCreateSource } from "~types/order";
import { v4 as uuidv4 } from "uuid";

export const createOrderItem = async (order: IOrderFormDto) => {
  return await sanityMutationClient({
    mutations: order.orderItems.map((orderItem) => ({
      create: {
        _type: "orderItem",
        _id: uuidv4(),
        sku: {
          _type: "reference",
          _ref: orderItem.sku,
          // weak: true,
        },
        preOrderPrice: orderItem.preOrderPrice,
        quantity: orderItem.quantity,
        isProductionPurchased: orderItem.isProductionPurchased,
      },
    })),
  });
};

export const createOrder = async (order: IOrderFormDto, orderItems: any[]) => {
  const { account, deposit, discount, finalPayment, orderStatus, sortNumber } =
    order;

  return await sanityMutationClient({
    mutations: [
      {
        create: {
          _type: "order",
          _id: uuidv4(),
          account: {
            _type: "reference",
            _ref: account,
            // weak: true,
          },
          deposit,
          discount,
          finalPayment,
          orderItems: orderItems.map((orderItem) => ({
            _type: "reference",
            _ref: orderItem._id,
            _key: uuidv4(),
            // weak: true,
          })),

          orderStatus,
          sortNumber,
          // orderItems: order.skus.map((sku) => ({
          //   _type: "reference",
          //   _ref: sku._id,
          // })),
          // deposit: order.deposit,
          // sortNumber: order.sortNumber,
          // discount: order.discount,
        },
      },
    ],
  });
};

export const deleteOrder = async (orderId: string) => {
  return await sanityMutationClient({
    mutations: [
      {
        delete: {
          id: orderId,
        },
      },
    ],
  });
};

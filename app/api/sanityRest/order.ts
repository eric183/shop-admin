import { IOrderFormDto } from "~app/order/form";
import { sanityMutationClient } from "~base/sanity/client";
import { IOrder, IOrderCreateSource } from "~types/order";
import { v4 as uuidv4 } from "uuid";

export const createOrderItem = async (order: IOrderFormDto) => {
  return await sanityMutationClient({
    mutations: order.orderItems.map((orderItem) => ({
      create: {
        _type: "orderItem",
        _id: uuidv4(),
        sku: {
          _type: "reference",
          _ref: orderItem.sku._id,
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
            _ref: account._id,
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
        },
      },
    ],
  });
};

export const updateOrderItem = async (
  orderForm: IOrderFormDto,
  record: IOrder
) => {
  record.orderItems = record.orderItems ? record.orderItems : [];
  let response;

  if (orderForm.orderItems.length < record.orderItems.length) {
    const newOrderItems = record.orderItems.filter(
      (c) => !orderForm.orderItems.map((x) => x._id).includes(c._id)
    );

    const response = await sanityMutationClient({
      mutations: {
        patch: {
          id: record._id,
          unset: {
            orderItems: orderForm.orderItems.map((orderItem) => ({
              _type: "reference",
              _ref: orderItem._id,
            })),
          },
        },
      },
      // newOrderItems.map((orderItem) => ({
      //   delete: {
      //     // _type: "orderItem",
      //     id: orderItem._id,
      //     // sku: {
      //     //   _type: "reference",
      //     //   _ref: orderItem.sku,
      //     //   // weak: true,
      //     // },
      //     // preOrderPrice: orderItem.preOrderPrice,
      //     // quantity: orderItem.quantity,
      //     // isProductionPurchased: orderItem.isProductionPurchased,
      //   },
      // })),
    });
  }

  if (orderForm.orderItems.length >= record.orderItems.length) {
    response = await sanityMutationClient({
      mutations: orderForm.orderItems.map(
        (orderItem) =>
          orderItem._id
            ? {
                ...{
                  // replace: {
                  //   _type: "orderItem",
                  //   _id: uuidv4(),
                  //   sku: {
                  //     _type: "reference",
                  //     _ref: orderItem.sku,
                  //     weak: true,
                  //   },
                  //   preOrderPrice: orderItem.preOrderPrice,
                  //   quantity: orderItem.quantity,
                  //   isProductionPurchased: orderItem.isProductionPurchased,
                  // },
                  patch: {
                    id: orderItem._id,
                    // id: ._id,
                    set: {
                      preOrderPrice: orderItem.preOrderPrice,
                      quantity: orderItem.quantity,
                      isProductionPurchased: orderItem.isProductionPurchased,
                      orderItems: {
                        _type: "reference",
                        _ref: orderItem.sku._id,
                      },
                    },
                  },
                },
              }
            : {
                create: {
                  _type: "orderItem",
                  _id: uuidv4(),
                  sku: {
                    _type: "reference",
                    _ref: orderItem.sku._id,
                  },
                  preOrderPrice: orderItem.preOrderPrice,
                  quantity: orderItem.quantity,
                  isProductionPurchased: orderItem.isProductionPurchased,
                },
              }

        // {
        //   patch: orderItem._id
        //     ? {
        //         id: orderItem._id,
        //         set: {
        //           orderItems: {
        //             _type: "reference",
        //             _ref: orderItem.sku._id,
        //           },
        //           quantity: orderItem.quantity,
        //           isProductionPurchased: orderItem.isProductionPurchased,
        //         },
        //       }
        //     : {},
        // }
      ),
    });
  }

  await updateOrder(orderForm, response);

  return response;
};

export const updateOrder = async (
  order: IOrderFormDto,
  response: {
    results: {
      document: IOrder["orderItems"];
    }[];
  }
) => {
  const { account, deposit, discount, finalPayment, orderStatus, sortNumber } =
    order;

  const orderItems = response.results.map(
    (x) => x.document
  ) as unknown as IOrder["orderItems"];

  return await sanityMutationClient({
    mutations: [
      {
        patch: {
          id: order._id,
          set: {
            account: {
              _type: "reference",
              _ref: account._id,
              // weak: true,
            },
            orderItems: orderItems.map((orderItem) => ({
              _type: "reference",
              _ref: orderItem._id,
              _key: uuidv4(),
              // weak: true,
            })),
            deposit,
            discount,
            finalPayment,
            orderStatus,
            sortNumber,
          },
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

import { sanityMutationClient } from "~base/sanity/client";
import { IOrder, IOrderCreateSource } from "~types/order";
import { v4 as uuidv4 } from "uuid";
import { IOrderFormDto } from "~app/brandOrder/form";

export const createOrderSampler = async (order: any) => {
  const { account, deposit, finalPayment, orderStatus, sortNumber } = order;
  const orderItems = order.orderItems.map((orderItem: any) => ({
    ...orderItem,
    _id: uuidv4(),
  }));

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
          finalPayment,
          orderItems: orderItems.map((orderItem: { _id: any }) => ({
            _type: "reference",
            _ref: orderItem._id,
            _key: uuidv4(),
            // weak: true,
          })),
          orderStatus,
          sortNumber,
        },
      },
      ...orderItems.map(
        (orderItem: {
          _id: any;
          sku: { _id: any };
          preOrderPrice: any;
          quantity: any;
          isProductionPurchased: any;
          discount: any;
        }) => ({
          create: {
            _type: "orderItem",
            _id: orderItem._id,
            sku: {
              _type: "reference",
              _ref: orderItem.sku._id,
              // weak: true,
            },
            preOrderPrice: orderItem.preOrderPrice,
            quantity: orderItem.quantity,
            isProductionPurchased: orderItem.isProductionPurchased,
            discount: orderItem.discount,
          },
        })
      ),
    ],
  });
};

export const createOrderItem = async (brandOrders: IOrderFormDto[]) => {
  const userOrders: any = [];

  const accountArray: any = [];
  brandOrders.map(() => ({
    create: {},
  }));
  brandOrders.forEach((order) => {
    order.orderItems.forEach((orderItem) => {
      orderItem._id = uuidv4();
      order.account._key = uuidv4();
      userOrders.push({
        create: {
          _type: "orderItem",
          _id: orderItem._id,
          sku: {
            _type: "reference",
            _ref: orderItem.sku._id,
          },
          // account: {
          //   _type: "reference",
          //   _ref: order.account._id,
          // },
          preOrderPrice: orderItem.preOrderPrice,
          quantity: orderItem.quantity,
          isProductionPurchased: orderItem.isProductionPurchased,
        },
      });
    });

    userOrders.push({
      create: {
        _type: "userOrder",
        _id: uuidv4(),
        account: {
          _type: "reference",
          _ref: order.account._id,
          _key: uuidv4(),
        },
        discount: order.discount,
        finalPayment: order.finalPayment,
        deposit: order.deposit,
        // {
        //   type: "number",
        //   name: "discount",
        //   title: "Discount",
        //   initialValue: 0,
        //   description: "折扣",
        // },

        // {
        //   type: "number",
        //   name: "finalPayment",
        //   title: "Final Payment",
        //   initialValue: 0,
        //   description: "尾款",
        // },

        // {
        //   type: "number",
        //   name: "deposit",
        //   title: "Deposit",
        //   description: "定金",
        // },
        orderItems: order.orderItems.map((orderItem) => {
          return {
            _type: "reference",
            _ref: orderItem._id,
            _key: uuidv4(),
          };
        }),
      },
    });
  });

  return await sanityMutationClient({
    mutations: userOrders,
  });

  // mutations: order.orderItems.map((orderItem) => ({
  //   create: {
  //     _type: "orderItem",
  //     _id: uuidv4(),
  //     account: {
  //       _type: "reference",
  //       _ref: account._id,
  //     },
  //     sku: {
  //       _type: "reference",
  //       _ref: orderItem.sku._id,
  //       // weak: true,
  //     },
  //     preOrderPrice: orderItem.preOrderPrice,
  //     quantity: orderItem.quantity,
  //     isProductionPurchased: orderItem.isProductionPurchased,
  //     discount: orderItem.discount,
  //   },
  // })),
};

export const createOrder = async (
  brand: Partial<IOrderCreateSource["brands"][0]>,
  userOrders: IOrderFormDto["orderItems"]
) => {
  const formatOrder: any = [];

  formatOrder.push({
    create: {
      _type: "brandOrder",
      _id: uuidv4(),
      brand: {
        _type: "reference",
        _ref: brand._id,
      },
      userOrders: userOrders.map((userOrder) => ({
        _type: "reference",
        _ref: userOrder._id,
        _key: uuidv4(),
      })),
    },
  });

  debugger;
  return await sanityMutationClient({
    mutations: formatOrder,
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
                      discount: orderItem.discount,

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
                  discount: orderItem.discount,
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
  const { account, finalPayment, orderStatus, sortNumber } = order;

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
            // deposit,
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

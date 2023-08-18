import { sanityMutationClient } from "~base/sanity/client";
import { IOrder } from "~types/order";
import { v4 as uuidv4 } from "uuid";
import { IBrandOrder } from "~types/brandOrder";

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
          },
          deposit,
          finalPayment,
          orderItems: orderItems.map((orderItem: { _id: any }) => ({
            _type: "reference",
            _ref: orderItem._id,
            _key: uuidv4(),
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

export const createOrder = async (
  brandOrder: IBrandOrder,
  originOrderItems?: IBrandOrder["userOrders"][0]["orderItems"]
) => {
  const formatOrder: any = [];
  const brandOrderId = brandOrder._id ? brandOrder._id : uuidv4();

  formatOrder.push({
    createOrReplace: {
      _type: "brandOrder",
      _id: brandOrderId,
      brand: {
        _type: "reference",
        _ref: brandOrder.brand._id,
      },
    },
  });

  brandOrder.userOrders.forEach((userOrder) => {
    const userOrderId = userOrder._id ? userOrder._id : uuidv4();

    userOrder.orderItems.forEach((orderItem) => {
      const orderItemId = orderItem._id ? orderItem._id : uuidv4();
      userOrder.account._key = uuidv4();
      formatOrder.push({
        createOrReplace: {
          _type: "orderItem",
          _id: orderItemId,
          sku: {
            _type: "reference",
            _ref: orderItem.sku._id,
          },
          userOrder: {
            _type: "reference",
            _ref: userOrderId,
          },
          preOrderPrice: orderItem.preOrderPrice,
          quantity: orderItem.quantity,
          isProductionPurchased: orderItem.isProductionPurchased,
        },
      });
    });

    if (
      originOrderItems &&
      userOrder.orderItems.length < originOrderItems.length
    ) {
      const deleteItems = originOrderItems.filter((x) =>
        userOrder.orderItems.every((f) => x !== f)
      );

      deleteItems.forEach((originOrderItem) => {
        formatOrder.push({
          delete: {
            id: originOrderItem._id,
          },
        });
      });
    }

    formatOrder.push({
      createOrReplace: {
        _type: "userOrder",
        _id: userOrderId,
        account: {
          _type: "reference",
          _ref: userOrder.account._id,
        },
        brandOrder: {
          _type: "reference",
          _ref: brandOrderId,
        },
        discount: userOrder.discount,
        finalPayment: userOrder.finalPayment,
        deposit: userOrder.deposit,
        orderStatus: userOrder.orderStatus,
      },
    });
  });

  return await sanityMutationClient({
    mutations: formatOrder,
  });
};

export const updateOrderItem = async (
  orderForm: IBrandOrder,
  record: IBrandOrder
) => {
  let response;
  if (
    orderForm.userOrders[0].orderItems.length <
    record.userOrders[0].orderItems.length
  ) {
    await sanityMutationClient({
      mutations: {
        patch: {
          id: record._id,
          unset: {
            orderItems: orderForm.userOrders[0].orderItems.map((orderItem) => ({
              _type: "reference",
              _ref: orderItem._id,
            })),
          },
        },
      },
    });
  }

  if (
    orderForm.userOrders[0].orderItems.length >=
    record.userOrders[0].orderItems.length
  ) {
    response = await sanityMutationClient({
      mutations: orderForm.userOrders[0].orderItems.map((orderItem) =>
        orderItem._id
          ? {
              ...{
                patch: {
                  id: orderItem._id,
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
      ),
    });
  }

  await updateOrder(orderForm, response);

  return response;
};

export const updateOrder = async (
  order: IBrandOrder,
  response: {
    results: {
      document: IOrder["orderItems"];
    }[];
  }
) => {
  const { account, finalPayment, orderStatus, deposit, discount } =
    order.userOrders[0];
  const orderItems = response.results.map(
    (x) => x.document
  ) as unknown as IOrder["orderItems"];
  return await sanityMutationClient({
    mutations: [
      {
        patch: {
          id: order.userOrders[0]._id,
          set: {
            account: {
              _type: "reference",
              _ref: account._id,
            },
            orderItems: orderItems.map((orderItem) => ({
              _type: "reference",
              _ref: orderItem._id,
              _key: uuidv4(),
            })),
            deposit,
            finalPayment,
            orderStatus,
            discount,
          },
        },
      },
    ],
  });
};

export const deleteOrder = async (record: IBrandOrder["userOrders"][0]) => {
  const mutations = record.orderItems.map((orderItem) => ({
    delete: {
      id: orderItem._id,
    },
  }));

  return await sanityMutationClient({
    mutations: [
      ...mutations,
      {
        delete: {
          id: record._id,
        },
      },
    ],
  });
};

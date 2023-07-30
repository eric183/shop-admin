import {
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import { Pagination, Select, Switch } from "antd";
import clsx from "clsx";

import React, { useState, useRef, useEffect, ElementRef } from "react";
import { IProduct, Sku } from "~types/product";
import { IOrder, IOrderCreateSource, OrderStatus } from "~types/order";
import {
  createOrder,
  createOrderItem,
  updateOrderItem,
} from "~app/api/sanityRest/order";
import { createAccount } from "~app/api/sanityRest/account";
import { useUploadingStore } from "~components/CherryUI/GoogleUploader";
import { modalStore } from "~components/CherryUI/Modal";
import { motion } from "framer-motion";
import { Tube } from "@react-three/drei";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";

interface Props {
  datasource: IOrder[];
  createSource: IOrderCreateSource;
}

export interface IOrderFormDto {
  _id?: string;
  account: any;
  sortNumber: number;
  orderItems: {
    _id?: string;
    sku: Partial<Sku>;
    quantity: number;
    preOrderPrice: number;
    isProductionPurchased: boolean;
    discount: number;
  }[];
  shipments: any[];
  deposit: number;
  discount: number;
  finalPayment: number;
  orderStatus: OrderStatus;
}

const BrandOrderForm: React.FC<Props> = ({ datasource, createSource }) => {
  const defaultOrder = {
    account: {},
    discount: 0,
    finalPayment: 0,
    orderStatus: "UNPAID",
    deposit: 0,
    shipments: [],
    sortNumber: 0,
    orderItems: [
      {
        sku: {},
        quantity: 0,
        preOrderPrice: 0,
        isProductionPurchased: false,
        discount: 0,
      },
    ],
  } as IOrderFormDto;

  const selectRef = useRef<any>();
  const paginationRef = useRef<any>(null!);
  const { setModalType, modalType } = modalStore();
  const [matchSPU, setMatchSPU] = useState<IProduct>(null!);
  const [selectBrand, setSelectBrand] = useState<{
    name: string;
    _id: string;
    logo?: string;
  }>({
    name: "",
    _id: "",
  });
  const { clearImageUrls, imageUrls, setImageUrls } = useUploadingStore();

  // const [order, setOrder] = useState<IOrderFormDto>(defaultOrder);

  const [brandOrders, setBrandOrders] = useState<IOrderFormDto[]>([
    defaultOrder,
  ]);

  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [domReady, setDomReady] = React.useState(false);

  const {
    open,
    setConfirmLoading,
    confirmLoading,
    setOpen,
    record,
    setRecord,
  } = modalStore();

  // const spu = datasource;

  const createAccountHandler = ({ username, isNew }: any) => {
    createAccount({ username });
  };

  const formSubitHandler = async (evt: any) => {
    evt.preventDefault();
    setConfirmLoading(true);

    if (confirmLoading) return;

    if (!order.account) {
      window.alert("请输入客户名");
      return;
    }

    if (!order.orderItems) {
      window.alert("请输入订单内容");
      return;
    }

    // if (!order.shipments) {
    //   window.alert("请输入发货信息");
    //   return;
    // }

    order.account = order.account.isNew
      ? (await createAccount(order.account))[0].document
      : order.account;

    if (modalType === "create") {
      const orderItemsRs = await createOrderItem(order);
      const orderRs = await createOrder(
        order,
        orderItemsRs.results.map((result: any) => result.document)
      );
    }

    if (modalType === "update") {
      // debugger
      const recordOrderIds = order.orderItems.map((item) => item._id);

      const currentOrders = order.orderItems.filter(
        (item) => !recordOrderIds.includes(item._id)
      );

      const orderItemsRs = await updateOrderItem(order, record);

      // const orderRs = await updateOrder(
      //   order,
      //   orderItemsRs.results.map((result: any) => result.document)
      // );
    }

    setConfirmLoading(false);
    setOpen(false);
    clearForm();
    // await formPost(skuCreations, spuCreations, imagesCreations);

    // here go set a fetch request to sanity.io
  };

  const clearForm = async () => {
    setOrder({
      account: {},
      discount: 0,
      finalPayment: 0,
      orderStatus: "UNPAID",
      deposit: 0,
      shipments: [],
      sortNumber: 0,
      orderItems: [
        {
          sku: {},
          quantity: 0,
          preOrderPrice: 0,
          isProductionPurchased: false,
          discount: 0,
        },
      ],
    });
  };

  useEffect(() => {
    if (!open) return;
    if (modalType === "update") {
      // setOrder(record);
    }
  }, [open, record]);

  useEffect(() => {
    setDomReady(true);
  }, []);

  const { accounts, skus, brands } = createSource;
  console.log(brands, "brands");
  // console.log(orderIndex, brandOrders, "brandOrders...");

  return (
    <article className="flex flex-row">
      <ArrowLeftCircleIcon
        className={clsx({
          "w-8 fill-gray-400 cursor-pointer hover:fill-blue-500 transition-colors":
            true,
          "fill-blue-400": orderIndex > 0,
        })}
        onClick={() => {
          if (orderIndex > 0) {
            setOrderIndex(orderIndex - 1);
          }
        }}
      />
      {domReady &&
        ReactDOM.createPortal(
          <div className="relative z-0 w-60 group group-one">
            {/* <label
                    htmlFor="name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    品牌
                  </label> */}
            <Select
              mode="tags"
              size="small"
              maxTagCount={1}
              placeholder="请选择品牌"
              onChange={(detail, de) => {
                const foundAccount = accounts.find(
                  (item) => item._id === detail[0]
                );

                // setOrder({
                //   ...order,
                //   account: foundAccount
                //     ? foundAccount
                //     : {
                //         username: detail[0],
                //         isNew: true,
                //       },
                // });

                // selectRef.current.blur();
              }}
              className="w-full mt-2"
              choiceTransitionName="name"
              ref={selectRef}
              // value={order.account?._id as any}
              value={}
            >
              {brands.map((item, index: number) => (
                <Select.Option key={index} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>,
          document.querySelector(".ant-modal-header")!
        )}

      <motion.form
        className="flex flex-row mx-2 w-full overflow-hidden pb-10"
        onSubmit={formSubitHandler}
        initial={"hidden"}
        animate={"visible"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {/* {orders.map((order, index) => {
            return (
        
            );
          })} */}

        {brandOrders.map((order, index) => (
          <motion.div
            key={index}
            className="w-full h-full flex flex-col shrink-0"
            animate={orderIndex === index ? "visible" : "hidden"}
            variants={{
              hidden: {
                opacity: 0,
                x: `${100 * index}%`,
                transition: { duration: 0.2 },
              },
              visible: {
                opacity: 1,
                x: `-${100 * index}%`,
                // transition: { duration: 0.2, staggerChildren: 0.1 },
              },
            }}
          >
            <div className="relative z-0 w-full mb-3 mt-8 group flex flex-col">
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                买家
              </label>
              <Select
                mode="tags"
                maxTagCount={1}
                placeholder="Please select a person"
                onChange={(detail, de) => {
                  const foundAccount = accounts.find(
                    (item) => item._id === detail[0]
                  );

                  setOrder({
                    ...order,
                    account: foundAccount
                      ? foundAccount
                      : {
                          username: detail[0],
                          isNew: true,
                        },
                  });

                  selectRef.current.blur();
                }}
                className="w-full mt-2"
                choiceTransitionName="name"
                ref={selectRef}
                value={order.account?._id as any}
              >
                {accounts.map((item, index: number) => (
                  <Select.Option key={index} value={item._id}>
                    {item.username}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="relative z-0 w-full mb-6 group">
              <label className="flex flex-row items-center peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                <span className="flex-shrink-0">商品列表</span>
                <PlusCircleIcon
                  className="ml-4 cursor-pointer"
                  width={24}
                  color="#1D4ED8"
                  onClick={() => {
                    const currentOrderItems = order.orderItems
                      ? order.orderItems
                      : [];
                    // const currentOrders = ];
                    currentOrderItems.push({
                      sku: {},
                      quantity: 0,
                      preOrderPrice: 0,
                      isProductionPurchased: false,
                      discount: 0,
                    });

                    setOrder({
                      ...order,
                      orderItems: currentOrderItems,
                    });
                  }}
                />
              </label>
              <div className="my-12"></div>
              {order.orderItems?.map((orderItem, orderItemIndex) => (
                <div
                  // className="grid md:grid-cols-5 md:gap-6 pl-8"
                  className="flex flex-col border border-gray-200 rounded-md px-8 pt-6 mb-3 relative drop-shadow-md shadow-gray-500"
                  key={orderItemIndex}
                >
                  <MinusCircleIcon
                    className="absolute left-1 top-3 hover:fill-blue-500 cursor-pointer transition"
                    width={18}
                    color="gray"
                    onClick={() => {
                      const currentOrderItems = [...order.orderItems];
                      currentOrderItems.splice(orderItemIndex, 1);

                      setOrder({
                        ...order,
                        orderItems: currentOrderItems,
                      });
                    }}
                  />

                  <section className="flex flex-row">
                    {/* 产品名称 */}
                    <div className="relative z-0 w-full group flex flex-col justify-center">
                      <label
                        htmlFor="name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        产品名称
                      </label>
                      <Select
                        placeholder="Please select"
                        onChange={(detail, de) => {
                          const currentOrderItems = [...order.orderItems];

                          currentOrderItems[orderItemIndex].sku = skus.find(
                            (sku) => sku._id === detail
                          )!;
                          setOrder({
                            ...order,
                            orderItems: currentOrderItems,
                          });
                        }}
                        className="w-full"
                        size="small"
                        choiceTransitionName="name"
                        ref={selectRef}
                        value={orderItem.sku._id}
                      >
                        {skus.map((item, index: number) => (
                          <Select.Option key={index} value={item._id}>
                            {item.spu.name +
                              " " +
                              item.attribute.color +
                              " " +
                              item.attribute.size}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                    <div className="relative z-0 w-full mb-3 group flex flex-col items-center">
                      <Switch
                        className="text-center mx-auto inline-block border-4 border-cyan-600 mt-5 !bg-[#00000040)]"
                        checked={orderItem.isProductionPurchased}
                        onChange={(detail) => {
                          const currentOrderItems = [...order.orderItems];
                          currentOrderItems[
                            orderItemIndex
                          ].isProductionPurchased = detail;
                          setOrder({
                            ...order,
                            orderItems: currentOrderItems,
                          });
                        }}
                      />
                      <label
                        htmlFor="preOrderPrice"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        商品是否买到
                      </label>
                    </div>
                  </section>

                  <i className="mt-3 mb-5 border-b-2 border-gray-400 border-dashed"></i>
                  <section className="grid grid-cols-4 gap-3">
                    {/* 产品数量 */}
                    <div className="relative z-0 w-full mb-3 group">
                      <input
                        type="text"
                        onChange={(event) => {
                          const currentOrderItems = [...order.orderItems];
                          currentOrderItems[orderItemIndex].quantity =
                            parseFloat(event.target.value);
                          setOrder({
                            ...order,
                            orderItems: currentOrderItems,
                          });
                        }}
                        name={`quantity_${orderItemIndex}`}
                        id="attribute_color"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                        value={orderItem.quantity}
                      />
                      <label
                        htmlFor="attribute_color"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        数量
                      </label>
                    </div>

                    {/* 预订价格 */}
                    <div className="relative z-0 w-full mb-3 group">
                      <input
                        type="number"
                        onChange={(event) => {
                          const currentOrderItems = [...order.orderItems];
                          currentOrderItems[orderItemIndex].preOrderPrice =
                            parseFloat(event.target.value);
                          setOrder({
                            ...order,
                            orderItems: currentOrderItems,
                          });
                        }}
                        name={`preOrderPrice_${orderItemIndex}`}
                        id="preOrderPrice"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                        value={orderItem.preOrderPrice}
                      />
                      <label
                        htmlFor="preOrderPrice"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        预定价格
                      </label>
                    </div>

                    {/* 折扣 */}
                    <div className="relative z-0 w-full mb-3 group">
                      <input
                        type="number"
                        name={`discount_${orderItemIndex}`}
                        id={`discount_${orderItemIndex}`}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={orderItem.discount}
                        onChange={(event) => {
                          const currentOrderItems = [...order.orderItems];
                          currentOrderItems[orderItemIndex].discount =
                            parseFloat(event.target.value);
                          setOrder({
                            ...order,
                            orderItems: currentOrderItems,
                          });

                          setOrder({
                            ...order,
                            discount: parseFloat(event.target.value),
                          });
                        }}
                      />
                      <label
                        htmlFor={`discount_${orderItemIndex}`}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        折扣
                      </label>
                    </div>

                    {/* 定金 */}
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="number"
                        name="deposit"
                        id="deposit"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={order.deposit}
                        onChange={(event) => {
                          setOrder({
                            ...order,
                            deposit: parseFloat(event.target.value),
                          });
                        }}
                      />
                      <label
                        htmlFor="deposit"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        定金
                      </label>
                    </div>
                  </section>
                </div>
              ))}
            </div>
            {/* <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                name="deposit"
                id="deposit"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={order.deposit}
                onChange={(event) => {
                  setOrder({
                    ...order,
                    deposit: parseFloat(event.target.value),
                  });
                }}
              />
              <label
                htmlFor="deposit"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                定金
              </label>
            </div> */}

            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                name="finalPayment"
                id="finalPayment"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={order.finalPayment}
                onChange={(event) => {
                  setOrder({
                    ...order,
                    finalPayment: parseFloat(event.target.value),
                  });
                }}
              />
              <label
                htmlFor="finalPayment"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                尾款
              </label>
            </div>

            <div className="relative z-0 w-full mb-3 group flex flex-col">
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                订单状态
              </label>
              <Select
                placeholder="Please select a status"
                onChange={(detail) => {
                  setOrder({
                    ...order,
                    orderStatus: detail,
                  });
                }}
                className="w-full mt-2"
                choiceTransitionName="name"
                ref={selectRef}
                value={order.orderStatus}
              >
                <Select.Option value="UNPAID">未支付</Select.Option>
                <Select.Option value="HALFPAID">已支付定金</Select.Option>
                <Select.Option value="PAID">已结尾款</Select.Option>
                <Select.Option value="CANCELLED">已取消</Select.Option>
              </Select>
            </div>
          </motion.div>
        ))}
      </motion.form>

      <ArrowRightCircleIcon
        className="w-8 fill-blue-400 cursor-pointer"
        onClick={() => {
          // if (orderIndex === brandOrders.length - 1) {
          //   return;
          // }
          // if (orderIndex === brandOrders.length - 2) {
          //   setBrandOrders((state) => [...state, defaultOrder]);
          // }
          const currentIndex = orderIndex + 1;
          setOrderIndex(currentIndex);
          console.log(brandOrders.length);
          if (currentIndex >= brandOrders.length) {
            // alert('已经是最后一条了')
            toast.info("新用户订单...", {
              autoClose: 1000,
            });
            setBrandOrders((state) => [...state, defaultOrder]);
          }
        }}
      />

      <footer className="absolute bottom-2  w-full flex flex-row justify-between">
        {/* <div className="max-w-7xl"> */}
        <Pagination
          defaultCurrent={1}
          defaultPageSize={1}
          current={orderIndex + 1}
          total={brandOrders.length}
          onChange={(page) => {
            setOrderIndex(page - 1);
          }}
        />
        {/* <Pagination current={orderIndex + 1} total={brandOrders.length + 5} /> */}
        {/* <Pager current={orderIndex + 1} total={brandOrders.length + 5} /> */}
        {/* </div> */}
        <button
          type="submit"
          className={clsx({
            "mr-8 shadow rounded-md bg-indigo-500": true,
            "inline-flex px-4 py-2  leading-6 !cursor-pointer": true,
            "font-semibold text-sm text-white": true,
            "items-center self-end justify-around ": true,
            "transition ease-in-out duration-150": true,
            "w-46 hover:bg-indigo-400 cursor-not-allowed": confirmLoading,
            "w-38 bg-blue-700 hover:bg-blue-800 ": !confirmLoading,
          })}
          // disabled={confirmLoading ? true : false}
        >
          {confirmLoading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}

          {confirmLoading ? "Processing..." : "提交"}
        </button>
      </footer>
    </article>
  );
};

function useForceUpdate() {
  const [value, setState] = useState(true);

  return () => setState(!value);
}

const Pager = ({ current, total }) => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  // const handleForceupdateMethod = useForceUpdate();
  useEffect(() => {
    console.log(total, "total");
    forceUpdate();
  }, [total]);

  const Renders = React.useMemo(
    () => <Pagination current={current} total={total} />,
    [total]
  );
  return Renders;
};

export default BrandOrderForm;

"use client";

import {
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import { Pagination, Select, Switch } from "antd";
import clsx from "clsx";

import React, { useState, useRef, useEffect } from "react";
import { IProduct, Sku } from "~types/product";
import { IOrder, IOrderCreateSource, OrderStatus } from "~types/order";
import { createOrder, updateOrderItem } from "~app/api/sanityRest/order";
import { createAccount } from "~app/api/sanityRest/account";
import { useUploadingStore } from "~components/CherryUI/GoogleUploader";
import { modalStore } from "~components/CherryUI/Modal";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { DateRangePicker } from "./Picker";
import { sanityClient } from "~base/sanity/client";
import { orderBrandsWithDateRange } from "~app/api/groqs/global";
import { toYMD } from "~base/Timeformat";
import { useQuery } from "@tanstack/react-query";
import { fetchGlobal } from "~app/api/sanityRest/global";
import { IBrandOrder } from "~types/brandOrder";

interface Props {
  datasource: IBrandOrder[];
  // createSource: IOrderCreateSource;
}

export interface Brand {
  _id: string;
  name: string;
  spus?: {
    _id?: string;
    name?: string;
    skus?: Sku[];
  }[];
}
export interface IOrderFormDto {
  _id?: string;
  account: any;
  sortNumber: number;
  brand?: {
    _id: string;
    name: string;
  };
  orderItems: {
    _id?: string;
    sku: Partial<Sku>;
    quantity: number;
    preOrderPrice: number;
    isProductionPurchased: boolean;
  }[];
  shipments: any[];
  discount: number;
  deposit: number;
  // discount: number;
  finalPayment: number;
  orderStatus: OrderStatus;
}

let saveOrder = {} as IBrandOrder;
const BrandOrderForm: React.FC<Props> = ({ datasource }) => {
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const { accounts, brands, skus } = reponseGlobal.data as IOrderCreateSource;

  const defaultUserOrder = {
    account: {},
    orderItems: [
      {
        quantity: 1,
        preOrderPrice: 0,
        sku: [
          {
            color: "",
            size: "",
            spuColorSize: "",
          },
        ],
      },
    ],
    discount: 0,
    finalPayment: 0,
    deposit: 0,
    orderStatus: "UNPAID",
  } as unknown as IBrandOrder["userOrders"][0];

  const [brandsWithOrders, setBrandsWithOrders] =
    useState<IBrandOrder[]>(datasource);
  const [selectedBrand, setSelectedBrand] = useState<{
    name: string;
    _id?: string;
    logo?: string;
    spus?: IBrandOrder["brand"]["spus"];
  }>(null!);
  const [selectedBrandOrder, setSelectedBrandOrder] = useState<IBrandOrder>({
    _id: "",
    brand: {
      _id: "",
      name: "",
    },
    userOrders: [defaultUserOrder],
    createdAt: "",
    updatedAt: "",
  });

  const formRef = useRef<any>();
  const selectRef = useRef<any>();
  const brandSelectRef = useRef<any>();
  const paginationRef = useRef<any>(null!);
  const { setModalType, modalType } = modalStore();
  const [matchSPU, setMatchSPU] = useState<IProduct>(null!);
  const [fromTo, setFromTo] = useState<[Date, Date]>(null!);
  const [updateOrderRecord, setUpdateOrderRecord] = useState<any>(null!);
  const { clearImageUrls, imageUrls, setImageUrls } = useUploadingStore();

  // const [order, setOrder] = useState<IOrderFormDto>(defaultOrder);

  // const [brandOrders, setBrandOrders] = useState<IOrderFormDto[]>([
  //   defaultOrder,
  // ]);
  // brandsWithOrder.find((x) => x._id === foundBrandOrder?._id)

  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [domReady, setDomReady] = useState(false);

  const [dynamicAccounts, setDynamicAccounts] =
    useState<IOrderCreateSource["accounts"]>(accounts);

  const { orderOpen, setConfirmLoading, confirmLoading, setOrderOpen } =
    modalStore();

  const record = modalStore((state) => state.record);

  // const spu = datasource;

  const createAccountHandler = ({ username, isNew }: any) => {
    createAccount({ username });
  };

  const formSubitHandler = async (evt: any) => {
    console.log(selectedBrandOrder, "....a");
    console.log(`updateOrderRecord`, saveOrder, ".aaaaa");
    evt.preventDefault();
    setConfirmLoading(true);

    if (confirmLoading) return;
    if (modalType === "create") {
      const orderRs = await createOrder({
        ...selectedBrandOrder,
        brand: selectedBrand as IBrandOrder["brand"],
      });
    }

    if (modalType === "update") {
      const orderItemsRs = await createOrder(
        selectedBrandOrder,
        saveOrder.userOrders[0].orderItems
      );
    }

    setConfirmLoading(false);
    setOrderOpen(false);
    clearForm();
  };

  const clearForm = async () => {
    setSelectedBrandOrder({
      _id: "",
      brand: {
        _id: "",
        name: "",
      },
      userOrders: [defaultUserOrder],
      createdAt: "",
      updatedAt: "",
    });
    // setBrandOrders([defaultOrder]);
    // setOrder({
    //   account: {},
    //   discount: 0,
    //   finalPayment: 0,
    //   orderStatus: "UNPAID",
    //   deposit: 0,
    //   shipments: [],
    //   sortNumber: 0,
    //   orderItems: [
    //     {
    //       sku: {},
    //       quantity: 0,
    //       preOrderPrice: 0,
    //       isProductionPurchased: false,
    //       discount: 0,
    //     },
    //   ],
    // });
  };

  const skuFilter = (skus: Sku[]) => {
    if (!selectedBrand) {
      return skus;
    }

    const _skus = skus.filter((_s) =>
      selectedBrand.spus?.some((_spu) => _spu._id === _s?.spu?.spuId)
    );

    return _skus;
  };

  useEffect(() => {
    if (!orderOpen) return;
    if (modalType === "update") {
      setSelectedBrandOrder({ ...record });
      const users = record.userOrders.map(
        (x: { orderItems: IBrandOrder["userOrders"][0]["orderItems"] }) => ({
          ...x,
          orderItems: x.orderItems.map((y) => ({
            ...y,
          })),
        })
      );
      setSelectedBrand({
        _id: record.brand._id as string,
        name: record.brand.name as string,
        spus: brands.find((x) => x._id === record.brand._id)
          ?.spus as IBrandOrder["brand"]["spus"],
      });
      saveOrder = {
        _id: record._id,
        userOrders: users,
        // userOrder: {
        //   account: users[0].account,
        //   deposit: users[0].deposit,
        //   discount: users[0].discount,
        //   finalPayment: users[0].finalPayment,
        //   orderItems: users[0].orderItems,
        //   orderStatus: users[0].orderStatus,
        //   _id: users[0]._id,
        // },
        brand: record.brand,
        // deposit: record.userOrders[0].deposit,
        // discount: record.userOrders[0].discount,
        // finalPayment: record.userOrders[0].finalPayment,
      };
    }
  }, [record]);

  useEffect(() => {
    setDomReady(true);
  }, []);

  if (reponseGlobal.status !== "success") return null;

  console.log(brandsWithOrders, "brandsWithOrders");

  console.log(`selectedBrandOrder`, selectedBrandOrder);
  console.log(`record`, record);
  return (
    <article className="flex flex-row">
      <ArrowLeftCircleIcon
        className={clsx({
          "w-8 fill-gray-400 cursor-pointer hover:fill-blue-500 transition-colors":
            true,
          "fill-blue-400": orderIndex > 0,
          "hidden fill-blue-400": modalType === "update",
        })}
        onClick={() => {
          if (orderIndex > 0) {
            setOrderIndex(orderIndex - 1);
          }
        }}
      />

      {domReady ? (
        ReactDOM.createPortal(
          <div className="relative z-0 w-60 group group-one">
            <DateRangePicker
              className="mt-2"
              onChange={async (d) => {
                if (d === null) {
                  setBrandsWithOrders([]);
                  setSelectedBrand({ name: "", _id: undefined });

                  clearForm();

                  return;
                }

                const dateRangeOrders = await sanityClient.fetch<IBrandOrder[]>(
                  orderBrandsWithDateRange,
                  {
                    from: d[0],
                    to: d[1],
                  }
                );

                const _brandsWithOrders = dateRangeOrders.map((order) => ({
                  ...order,
                  userOrders: [defaultUserOrder],
                }));

                setBrandsWithOrders(
                  _brandsWithOrders.length > 0 ? _brandsWithOrders : undefined!
                );

                setSelectedBrand({
                  name: "",
                  _id: undefined,
                });
              }}
            />
          </div>,
          document.querySelector(".ant-modal-header")!
        )
      ) : (
        <></>
      )}

      {domReady ? (
        ReactDOM.createPortal(
          <div className="relative z-0 w-96 group group-one">
            {/* <label
                    htmlFor="name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    品牌
                  </label> */}
            {brandsWithOrders && brandsWithOrders.length === 0 ? (
              <Select
                mode="tags"
                size="small"
                maxTagCount={1}
                placeholder="请选择品牌"
                onChange={(detail, de) => {
                  const foundBrand = brands
                    // .map((x) => x._id)
                    .find((item) =>
                      detail.length >= 2
                        ? item._id === detail[1]
                        : item._id === detail[0]
                    );
                  setSelectedBrand(foundBrand!);

                  setSelectedBrandOrder((prev) => ({
                    ...prev,
                    userOrders: prev.userOrders.map((u) => ({
                      ...u,
                      orderItems: u.orderItems.map((o) => ({
                        ...o,
                        quantity: 1,
                        preOrderPrice: 0,
                        isProductionPurchased: false,
                        sku: {
                          _id: undefined,
                          name: "",
                        },
                      })),
                    })),
                  })) as any;
                  brandSelectRef.current.blur();
                }}
                className="w-full mt-2"
                choiceTransitionName="name"
                ref={brandSelectRef}
                value={selectedBrand?._id}
              >
                {brands.map((item, index: number) => (
                  <Select.Option key={index} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Select
                mode="tags"
                size="small"
                maxTagCount={1}
                placeholder="请选择品牌"
                onChange={(detail, de) => {
                  const foundBrandOrder = brandsWithOrders
                    // .map((x) => x.brand)
                    .find((item) =>
                      detail.length >= 2
                        ? item.brand._id === detail[1]
                        : item.brand._id === detail[0]
                    );
                  if (foundBrandOrder) {
                    const fountBrandWithOrder = brandsWithOrders.find(
                      (x) => x._id === foundBrandOrder._id
                    )!;

                    setSelectedBrandOrder(
                      fountBrandWithOrder as unknown as IBrandOrder
                    );
                  }

                  setSelectedBrand(
                    foundBrandOrder
                      ? foundBrandOrder.brand
                      : { name: "", _id: undefined }!
                  );

                  brandSelectRef.current.blur();
                }}
                className="w-full mt-2"
                choiceTransitionName="name"
                ref={brandSelectRef}
                value={selectedBrand?._id}
              >
                {brandsWithOrders && brandsWithOrders.length >= 0
                  ? brandsWithOrders
                      .map((x) => ({ ...x }))
                      .map((item, index: number) => (
                        <Select.Option key={index} value={item.brand._id}>
                          {item.brand.name + " " + toYMD(item.createdAt!)}
                        </Select.Option>
                      ))
                  : brandsWithOrders
                  ? brands.map((item, index: number) => (
                      <Select.Option key={index} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : ([] as any[]).map((item, index: number) => (
                      <Select.Option key={index} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
              </Select>
            )}
          </div>,
          document.querySelector(".ant-modal-header")!
        )
      ) : (
        <></>
      )}

      <motion.form
        ref={formRef}
        className="flex flex-row mx-2 w-full overflow-hidden pb-10"
        // onSubmit={formSubitHandler}
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

        {selectedBrandOrder.userOrders.map((order, index) => (
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
                onChange={async (detail, de) => {
                  const foundAccount = dynamicAccounts.find((item) =>
                    detail.length >= 2
                      ? item._id === detail[1]
                      : item._id === detail[0]
                  );

                  const _account = foundAccount
                    ? foundAccount
                    : detail.length > 0
                    ? (
                        await createAccount({
                          username: detail[0],
                        })
                      )[0].document
                    : { username: "", _id: undefined };

                  setSelectedBrandOrder((prev) => {
                    const newOrder = { ...prev };
                    newOrder.userOrders[index].account = _account;
                    return newOrder;
                  });

                  if (!foundAccount && detail.length > 0) {
                    setDynamicAccounts((prev) => [...prev, _account]);
                  }

                  selectRef.current.blur();
                }}
                className="w-full mt-2"
                choiceTransitionName="username"
                ref={selectRef}
                value={order.account?._id as any}
              >
                {dynamicAccounts.map((item, index: number) => (
                  <Select.Option key={index} value={item._id}>
                    {item.username}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="relative z-0 w-full mb-6 group border border-gray-300 rounded-md px-2 py-2 drop-shadow-md shadow-gray-500">
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

                    currentOrderItems.push({
                      sku: {
                        _id: undefined,
                      },
                      quantity: 1,
                      preOrderPrice: 0,
                      isProductionPurchased: false,
                    });

                    setSelectedBrandOrder((prev) => {
                      const newOrder = { ...prev };
                      newOrder.userOrders[index].orderItems = currentOrderItems;
                      return newOrder;
                    });
                  }}
                />
              </label>
              <div className="my-12"></div>
              <ul className="max-h-56 overflow-y-auto">
                {order.orderItems?.map((orderItem, orderItemIndex) => (
                  <li
                    key={orderItemIndex}
                    className="relative flex flex-col px-8 pt-6 mb-3 drop-shadow-md shadow-gray-500 border border-gray-200 rounded-md"
                  >
                    <MinusCircleIcon
                      className="absolute left-1 top-3 hover:fill-blue-500 cursor-pointer transition"
                      width={18}
                      color="gray"
                      onClick={() => {
                        const currentOrderItems = [...order.orderItems];
                        currentOrderItems.splice(orderItemIndex, 1);
                        setSelectedBrandOrder((prev) => {
                          const newOrder = { ...prev };
                          newOrder.userOrders[index].orderItems =
                            currentOrderItems;
                          return newOrder;
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

                            setSelectedBrandOrder((prev) => {
                              const newOrder = { ...prev };
                              const _brand = prev.brand._id
                                ? prev.brand
                                : brands.find((f) =>
                                    f.spus.find(
                                      (p) =>
                                        p._id ===
                                        skus.find((sk) => sk._id === detail)!
                                          .spu.spuId
                                    )
                                  )!;

                              setSelectedBrand({
                                ..._brand,
                                spus: brands.find((x) => x._id === _brand._id)
                                  ?.spus as IBrandOrder["brand"]["spus"],
                              });

                              newOrder.userOrders[index].orderItems =
                                currentOrderItems;

                              return newOrder;
                            });
                          }}
                          className="w-full"
                          size="small"
                          choiceTransitionName="name"
                          ref={selectRef}
                          value={orderItem.sku._id}
                        >
                          {skuFilter(skus)!.map((item, index: number) => (
                            <Select.Option key={index} value={item._id}>
                              {item?.spu?.name +
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
                            setSelectedBrandOrder((prev) => {
                              const newOrder = { ...prev };
                              newOrder.userOrders[index].orderItems =
                                currentOrderItems;
                              return newOrder;
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

                            setSelectedBrandOrder((prev) => {
                              const newOrder = { ...prev };
                              newOrder.userOrders[index].orderItems =
                                currentOrderItems;
                              return newOrder;
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

                            setSelectedBrandOrder((prev) => {
                              const newOrder = { ...prev };
                              newOrder.userOrders[index].orderItems =
                                currentOrderItems;
                              return newOrder;
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
                    </section>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="deposit"
                  id="deposit"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={order.deposit}
                  onChange={(event) => {
                    setSelectedBrandOrder((prev) => {
                      const newOrder = { ...prev };
                      newOrder.userOrders[index].deposit = parseFloat(
                        event.target.value
                      );
                      return newOrder;
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
              <div className="relative z-0 w-full mb-3 group">
                <input
                  type="number"
                  name={`discount`}
                  id={`discount`}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={order.discount}
                  onChange={(event) => {
                    setSelectedBrandOrder((prev) => {
                      const newOrder = { ...prev };
                      newOrder.userOrders[index].discount = parseFloat(
                        event.target.value
                      );
                      return newOrder;
                    });
                  }}
                />
                <label
                  htmlFor={`discount`}
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  折扣
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="finalPayment"
                  id="finalPayment"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={order.finalPayment}
                  onChange={(event) => {
                    setSelectedBrandOrder((prev) => {
                      const newOrder = { ...prev };
                      newOrder.userOrders[index].finalPayment = parseFloat(
                        event.target.value
                      );
                      return newOrder;
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
                  setSelectedBrandOrder((prev) => {
                    const newOrder = { ...prev };
                    newOrder.userOrders[index].orderStatus = detail;
                    return newOrder;
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
        className={clsx({
          "w-8 cursor-pointer": true,
          "fill-gray-400 hidden": modalType === "update",
          "fill-blue-400": modalType === "create",
        })}
        onClick={() => {
          if (modalType === "update") return;
          const currentIndex = orderIndex + 1;
          setOrderIndex(currentIndex);
          console.log(selectedBrandOrder.userOrders.length);
          if (currentIndex >= selectedBrandOrder.userOrders.length) {
            // alert('已经是最后一条了')
            toast.info("新用户订单...", {
              autoClose: 1000,
            });
            setSelectedBrandOrder((prev) => {
              const newOrder = { ...prev };
              newOrder.userOrders = [...newOrder.userOrders, defaultUserOrder];
              return newOrder;
            });
          }
        }}
      />

      <footer className="absolute bottom-2  w-full flex flex-row justify-between">
        {/* <div className="max-w-7xl"> */}
        <Pagination
          defaultCurrent={1}
          defaultPageSize={1}
          current={orderIndex + 1}
          total={selectedBrandOrder.userOrders.length}
          onChange={(page) => {
            setOrderIndex(page - 1);
          }}
        />
        {/* <Pagination current={orderIndex + 1} total={brandOrders.length + 5} /> */}
        {/* <Pager current={orderIndex + 1} total={brandOrders.length + 5} /> */}
        {/* </div> */}
        <button
          type="submit"
          onClick={formSubitHandler}
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

export default BrandOrderForm;

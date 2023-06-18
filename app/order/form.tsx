import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Button, Select, Switch } from "antd";
import clsx from "clsx";
import spu from "~base/sanity/schemas/spu";
import { v4 as uuidv4 } from "uuid";

import GoogleUploader, {
  useUploadingStore,
} from "~components/Layout/GoogleUploader";
import { modalStore } from "../../components/Layout/Modal";
import React, { useState, useRef, useEffect } from "react";
import { sanityMutationClient } from "~base/sanity/client";
import { IProduct, Sku } from "~types/product";
import { IOrder, IOrderCreateSource, OrderStatus } from "~types/order";
import DirectoryTree, { DirectoryTreeProps } from "antd/es/tree/DirectoryTree";
import { DataNode } from "antd/es/tree";
import orderItem from "~base/sanity/schemas/orderItem";
import {
  createOrder,
  createOrderItem,
  updateOrder,
  updateOrderItem,
} from "~app/api/sanityRest/order";

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
  }[];
  shipments: any[];
  deposit: number;
  discount: number;
  finalPayment: number;
  orderStatus: OrderStatus;
}

const OrderForm: React.FC<Props> = ({ datasource, createSource }) => {
  const { setModalType, modalType } = modalStore();
  const [matchSPU, setMatchSPU] = useState<IProduct>(null!);
  const { clearImageUrls, imageUrls, setImageUrls } = useUploadingStore();

  const [order, setOrder] = useState<IOrderFormDto>({
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
      },
    ],
  });

  const {
    open,
    setConfirmLoading,
    confirmLoading,
    setOpen,
    record,
    setRecord,
  } = modalStore();

  const selectRef = useRef<any>();

  const spu = datasource;

  const defaultNameInit = (evt: string[]) => {
    // const name = evt[0];
    // const foundItem = spu.find((item: IProduct) => item.name === name);
    // if (foundItem) {
    //   setMatchSPU(foundItem);
    //   const currentImages = foundItem?.imageURLs.map(
    //     (i: any) => i.asset
    //   ) as any;
    //   clearImageUrls();
    //   setImageUrls(currentImages);
    //   // setImages(currentImages);
    // } else {
    //   // setImages(currentImages);
    //   setMatchSPU(null!);
    // }
    // setFormData((prev) => ({
    //   ...prev,
    //   name,
    //   category: foundItem?.category || "",
    //   brand: foundItem?.brand || "",
    //   link: foundItem?.link || "",
    // }));
    // selectRef.current.blur();
  };

  const aiCreate = async () => {
    const prompt = window.prompt("请输入数据");
    const embeddingPrompt = `{
      items: [{
      "name": "",
      "type": "",
      "brand": "",
      "sizes": [{ "color": "","size": "", "quantity": 0}],
      "link": ""}]
      }

      按这个结构来如上结构，请填充下面的数据，帮我整理成一个叫做shopJSON的json, 只要给我JSON片段，不要其他废话：
      ${prompt}`;
    // {
    //   items: [{
    //   "name": "",
    //   "type": "",
    //   "brand": "",
    //   "sizes": [{ "color": "","size": "", "quantity": 0}],
    //   "link": ""}]
    //   }

    //   按这个结构来如上结构，请填充下面的数据，帮我整理成一个叫做shopJSON的json, 只要给我JSON片段，不要其他废话：
    const response: any = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATGPT_API_TOKEN}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          stream: false,
          // temperature: 0.7,
          temperature: 0,
          max_tokens: 1500,
          // stop: "\n",
          // top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          // user: body?.user,
          n: 1,
          messages: [
            {
              role: "user",
              content: embeddingPrompt, // 4096
            },
          ],
        }),
      }
    ).catch((error) => {
      window.alert("设置错误，请检查网络");
      console.log(error.message);
    });
    const data = await response?.json();
    const choice = data?.choices[0];
    const jsonContent = choice.message.content;

    console.log(jsonContent, "Reponse_JSON");
  };

  const skuInputChangeHandler = (evt: any) => {
    const [attribute, info, index] = evt.target.name.split("_") as string[];

    const { name, value } = evt.target;

    const currentSku = formData.skus![Number(index)];

    if (info === "price") {
      currentSku.price = Number(value);
    }
    const currentAttribute = currentSku[
      attribute as keyof Sku
    ] as Sku["attribute"];

    formData.skus![Number(index)] = {
      ...currentSku,
      price: currentSku.price ? currentSku.price : 0,
      [attribute]: {
        ...currentAttribute,
        // ...currentSku[attribute],
        [info]: value,
      },
    };

    setFormData((prev) => ({
      ...prev,
      skus: formData.skus!,
    }));
  };

  const inputChangeHandler = (evt: any) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!order.shipments) {
      window.alert("请输入发货信息");
      return;
    }

    if (modalType === "create") {
      const orderItemsRs = await createOrderItem(order);
      const orderRs = await createOrder(
        order,
        orderItemsRs.results.map((result: any) => result.document)
      );
    }

    if (modalType === "update") {
      debugger;
      const orderItemsRs = await updateOrderItem(order);
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
        },
      ],
    });
  };

  useEffect(() => {
    if (!open) return;
    if (modalType === "update") {
      setOrder(record);
    }
  }, [open, record]);

  const { accounts, skus } = createSource;
  console.log(order, "order...", accounts, "accounts...");
  return (
    <article>
      <form className="flex flex-col" onSubmit={formSubitHandler}>
        {/* {orders.map((order, index) => {
          return (
      
          );
        })} */}
        <>
          <div className="relative z-0 w-full mb-3 mt-8 group flex flex-col">
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              买家
            </label>
            <Select
              placeholder="Please select a person"
              onChange={(detail) => {
                setOrder({
                  ...order,
                  account: detail,
                });
              }}
              className="w-full mt-2"
              choiceTransitionName="name"
              ref={selectRef}
              value={order.account._id as any}
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
                  const currentOrderItems = order.orderItems;
                  // const currentOrders = ];
                  currentOrderItems.push({
                    sku: {},
                    quantity: 0,
                    preOrderPrice: 0,
                    isProductionPurchased: false,
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
                className="grid md:grid-cols-4 md:gap-6 pl-8"
                key={orderItemIndex}
              >
                <MinusCircleIcon
                  className="absolute left-0 translate-y-1/2 mt-1.5 hover:fill-blue-500 cursor-pointer transition"
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

                <div className="relative z-0 w-full mb-3 group">
                  <input
                    type="text"
                    onChange={(event) => {
                      const currentOrderItems = [...order.orderItems];
                      currentOrderItems[orderItemIndex].quantity = parseFloat(
                        event.target.value
                      );
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
                <div className="relative z-0 w-full mb-3 group flex flex-col items-center">
                  <Switch
                    className="text-center mx-auto inline-block border border-cyan-600 mt-5 !bg-[#00000040)]"
                    checked={orderItem.isProductionPurchased}
                    onChange={(detail) => {
                      const currentOrderItems = [...order.orderItems];
                      currentOrderItems[orderItemIndex].isProductionPurchased =
                        detail;
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
              </div>
            ))}
          </div>
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
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              name="discount"
              id="discount"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={order.discount}
              onChange={(event) => {
                setOrder({
                  ...order,
                  discount: parseFloat(event.target.value),
                });
              }}
            />
            <label
              htmlFor="discount"
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
              产品名称
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
        </>
        <button
          type="submit"
          className={clsx({
            "inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white transition ease-in-out duration-150 self-end justify-around !cursor-pointer":
              true,
            "w-46 bg-indigo-500 hover:bg-indigo-400 cursor-not-allowed":
              confirmLoading,
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
      </form>
    </article>
  );
};

export default OrderForm;

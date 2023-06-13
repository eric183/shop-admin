import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Select } from "antd";
import clsx from "clsx";
import spu from "~base/sanity/schemas/spu";
import { v4 as uuidv4 } from "uuid";

import GoogleUploader, {
  useUploadingStore,
} from "~components/Layout/GoogleUploader";
import { modalStore } from "./modal";
import { useState, useRef } from "react";
import { sanityMutationClient } from "~base/sanity/client";
import { IProduct, Sku } from "~types/product";

const ProductForm = ({ datasource }) => {
  const [matchSPU, setMatchSPU] = useState<IProduct>(null!);
  const { clearImageUrls, imageUrls, setImageUrls } = useUploadingStore();
  const {
    open,
    setConfirmLoading,
    confirmLoading,
    setOpen,
    record,
    setRecord,
  } = modalStore();
  const [formData, setFormData] = useState<Partial<IProduct>>({
    skus: [
      {
        attribute: {
          color: "",
          size: "",
        },
      },
    ],
  });

  const selectRef = useRef<any>();

  const spu = datasource;

  const keyEnterBinder = (evt: string[]) => {
    const name = evt[0];
    const foundItem = spu.find((item) => item.name === name);
    if (foundItem) {
      setMatchSPU(foundItem);
      const currentImages = foundItem?.imageURLs.map((i) => i.asset) as any;
      clearImageUrls();

      setImageUrls(currentImages);
      // setImages(currentImages);
    } else {
      // setImages(currentImages);
      setMatchSPU(null!);
    }

    setFormData((prev) => ({
      ...prev,
      name,
      category: foundItem?.category || "",
      brand: foundItem?.brand || "",
      link: foundItem?.link || "",
    }));

    selectRef.current.blur();
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

    const { name, category, brand, link, skus } = formData;
    let _matchSPU = matchSPU;
    const imagesCreations = (imageUrls as IProduct["imageURLs"]).map(
      (image) => {
        return {
          _type: "image",
          _key: uuidv4().split("-")[0],
          asset: {
            _ref: image._id,
            _type: "reference",
          },
        };
      }
    );
    debugger;
    if (!matchSPU) {
      const { results } = await sanityMutationClient({
        mutations: [
          {
            create: {
              _type: "spu",
              _id: uuidv4(),
              name,
              category,
              brand,
              link,
              // images: imagesCreations,
            },
          },
        ],
      });

      _matchSPU = results[0].document;
      // await sanityMutationClient(skuCreations);
    }
    const skusResults = await skuCreations(_matchSPU._id);

    // update skus reference to spu
    const _skus = _matchSPU.skus
      ? [..._matchSPU.skus, ...skusResults]
      : skusResults;

    await sanityMutationClient({
      mutations: [
        {
          patch: {
            id: _matchSPU._id,
            set: {
              name,
              category,
              brand,
              link,
              images: imagesCreations,
              skus: _skus.map(({ _id }: any) => {
                return {
                  _type: "reference",
                  _key: uuidv4().split("-")[0],
                  _ref: _id,
                };
              }),
            },
          },
        },
        // {
        //   patch: {
        //     id: matchSPUId,
        //     set: {
        //       name,
        //       category,
        //       brand,
        //       link,
        //       images: imagesCreations,
        //     },
        //   },
        // },
        // ...(skuCreations(matchSPUId) as any),
        // ...(skuCreations as any),

        // ...imagesCreations,
      ],
    });

    setConfirmLoading(false);
    setOpen(false);
    clearForm();
    // await formPost(skuCreations, spuCreations, imagesCreations);

    // here go set a fetch request to sanity.io
  };

  const skuCreations = async (matchSPUId: string) => {
    const { skus } = formData;

    const { results } = await sanityMutationClient({
      mutations: skus?.map(({ attribute, price }) => {
        return {
          create: {
            _type: "sku",
            spu: {
              _type: "spu",
              _ref: matchSPUId,
            },
            price,
            attribute: {
              color: attribute?.color,
              size: attribute?.size,
            },
          },
        };
      }),
    });

    return results.map(({ document }: any) => ({ ...document }));
  };

  // const formPost = async (skuForm: any, spuForm: any, imageForm: any) => {
  //   const { results } = await sanityMutationClient(skuForm);

  //   const { results } = await sanityMutationClient(spuForm);

  //   debugger;

  //   setConfirmLoading(false);
  //   setOpen(false);
  //   clearForm();
  //   return {};
  // };

  const clearForm = async () => {
    setFormData({
      name: "",
      category: "",
      brand: "",
      link: "",
      skus: [
        {
          price: 0,
          attribute: {
            color: "",
            size: "",
          },
        },
      ],
    });
    setImageUrls([]);
    setMatchSPU(null!);
  };

  return (
    <form className="flex flex-col" onSubmit={formSubitHandler}>
      <GoogleUploader />
      {/* <SanityUploader /> */}
      <div className="relative z-0 w-full mb-3 mt-8 group flex flex-col">
        <label
          htmlFor="name"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          产品名称
        </label>
        <Select
          mode="tags"
          placeholder="Please select"
          onChange={keyEnterBinder}
          className="w-full mt-2"
          choiceTransitionName="name"
          ref={selectRef}
        >
          {spu.map((item, index) => (
            <Select.Option key={index} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="relative z-0 w-full mb-6 group">
        <label className="flex flex-row items-center peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          <span className="flex-shrink-0">规格</span>
          <PlusCircleIcon
            className="ml-4 cursor-pointer"
            width={24}
            color="#1D4ED8"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                skus: [
                  ...(prev.skus as any[]),
                  {
                    attribute: {
                      color: "",
                      size: "",
                    },
                  },
                ],
              }));
            }}
          />
        </label>
        <div className="my-10"></div>
        {formData.skus?.map((sku, index) => (
          <div className="grid md:grid-cols-3 md:gap-6 pl-8" key={index}>
            <MinusCircleIcon
              className="absolute left-0 translate-y-1/2 mt-1.5 hover:fill-blue-500 cursor-pointer transition"
              width={18}
              color="gray"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  skus: [
                    ...prev.skus!.slice(0, index),
                    ...prev.skus!.slice(index + 1),
                  ],
                }));
              }}
            />

            <div className="relative z-0 w-full mb-3 group">
              <input
                type="text"
                onChange={skuInputChangeHandler}
                name={`attribute_size_${index}`}
                id="attribute_size"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={sku.attribute.size}
              />
              <label
                htmlFor="attribute_size"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                码数
              </label>
            </div>
            <div className="relative z-0 w-full mb-3 group">
              <input
                type="text"
                onChange={skuInputChangeHandler}
                name={`attribute_color_${index}`}
                id="attribute_color"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={sku.attribute.color}
              />
              <label
                htmlFor="attribute_color"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                颜色
              </label>
            </div>
            <div className="relative z-0 w-full mb-3 group">
              <input
                type="number"
                onChange={skuInputChangeHandler}
                name={`attribute_price_${index}`}
                id="price"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={sku.price}
              />
              <label
                htmlFor="price"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                价格
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="brand"
          name="brand"
          id="brand"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.brand}
          onChange={inputChangeHandler}
        />
        <label
          htmlFor="brand"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          品牌
        </label>
      </div>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="link"
          name="link"
          id="link"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.link}
          onChange={inputChangeHandler}
        />
        <label
          htmlFor="link"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          链接
        </label>
      </div>

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
  );
};

export default ProductForm;

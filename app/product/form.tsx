import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Select } from "antd";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

import React, { useState, useRef, useEffect } from "react";
import { IProduct, Sku } from "~types/product";
import { createProduct, updateProduct } from "~app/api/sanityRest/product";
import GoogleUploader, {
  useUploadingStore,
} from "~components/CherryUI/GoogleUploader";
import { modalStore } from "~components/CherryUI/Modal";
import { IOrderCreateSource } from "~types/order";
import { debug } from "console";
import spu from "~base/sanity/schemas/spu";

interface Props {
  datasource: IProduct[];
  createSource: IOrderCreateSource;
  refetch: () => void;
}
// const ProductForm: React.FC<{
//   datasource: IProduct[];
// }> = ({ datasource }) => {
const ProductForm: React.FC<Props> = ({
  datasource,
  refetch,
  createSource,
}) => {
  const { brands, inventories, globalSkus } = createSource;
  const products = datasource;

  const brandSelectRef = useRef<any>(null!);
  const { setModalType, modalType } = modalStore();
  const [matchProduct, setMatchProduct] = useState<IProduct>(null!);
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
    spus: [],
    spu: {
      name: "",
      link: "",
      skus: [
        {
          attribute: {
            color: "",
            size: "",
          },
        },
      ],
    },
  });

  const [currentProducts, setCurrentProducts] = useState<IProduct[]>(products);
  const GoogleUploaderRef = useRef<any>(null!);

  const selectRef = useRef<any>();

  // tofix: any
  const defaultNameInit = (evt: string[], record: any) => {
    const name = evt[0];
    const foundItem = products.find(
      (item: IProduct) => item.brand.name === name
    );

    if (foundItem) {
      setMatchProduct(foundItem);

      const currentImages = foundItem?.images
        ? foundItem?.images.map((i: any) => i.asset)
        : [];
      clearImageUrls();

      setImageUrls(currentImages);
    } else {
      setMatchProduct(null!);
    }
    // deb

    setFormData({
      ...record,
      _id: record.brand._id,
      spu: record,
      link: record.link,
      spus: brands.find((brand) => brand._id === record.brand._id)?.spus,
      // images: record,
      // category: record.category,
      // link: record.link,
      // skus: record.spu.skus,
    });

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

    const currentSku = formData.spu!.skus![Number(index)];

    if (info === "price") {
      currentSku.price = Number(value);
    }
    const currentAttribute = currentSku[
      attribute as keyof Sku
    ] as Sku["attribute"];

    formData.spu!.skus![Number(index)] = {
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
      spu: {
        ...prev.spu,
        skus: formData.spu!.skus,
      },
    }));
    // skus: formData.spuskus!,
  };

  const inputChangeHandler = (evt: any) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formSubitHandler = async (evt: any) => {
    if (confirmLoading) return;
    evt.preventDefault();
    setConfirmLoading(true);

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

    if (modalType === "create") {
      const createForm = {
        ...matchProduct,
        ...formData,
        images: imagesCreations,
      };

      await createProduct(createForm);
    }

    if (modalType === "update") {
      await updateProduct(
        matchProduct._id!,
        {
          ...formData,
          images: imagesCreations,
        },
        record
      );
    }

    await refetch();

    setConfirmLoading(false);
    setOpen(false);
    clearForm();
  };

  const clearForm = async () => {
    setFormData({
      name: undefined,
      category: "",
      brand: { name: "" },
      spu: {
        link: "",
        name: "",
        skus: [
          {
            price: 0,
            attribute: {
              color: "",
              size: "",
            },
          },
        ],
      },
    });
    setImageUrls([]);
    setMatchProduct(null!);
  };

  const pasteBinder = (e: React.ClipboardEvent<HTMLFormElement>) => {
    // debugger;

    if (e.clipboardData.types[0] === "text/plain") return;
    const file = e.clipboardData.files[0];

    GoogleUploaderRef.current.uploadHandler([file]);
  };

  useEffect(() => {
    clearForm();

    if (record && open && modalType === "update") {
      defaultNameInit([record.brand.name], record);
      setMatchProduct(record);
    }
  }, [open]);

  return (
    <form
      className="flex flex-col"
      onSubmit={formSubitHandler}
      onPaste={pasteBinder}
    >
      <GoogleUploader ref={GoogleUploaderRef} />

      <div className="relative z-0 w-full mb-3 mt-8 group">
        <label
          htmlFor="brand"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          品牌
        </label>
        <Select
          disabled={modalType === "update"}
          mode="tags"
          size="small"
          maxTagCount={1}
          placeholder="请选择品牌"
          onChange={(detail, de) => {
            const foundBrand = brands.find((item) =>
              detail.length >= 2
                ? item._id === detail[1]
                : item._id === detail[0]
            );
            brandSelectRef.current.blur();

            const brand = foundBrand
              ? foundBrand
              : { name: detail[0]!, _id: undefined, spus: [] as any };

            setFormData((prev) => ({
              ...prev,
              brand,
              spus: brand.spus,
            }));
          }}
          className="w-full mt-2"
          choiceTransitionName="name"
          ref={brandSelectRef}
          value={formData?.brand?._id}
        >
          {brands.map((item, index: number) => (
            <Select.Option key={index} value={item._id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="relative z-0 w-full mb-3 mt-8 group flex flex-col">
        <label
          htmlFor="spuName"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          品类名称
        </label>
        <Select
          disabled={modalType === "update"}
          mode="tags"
          size="small"
          maxTagCount={1}
          placeholder="请选择品类名称"
          onChange={(detail, dd) => {
            const foundSPU = products.find((s) =>
              detail.length >= 2 ? s._id === detail[1] : s._id === detail[0]
            );

            selectRef.current.blur();

            if (!foundSPU && detail.length === 0) {
              setFormData({
                ...formData,
                // name: event[0],
                spu: {
                  _id: undefined,
                  name: "",
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
                },
              });
              return;
            }

            const d = {
              ...formData,
              spu: foundSPU
                ? {
                    ...foundSPU,
                    skus: [
                      {
                        price: 0,
                        attribute: {
                          color: "",
                          size: "",
                        },
                      },
                    ],
                  }
                : {
                    link: "",
                    _id: undefined,
                    name: detail[0],
                    skus: [
                      {
                        price: 0,
                        attribute: {
                          color: "",
                          size: "",
                        },
                      },
                    ],
                  },
            } as any;

            // setCurrentSpus((prev) => [...prev, d!]);
            setFormData(d);
          }}
          className="w-full mt-2"
          choiceTransitionName="spuName"
          ref={selectRef}
          value={formData?.spu?._id as any}
        >
          {formData.spus?.map((item: IProduct, index: number) => (
            <Select.Option key={index} value={item._id}>
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
              setFormData((prev) => {
                if (prev.spu?.skus) {
                  return {
                    ...prev,
                    spu: {
                      ...prev.spu,
                      skus: [
                        ...(prev.spu.skus ? prev.spu.skus : []),
                        {
                          price: 0,
                          attribute: {
                            color: "",
                            size: "",
                          },
                        },
                      ],
                    },
                  };
                }

                return prev;
              });
            }}
          />
        </label>
        <div className="my-10"></div>
        {formData.spu!.skus?.map((sku, index) => (
          <div className="grid md:grid-cols-3 md:gap-6 pl-8" key={index}>
            <MinusCircleIcon
              className="absolute left-0 translate-y-1/2 mt-1.5 hover:fill-blue-500 cursor-pointer transition"
              width={18}
              color="gray"
              onClick={() => {
                setFormData((prev) => {
                  if (prev.spu?.skus) {
                    return {
                      ...prev,
                      spu: {
                        ...prev.spu,
                        skus: [
                          ...prev.spu.skus!.slice(0, index),
                          ...prev.spu.skus!.slice(index + 1),
                        ],
                      },
                    };
                  }

                  return prev;
                });
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
          type="link"
          name="link"
          id="link"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.spu?.link as string}
          onChange={(evt: any) => {
            setFormData((prev) => ({
              ...prev,
              spu: {
                ...prev.spu,
                link: evt.target.value,
              },
            }));
          }}
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

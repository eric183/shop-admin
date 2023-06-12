"use client";

import { Modal, Select } from "antd";
import { FormEventHandler, useRef, useState } from "react";
import { GradientButton } from "~components/Buttons";
import ProductModal from "./modal";
import { IProduct } from "~types/product";
import clsx from "clsx";

const CreateButton: React.FC<{
  datasource: IProduct[];
}> = ({ datasource }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IProduct>>({});
  const selectRef = useRef<any>();

  const spu = datasource;

  const keyEnterBinder = (evt: string[]) => {
    const name = evt[0];
    const foundItem = spu.find((item) => item.name === name);

    setFormData((prev) => ({
      ...prev,
      name,
      category: foundItem?.category || "",
      brand: foundItem?.brand || "",
      link: foundItem?.link || "",
    }));

    selectRef.current.blur();
  };

  const formSubitHandler = (evt: any) => {
    evt.preventDefault();
    if (confirmLoading) return;

    setFormData((prev) => ({
      ...prev,
      color: evt.target["attribute_color"].value,
      size: evt.target["attribute_size"].value,
    }));

    // here go set a fetch request to sanity.io

    setConfirmLoading(true);

    setTimeout(() => {
      setConfirmLoading(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <section className="flex justify-end mt-5 mr-5">
      <GradientButton
        onClick={() => {
          setOpen(true);
        }}
      >
        商品添加
      </GradientButton>

      <ProductModal
        title="商品添加"
        open={open}
        confirmLoading={confirmLoading}
        setOpen={setOpen}
        setConfirmLoading={setConfirmLoading}
      >
        <form className="flex flex-col" onSubmit={formSubitHandler}>
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
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="attribute_size"
                id="attribute_size"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="attribute_size"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                码数
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="attribute_color"
                id="attribute_color"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="attribute_color"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                颜色
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="brand"
              name="brand"
              id="brand"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={formData.brand}
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
              name="floating_link"
              id="floating_link"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={formData.link}
              required
            />
            <label
              htmlFor="floating_link"
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
          {/* <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-28 self-end items-center"
          >
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
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            提交
          </button> */}
        </form>
      </ProductModal>
    </section>
  );
};

export default CreateButton;

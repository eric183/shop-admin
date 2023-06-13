"use client";

import { GradientButton } from "~components/Buttons";
import { modalStore } from "./modal";
import { IProduct } from "~types/product";

const CreateButton: React.FC<{
  datasource: IProduct[];
}> = ({ datasource }) => {
  const { setOpen } = modalStore();
  return (
    <section className="flex justify-end mt-5 mr-5">
      {/* <GradientButton className="!bg-blue-700" onClick={aiCreate}>
        商品添加 - AI
      </GradientButton> */}
      <GradientButton
        onClick={() => {
          setOpen(true);
        }}
      >
        商品添加
      </GradientButton>
    </section>
  );
};

export default CreateButton;

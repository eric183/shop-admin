"use client";

import { GradientButton } from "~components/Buttons";
import { modalStore } from "../../components/Layout/Modal";
import { IOrder } from "~types/order";

interface Props {
  datasource: IOrder[];
}

const CreateButton = ({ datasource }: Props) => {
  const { setOpen, setModalType } = modalStore();
  return (
    <section className="flex justify-end mt-5 mr-5">
      {/* <GradientButton className="!bg-blue-700" onClick={aiCreate}>
        商品添加 - AI
      </GradientButton> */}
      <GradientButton
        onClick={() => {
          setOpen(true);
          setModalType("create");
        }}
      >
        订单添加
      </GradientButton>
    </section>
  );
};

export default CreateButton;

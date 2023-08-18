"use client";

import { GradientButton } from "~components/CherryUI/Buttons";
import { IOrder, IOrderCreateSource } from "~types/order";
import clsx from "clsx";
import { FC, useState } from "react";
import BrandOrderForm from "~app/brandOrder/form";
import { useQuery } from "@tanstack/react-query";
import { fetchGlobal } from "~app/api/sanityRest/global";
import { Modal } from "antd";
import { modalStore } from "../Modal";
import { IBrandOrder } from "~types/brandOrder";

interface Props {
  datasource?: IOrderCreateSource;
  className?: string;
}

const OrderCreateButton: FC<Props> = ({ datasource, className }) => {
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const { setModalType, setOrderOpen } = modalStore();

  // console.log(reponseGlobal.data, "....");
  if (reponseGlobal.status !== "success") return null;
  return (
    <section
      className={clsx({
        "flex justify-end mt-5 mr-5": true,
        [className as string]: !!className,
      })}
    >
      {/* <GradientButton className="!bg-blue-700" onClick={aiCreate}>
        商品添加 - AI
      </GradientButton> */}
      <GradientButton
        onClick={() => {
          setOrderOpen(true);
          setModalType("create");
        }}
      >
        新建订单
      </GradientButton>

      <CherryVisionModal>
        <BrandOrderForm
          // createSource={
          //   {
          //     accounts: reponseGlobal.data.accounts,
          //     skus: reponseGlobal.data.skus,
          //     brands: reponseGlobal.data.brands,
          //   } as const as IOrderCreateSource
          // }
          datasource={[]}
        />
      </CherryVisionModal>
    </section>
  );
};

const CherryVisionModal = ({ children, open, setOpen }: any) => {
  const { confirmLoading, setOrderOpen, orderOpen } = modalStore();
  const handleCancel = () => {
    setOrderOpen(false);
  };
  return (
    <Modal
      title={"新建订单"}
      width={800}
      open={orderOpen}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default OrderCreateButton;

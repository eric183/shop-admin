"use client";

import { GradientButton } from "~components/Buttons";
import { IOrder, IOrderCreateSource } from "~types/order";
import clsx from "clsx";
import { FC, useState } from "react";
import BrandOrderForm from "~app/brandOrder/form";
import { useQuery } from "@tanstack/react-query";
import { fetchGlobal } from "~app/api/sanityRest/global";
import { Modal } from "antd";
import { modalStore } from "~components/Layout/Modal";

interface Props {
  datasource?: IOrder[];
  className?: string;
}

const OrderCreateButton: FC<Props> = ({ datasource, className }) => {
  const reponseGlobal = useQuery({
    queryKey: ["global"],
    queryFn: async () => await fetchGlobal(),
  });

  const [open, setOpen] = useState<boolean>(false);
  const { setModalType } = modalStore();

  console.log(reponseGlobal.data, "....");
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
          setOpen(true);
          setModalType("create");
        }}
      >
        订单添加
      </GradientButton>

      <CherryVisionModal setOpen={setOpen} open={open}>
        <BrandOrderForm
          createSource={
            {
              accounts: reponseGlobal.data.accounts,
              skus: reponseGlobal.data.skus,
            } as const as IOrderCreateSource
          }
          datasource={[]}
        />
      </CherryVisionModal>
    </section>
  );
};

const CherryVisionModal = ({ children, open, setOpen }: any) => {
  const { confirmLoading } = modalStore();
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Modal
      title={"新建订单"}
      width={800}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default OrderCreateButton;

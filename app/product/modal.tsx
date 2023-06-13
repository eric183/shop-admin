"use client";

import { Modal } from "antd";

import { useState } from "react";
import { create } from "zustand";
import { sanityClient } from "~base/sanity/client";

export const modalStore = create<{
  open: boolean;
  setOpen: (arg: boolean) => void;
  title: string;
  setTitle: (arg: string) => void;
  confirmLoading: boolean;
  setConfirmLoading: (arg: boolean) => void;
  record: any;
  setRecord: (arg: any) => void;
}>()((set) => ({
  open: false,
  setOpen: (arg: boolean) => set({ open: arg }),
  title: "",
  setTitle: (arg: string) => set({ title: arg }),
  confirmLoading: false,
  setConfirmLoading: (arg: boolean) => set({ confirmLoading: arg }),
  record: {},
  setRecord: (arg: any) => set({ record: arg }),
}));

interface IProductModal {
  [key: string]: any;
}

const ProductModal: React.FC<IProductModal> = ({ children }) => {
  const { open, setOpen, title, confirmLoading } = modalStore();
  const handleCancel = () => {
    setOpen(false);
  };
  console.log(open, "isopen");
  return (
    <Modal
      title={title}
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

export default ProductModal;

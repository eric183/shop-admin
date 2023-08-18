"use client";

import { Modal } from "antd";

import { create } from "zustand";
import { IProduct } from "~types/product";

// any is not good
export const modalStore = create<{
  open: boolean;
  setOpen: (arg: boolean) => void;
  orderOpen: boolean;
  setOrderOpen: (arg: boolean) => void;
  title: string;
  setTitle: (arg: string) => void;
  confirmLoading: boolean;
  setConfirmLoading: (arg: boolean) => void;
  record: any;
  setRecord: (arg: any) => void;
  modalType: "create" | "update";
  setModalType: (arg: "create" | "update") => void;
}>()((set) => ({
  open: false,
  setOpen: (arg: boolean) => set({ open: arg }),
  orderOpen: false,
  setOrderOpen: (arg: boolean) => set({ orderOpen: arg }),
  title: "",
  setTitle: (arg: string) => set({ title: arg }),
  confirmLoading: false,
  setConfirmLoading: (arg: boolean) => set({ confirmLoading: arg }),
  record: {} as any,
  setRecord: (arg: any) => {
    set((state) => ({
      record: { ...arg },
    }));
  },
  modalType: "create",
  setModalType: (arg: "create" | "update") => set({ modalType: arg }),
}));

interface ICherryVisionModal {
  [key: string]: any;
}

const CherryVisionModal: React.FC<ICherryVisionModal> = ({ children }) => {
  const { open, setOpen, title, confirmLoading } = modalStore();
  const handleCancel = () => {
    setOpen(false);
  };
  // console.log(open, "isopen");
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

export default CherryVisionModal;

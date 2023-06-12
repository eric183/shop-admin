"use client";

import { Modal } from "antd";

import { useState } from "react";
import sanityClient from "~base/sanity/client";

interface IProductModal {
  open: boolean;
  title: string;
  confirmLoading: boolean;
  children: React.ReactNode;
  setOpen: (arg: boolean) => void;
  setConfirmLoading: (arg: boolean) => void;
}

const ProductModal: React.FC<IProductModal> = ({
  setOpen,
  open,
  title,
  confirmLoading,
  setConfirmLoading,
  children,
}) => {
  const [modalText, setModalText] = useState<string>("Content of the modal");

  const handleOk = async () => {
    // setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);

    // const document = await sanityClient.fetch(
    //   `*[_type == "spu" && name === $name]{_id}`,
    //   { name }
    // );
    // document.sanityClient.createIfNotExists({
    //   _type: document._id,
    // });

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Modal
      title={title}
      width={800}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
    >
      {/* <p>{modalText}</p> */}

      {children}
    </Modal>
  );
};

export default ProductModal;

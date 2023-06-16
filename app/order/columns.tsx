"use client";

import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { IOrder } from "~types/order";
import { Button, Image } from "antd";
import { useState } from "react";
import { modalStore } from "../../components/Layout/Modal";

const useColumns = () => {
  // const [record, setEditRecord] = useState<IOrder | null>(null);
  const { setOpen, setRecord, setModalType } = modalStore();
  const columns: ColumnsType<IOrder> = [
    
    // {
    //   title: "品牌",
    //   dataIndex: "brand",
    //   key: "brand",
    // },
    // {
    //   title: "商品名",
    //   dataIndex: "name",
    //   key: "name",
    //   render: (text, record) => {
    //     return text;
    //   },
    // },
    // {
    //   title: "链接",
    //   dataIndex: "link",
    //   key: "link",
    //   render: (text, record) => {
    //     return (
    //       <p className="w-60 overflow-hidden whitespace-nowrap">
    //         <Link
    //           href={text}
    //           target="_blank"
    //           className="inline-block truncat text-ellipsis "
    //         >
    //           {text}
    //         </Link>
    //       </p>
    //     );
    //   },
    // },
    // {
    //   title: "操作",
    //   dataIndex: "operation",
    //   key: "operation",
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         <Button
    //           // type="link"
    //           onClick={() => {
    //             setRecord(record);
    //             setOpen(true);
    //             setModalType("update");
    //           }}
    //           className="text-blue-900"
    //         >
    //           编辑
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  return [columns];
};

// const ImagePreviewTool: React.FC<{ images: IOrder["imageURLs"] }> = ({
//   images,
// }) => {
//   const [visible, setVisible] = useState(false);
//   return (
//     <>
//       {images && (
//         <Image
//           preview={{ visible: false }}
//           width={50}
//           alt="Preview Image"
//           src={images[0]?.asset?.url}
//           onClick={() => setVisible(true)}
//         />
//       )}
//       {/* <div style={{ display: "none" }}>
//         <Image.PreviewGroup
//           preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
//         >
//           {images?.map((image, index) => (
//             <Image src={image?.asset?.url} key={index} alt="previewer" />
//           ))}
//         </Image.PreviewGroup>
//       </div> */}
//     </>
//   );
// };

export default useColumns;

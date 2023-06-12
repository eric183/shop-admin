"use client";

import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toYMD, toYMD_Short } from "~base/Timeformat";
import GoogleUploader from "~components/Layout/GoogleUploader";

interface DataType {
  key: string;
  name: string;
  prepare: number;
  left: number;
  fact: number;
  date: string;
  outdate: string;
  // tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "商品 ID",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "预购库存",
    dataIndex: "prepare",
    key: "prepare",
  },
  {
    title: "剩余库存",
    dataIndex: "left",
    key: "left",
  },
  {
    title: "实际库存",
    dataIndex: "fact",
    key: "fact",
  },
  {
    title: "入库日期",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "出库日期",
    dataIndex: "outdate",
    key: "outdate",
  },
  // {
  //   title: "Tags",
  //   key: "tags",
  //   dataIndex: "tags",
  //   render: (_, { tags }) => (
  //     <>
  //       {tags.map((tag) => {
  //         let color = tag.length > 5 ? "geekblue" : "green";
  //         if (tag === "loser") {
  //           color = "volcano";
  //         }
  //         return (
  //           <Tag color={color} key={tag}>
  //             {tag.toUpperCase()}
  //           </Tag>
  //         );
  //       })}
  //     </>
  //   ),
  // },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];

const data: DataType[] = [
  {
    key: "大码女装",
    name: "DarcSports",
    prepare: 62,
    left: 32,
    fact: 1,
    date: toYMD(new Date().toString()),
    outdate: toYMD_Short(new Date().toString()),
    // tags: ["nice", "developer"],
  },
  {
    key: "小码女装",
    name: "csb",
    prepare: 92,
    left: 42,
    fact: 1,
    date: toYMD(new Date().toString()),
    outdate: toYMD_Short(new Date().toString()),
    // tags: ["loser"],
  },
  {
    key: "中码女装",
    name: "Joe Black",
    prepare: 132,
    left: 32,
    fact: 1,
    date: toYMD(new Date().toString()),
    outdate: toYMD_Short(new Date().toString()),
    // tags: ["cool", "teacher"],
  },
];

const Invents = () => {
  return (
    <div className="w-full h-full">
      <GoogleUploader />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Invents;

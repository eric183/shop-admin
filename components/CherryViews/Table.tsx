"use client";

import { Table } from "antd";
import { ColumnGroupType, ColumnProps, ColumnsType } from "antd/es/table";
import { FC } from "react";

interface Props<T extends object> {
  keyIndex: string;
  datasource: T[];
  columns: ColumnsType<T>;
}

const CherryTable = <T extends object>(props: Props<T>) => {
  const { datasource, columns, keyIndex } = props;

  return (
    <div>
      <Table dataSource={datasource} columns={columns} rowKey={keyIndex} />
    </div>
  );
};

export default CherryTable;

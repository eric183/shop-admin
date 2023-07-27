"use client";

import { Table } from "antd";
import { ColumnGroupType, ColumnProps, ColumnsType } from "antd/es/table";
import { FC } from "react";

interface Props<T extends object> {
  keyIndex: string;
  datasource: T[];
  columns: ColumnsType<T>;
  status: string;
}

const CherryTable = <T extends object>(props: Props<T>) => {
  const { datasource, columns, keyIndex, status } = props;

  return (
    <div>
      <Table
        dataSource={datasource}
        columns={columns}
        rowKey={keyIndex}
        loading={status === "loading"}
      />
    </div>
  );
};

export default CherryTable;

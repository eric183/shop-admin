"use client";

import { Table } from "antd";
import { ColumnGroupType, ColumnProps, ColumnsType } from "antd/es/table";
import { FC } from "react";

interface Props<T extends object> {
  datasource: T[];
  columns: ColumnsType<T>;
}

const CherryTable = <T extends object>(props: Props<T>) => {
  const { datasource, columns } = props;

  return (
    <div>
      <Table dataSource={datasource} columns={columns} />
    </div>
  );
};

export default CherryTable;

const RoutePaths: RoutePathesType[] = [
  // {
  //   path: "invents",
  //   linkLabel: "库存管理",
  //   parent: null,
  //   children: [],
  //   sort: 0,
  // },
  {
    path: "product",
    linkLabel: "商品管理",
    parent: null,
    children: [],
    sort: 1,
  },
  {
    path: "order",
    linkLabel: "订单管理",
    parent: null,
    children: [],
    sort: 2,
  },

  // {
  //   path: "GPT",
  //   linkLabel: "GPT",
  //   parent: null,
  //   sort: 0,
  //   children: [],
  // },
];

export interface RoutePathesType {
  path: string;
  // component: string;
  linkLabel: string;
  parent: null | string;
  children: RoutePathesType[];
  sort: number;
}

export default RoutePaths;

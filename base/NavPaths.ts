const RoutePaths: RoutePathesType[] = [
  {
    path: "invents",
    linkLabel: "库存管理",
    parent: null,
    children: [],
    sort: 0,
  },
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
  //   path: "user",
  //   component: "Static",
  //   linkLabel: "用户",
  //   parent: null,
  //   sort: 1,
  //   children: [
  //     {
  //       path: "recruit",
  //       component: "Recruit",
  //       linkLabel: "招聘",
  //       parent: "user",
  //       sort: 0,
  //       children: [],
  //     },
  //     {
  //       path: "hire",
  //       component: "Hire",
  //       linkLabel: "应聘",
  //       parent: "user",
  //       sort: 1,
  //       children: [],
  //     },
  //   ],
  // },
  {
    path: "GPT",
    linkLabel: "GPT",
    parent: null,
    sort: 0,
    children: [],
  },
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

import { IBrandOrder } from "./brandOrder";
import { Inventory } from "./inventory";
import { SPU } from "./product";

export interface IOrder {
  _updatedAt: string;
  finalPayment: number;
  shipments: Shipment[];
  orderStatus: string;
  sortNumber: number;
  _createdAt: string;
  _id: string;
  discount: number;
  deposit: number;
  account: {
    _id: string;
    username: string;
  };
  orderItems: OrderItem[];
}

interface OrderItem {
  _id: string;
  quantity: number;
  sku: Sku;
}

interface Sku {
  _id: string;
  color: string;
  size: string;
  spu: Spu;
}

interface Spu {
  _id: string;
  spuId: string;
  name: string;
  imageURLs: {
    asset: {
      _id: string;
      _ref: string;
      url: string;
    };
  }[];
}

interface Shipment {
  type: string;
  _id: string;
  carrier: string;
  address: string;
  trackingNumber: string;
}

export interface IOrderCreateSource {
  _id: string;
  accounts: Account[];
  globalSkus: Skus[];
  inventories: Inventory[];
  brands: {
    _id: string;
    name: string;
    logo: string;
    spus: Spu[];
  }[];
  skus: Skus[];
  username: null;
}

interface Account {
  _id: string;
  username: string;
}

interface Skus {
  _id: string;
  attribute: Attribute;
  spu: Spu;
}

interface Attribute {
  color: string;
  size: string;
}

// interface Spu {
//   spuId: string;
//   name: string;
// }

export type OrderStatus =
  | "UNPAID"
  | "HALFPAID"
  | "PAID"
  | "SHIPPED"
  | "RECEIVED"
  | "CANCELLED";

export interface IOrderform {
  _id?: string;
  name?: string;
  category?: string;
  brand: IBrandOrder["brand"];
  images: SPU["imageURLs"];
  spu: SPU;
}

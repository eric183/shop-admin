import { Inventory } from "./inventory";
import { IProduct } from "./product";

export interface IBrandOrder {
  _id: string;
  brand: {
    _id: string;
    name: string;
    spus?: IProduct["spu"][];
  };
  userOrders: {
    _id?: string;
    account: {
      _id?: string;
      username?: string;
      _key?: string;
    };
    orderItems: {
      _id?: string;
      _ref?: string;
      quantity: number | string;
      preOrderPrice: number | string;
      isProductionPurchased?: boolean;
      sku: {
        _id?: string;
        color?: string;
        size?: string;
        spuColorSize?: string;
        spu?: {
          _id?: string;
          name: string;
          images?: string[];
        };
        inventory?: Inventory;
      };
    }[];
    discount: number | string;
    finalPayment: number | string;
    deposit: number | string;
    orderStatus: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

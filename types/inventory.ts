import { Brand } from "~app/brandOrder/form";
import { ImageURL } from "./product";

export interface Inventory {
  _id: string;
  remainQuantity: number;
  preQuantity: number;
  actualQuantity: number;
  skuDetail: {
    _id: string;
    brand: Brand;
    productName: string;
    spu: {
      _id: string;
      imageURLs: ImageURL[];
    };
  };
}

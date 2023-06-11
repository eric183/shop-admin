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
  username: string;
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
  name: string;
}

interface Shipment {
  type: string;
  _id: string;
  carrier: string;
  address: string;
  trackingNumber: string;
}

import type { IColumn } from "../Utils/DataBuilder";
import type Cart from "./Cart";
import type User from "./User";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled" | "failed";
export interface ShippingInfo {
  fullName: string,
  email: string, 
  phoneNumber: string,
  address: string,
  area: string,
  postalCode: string
};

export default class Order {
  user: User | string = "";
  cart: Cart | string = "";
  payMethod: "cod" | "paypal" = "cod";
  result: any = null;
  status: OrderStatus = "pending";
  shippingInfo: ShippingInfo = {} as ShippingInfo;
  updatedAt: Date | null = null;
  createdAt: Date | null = null;

  constructor(obj: any) {
    this.user = obj.user;
    this.cart = obj.cart;
    this.payMethod = obj.payMethod || "cod";
    this.result = obj.result || null;
    this.status = obj.status || "pending";
    this.shippingInfo = obj.shippingInfo;
    this.createdAt = obj.createdAt? new Date(obj.createdAt):null;
    this.updatedAt = obj.updatedAt? new Date(obj.updatedAt):null;
  }
};

export const ORDERS_COLUMNS: IColumn[] = [
  {
    name: "UserId",
    id: "user",
    enableColumnFilter: true
  },
  {
    name: "CartId",
    id: "cart",
    enableColumnFilter: true
  },
  {
    name: "Payment Method",
    id: "payMethod",
    enableColumnFilter: true
  },
  {
    name: "Status",
    id: "status",
    enableColumnFilter: true
  },
  {
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: false,
    isDate: true
  },
];
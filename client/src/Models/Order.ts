import type { InputDefs } from "../Context/EditableData";
import { toDateTimeLocalString, type IColumn } from "../Utils/DataBuilder";
import Cart from "./Cart";
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
  id: string = "";
  user: User | string = "";
  cart: Cart | string = "";
  payMethod: "cod" | "paypal" = "cod";
  result: any = null;
  status: OrderStatus = "pending";
  shippingInfo: ShippingInfo = {} as ShippingInfo;
  amount: number = 0;
  updatedAt: Date | null = null;
  createdAt: Date | null = null;

  constructor(obj: any) {
    this.id = obj._id || "";
    this.user = obj.user;
    this.cart = obj.cart;
    if (typeof this.cart == "object") {
      this.cart = new Cart(this.cart);
    }
    this.payMethod = obj.payMethod || "cod";
    this.result = obj.result || null;
    this.status = obj.status || "pending";
    this.amount = obj.amount || 0;
    this.shippingInfo = obj.shippingInfo;
    this.createdAt = obj.createdAt? new Date(obj.createdAt):null;
    this.updatedAt = obj.updatedAt? new Date(obj.updatedAt):null;
  }

  getStatusNumValue() {
    switch (this.status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      case "completed":
        return 5;
      case "cancelled":
      case "failed":
      default:
        return -1;
    }
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
    name: "Method",
    id: "payMethod",
    enableColumnFilter: true
  },
  {
    id: "amount",
    enableColumnFilter: true,
    transform: (data) => {
      return `${Math.trunc(data.amount * 100)/ 100}`;
    },
    isNumber: true
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

export const ORDERS_EDIT_INPUTS: InputDefs<Order> = [
  [
    {
      inputType: "text",
      id: "id",
      label: "Id",
      readOnly: true,
    },
    {
      inputType: "datetime-local",
      id: "createdAt",
      label: "CreatedAt",
      readOnly: true,
      defaultValue: (data) => {
        return toDateTimeLocalString(data.current.createdAt)
      }
    },
    {
      inputType: "datetime-local",
      id: "updatedAt",
      label: "UpdatedAt",
      readOnly: true,
      defaultValue: (data) => {
        return toDateTimeLocalString(data.current.updatedAt)
      }
    }
  ],
  [
    {
      inputType: "text",
      readOnly: true,
      id: "payMethod",
      label: "Payment Method",
    },
    {
      inputType: "number",
      readOnly: true,
      defaultValue: data => {
        return `${Math.trunc((data.current.amount || 0) * 100) / 100}`;
      },
      id: "amount",
      label: "Amount payed",
    },
    {
      inputType: "select",
      id: "status",
      label: "Status",
      defaultValue: data => data.current.status,
      options: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "failed"
      ]
    }
  ]
];

export class OrderQuery {
  populated: boolean = false;
  status: OrderStatus[] | [] = [];
  sort: "asc" | "desc" | "" = "";
  self: boolean = false;

  build() {
    const query = [];
    if (this.populated)
      query.push("populated=1");
    if (this.self)
      query.push("self=1");
    if (this.status.length > 0)
      query.push(`status=${this.status.join(';')}`);
    if (this.sort)
      query.push(`sort=${this.sort}`);
    

    if (query.length == 0) return '';
    return `?${encodeURI(query.join('&'))}`;
  }
}
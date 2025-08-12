import type { IColumn } from "../Utils/DataBuilder";
import type { Product } from "./Product"

export interface CartItem {
  id: string,
  amount: number,
  product?: Product
}

export default class Cart {
  id: string;
  owner: string;
  products: CartItem[];
  status: "done" | "cart";
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(obj: any) {
    this.id = obj._id;
    this.owner = obj.owner;
    this.products = obj.products as CartItem[];
    this.status = obj.status;
    this.createdAt = obj.createdAt? new Date(obj.createdAt):null;
    this.updatedAt = obj.updatedAt? new Date(obj.updatedAt):null;
  }
};

export class Checkout {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  itemsAmount: number;
  total: number;

  constructor(obj: any) {
    this.subtotal = obj.subtotal;
    this.vatRate = obj.vatRate;
    this.vatAmount = obj.vatAmount;
    this.itemsAmount = obj.itemsAmount;
    this.total = obj.total;
  }
}

export const CARTS_COLUMNS: IColumn[] = [
  {
    id: "id",
    enableColumnFilter: true
  },
  {
    id: "owner",
    enableColumnFilter: true
  },
  {
    id: "products",
    enableColumnFilter: true,
    transform: (data: Cart) => {
      return `${data.products.length} Products`;
    }
  },
  {
    id: "status",
    enableColumnFilter: true,
    isNumber: true
  },
  {
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: true,
    isDate: true
  },
];
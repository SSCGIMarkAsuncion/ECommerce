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
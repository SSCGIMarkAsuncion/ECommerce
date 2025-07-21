export default interface Cart {
  id: string,
  owner: string,
  products: CartItem[],
  status: "done" | "cart",
  createdAt: Date,
  updatedAt: Date
};

export function mapToCart(obj: any) {
  return {
    id: obj._id,
    owner: obj.owner,
    products: obj.products as CartItem[],
    status: obj.status,
    createdAt: new Date(obj.createdAt),
    updatedAt: new Date(obj.updatedAt)
  }
}

export interface CartItem {
  id: string,
  amount: number
}
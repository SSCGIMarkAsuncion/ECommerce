import type { Product } from "../Models/Product"
import { MError } from "../Utils/Error";

export default function useCart() {
  const addToCart = (product: Product, amount: number) => {
    console.log("addToCart", product, amount);
    throw new MError("Not Implemented::addToCart");
  };

  const getCarts = async () => {
    throw new MError("Not Implemented");
  }

  return {
    addToCart,
    getCarts
  }
}
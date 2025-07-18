import type { Product } from "../Models/Product"
import { MError } from "../Utils/Error";
const api = import.meta.env.VITE_API;

export default function useCart() {
  const addToCart = async (product: Product, amount?: number) => {
    console.log("addToCart", product, amount);
    const samount = (amount)? `?amount=${amount}`:"";
    const url = `${api}/cart/add/${product.id}${samount}`;
    const res = await fetch(url, {
      credentials: "include"
    });
    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399 ) {
      return resjson;
    }
    throw new MError(resjson);
  };

  const getCarts = async () => {
    throw new MError("Not Implemented");
  }

  return {
    addToCart,
    getCarts
  }
}
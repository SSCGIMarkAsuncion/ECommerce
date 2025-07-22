import { useEffect } from "react";
import { useCartContext } from "../Context/Cart";
import type Cart from "../Models/Cart";
import { mapToCart } from "../Models/Cart";
import { mapToProduct, type Product } from "../Models/Product"
import { MError } from "../Utils/Error";
const api = import.meta.env.VITE_API;

export default function useCart() {
  const { cartDispatcher } = useCartContext();

  const addToCart = async (product: Product, amount: number): Promise<Cart> => {
    console.log("addToCart", product, amount);

    const samount = `?amount=${amount}`;
    const url = `${api}/cart/add/${product.id}/${samount}`;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include"
    });
    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399 ) {
      const mappedCart = mapToCart(resjson);
      cartDispatcher({
        type: "assign",
        cart: mappedCart,
      });
      return mappedCart;
    }
    throw new MError(resjson);
  };

  const getCarts = async (includeProductInfo?: boolean) => {
    const include = (includeProductInfo)? "?withProduct=1":"";
    const url = `${api}/cart/${include}`;
    const res = await fetch(url, {
      credentials: "include"
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      const cart = mapToCart(resjson);
      if (includeProductInfo) {
        const newProducts = cart.products.map((product) => {
          const np = mapToProduct((product.product as any)[0]);
          return { ...product, product: np };
        });
        cart.products = newProducts;
      }
      return cart;
    }
    throw new MError(resjson);
  }

  const getCartsAndSetCarts = (includeProductInfo?: boolean) => {
    useEffect(() => {
      getCarts(includeProductInfo)
        .then((cart) => {
          cartDispatcher({
            type: "assign",
            cart
          });
        })
        .catch((e) => console.log(e));
    }, []);
  };

  return {
    addToCart,
    getCarts,
    getCartsAndSetCarts
  }
}
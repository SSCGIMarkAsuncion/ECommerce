import { useEffect } from "react";
import { useCartContext } from "../Context/Cart";
import Cart, { Checkout } from "../Models/Cart";
import { Product } from "../Models/Product"
import { MError } from "../Utils/Error";
const api = import.meta.env.VITE_API;

export default function useCart() {
  const { cartDispatcher } = useCartContext();

  const addToCart = async (product: Product, amount: number): Promise<Cart> => {
    const samount = `?amount=${amount}`;
    const url = `${api}/cart/add/${product.id}/${samount}`;
    const res = await fetch(url, {
      method: "PUT",
      credentials: "include"
    });
    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399 ) {
      const mappedCart = new Cart(resjson);
      cartDispatcher({
        type: "assign",
        cart: mappedCart,
      });
      return mappedCart;
    }
    throw new MError(resjson);
  };

  const removeFromCart = async (product: Product) => {
    return addToCart(product, 0);
  };

  // rename to getCart
  const getCarts = async (includeProductInfo?: boolean) => {
    const include = (includeProductInfo)? "?withProduct=1":"";
    const url = `${api}/cart/${include}`;
    const res = await fetch(url, {
      credentials: "include"
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      if (!resjson) return null;
      const cart = new Cart(resjson);
      if (includeProductInfo) {
        const newProducts = cart.products.map((product) => {
          const np = new Product(product.product);
          return { ...product, product: np };
        });
        cart.products = newProducts;
      }
      return cart;
    }
    throw new MError(resjson);
  };

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

  const getBreakdown = async () => {
    const res = await fetch(`${api}/cart/breakdown`,{
      credentials: "include"
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399 ) {
      return new Checkout(resjson);
    }
    throw new MError(resjson);
  };

  const getAllCarts = async () => {
    const url = `${api}/cart/all`;
    const res = await fetch(url, {
      credentials: "include"
    });

    const resjson = await res.json() as any[];
    if (res.status >= 200 && res.status <= 399 ) {
      const carts = resjson.map((item) => new Cart(item));
      return carts;
    }
    throw new MError(resjson);
  };

  const deleteCart = async (cart: Cart) => {
    const url = `${api}/cart/delete/${cart.id}`;
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.status >= 200 && res.status <= 399 ) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  };

  return {
    addToCart,
    getCarts,
    getCartsAndSetCarts,
    removeFromCart,
    getBreakdown,
    getAllCarts,
    deleteCart
  }
}
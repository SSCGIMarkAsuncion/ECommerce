import { createContext, useContext, useEffect, useReducer, useState, type ActionDispatch, type ReactNode } from "react";
import type Cart from "../Models/Cart";
import type { Product } from "../Models/Product";
import useCart from "../Hooks/useCart";
import { useUserContext } from "./User";
import Loading from "../Components/Loading";
import { useNotification } from "./Notify";

const CartContext = createContext<Cart | null>(null);
const CartContextDispatcher = createContext<ActionDispatch<[action: CartContextAction]> | null>(null);

export function useCartContext() {
  return {
    cart: useContext(CartContext),
    cartDispatcher: useContext(CartContextDispatcher)!
  };
}

export function CartContextProvider({ children, withProductInfo = false }: { children: ReactNode, withProductInfo?: boolean }) {
  const [ initial, dispatcher ] = useReducer(reducer, null);
  const [ loading, setLoading ] = useState(true);
  const { user } = useUserContext();
  const { getCarts } = useCart();
  const notify = useNotification();

  useEffect(() => {
    async function a() {
      setLoading(true);
      try {
        const cart = await getCarts(withProductInfo)
        dispatcher({
          type: "assign",
          cart
        });
      }
      catch(e) {
        if (e instanceof Error) {
          notify("error", e.message)
        }
        else {
          notify("error", String(e));
        }
      }
      setLoading(false);
    }
    if (!user) {
      dispatcher({
        type: "remove", cart: null
      });
      return;
    }
    a();
  }, [user]);

  return <CartContext.Provider value={initial}>
    <CartContextDispatcher.Provider value={dispatcher}>
      {children}
    </CartContextDispatcher.Provider>
  </CartContext.Provider>
}

export interface CartContextAction {
  type: "assign" | "remove",
  cart: Cart | null,
};

function reducer(prev: Cart | null, action: CartContextAction) {
  switch (action.type) {
    case "assign":
      if (prev && action.cart) {
        const map: any = {};
        prev.products.forEach((cartItem) => {
          map[cartItem.id] = cartItem;
        });

        const mappedProducts = action.cart.products.map((cartItem) => {
          const mapItem = map[cartItem.id];
          if (!mapItem) {
            return cartItem;
          }
          return {
            id: cartItem.id,
            amount: cartItem.amount,
            product: (cartItem.product || mapItem.product) as (Product | undefined)
          };
        });

        action.cart.products = mappedProducts;
      }
      return action.cart;
    case "remove":
      return null;
  }
  return prev;
}
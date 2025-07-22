import { createContext, useContext, useReducer, type ActionDispatch, type ReactNode } from "react";
import type Cart from "../Models/Cart";
import type { Product } from "../Models/Product";

const CartContext = createContext<Cart | null>(null);
const CartContextDispatcher = createContext<ActionDispatch<[action: CartContextAction]> | null>(null);

export function useCartContext() {
  return {
    cart: useContext(CartContext),
    cartDispatcher: useContext(CartContextDispatcher)!
  };
}

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [ initial, dispatcher ] = useReducer(reducer, null);

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
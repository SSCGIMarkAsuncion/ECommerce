import { createContext, useContext, useReducer, type ActionDispatch, type ReactNode } from "react";
import type Cart from "../Models/Cart";

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
  type: "assign" | "remove" | "edit",
  cart: Cart | null,
};

function reducer(prev: Cart | null, action: CartContextAction) {
  switch (action.type) {
    case "assign":
      return action.cart;
    case "remove":
      return null;
  }
  return prev;
}
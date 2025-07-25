import type { HTMLProps } from "react";
import { useCartContext } from "../Context/Cart";
import useCart from "../Hooks/useCart";
import type { Product } from "../Models/Product";
import type { ButtonProps } from "./Button";
import Button from "./Button";
import { IconTrash } from "../Utils/SVGIcons";

export interface ButtonCartProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

export function ButtonCart({ product, ...props }: ButtonCartProps) {
  const { cart } = useCartContext();
  const { addToCart } = useCart();
  // console.log(cart?.products, product);
  const cartItem = cart?.products.filter((item) => {
    return item.id == product.id;
  })[0];

  return <Btn className="fraunces-regular w-full mt-4"
    cartAmount={cartItem?.amount}
    onChangeCartAmount={(newAmount: number) => {
      addToCart(product, newAmount);
    }}
    onClick={(e) => {
      e.stopPropagation();
      addToCart(product, 1);
    }}>
    {props.children || "Add to cart"}
  </Btn>
}

export function ButtonCartDelete({ product, ...props }: ButtonCartProps) {
  const { removeFromCart } = useCart();

  return <Button
   onClick={(e) => {
    e.stopPropagation();
    removeFromCart(product);
   }}
   pType="icon" pColor="red" className={props.className}>
    <IconTrash className="fill-red-800"/>
  </Button>
}

interface BtnProps extends ButtonProps {
  cartAmount?: number,
  onChangeCartAmount?: (amount: number) => void
};

function Btn(props: BtnProps) {
  const amount = props.cartAmount || 0;
  if (amount >= 1) {
    return <div className={`flex gap-1 justify-between items-center ${props.className}`}>
      <Button className="aspect-square" onClick={() => {
        if (props.onChangeCartAmount)
          props.onChangeCartAmount(amount-1);
      }}>-</Button>
      {amount}
      <Button className="aspect-square" onClick={() => {
        if (props.onChangeCartAmount)
          props.onChangeCartAmount(amount+1);
      }}
      >+</Button>
    </div>
  }

  const btnProps = {
    ...props,
  };
  delete btnProps.cartAmount;
  delete btnProps.onChangeCartAmount;
  return <Button
    {...btnProps}>
    {props.children}
  </Button>
}
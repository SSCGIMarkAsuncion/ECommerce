import type { HTMLProps } from "react";
import type { CartItem } from "../Models/Cart";
import { Card } from "./Card";
import { ButtonCart } from "./CartButton";
import Skeleton from "./Skeleton";

export interface CartItemProps extends HTMLProps<HTMLDivElement> {
  cartItem: CartItem
};

export default function CartItem(props: CartItemProps) {
  if (!props.cartItem.product) {
    return <Skeleton className="w-full h-[150px]" />
  }

  const product = props.cartItem.product!;

  // console.log(product);
  return <Card className="fraunces-regular flex flex-col gap-2 md:flex-row md:items-center">
    <img src={product.imgs[0]} alt="/Logo.svg" className="max-h-[200px] max-w-auto md:max-h-auto md:max-w-[200px]" />
    <p className="max-w-[initial] md:max-w-[25vw] text-wrap">{product.name}</p>
    <div className="flex-1"></div>
    <div className="ml-auto md:ml-[initial] p-2">
      <ButtonCart product={product} />
    </div>
  </Card>
}
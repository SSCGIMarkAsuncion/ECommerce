import type { HTMLProps } from "react";
import type { CartItem } from "../Models/Cart";
import { Card } from "./Card";
import { ButtonCart, ButtonCartDelete } from "./CartButton";
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
  return <Card className="relative fraunces-regular flex gap-2 md:items-center text-2xl h-[200px]">
    <img src={product.imgs[0]} alt="/Logo.svg" className="w-auto h-full" />
    <div className="h-full flex flex-col gap-1 flex-1">
      <h1 className="max-w-[initial] md:max-w-[25vw] text-wrap my-4">{product.name}</h1>
      <div className="flex-1"></div>
      <div className="text-3xl md:text-2xl w-full md:w-[8em] md:ml-auto p-2">
        <ButtonCart product={product} className="mt-auto"/>
      </div>
    </div>
    <ButtonCartDelete product={product} className="w-8 h-8 absolute top-2 right-2" />
  </Card>
}
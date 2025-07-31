import type { HTMLProps } from "react";
import type { CartItem } from "../Models/Cart";
import { Card } from "./Card";
import { ButtonCart, ButtonCartDelete } from "./CartButton";
import Price from "./Price";
import Img from "./Img";

export interface CartItemProps extends HTMLProps<HTMLDivElement> {
  cartItem: CartItem
};

export default function CartItem(props: CartItemProps) {
  if (!props.cartItem.product) {
    return null;
  }

  const product = props.cartItem.product!;

  return <Card className="relative aspect-[9/5] h-[200px] fraunces-regular flex gap-2 text-md md:text-lg">
    <div className="w-[35%] md:w-[30%] bg-gray-100">
      <Img src={product.imgs[0]} className="m-auto w-auto h-full" />
    </div>
    <div className="h-full flex flex-col gap-1 flex-1">
      <div className="py-2">
        <p className="text-wrap my-4">{product.name}</p>
      </div>
      <div className="flex-1"></div>
      <Price price={product.price} promoPrice={product.discount} />
      <div className="w-full md:w-[8em] pb-2">
        <ButtonCart product={product} className="mt-auto"/>
      </div>
    </div>
    <ButtonCartDelete product={product} className="size-7 absolute top-2 right-2" />
  </Card>
}
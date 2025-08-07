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
  const invalid = product.stocks < props.cartItem.amount;

  return <Card className={`fraunces-regular relative aspect-[9/5] h-[200px] fraunces-regular flex gap-2 text-md md:text-lg ${invalid? "bg-red-200!":""}`}>
    <div className="w-[35%] md:w-[30%] bg-gray-100">
      <Img src={product.imgs[0]} className="m-auto w-auto h-full" />
    </div>
    <div className="h-full flex flex-col gap-1 flex-1">
      <div className="py-2">
        <p className="text-wrap mt-4">{product.name}</p>
        <p className="text-wrap mb-4 text-primary-900/80">Stock: {product.stocks}</p>
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
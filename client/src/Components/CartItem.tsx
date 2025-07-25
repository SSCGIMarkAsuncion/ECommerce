import type { HTMLProps } from "react";
import type { CartItem } from "../Models/Cart";
import { Card } from "./Card";
import { ButtonCart, ButtonCartDelete } from "./CartButton";

export interface CartItemProps extends HTMLProps<HTMLDivElement> {
  cartItem: CartItem
};

export default function CartItem(props: CartItemProps) {
  if (!props.cartItem.product) {
    return null;
  }

  const product = props.cartItem.product!;
  const hasSalePrice = Boolean(product.salePrice);

  return <Card className="relative fraunces-regular flex gap-2 md:items-center text-xl h-[200px]">
    <img src={product.imgs[0]} alt="/Logo.svg" className="w-auto h-full" />
    <div className="h-full flex flex-col gap-1 flex-1">
      <div className="py-2">
        <p className="text-md">
          <span className={`${hasSalePrice? "line-through":""}`}>PHP {product.price}</span>
          &nbsp;{hasSalePrice? "PHP":""} {product.salePrice}
        </p>
        <p className="text-wrap my-4">{product.name}</p>
      </div>
      <div className="flex-1"></div>
      <div className="text-3xl md:text-2xl w-full md:w-[8em] md:ml-auto p-2">
        <ButtonCart product={product} className="mt-auto"/>
      </div>
    </div>
    <ButtonCartDelete product={product} className="w-8 h-8 absolute top-2 right-2" />
  </Card>
}
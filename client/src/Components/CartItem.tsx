import type { HTMLProps } from "react";
import type { CartItem } from "../Models/Cart";
import { Card } from "./Card";
import { ButtonCart, ButtonCartDelete } from "./CartButton";
import Price from "./Price";
import Img from "./Img";
import { useNavigate } from "react-router";

export interface CartItemProps extends HTMLProps<HTMLDivElement> {
  cartItem: CartItem,
  readOnly?: boolean
};

export default function CartItem({ readOnly = false, ...props }: CartItemProps) {
  const navigate = useNavigate();
  if (!props.cartItem.product) {
    return null;
  }

  const product = props.cartItem.product!;
  const invalid = product.stocks < props.cartItem.amount;

  console.log(props.cartItem, product);
  return <Card
    className={`fraunces-regular relative p-0! aspect-[9/5] h-[180px] grid grid-cols-4 gap-2 text-md md:text-lg ${invalid ? "bg-red-200!" : ""}`}
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/product/${product.id}`)
    }}>
    <div className="col-span-1 bg-gray-100 h-[inherit] p-1">
      <Img src={product.imgs[0]} className="m-auto w-auto h-full object-cover border-2 border-primary-900" />
    </div>
    <div className="h-full flex flex-col gap-1 col-span-3">
      <div className="py-2">
        <p className="mt-4 truncate">{product.name}</p>
        <p className="text-primary-900/80 text-sm">Qty: {props.cartItem.amount}</p>
        <p className="text-primary-900/80 text-sm">Stock: {product.stocks}</p>
      </div>
      <div className="flex-1"></div>
      <Price price={product.price} promoPrice={product.discount} />
      <div hidden={readOnly} className="w-full md:w-[8em] pb-2">
        <ButtonCart product={product} className="mt-auto" />
      </div>
    </div>
    {!readOnly &&
      <ButtonCartDelete product={product} className="size-7 absolute top-2 right-2" />
    }
  </Card>
}
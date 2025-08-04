import type { HTMLProps } from "react"
import type { Product } from "../Models/Product"
import { Card } from "./Card"
import Img from "./Img"
import Price from "./Price"
import { ButtonCart } from "./CartButton"
import { useNavigate } from "react-router"

export interface ProductItemProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

export function ProductItem({ product, ...props}: ProductItemProps) {
  const navigation = useNavigate();
  return <Card {...props} className="w-full flex flex-col animate-appear relative" onClick={(e) => {
    e.stopPropagation();
    navigation(`/product/${product.id}`);
  }}>
    <Img src={product.imgs[0]} className="w-full h-[100px] md:h-[200px] object-cover"/>
    <div className="fraunces-regular p-2 text-sm flex flex-col flex-1 gap-4">
      <p className="text-wrap text-primary-950">{product.name}</p>
      <p className="text-wrap text-xs text-primary-950">Stock: {product.stocks}</p>
      <div className="mt-auto">
        <Price price={product.price} promoPrice={product.discount} promoTextSize="text-xs" className="font-medium text-right"/>
        <ButtonCart product={product} />
      </div>
    </div>
    {
      product.discount > 0 &&
      <div className="aspect-square w-8 flex items-center justify-center bg-primary-900 text-white absolute top-2 left-2 shadow-sm/75 shadow-black">
        <p className="my-auto font-bold">%</p>
      </div>
    }
  </Card>
}
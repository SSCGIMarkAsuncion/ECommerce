import type { HTMLProps } from "react";
import { toCurrency } from "../Utils/Currency";

export interface PriceProps extends HTMLProps<HTMLParagraphElement> {
  price: number,
  promoPrice: number | null,
  promoTextSize?: string,
};

export default function Price({ price, promoPrice, promoTextSize = "text-sm",...props }: PriceProps) {
  // *100 to move decimal and truncate then /100 to put decimal back to its place
  const discountedPrice = (promoPrice)? Math.trunc((price * (1-promoPrice/100))*100)/100:0;
  const hasDiscount = promoPrice && promoPrice > 0;

  return <p className={`fraunces-regular text-primary-950 ${props.className}`}>
    { hasDiscount? <> <span className={`align-top line-through ${promoTextSize}`}>{toCurrency(price)}</span></>:<></> }
    <span>{toCurrency(hasDiscount? discountedPrice:price)}</span>
  </p>
}
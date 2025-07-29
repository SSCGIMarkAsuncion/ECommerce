import type { HTMLProps } from "react";

export interface PriceProps extends HTMLProps<HTMLParagraphElement> {
  price: number,
  promoPrice: number | null,
  promoTextSize?: string,
};

export default function Price({ price, promoPrice, promoTextSize = "text-sm",...props }: PriceProps) {
  return <p className={`fraunces-regular text-primary-950 ${props.className}`}>
    { promoPrice && <> <span className={`align-top line-through ${promoTextSize}`}>PHP {price}</span></> }
    <span>PHP {promoPrice? promoPrice:price}</span>
  </p>
}
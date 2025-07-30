import type { HTMLProps } from "react";

export interface PriceProps extends HTMLProps<HTMLParagraphElement> {
  price: number,
  promoPrice: number | null,
  promoTextSize?: string,
};

export default function Price({ price, promoPrice, promoTextSize = "text-sm",...props }: PriceProps) {
  const discountedPrice = (promoPrice)? price * (promoPrice/100):0;

  return <p className={`fraunces-regular text-primary-950 ${props.className}`}>
    { promoPrice && <> <span className={`align-top line-through ${promoTextSize}`}>PHP {price}</span></> }
    <span>PHP {promoPrice? discountedPrice:price}</span>
  </p>
}
import type { HTMLProps, ReactNode } from "react";

export interface PriceProps extends HTMLProps<HTMLParagraphElement> {
  price: number,
  promoPrice: number | null,
};

export default function Price({ price, promoPrice,...props }: PriceProps) {
  return <p className={`fraunces-regular text-primary-950 ${props.className}`}>
    { promoPrice && <> <span className="align-top line-through text-sm">PHP {price}</span></> }
    <span>PHP {promoPrice? promoPrice:price}</span>
  </p>
}
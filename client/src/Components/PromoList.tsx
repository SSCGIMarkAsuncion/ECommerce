import React from "react";
import type { Product } from "../Models/Product";
import Skeleton from "./Skeleton";
import { ButtonCart } from "./CartButton";
import { BgSkewedRect } from "../Utils/SVGIcons";
import Price from "./Price";

export interface PromoListProps extends React.HTMLProps<HTMLDivElement> {
  promos: Product[]
};

export interface PromoProps extends React.HTMLProps<HTMLDivElement> {
  promo: Product,
  index: number
};

export default function PromoList(props: PromoListProps) {
  return <div className="p-2 flex flex-col gap-8">
  {
    (props.promos.length == 0)?
      ((new Array(4)).fill(null)).map((_,i) => {
        return <Skeleton key={i} className="w-full h-[30vw] bg-primary-100"/>
      })
      :props.promos.map((promo, i) => {
        return <PromoItem key={promo.id} promo={promo} index={i} />
      })
  }
  </div>
}

export function PromoItem(props: PromoProps) {
  console.assert(props.promo.discount != undefined);
  const isLeft = props.index % 2 === 0;
  const textAlign = isLeft? "text-initial":"text-right";
  const percentOff = Math.trunc(100 - (props.promo.discount!/props.promo.price * 100));

  return <div className="w-full sm:w-[90%] lg:w-[70%] m-auto">
    <h2 className={`fraunces-regular text-3xl tracking-wide text-primary-950 mb-2 ${textAlign} font-semibold`}>{props.promo.name}</h2>
    <div className={`mb-4 block md:flex md:gap-2 ${isLeft? "flex-row":"flex-row-reverse"}`}>

      <div className="p-8 relative">
        <BgSkewedRect className="absolute top-[50%] left-[50%] translate-[-50%] aspect-[3/4] size-[18em] sm:size-[28em]"/>
        <img src={props.promo.imgs[0]} alt="/Logo.svg" className={`aspect-[3/4]! max-w-[190px] sm:max-w-[320px] ${!isLeft? "rotate-3":"rotate-[-3deg]"} object-cover m-auto shadow-xs shadow-black`} />
      </div>

      <div className={`md:flex flex-col md:justify-center text-lg md:text-xl lg:text-2xl ${textAlign}`}>
        <Price price={props.promo.price} promoPrice={props.promo.discount} />
        <p className={`fraunces-regular text-md md:text-lg lg:text-xl mb-2 text-primary-950`}>
          {props.promo.description}
        </p>
        {/* <div className="mt-auto hidden md:block w-full"></div> */}
        <div className={`text-lg w-full ${isLeft? "":"flex justify-end"}`}>
          <ButtonCart product={props.promo} className="max-w-[15em] md:max-w-auto mt-4">{`${percentOff}% Off Order now`}</ButtonCart>
        </div>
      </div>

    </div>
  </div>
}
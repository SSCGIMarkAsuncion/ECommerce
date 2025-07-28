import React from "react";
import type { Product } from "../Models/Product";
import Skeleton from "./Skeleton";
import { ButtonCart } from "./CartButton";

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
        return <Promo key={promo.id} promo={promo} index={i} />
      })
  }
  </div>
}

export function Promo(props: PromoProps) {
  console.assert(props.promo.salePrice != undefined);
  const isLeft = props.index % 2 === 0;
  const textAlign = isLeft? "text-initial":"text-right";
  const percentOff = Math.trunc(100 - (props.promo.salePrice!/props.promo.price * 100));

  return <div className="md:w-[90%] lg:w-[70%] md:m-auto">
    <h2 className={`fraunces-regular text-3xl text-primary-950 mb-2 ${textAlign} font-semibold`}>{props.promo.name}</h2>
    <div className={`md:flex md:gap-2 ${isLeft? "flex-row":"flex-row-reverse"}`}>

      <div className={`w-full my-4 md:my-0`}>
        <img src={props.promo.imgs[0]} className="w-[50%] md:w-[40vw] lg:w-[30vw] m-auto shadow-xs/30 shadow-black" />
      </div>

      <div className={`md:flex flex-col text-lg md:text-xl lg:text-2xl ${textAlign}`}>
        <p className={`fraunces-regular mb-2 text-primary-950`}>
          <span className="line-through">PHP {props.promo.price}</span>&nbsp;PHP {props.promo.salePrice}
        </p>
        <p className={`fraunces-regular text-md md:text-lg lg:text-xl mb-2 text-primary-950`}>
          {props.promo.description}
        </p>
        {/* <div className="mt-auto hidden md:block w-full"></div> */}
        <div className={`text-lg w-full ${isLeft? "":"flex justify-end"}`}>
          <ButtonCart product={props.promo}>{`${percentOff}% Off Order now`}</ButtonCart>
        </div>
      </div>
    </div>
  </div>
}
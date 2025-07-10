import React from "react";
import type { Product } from "../Models/Product";
import Button from "./Button";
import Skeleton from "./Skeleton";

export interface PromoListProps extends React.HTMLProps<HTMLDivElement> {
  promos: Product[]
};

export interface PromoProps extends React.HTMLProps<HTMLDivElement> {
  promo: Product,
  index: number
};

export default function PromoList(props: PromoListProps) {
  return <div className="p-2 flex flex-col gap-4">
  {
    (props.promos.length == 0)?
      ((new Array(4)).fill(null)).map((_,i) => {
        return <Skeleton key={i} className="w-full h-[200px] bg-primary-100"/>
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

  return <div>
    <h2 className={`fraunces-regular text-3xl text-primary-950 mb-2 ${textAlign} font-semibold`}>{props.promo.name}</h2>
    <div className="w-full my-4">
      <img src={props.promo.imgs[0]} className="w-[50%] m-auto shadow-xs/30 shadow-black" />
    </div>
    <p className={`fraunces-regular text-lg mb-2 text-primary-950 ${textAlign}`}>
      <span className="line-through">PHP {props.promo.price}</span>&nbsp;PHP {props.promo.salePrice}
    </p>
    <p className={`fraunces-regular text-md mb-2 text-primary-950 ${textAlign}`}>
      {props.promo.description}
    </p>
    <div className={`w-full ${isLeft? "":"flex justify-end"}`}>
      <Button className="fraunces-regular">{`${percentOff}% Off Order now`}</Button>
    </div>
  </div>
}
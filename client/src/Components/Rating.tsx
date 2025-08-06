import type { HTMLProps, ReactNode } from "react";
import { IconStar } from "../Utils/SVGIcons";

export interface RatingProps extends Omit<HTMLProps<HTMLDivElement>, "onRateChange"> {
  editable?: boolean,
  rate: number
  max?: number
  starClass?: string,
  onRateChange?: (rate: number) => void
};

export default function Rating({ editable = false, starClass, onRateChange, max = 5, rate, ...props}: RatingProps) {
  const stars: ReactNode[] = [];
  for (let i=0;i<max;i++) {
    let toggle = null;
    if (editable) {
      toggle = (active: boolean) => {
        if (!onRateChange) return;
        if (!active && rate == i+1) {
          return onRateChange(i);
        }
        onRateChange(i+1);
      };
    }
    stars.push(
      <Star key={i} className={starClass} active={i+1<=rate} onSToggle={toggle || undefined} />
    );
  }

  return <div {...props} className={`flex gap-1 ${props.className}`}>
    { stars.map((item) => item) }
  </div>
}

interface StarProps extends HTMLProps<HTMLElement> {
  active: boolean,
  onSToggle?: (active: boolean) => void
};

function Star({ active, onSToggle, ...props }: StarProps) {
  return <div onClick={(e) => {
    e.stopPropagation();
    if (onSToggle)
      onSToggle(!active);
  }}>
    <IconStar {...props} className={`${onSToggle? "hover:brightness-75":""} ${props.className} ${active ? "fill-amber-400" : "fill-gray-400"}`} />
  </div>
}
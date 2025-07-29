import type React from "react";
import { Theme, type ButtonColorStyles, type ButtonType } from "../Utils/Theme";
import { IconCaretDown, IconSort, IconSpinner } from "../Utils/SVGIcons";
import { useNavigate } from "react-router";
import { useEffect, useState, type ReactNode } from "react";
import { type SortType } from "../Hooks/useProducts";

type HTMLButtonTypes = "button" | "submit" | "reset" | undefined;

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  pColor?: ButtonColorStyles,
  pType?: ButtonType,
  loading?: boolean
};

export default function Button({ pColor, pType, loading,...props }: ButtonProps) {
  const navigate = useNavigate();
  // console.log(props);
  let style = Theme.button[pType || "filled"][pColor || "primary"];
  let rounded = pType == "icon"? "rounded-full":Theme.rounded;
  let padding = pType == "icon"? "p-2":"px-3 py-2";

  const type: HTMLButtonTypes = (props.type || "button") as HTMLButtonTypes;
  const btn = <button
   {...props}
   type={type}
   onClick={props.onClick}
   className={`cursor-pointer font-medium
    flex items-center justify-center gap-2
    ${Theme.button.disabled}
    ${padding} ${rounded} ${style} ${Theme.transition} ${props.className || ""}`}
    disabled={(props.disabled == undefined)? Boolean(loading):Boolean(props.disabled)}>
    { props.children || "" }
    { loading && <IconSpinner className="h-5 w-5"/> }
  </button>

  if (props.href) {
    return <a href={props.href} onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(props.href!);
    }} className={props.className}>{btn}</a>
  }
  return <>{btn}</>
}

export interface ToggleProps extends ButtonProps {
  onBtnToggle?: (active: boolean) => void
  initial?: boolean
};

export function Toggle({ children, initial, onBtnToggle, ...props }: ToggleProps) {
  const [ active, setActive ] = useState(initial || false);

  useEffect(() => {
    if (onBtnToggle)
      onBtnToggle(active);
  }, [active]);

  return <Button
   {...props}
   pColor={`${active? "primary":"nonePrimary"}`} className={`py-0! px-1! ${props.className}`}
   onClick={(e) => {
    e.stopPropagation();
    setActive(v => !v);
   }}>
    {children}
  </Button>
}

export interface SortButtonProps extends ButtonProps {
  onBtnToggle?: (sortType: SortType) => void
  sortValue: SortType | null
};

export function SortButton({ children, sortValue, onBtnToggle, ...props }: SortButtonProps) {

  const iconFill = "fill-primary-900";
  let icon = <IconSort className={`size-3 ${iconFill}`} />
  if (sortValue == "asc") {
    icon = <IconCaretDown className={`size-3 rotate-180 ${iconFill}`}/>
  }
  else if (sortValue == "desc") {
    icon = <IconCaretDown className={`size-3 ${iconFill}`} />
  }

  return <Button
   {...props}
   pColor="nonePrimary" className={`py-0! px-1! ${props.className}`}
   onClick={(e) => {
    e.stopPropagation();
    if(!onBtnToggle) return;
    if (sortValue==null) {
      return onBtnToggle("asc");
    }
    else if(sortValue=="asc") {
      return onBtnToggle("desc");
    }
    else {
      return onBtnToggle("asc");
    }
   }}>
    {children}
    {icon}
  </Button>
}
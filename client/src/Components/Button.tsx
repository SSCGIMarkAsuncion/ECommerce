import type React from "react";
import { Theme, type ButtonColorStyles, type ButtonType } from "../Utils/Theme";
import { IconSpinner } from "../Utils/SVGIcons";

type HTMLButtonTypes = "button" | "submit" | "reset" | undefined;

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  pColor?: ButtonColorStyles,
  pType?: ButtonType,
  loading?: boolean
};

export default function Button({ pColor, pType, loading,...props }: ButtonProps) {
  // console.log(props);
  let style = Theme.button[pType || "filled"][pColor || "primary"];
  let rounded = pType == "icon"? "rounded-full":Theme.rounded;
  let padding = pType == "icon"? "p-2":"px-3 py-2";

  const type: HTMLButtonTypes = (props.type || "button") as HTMLButtonTypes;
  return <button
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
}

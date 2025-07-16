import type React from "react";
import { Theme, type ButtonColorStyles, type ButtonType } from "../Utils/Theme";
import { IconSpinner } from "../Utils/SVGIcons";

type HTMLButtonTypes = "button" | "submit" | "reset" | undefined;

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  pColor?: ButtonColorStyles,
  pType?: ButtonType,
  loading?: boolean
};

export default function Button(props: ButtonProps) {
  // console.log(props);
  let style = Theme.button[props.pType || "filled"][props.pColor || "primary"];
  let rounded = props.pType == "icon"? "rounded-full":Theme.rounded;
  let padding = props.pType == "icon"? "p-2":"px-3 py-2"

  const type: HTMLButtonTypes = (props.type || "button") as HTMLButtonTypes;
  return <button type={type}
   onClick={props.onClick}
   className={`cursor-pointer font-medium
    flex items-center justify-center gap-2
    ${Theme.button.disabled}
    ${padding} ${rounded} ${style} ${Theme.transition} ${props.className || ""}`}
    disabled={(props.disabled == undefined)? Boolean(props.loading):Boolean(props.disabled)}>
    { props.children || "" }
    { props.loading && <IconSpinner className="h-5 w-5"/> }
  </button>
}

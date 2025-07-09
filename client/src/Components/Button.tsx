import type React from "react";
import { Theme, type ButtonColorStyles } from "../Utils/theme";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  pColor?: ButtonColorStyles,
  pType?: "filled" | "outline",
  isLoading?: boolean
};

export default function Button(props: ButtonProps) {
  // console.log(props);
  let style = Theme.button[props.pType || "filled"][props.pColor || "primary"];

  return <button type="button"
   className={`cursor-pointer px-3 py-2 rounded-xs font-medium ${style} ${Theme.transition} ${props.className || ""}`}>
    { props.children || "" }
  </button>
}
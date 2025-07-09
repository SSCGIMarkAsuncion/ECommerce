import type React from "react";
import { Theme, type ButtonColorStyles, type ButtonType } from "../Utils/Theme";
import { IconSpinner } from "../Utils/SVGIcons";

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
  let centerChild = props.pType == "icon"? "flex align-center justify-center":"";

  return <button type="button"
   className={`cursor-pointer font-medium
    flex items-center gap-2 
    ${Theme.button.disabled}
    ${centerChild} ${padding} ${rounded} ${style} ${Theme.transition} ${props.className || ""}`}
    disabled={Boolean(props.loading)}>
    { props.children || "" }
    { props.loading && <IconSpinner className="h-5 w-5"/> }
  </button>
}
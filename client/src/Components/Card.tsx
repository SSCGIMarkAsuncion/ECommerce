import type { HTMLProps } from "react";
import { Theme } from "../Utils/Theme";

export function Card(props: HTMLProps<HTMLDivElement>) {
  return <div
  {...props}
  className={`${Theme.rounded} p-1 bg-white hover:bg-gray-200 cursor-pointer shadow-xs shadow-black/50 ${Theme.transition} ${props.className}`}>
    {props.children}
  </div>
}
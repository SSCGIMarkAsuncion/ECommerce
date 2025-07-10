import type { HTMLProps } from "react";

export interface LinkProps extends HTMLProps<HTMLAnchorElement>{
};

export default function Link(props: LinkProps) {
  return <a href={props.href}
    className={`hover:brightness-75 active:brightness-75 hover:underline active:underline
     flex items-center gap-1
     ${props.className || ""}`}>
    {props.children}
  </a>
}
import type { HTMLProps } from "react";
import { useNavigate } from "react-router";

export interface LinkProps extends HTMLProps<HTMLAnchorElement>{
};

export default function Link(props: LinkProps) {
  const navigate = useNavigate();
  return <a href={props.href}
    onClick={(e) => {
      e.preventDefault();
      if (props.href)
        navigate(props.href);
    }}
    className={`hover:brightness-75 active:brightness-75 hover:underline active:underline
     flex items-center gap-1
     ${props.className || ""}`}>
    {props.children}
  </a>
}
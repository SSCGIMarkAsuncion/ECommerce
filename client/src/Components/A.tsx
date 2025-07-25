import type { HTMLProps } from "react";
import { useNavigate } from "react-router";
import { Theme } from "../Utils/Theme";

export default function A(props: HTMLProps<HTMLAnchorElement>) {
  const navigate = useNavigate();
  return <a {...props}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.href)
        navigate(props.href);
    }}
    className={`text-white hover:underline hover:brightness-75 active:hover:brightness-75 cursor-pointer active:underline ${Theme.transition} ${props.className}`}>
    {props.children}
  </a>
}
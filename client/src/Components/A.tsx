import type { HTMLProps } from "react";
import { useNavigate } from "react-router";
import { Theme } from "../Utils/Theme";

export default function A(props: HTMLProps<HTMLAnchorElement>) {
  const navigate = useNavigate();
  return <a {...props}
    onClick={(e) => {
      if (props.onClick) props.onClick(e);
      if (!props.href) return;
      if (props.href.includes('#')) return;
      e.preventDefault();
      navigate(props.href);
    }}
    className={`text-white hover:underline hover:brightness-75 active:hover:brightness-75 cursor-pointer active:underline ${Theme.transition} ${props.className}`}>
    {props.children}
  </a>
}
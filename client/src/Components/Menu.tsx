import { useCallback, useState, type HTMLProps } from "react";
import { Theme } from "../Utils/Theme";
import { IconCaretDown, IconXMark } from "../Utils/SVGIcons";
import Button from "./Button";
import { useNavigate } from "react-router";

export interface SlidingMenuContentProps extends HTMLProps<HTMLDivElement> {
  hidden: boolean,
};

export function SlidingMenuContent(props: SlidingMenuContentProps) {
  const animation = !Boolean(props.hidden)? "animate-slide-down opacity-1":"animate-slide-up opacity-0";

  return <div onClick={props.onClick}
    // hidden={Boolean(props.hidden)}
    className={`${animation} absolute top-0 left-0 w-full pt-[var(--appbar-height)] bg-primary-900 z-100 ${props.className || ""}`}>
    <Button
      pType="icon" className="w-[32px] h-[32px] absolute right-[1em] top-[1em]">
      <IconXMark />
    </Button>
    <div className="py-4 flex flex-col">
      {props.children}
    </div>
  </div>
}

export function MenuItem(props: HTMLProps<HTMLAnchorElement>) {
  const navigate = useNavigate();
  return <a className={`${Theme.transition} cursor-pointer p-2 hover:bg-primary-950 ${props.className}`} href={props.href}
    onClick={props.onClick || ((e) => {
      e.preventDefault();
      if (props.href)
        navigate(props.href);
    })}>
    {props.children}
  </a>
}

export interface SubMenuProps extends HTMLProps<HTMLDivElement> {
  title: string,
  contentContainerClassName?: string
};

export function SubMenu(props: SubMenuProps) {
  const [isHidden, setHidden ] = useState(true);
  const caretRotation = isHidden? "animate-rotate-180-rev":"animate-rotate-180";

  const onClick = useCallback(() => {
    setHidden(v => !v);
  }, []);

  return <div onClick={props.onClick}>
    <div onClick={onClick} className="flex justify-center cursor-pointer p-2 hover:bg-primary-950">{props.title} <IconCaretDown className={`ml-2 w-[8px] h-[auto] ${caretRotation}`} /></div>
    <div
     hidden={isHidden} className={`animate-slide-down w-full ${props.contentContainerClassName || ""}`}>
      {props.children}
    </div>
  </div>
}
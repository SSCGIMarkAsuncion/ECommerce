import { useCallback, useEffect, useState, type HTMLAttributes, type HTMLProps } from "react";
import { Theme } from "../Utils/Theme";

export default function Sidebar(props: HTMLAttributes<HTMLDivElement>) {
  const [ isOpen, setIsOpen ] = useState(false);

  const onClose = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const ev = new CustomEvent("SidebarClose");
    setIsOpen(false);
    window.dispatchEvent(ev);
  }, []);

  useEffect(() => {
    function handleToggle(e: CustomEvent) {
      setIsOpen(e.detail as boolean);
    }

    // @ts-ignore
    window.addEventListener("SidebarToggle", handleToggle);
    return () => {
      // @ts-ignore
      window.removeEventListener("SidebarToggle", handleToggle);
    }
  }, []);

  return <div
   {...props}
   onClick={onClose}
   className={`${isOpen? "animate-slide-right-in":"animate-slide-left-out md:animate-slide-right-in"} h-[100svh] absolute top-0 left-0 md:w-[var(--sidebar-width)] ${Theme.sidebar.background} text-white ${props.className}`}>
      {props.children}
  </div>;
}

export function SidebarOffset({ className ="" }) {
  return <div className={`w-[var(--sidebar-width)] ${className}`}></div>
}

export interface SidebarButtonProps extends HTMLProps<HTMLButtonElement> {
  active?: boolean
};

export function SidebarButton({ active = false, ...props }: SidebarButtonProps) {
  return <button
   {...props}
   type="button"
   className={`w-full py-2 px-4 flex items-center gap-2 ${Theme.button.filled.none} ${active? Theme.button.active:""} ${props.className}`}>
    {props.children}
  </button>
}
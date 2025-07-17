import { useCallback, useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type HTMLProps } from "react";
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
   className={`${isOpen? "animate-slide-right-in":"animate-slide-left-out"} h-full pt-[var(--appbar-height)] absolute top-0 left-0 max-w-full md:max-w-[200px] bg-primary-800 text-white ${props.className}`}>
    <div className="py-4">
      {props.children}
    </div>
  </div>;
}

export function SidebarButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button
   {...props}
   type="button"
   className={`w-full py-2 px-4 flex items-center gap-2 ${Theme.button.filled.none} ${props.className}`}>
    {props.children}
  </button>
}
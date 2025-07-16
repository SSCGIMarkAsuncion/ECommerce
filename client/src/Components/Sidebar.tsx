import { useEffect, useState, type HTMLProps } from "react";

export interface SidebarProps extends HTMLProps<HTMLDivElement> {
};


export default function Sidebar(props: SidebarProps) {
  const [ isOpen, setIsOpen ] = useState(false);

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

  return <div className={`${isOpen? "animate-slide-right-in":"animate-slide-left-out"} h-full pt-[var(--appbar-height)] absolute top-0 left-0 max-w-full md:max-w-[200px] bg-primary-800 text-white`}>
    <div className="p-4">
      asda
    </div>
  </div>;
}
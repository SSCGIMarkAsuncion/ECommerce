import { useNavigate } from "react-router";
import { Theme } from "../Utils/Theme"
import Button from "./Button";
import { IconBars } from "../Utils/SVGIcons";
import { useCallback, useEffect, useState } from "react";
import { MenuItem, SlidingMenuContent, SubMenu } from "./Menu";
import { useUser } from "../Context/User";
import useAuth from "../Hooks/useAuth";

export default function Navbar({ className = "" }) {
  const navigate = useNavigate();
  const [ bg, setBg ] = useState("");
  const height = Theme.appbar.classHeight;

  useEffect(() => {
    function onScroll(e: Event) {
      // console.log((e.currentTarget as HTMLDivElement).scrollTop);
      const root = e.currentTarget as HTMLDivElement;
      // console.log(root.scrollTop);
      if (root.scrollTop > 25) {
        setBg(Theme.appbar.scrolledBackground);
      }
      else {
        setBg("");
      }
    }
    // console.log("useEffect navbar");
    document.querySelector("#root")?.addEventListener("scroll", onScroll);
    // window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    }
  }, []);

  return <div className={`${height} ${Theme.transition} ${bg} w-full px-3 flex items-center fixed top-0 left-0 text-white ${className}`}>
    <a className="flex gap-2 items-center z-[999]" href="/" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate("/");
    }}>
    <img className="w-[32px] h-auto rounded-md" src="/kape_kalakal.jpeg" alt="icon" title="icon" />
    <p className="birthstone-regular text-4xl">Kape Kalakal</p>
    </a>

    <NavbarMenu />
  </div>
}


function NavbarMenu() {
  const [ isOpen, setOpen ] = useState(true);
  const { user, userDispatcher } = useUser();
  const { authLogout } = useAuth();

  const toggle = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpen(v => !v);
  }, []);

  return <div id="menu" className="ml-auto">
    <Button onClick={toggle}
      pType="icon" className="w-[38px] h-[38px]">

      <IconBars fill="#fff" />

    </Button>
    <SlidingMenuContent onClick={toggle} hidden={isOpen} className="text-lg text-center">
      { (user && user.role == "admin") && <MenuItem href="/admin">Admin Dashboard</MenuItem> }
      <MenuItem href="/products">Products</MenuItem>
      { user == null?
        <>
        <MenuItem href="/login">Login</MenuItem>
        <MenuItem href="/register">Register</MenuItem>
        </>:
        <SubMenu title={user.username}
         contentContainerClassName="text-sm"
         onClick={(e) => {
          e.stopPropagation();
        }}>
          <MenuItem className="block w-full" onClick={(e) => {
            toggle(e);
            authLogout(() => {
            userDispatcher({
              type: "remove", user: null
            });
          })}}>Logout</MenuItem>
        </SubMenu>
      }
    </SlidingMenuContent>
  </div>
}
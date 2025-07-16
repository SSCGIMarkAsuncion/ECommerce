import { useNavigate } from "react-router";
import { Theme } from "../Utils/Theme"
import Button from "./Button";
import { IconBars, IconCart, IconSearch } from "../Utils/SVGIcons";
import { useCallback, useEffect, useState } from "react";
import { MenuItem, SlidingMenuContent, SubMenu } from "./Menu";
import { useUser } from "../Context/User";
import useAuth from "../Hooks/useAuth";
import { isAdmin } from "../Models/User";

export default function Navbar({ className = "" }) {
  const navigate = useNavigate();
  const [ bg, setBg ] = useState(Theme.appbar.normalBackground);
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
        setBg(Theme.appbar.normalBackground);
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
      { (user && isAdmin(user)) && <MenuItem href="/admin">Admin Dashboard</MenuItem> }
      <MenuItem href="/products" className="flex items-center gap-2 justify-center">
        <IconSearch className="w-[18px] h-[18px]"/>
        Products
      </MenuItem>
      <MenuItem href="/cart" className="flex items-center gap-2 justify-center">
        <IconCart className="w-[18px] h-[18px]"/>
        Cart
      </MenuItem>
      <MenuItem href="/#contact" className="flex items-center gap-2 justify-center">
        Contact Us
      </MenuItem>
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
          { user && isAdmin(user)?
            <MenuItem href="/admin" className="block w-full">
              Admin Dashboard
            </MenuItem>:<></>
          }
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
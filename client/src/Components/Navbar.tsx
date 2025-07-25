import { useNavigate } from "react-router";
import { Theme } from "../Utils/Theme"
import Button from "./Button";
import { IconBars, IconCart, IconSearch, IconSidebar } from "../Utils/SVGIcons";
import { useCallback, useEffect, useState } from "react";
import { MenuItem, SlidingMenuContent, SubMenu } from "./Menu";
import { useUser } from "../Context/User";

export default function Navbar({ className = "", admin = false }) {
  const navigate = useNavigate();
  const [ bg, setBg ] = useState(Theme.appbar.normalBackground);
  const height = Theme.appbar.classHeight;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    function handleSidebarClose() {
      setSidebarOpen(false);
    }

    const root = document.querySelector("#root");
    root?.addEventListener("scroll", onScroll);
    window.addEventListener("SidebarClose", handleSidebarClose);

    return () => {
      root?.removeEventListener("scroll", onScroll);
      window.removeEventListener("SidebarClose", handleSidebarClose);
    }
  }, []);

  return <div className={`z-999 ${height} ${Theme.transition} ${bg} w-full px-3 flex items-center fixed top-0 left-0 text-white ${className}`}>
    {
      admin && 
      <Button onClick={() => {
        setSidebarOpen(v => !v);
        const ev = new CustomEvent("SidebarToggle", {
          detail: !sidebarOpen
        });
        window.dispatchEvent(ev);
      }}
        pType="icon" className="w-[33px] h-[33px] mr-2">
        <IconSidebar fill="#fff" className={`${sidebarOpen? "rotate-180":""}`} />
      </Button>
    }
    <a className="flex gap-2 items-center z-[999]" href="/" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate("/");
    }}>
    <img className="w-8 h-auto" src="/Logo_2.svg" alt="Home" title="Home" />
    <p className="birthstone-regular text-4xl shadow-lg">Kape Kalakal</p>
    </a>

    <NavbarMenu />
  </div>
}


function NavbarMenu() {
  const [ isOpen, setOpen ] = useState(true);
  const { user, userDispatcher: { logout }} = useUser();
  const navigate = useNavigate();

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
      <MenuItem href="/aboutus" className="flex items-center gap-2 justify-center">
        About Us
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
          { user && user.isAdmin()?
            <MenuItem href="/admin" className="block w-full">
              Admin Dashboard
            </MenuItem>:<></>
          }
          <MenuItem className="block w-full" onClick={(e) => {
            toggle(e);
            logout();
            navigate("/");
          }}>Logout</MenuItem>
        </SubMenu>
      }
    </SlidingMenuContent>
  </div>
}
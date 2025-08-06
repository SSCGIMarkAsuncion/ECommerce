import { useNavigate } from "react-router";
import { Theme } from "../Utils/Theme"
import Button from "./Button";
import { IconArrowLeft, IconBars, IconCart, IconSearch, IconSidebar } from "../Utils/SVGIcons";
import { useCallback, useEffect, useState } from "react";
import { ButtonMenu, MenuItem, SlidingMenuContent, SubMenu } from "./Menu";
import { useUserContext } from "../Context/User";
import A from "./A";
import { useCartContext } from "../Context/Cart";

export type NavbarType = "" | "product" | "admin";
export interface NavbarProps {
  className?: string,
  type?: NavbarType,
  admin?: boolean
};

// TODO: repalce admin with useUser
export default function Navbar({ className = "", type="", admin = false }: NavbarProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleSidebarClose() {
      setSidebarOpen(false);
    }

    window.addEventListener("SidebarClose", handleSidebarClose);

    return () => {
      window.removeEventListener("SidebarClose", handleSidebarClose);
    }
  }, []);

  return <div className={`z-999 h-[var(--appbar-height)] ${Theme.transition} ${Theme.appbar.background} w-full px-3 flex items-center fixed top-0 left-0 text-white ${className}`}>
    {
      admin && 
      <Button onClick={() => {
        setSidebarOpen(v => !v);
        const ev = new CustomEvent("SidebarToggle", {
          detail: !sidebarOpen
        });
        window.dispatchEvent(ev);
      }}
        pType="icon" className="w-[33px] h-[33px] mr-2 md:hidden">
        <IconSidebar fill="#fff" className={`${sidebarOpen? "rotate-180":""}`} />
      </Button>
    }
    {
     type === "product" &&
      <Button pType="icon" className="size-9 fill-white" onClick={(e) => {
        e.stopPropagation();
        navigate(-1);
      }}><IconArrowLeft /></Button>
    }
    <a className="flex gap-2 items-center z-[999]" href="/" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate("/");
    }}>
      <img className="w-8 h-auto" src="/Logo_2.svg" alt="Home" title="Home" />
      <p className="fraunces-regular text-xl shadow-lg">Kape Kalakal</p>
    </a>
    <NavbarMenu type={type} />
  </div>
}

export function NavbarOffset() {
  return <div className="h-[var(--appbar-height)]"></div>
}

function NavbarMenu({ type = "" }: { type: NavbarType }) {
  const [ isOpen, setOpen ] = useState(true);
  const { user, userDispatcher: { logout }} = useUserContext();
  const { cart } = useCartContext();
  const navigate = useNavigate();

  const toggle = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpen(v => !v);
  }, []);

  return <div id="menu" className="ml-auto md:ml-[initial] md:flex-1">
    {/* FOR MOBILE */}
    <Button onClick={toggle}
      pType="icon" className="w-[38px] h-[38px] md:hidden">
      <IconBars fill="#fff" />
    </Button>
    <SlidingMenuContent onClick={toggle} hidden={isOpen} className="text-lg text-center md:hidden">
      <MenuItem href="/products" className={`flex items-center gap-2 justify-center ${type == "admin"? "hidden":""}`}>
        <IconSearch className="w-[18px] h-[18px]"/>
        Products
      </MenuItem>
      <MenuItem href="/cart" className={`flex items-center gap-2 justify-center`}>
        <IconCart className="w-[18px] h-[18px]"/>
        Cart
      </MenuItem>
      <MenuItem href="/#contact" className={`flex items-center gap-2 justify-center ${type == "admin"? "hidden":""}`}>
        Contact Us
      </MenuItem>
      <MenuItem href="/aboutus" className={`flex items-center gap-2 justify-center ${type == "admin"? "hidden":""}`}>
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
          { user.isAdmin()?
            <MenuItem href="/admin" className="block w-full">
              Admin Dashboard
            </MenuItem>:<></>
          }
          <MenuItem className="block w-full" href="/settings">Settings</MenuItem>
          <MenuItem className="block w-full" onClick={(e) => {
            toggle(e);
            logout();
            navigate("/");
          }}>Logout</MenuItem>
        </SubMenu>
      }
    </SlidingMenuContent>

    {/* FOR >=LAPTOP */}
    <div className="hidden md:flex items-center fraunces-regular text-sm gap-2">
      {/* { type !== "product" &&
        <>
          <div className="flex-1"></div>
          <A href="/products">Products</A>
          <A href="/#contact">Contact Us</A>
          <A href="/aboutus">About Us</A>
        </>
      } */}
      <div className="flex-1"></div>
      {
        type !== "admin" &&
        <>
          <A href="/products">Products</A>
          <A href="/#contact">Contact Us</A>
          <A href="/aboutus">About Us</A>
        </>
      }
      <div className="flex-1"></div>
      <div hidden={!user} className="relative">
        <Button href="/cart" pType="icon" pColor="whitePrimary" className="size-8"><IconCart /></Button>
        { (cart && cart.products.length > 0)?
         <span className="absolute top-1 right-1 inline-flex size-2 rounded-full bg-red-500"></span>:<></>
        }
      </div>
      { !user?
        <>
          <Button href="/login" pColor="none" className="py-1!">Login</Button>
          <Button href="/register" pColor="whitePrimary" className="py-1!">Register</Button>
        </>:
        <>
        <ButtonMenu label={user.username}>
          { user.isAdmin() && <MenuItem href="/admin">Admin Dashboard</MenuItem> }
          <MenuItem href="/settings">Settings</MenuItem>
          <MenuItem onClick={() => {
            logout();
            navigate("/");
          }}>Logout</MenuItem>
        </ButtonMenu>
        </>
      }
    </div>
  </div>
}

// export function UserMenu() {
//   const navigate = useNavigate();
//   const { user, userDispatcher: { logout }} = useUserContext();
//   if (user == null) return;

//   return <ButtonMenu label={user.username}>
//     {user.isAdmin() && <MenuItem href="/admin">Admin Dashboard</MenuItem>}
//     <MenuItem href="/settings">Settings</MenuItem>
//     <MenuItem onClick={() => {
//       logout();
//       navigate("/");
//     }}>Logout</MenuItem>
//   </ButtonMenu>
// }
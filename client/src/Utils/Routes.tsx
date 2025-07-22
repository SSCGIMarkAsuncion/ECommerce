import { createBrowserRouter } from "react-router";
import Home from "../Module/Home";
import NotFound from "../Module/404";
import Login from "../Module/Login";
import Register from "../Module/Register";
import Admin from "../Module/Admin";
import { Products } from "../Module/Products";
import { CartContextProvider } from "../Context/Cart";
import Cart from "../Module/Cart";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <CartContextProvider><Home /></CartContextProvider>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/admin",
    element: <Admin />
  },
  {
    path: "/products",
    element: <CartContextProvider><Products /></CartContextProvider>
  },
  {
    path: "/cart",
    element: <CartContextProvider><Cart /></CartContextProvider>
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
import { createBrowserRouter } from "react-router";
import Home from "../Module/Home";
import NotFound from "../Module/404";
import Login from "../Module/Login";
import Register from "../Module/Register";
import Admin from "../Module/Admin";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Home />
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
    path: "*",
    element: <NotFound />
  }
]);
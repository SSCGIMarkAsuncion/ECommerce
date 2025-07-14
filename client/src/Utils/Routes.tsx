import { createBrowserRouter } from "react-router";
import Home from "../Module/Home";
import NotFound from "../Module/404";
import Login from "../Module/Login";

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
    element: <NotFound />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
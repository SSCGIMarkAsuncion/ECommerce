import { createBrowserRouter } from "react-router";
import Home from "../Module/Home";
import NotFound from "../Module/404";
import Login from "../Module/Login";
import Register from "../Module/Register";
import Admin from "../Module/Admin";
import { Products } from "../Module/Products";
import { CartContextProvider } from "../Context/Cart";
import Cart from "../Module/Cart";
import { AdminOnly, AuthenticatedOnly } from "../Context/User";
import { ProductContextProvider } from "../Context/Product";
import MProductItem from "../Module/ProductItem";
import AboutUs from "../Module/Aboutus";

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
    element: <AdminOnly>
      <CartContextProvider>
        <Admin />
      </CartContextProvider>
    </AdminOnly>
  },
  {
    path: "/products",
    element: <ProductContextProvider>
      <CartContextProvider>
        <Products />
      </CartContextProvider>
    </ProductContextProvider>
  },
  {
    path: "/product/:id",
    element: <CartContextProvider>
      <MProductItem />
    </CartContextProvider>
  },
  {
    path: "/aboutus",
    element: <CartContextProvider>
      <AboutUs />
    </CartContextProvider>
  },
  {
    path: "/cart",
    element: <AuthenticatedOnly>
      <CartContextProvider withProductInfo={true} waitForResult={true}>
        <Cart />
      </CartContextProvider>
    </AuthenticatedOnly>
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
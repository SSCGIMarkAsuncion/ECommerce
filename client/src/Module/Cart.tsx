import { useNavigate } from "react-router";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import CartItem from "../Components/CartItem";
import useCart from "../Hooks/useCart";
import { useCartContext } from "../Context/Cart";
import Button from "../Components/Button";

export default function Cart() {
  const navigate = useNavigate();
  const { cart } = useCartContext();
  const { getCartsAndSetCarts } = useCart();
  getCartsAndSetCarts(true);

  return <>
    <div className="mt-[var(--appbar-height)]"></div>
    { cart?
      <div className="min-h-full flex flex-col gap-2 p-2 w-[95%] md:w-[80%] m-auto">
        <h1 className="fraunces-regular text-4xl text-primary-950">My Cart</h1>
        {
          cart.products!.map((item) => {
            return <CartItem key={item.id} cartItem={item} />
          })
        }
        <Button className="mt-4 text-lg w-full" href="/checkout" onClick={() => {
          navigate("/checkout");
        }}>Checkout</Button>
      </div>
      :<div className="text-lg font-semibold h-full fraunces-regular flex flex-col items-center justify-center">
        <p>No Cart</p>
      </div>
    }
    <Navbar />
    <Footer />
  </>
}
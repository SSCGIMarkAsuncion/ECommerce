import { useNavigate } from "react-router";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import CartItem from "../Components/CartItem";
import { useCartContext } from "../Context/Cart";
import Button from "../Components/Button";
import { Card } from "../Components/Card";
import CartBreakdown from "../Components/CartBreakdown";

export default function Cart() {
  const navigate = useNavigate();
  const { cart } = useCartContext();

  return <>
    <div className="mt-[var(--appbar-height)]"></div>
    { cart?
      <div className="w-[98%] md:w-[90%] m-auto min-h-full">
        <h1 className="fraunces-regular text-4xl tracking-wide text-primary-950 mb-2">My Cart</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col gap-2 flex-1">
            {
              cart.products!.map((item) => {
                return <CartItem key={item.id} cartItem={item} />
              })
            }
          </div>
          <div className="text-md w-full md:w-max min-w-[200px]">
            <Card className="p-2 hover:bg-[initial]! fraunces-regular">
              <CartBreakdown />
              <Button className="mt-4 w-full" onClick={() => {
                navigate("/checkout");
              }}>Checkout</Button>
            </Card>
          </div>
        </div>
      </div>
      :<div className="text-lg font-semibold h-full fraunces-regular flex flex-col items-center justify-center">
        <p>No Cart</p>
      </div>
    }
    <Navbar />
    <Footer />
  </>
}
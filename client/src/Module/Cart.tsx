import { useNavigate } from "react-router";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import CartItem from "../Components/CartItem";
import { useCartContext } from "../Context/Cart";
import Button from "../Components/Button";
import { Card } from "../Components/Card";

export default function Cart() {
  const navigate = useNavigate();
  const { cart } = useCartContext();

  return <>
    <div className="mt-[var(--appbar-height)]"></div>
    { cart?
      <div className="min-h-full flex flex-col md:flex-row gap-2 p-2">
        <div className="w-[90%] mx-auto md:mx-8 md:w-[60%] flex flex-col gap-2">
          <h1 className="fraunces-regular text-4xl text-primary-950 mb-2">My Cart</h1>
          {
            cart.products!.map((item) => {
              return <CartItem key={item.id} cartItem={item} />
            })
          }
        </div>
        <div className="flex-[initial] md:flex-1 w-[90%] mx-auto md:mx-[initial] text-md">
          <Card className="p-2 hover:bg-[initial]!">
            <span>Breadown here</span>
            <Button className="mt-4 w-full" onClick={() => {
              navigate("/checkout");
            }}>Checkout</Button>
          </Card>
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
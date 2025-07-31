import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import CartItem from "../Components/CartItem";
import { useCartContext } from "../Context/Cart";
import Button from "../Components/Button";
import { Card } from "../Components/Card";
import CartBreakdown from "../Components/CartBreakdown";
import Radio from "../Components/Radio";
import Img from "../Components/Img";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNotification } from "../Context/Notify";

export default function Cart() {
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
              <Checkout />
            </Card>
          </div>
        </div>
      </div>
      : <NoCart />
    }
    <Navbar />
    <Footer />
  </>
}

function Checkout() {
  const notify = useNotification();
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    notify("error", "NOT IMPLEMENTED YET");
  }, []);

  return <form ref={ref} onSubmit={onSubmit}>
    <div className="grid grid-cols-2 gap-2 mt-4">
      <Radio id="paymentMethodCod" required label="Cash on Delivery" name="paymentMethod" value="cod" />
      <Radio id="paymentMethodOnline" required label="Pay online (GCash)" name="paymentMethod" value="gcash" />
    </div>
    <Button type="submit" className="mt-4 w-full">Checkout</Button>
  </form>
}

function NoCart() {
  return <div className="font-semibold fraunces-regular flex flex-col items-center py-8 h-[50svh] md:h-[80svh]">
    <Img src="/NoCart.png" className="size-[10em] mb-1" />
    <p className="text-primary-950 text-3xl">Your cart is empty!</p>
    <p className="text-primary-500 text-md mb-4">Looks like you haven't made your choice yet</p>
    <Button href="/products">Start shopping</Button>
  </div>
}
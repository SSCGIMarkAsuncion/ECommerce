import { useEffect, useState } from "react";
import useCart from "../Hooks/useCart"
import { useNotification } from "../Context/Notify";
import type { MError } from "../Utils/Error";
import Cart, { Checkout } from "../Models/Cart";
import { toCurrency } from "../Utils/Currency";

export default function CartBreakdown({ cart }: { cart: Cart }) {
  const [ checkoutInfo, setCheckoutInfo ] = useState<Checkout | null>(null);
  const { getBreakdown }  = useCart();
  const notify = useNotification();

  useEffect(() => {
    async function a() {
      try {
        const info = await getBreakdown(cart);
        setCheckoutInfo(info);
      }
      catch (e) {
        notify("error", e as MError);
      }
    }
    a();
  }, [cart]);

  if (!checkoutInfo) return null;

  return <div className="mb-2 *:mb-1">
    <p className="font-semibold mb-1">Computation</p>
    <div className="grid grid-cols-2"><p>Total Items:</p> <p className="text-right">{checkoutInfo.itemsAmount}</p></div>
    <div className="grid grid-cols-2"><p>Vat:</p> <p className="text-right">{checkoutInfo.vatRate}%</p></div>
    <div className="grid grid-cols-2"><p>Subtotal:</p> <p className="text-right">{toCurrency(checkoutInfo.subtotal)}</p></div>
    <hr className="bg-primary-950 h-[2px]"  />
    <div className="grid grid-cols-2"><p className="font-semibold">Total:</p> <p className="text-right">{toCurrency(checkoutInfo.total)}</p></div>
  </div>
}
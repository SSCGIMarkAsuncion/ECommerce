import { MError } from "../Utils/Error";
import type { OrderInfo } from "../Utils/OrderInfo";
import { PaypalCreateOrderOpts } from "../Utils/PaypalOrder";

const api = `${import.meta.env.VITE_API}/cart`;
export default function useCheckout() {
  const checkout = async (info: OrderInfo) => {
    const res = await fetch(`${api}/checkout`,{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: info.toJson()
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      if (info.payment_method == "paypal") {
        return new PaypalCreateOrderOpts(resjson);
      }
      // return null for cod payment
      return null;
    }

    throw new MError(resjson);
  };

  return {
    checkout
  };
}
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { OrderInfo } from "../Utils/OrderInfo";
import useCheckout from "../Hooks/useCheckout";
import type { PaypalCreateOrderOpts } from "../Utils/PaypalOrder";
import type { MError } from "../Utils/Error";
const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export interface PayPalOrderOptsContext { 
  orderOpts: React.RefObject<OrderInfo>,
  loading: boolean,
  actions: {
    checkout: () => Promise<PaypalCreateOrderOpts | null | MError>,
    undoCheckout: () => Promise<null>,
    postCheckoutResult: (data: any) => Promise<null>
  }
  // setOrderOpts: React.Dispatch<React.SetStateAction<PaypalOrderOpts>>
};

export const PaymentOrderOpts = createContext<PayPalOrderOptsContext>(null!);

export function usePaymentContext() {
  return useContext(PaymentOrderOpts);
}

export default function PaymentProvider({ children }: { children: ReactNode }) {
  const orderOpts = useRef(new OrderInfo());
  const { checkout: co, undoCheckout, postCheckoutResult } = useCheckout();
  const [ loading, setLoading ] = useState(false);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await co(orderOpts.current);
      return res;
    }
    finally {
      setLoading(false);
    }
  };

  return <PayPalScriptProvider options={{ clientId: CLIENT_ID, currency: "PHP" }}>
    <PaymentOrderOpts.Provider value={{
      orderOpts,
      loading,
      actions: {
        checkout,
        undoCheckout,
        postCheckoutResult
      }
    }}>
      {children}
    </PaymentOrderOpts.Provider>
  </PayPalScriptProvider>
}
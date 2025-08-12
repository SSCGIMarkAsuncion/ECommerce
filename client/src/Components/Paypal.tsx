import { PayPalButtons } from "@paypal/react-paypal-js";
import Button from "./Button";
import { usePaymentContext } from "../Context/Payment";

export default function ButtonPaypal({ className = "" }: { className?: string }) {
  const { loading, actions: { checkout } } = usePaymentContext();
  // const [{ options }, dispatch] = usePayPalScriptReducer();

  // useEffect(() => {
  //   dispatch({
  //     type: DISPATCH_ACTION.RESET_OPTIONS,
  //     value: {
  //       ...options, currency: "ph"
  //     }
  //   })
  // }, [])

  return <>
      <PayPalButtons disabled={loading} className={className} style={{ layout: "horizontal" }}
        // createOrder={async (data, actions) => {

        // }}

        onApprove={async (data, actions) => {
          console.log(data);
        }} />
  </>
}
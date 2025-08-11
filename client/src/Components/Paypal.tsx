import { PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import Button from "./Button";

export default function ButtonPaypal({ className = "" }: { className?: string }) {
  // const [{ options }, dispatch] = usePayPalScriptReducer();

  // useEffect(() => {
  //   dispatch({
  //     type: DISPATCH_ACTION.RESET_OPTIONS,
  //     value: {
  //       ...options, currency: "ph"
  //     }
  //   })
  // }, [])

  return <Button disabled>Not implemented yet</Button>;
  return <>
      <PayPalButtons className={className} style={{ layout: "horizontal" }}
        onApprove={async (data, actions) => {
          console.log(data);
        }} />
  </>
}
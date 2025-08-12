import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePaymentContext } from "../Context/Payment";
import { useNotification } from "../Context/Notify";
import { MError } from "../Utils/Error";

export default function ButtonPaypal({ className = "", onSuccess }: { className?: string, onSuccess: () => void }) {
  const { orderOpts, loading, actions: { checkout, undoCheckout, postCheckoutResult } } = usePaymentContext();
  const notify = useNotification();

  return <>
      <PayPalButtons disabled={loading} className={className} style={{ layout: "horizontal" }}
        createOrder={async (data, actions) => {
          orderOpts.current.payment_method = "paypal";
          const paypalCreateOrderOpts = await checkout();
          if (paypalCreateOrderOpts == null || paypalCreateOrderOpts instanceof MError) {
            throw new MError("An Error Occured");
          }

          // console.log("PAYPAL_CREATE_ORDER", data, paypalCreateOrderOpts);

          return actions.order.create({
            ...paypalCreateOrderOpts,
            ...data,
          });
        }}

        onError={async (e) => {
          try {
            await undoCheckout();
          }
          catch (e) {
            notify("error", e as MError);
          }
          console.log(e);
          notify("error", new MError(e.message));
        }}

        onApprove={async (data, _actions) => {
          try {
            await postCheckoutResult(data);
          }
          catch (e) {
            notify("error", e as MError);
          }
          finally {
            onSuccess();
          }
        }} />
  </>
}
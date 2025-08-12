import { useNavigate, useSearchParams } from "react-router";
import Radio from "../Components/Radio";
import { useCallback, useEffect, useState } from "react";
import Input from "../Components/Input";
import Navbar, { NavbarOffset } from "../Components/Navbar";
import Footer from "../Components/Footer";
import CartBreakdown from "../Components/CartBreakdown";
import { usePaymentContext } from "../Context/Payment";
import ButtonPaypal from "../Components/Paypal";
import Button from "../Components/Button";
import { useNotification } from "../Context/Notify";
import type { MError } from "../Utils/Error";
import { useUserContext } from "../Context/User";
import OrderSuccessfullyCreated from "../Components/OrderSuccessfullyCreated";

export default function Checkout() {
  const [ searchParams, ] = useSearchParams();
  const { user } = useUserContext();
  const { orderOpts } = usePaymentContext();
  const [ paymentMethod, setPaymentMethod ] = useState(searchParams.get("paymentMethod") || "cod");
  const [ isDoneAndSuccessful, setIsDoneAndSuccessful ] = useState(false);

  const onSuccess = useCallback(() => {
    setIsDoneAndSuccessful(true);
  }, []);

  const onInput = useCallback(async (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    
    orderOpts.current.full_name = `${data.get("last_name")}, ${data.get("first_name")} ${data.get("middle_name") || ""}`;
    orderOpts.current.email_address = data.get("email_address") as string || "";
    orderOpts.current.phone_number = data.get("phone_number") as string;
    orderOpts.current.address_line_1 = data.get("address_line_1") as string;
    orderOpts.current.admin_area_2 = data.get("admin_area_2") as string;
    orderOpts.current.postal_code = data.get("postal_code") as string;
    orderOpts.current.payment_method = paymentMethod as typeof orderOpts.current.payment_method;

    // orderOpts.current.address_line_1 = data.get("")
    // console.log(orderOpts.current);
  }, [paymentMethod]);

  return <>
    <NavbarOffset />
    {(!isDoneAndSuccessful)?
        <div className="w-[90%] mx-auto min-h-full px-8 pt-8 gap-4 grid grid-cols-3 fraunces-regular text-primary-900">
          <form className="col-span-2 [&>*]:mb-4" onInput={onInput} onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-2xl mb-1!">Order information</h1>
            <div>
              <p className="text-lg">Name*</p>
              <div className="flex gap-2 flex-col md:flex-row">
                <Input required id="first_name" containerClassName="flex-1" placeholder="John" label="First*" />
                <Input id="middle_name" placeholder="M." containerClassName="w-full md:w-[20%]" label="Middle" />
                <Input required id="last_name" containerClassName="flex-1" placeholder="Doe" label="Last*" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row *:flex-1 gap-2">
              <Input id="email_address" type="email" defaultValue={user?.email || ""} placeholder="john@email.com" label="Email" />
              <Input type="number"
                required
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                prefix={<p className="text-primary-900 mr-2">+63</p>}
                id="phone_number" placeholder="9xxxxxxxxx" label="Mobile number*" />
            </div>
            <Input required id="address_line_1" placeholder="Street address, apartment, suite, etc." label="Address*" />
            <div className="flex flex-col md:flex-row *:flex-1 gap-2">
              <Input required id="admin_area_2" label="City / Town*" />
              <Input type="number"
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                id="postal_code" placeholder="0000" label="Postal Code" />
            </div>

            <div className="flex gap-2 mt-4">
              <Radio id="paymentMethodCod" checked={paymentMethod == "cod"} required label="Cash on Delivery" name="paymentMethod" value="cod" onChange={(e) => {
                e.stopPropagation();
                setPaymentMethod(e.currentTarget.value);
              }} />
              <Radio id="paymentMethodOnline" checked={paymentMethod == "paypal"} required label="Pay online with Paypal" name="paymentMethod" value="paypal" onChange={(e) => {
                e.stopPropagation();
                setPaymentMethod(e.currentTarget.value);
              }} />
            </div>
            {
              paymentMethod == "paypal" ?
                <ButtonPaypal onSuccess={onSuccess} /> : <CodButton onSuccess={onSuccess} />
            }
          </form>
          <CartBreakdown />
        </div>:
        <div className="min-h-full w-[80%] m-auto flex items-center">
          <OrderSuccessfullyCreated title="Order successfully created" />
        </div>
    }
    <Navbar type="product" />
    <Footer />
  </>;
}

function CodButton({ onSuccess }: { onSuccess: () => void }) {
  const { loading, actions: { checkout, postCheckoutResult } } = usePaymentContext();
  const notify = useNotification();

  const onClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // ignore results for cod payments
      await checkout();
      onSuccess();
      await postCheckoutResult({ status: "successful" });
      notify("info", "Successfully created an order");
    }
    catch (e) {
      console.log(e);
      notify("error", e as MError);
    }
  }, []);

  return <Button loading={loading} className="w-full" onClick={onClick}>Process Order</Button>
}
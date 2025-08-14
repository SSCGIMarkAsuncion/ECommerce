import { useSearchParams } from "react-router";
import Radio from "../Components/Radio";
import { useCallback, useRef, useState } from "react";
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
import { useCartContext } from "../Context/Cart";
import type Cart from "../Models/Cart";
import { IconCheck, IconXMark } from "../Utils/SVGIcons";
import { UserShipping } from "../Models/User";

export default function Checkout() {
  const [ searchParams, ] = useSearchParams();
  const { user } = useUserContext();
  const refForm = useRef<HTMLFormElement>(null);
  const { orderOpts } = usePaymentContext();
  const [ paymentMethod, setPaymentMethod ] = useState(searchParams.get("paymentMethod") || "cod");
  const [ isDoneAndSuccessful, setIsDoneAndSuccessful ] = useState(false);
  const { cart } = useCartContext();
  const [ shippingInfoSynced, setShippingInfoSynced ] = useState(true);
  const notify = useNotification();

  const onSuccess = useCallback(() => {
    setIsDoneAndSuccessful(true);
  }, []);

  function updateInfo(form: FormData) {
  }

  const onSyncButton = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!refForm.current) return;
    const form = refForm.current as HTMLFormElement;
    const data = new FormData(form);
    
    const last_name = data.get("last_name");
    const first_name = data.get("first_name");
    const middle_name = data.get("middle_name") || "";

    const newInfo = new UserShipping({
      lastname: last_name,
      firstname: first_name,
      middlename: middle_name,
      phoneNumber: orderOpts.current.phone_number,
      address: orderOpts.current.address_line_1,
      area: orderOpts.current.admin_area_2,
      postalCode: orderOpts.current.postal_code
    });
  }, []);

  const onInput = useCallback(async (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    
    const last_name = data.get("last_name");
    const first_name = data.get("first_name");
    const middle_name = data.get("middle_name") || "";

    orderOpts.current.full_name = `${last_name}, ${first_name} ${middle_name}`;
    orderOpts.current.email_address = data.get("email_address") as string || "";
    orderOpts.current.phone_number = data.get("phone_number") as string;
    orderOpts.current.address_line_1 = data.get("address_line_1") as string;
    orderOpts.current.admin_area_2 = data.get("admin_area_2") as string;
    orderOpts.current.postal_code = data.get("postal_code") as string;
    orderOpts.current.payment_method = paymentMethod as typeof orderOpts.current.payment_method;

    const newInfo = new UserShipping({
      lastname: last_name,
      firstname: first_name,
      middlename: middle_name,
      phoneNumber: orderOpts.current.phone_number,
      address: orderOpts.current.address_line_1,
      area: orderOpts.current.admin_area_2,
      postalCode: orderOpts.current.postal_code
    });
    setShippingInfoSynced(user!.shipping.isEqual(newInfo));

    // orderOpts.current.address_line_1 = data.get("")
    // console.log(orderOpts.current);
  }, [paymentMethod]);

  return <>
    <NavbarOffset />
    {(!isDoneAndSuccessful)?
        <div className="w-[90%] mx-auto min-h-full px-8 pt-8 gap-4 grid grid-cols-3 fraunces-regular text-primary-900">
          <form ref={refForm} className="col-span-2 [&>*]:mb-4" onInput={onInput} onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-2xl mb-1! flex items-center">
              Order information
            <Button pColor="none" 
              onClick={onSyncButton}
              data-synced={shippingInfoSynced ? '1' : ''} className="ml-auto text-xs data-[synced='']:text-red-600 data-[synced='1']:text-green-600 gap-1">
              {shippingInfoSynced? "Information Synced":"Information not synced"}
              <span data-synced={shippingInfoSynced? '1':''} className="size-4 *:size-2 flex items-center justify-center data-[synced='1']:bg-green-300 data-[synced='']:bg-red-300 border-1 data-[synced='1']:border-green-400 data-[synced='']:border-red-400 data-[synced='']:fill-red-600 data-[synced='1']:fill-green-600 rounded-full">
                {shippingInfoSynced ? <IconCheck /> : <IconXMark />}
              </span>
            </Button>
            </h1>
            <div>
              <p className="text-lg">Name*</p>
              <div className="flex gap-2 flex-col md:flex-row">
                <Input required id="first_name" defaultValue={user?.shipping.firstname || ""} containerClassName="flex-1" placeholder="John" label="First*" />
                <Input id="middle_name" placeholder="M." defaultValue={user?.shipping.middlename || ""} containerClassName="w-full md:w-[20%]" label="Middle" />
                <Input required id="last_name" defaultValue={user?.shipping.lastname || ""} containerClassName="flex-1" placeholder="Doe" label="Last*" />
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
            <Input required id="address_line_1" defaultValue={user?.shipping.address || ""} placeholder="Street address, apartment, suite, etc." label="Address*" />
            <div className="flex flex-col md:flex-row *:flex-1 gap-2">
              <Input required id="admin_area_2" defaultValue={user?.shipping.area || ""} label="City / Town*" />
              <Input type="number"
                defaultValue={user?.shipping.postalCode || ""} 
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
          <CartBreakdown cart={cart as Cart} />
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
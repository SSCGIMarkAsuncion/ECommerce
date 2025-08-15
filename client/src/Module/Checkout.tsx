import { useSearchParams } from "react-router";
import Radio from "../Components/Radio";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../Components/Input";
import Navbar, { NavbarOffset } from "../Components/Navbar";
import Footer from "../Components/Footer";
import CartBreakdown from "../Components/CartBreakdown";
import { usePaymentContext } from "../Context/Payment";
import ButtonPaypal from "../Components/Paypal";
import Button from "../Components/Button";
import { useNotification } from "../Context/Notify";
import type { MError } from "../Utils/Error";
import OrderSuccessfullyCreated from "../Components/OrderSuccessfullyCreated";
import { useCartContext } from "../Context/Cart";
import type Cart from "../Models/Cart";
import { IconCheck, IconXMark } from "../Utils/SVGIcons";
import { UserShipping } from "../Models/User";
import Loading from "../Components/Loading";
import { useUserContext } from "../Context/User";
import useUsers from "../Hooks/useUser";

export default function Checkout() {
  const { cart } = useCartContext();
  const [ isDoneAndSuccessful, setIsDoneAndSuccessful ] = useState(false);

  return <>
    <NavbarOffset />
    {(!isDoneAndSuccessful)?
        <div className="w-[90%] mx-auto min-h-full px-8 pt-8 gap-4 grid grid-cols-3 fraunces-regular text-primary-900">
          <OrderForm setSucessful={setIsDoneAndSuccessful} />
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

function OrderForm({ setSucessful: setSuccessful }: { setSucessful: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { user } = useUserContext();
  const { orderOpts } = usePaymentContext();
  const { getShippingInfo } = useUsers();
  const { updateShippingInfo } = useUsers();
  const [ searchParams, ] = useSearchParams();
  const [ shippingInfoSynced, setShippingInfoSynced ] = useState(true);
  const refForm = useRef<HTMLFormElement>(null);
  const [ paymentMethod, setPaymentMethod ] = useState(searchParams.get("paymentMethod") || "cod");
  const [ loading, setLoading ] = useState(true);
  const shippingInfo = useRef<UserShipping | null>(null);

  useEffect(() => {
    async function a() {
      try {
        const info = await getShippingInfo()
        shippingInfo.current = info;
      }
      catch (e) {
        console.log(e)
        shippingInfo.current = new UserShipping({});
      }
      finally {
        setLoading(false);
      }
    }
    a();
  }, [])

  const onSuccess = useCallback(() => { setSuccessful(true); }, []);

  const onSyncButton = useCallback(async () => {
    const newInfo = new UserShipping({
      firstName: orderOpts.current.first_name,
      middleName: orderOpts.current.middle_name,
      lastName: orderOpts.current.last_name,
      phoneNumber: orderOpts.current.phone_number,
      address: orderOpts.current.address_line_1,
      area: orderOpts.current.admin_area_2,
      postalCode: orderOpts.current.postal_code
    });
    if (!shippingInfo.current!.isEqual(newInfo)) {
      try {
        const info = await updateShippingInfo(newInfo);
        shippingInfo.current = info;
      }
      catch (e) { console.log(e) }
    }
    setShippingInfoSynced(shippingInfo.current!.isEqual(newInfo));
  }, []);

  const onInput = useCallback(async (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    orderOpts.current.last_name = data.get("last_name") as string;
    orderOpts.current.first_name = data.get("first_name") as string;
    orderOpts.current.middle_name = data.get("middle_name") as string || "";
    orderOpts.current.email_address = data.get("email_address") as string || "";
    orderOpts.current.phone_number = data.get("phone_number") as string;
    orderOpts.current.address_line_1 = data.get("address_line_1") as string;
    orderOpts.current.admin_area_2 = data.get("admin_area_2") as string;
    orderOpts.current.postal_code = data.get("postal_code") as string;
    orderOpts.current.payment_method = paymentMethod as typeof orderOpts.current.payment_method;

    const newInfo = new UserShipping({
      firstName: orderOpts.current.first_name,
      middleName: orderOpts.current.middle_name,
      lastName: orderOpts.current.last_name,
      phoneNumber: orderOpts.current.phone_number,
      address: orderOpts.current.address_line_1,
      area: orderOpts.current.admin_area_2,
      postalCode: orderOpts.current.postal_code
    });
    console.log("onInput", newInfo);
    setShippingInfoSynced(shippingInfo.current!.isEqual(newInfo));
  }, [paymentMethod]);

  if (loading) return <Loading />;
  return <form ref={refForm} onInput={onInput} className="col-span-2 [&>*]:mb-4" onSubmit={(e) => e.preventDefault()}>
    <h1 className="text-2xl mb-1! flex items-center">
      Order information
      <Button pColor="none"
        onClick={onSyncButton}
        data-synced={shippingInfoSynced ? '1' : ''} className="ml-auto text-xs data-[synced='']:text-red-600 data-[synced='1']:text-green-600 gap-1">
        {shippingInfoSynced ? "Information Synced" : "Information not synced"}
        <span data-synced={shippingInfoSynced ? '1' : ''} className="size-4 *:size-2 flex items-center justify-center data-[synced='1']:bg-green-300 data-[synced='']:bg-red-300 border-1 data-[synced='1']:border-green-400 data-[synced='']:border-red-400 data-[synced='']:fill-red-600 data-[synced='1']:fill-green-600 rounded-full">
          {shippingInfoSynced ? <IconCheck /> : <IconXMark />}
        </span>
      </Button>
    </h1>
    <div>
      <p className="text-lg">Name*</p>
      <div className="flex gap-2 flex-col md:flex-row">
        <Input required id="first_name" defaultValue={shippingInfo.current!.firstName || ""} containerClassName="flex-1" placeholder="John" label="First*" />
        <Input id="middle_name" placeholder="M." defaultValue={shippingInfo.current!.middleName || ""} containerClassName="w-full md:w-[20%]" label="Middle" />
        <Input required id="last_name" defaultValue={shippingInfo.current!.lastName || ""} containerClassName="flex-1" placeholder="Doe" label="Last*" />
      </div>
    </div>
    <div className="flex flex-col md:flex-row *:flex-1 gap-2">
      <Input id="email_address" type="email" defaultValue={user?.email || ""} placeholder="john@email.com" label="Email" />
      <Input type="number"
        required
        defaultValue={shippingInfo.current!.phoneNumber}
        inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        prefix={<p className="text-primary-900 mr-2">+63</p>}
        id="phone_number" placeholder="9xxxxxxxxx" label="Mobile number*" />
    </div>
    <Input required id="address_line_1" defaultValue={shippingInfo.current!.address || ""} placeholder="Street address, apartment, suite, etc." label="Address*" />
    <div className="flex flex-col md:flex-row *:flex-1 gap-2">
      <Input required id="admin_area_2" defaultValue={shippingInfo.current!.area || ""} label="City / Town*" />
      <Input type="number"
        defaultValue={shippingInfo.current!.postalCode || ""}
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
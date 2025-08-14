import type { HTMLProps } from "react";
import { useCartContext } from "../Context/Cart";
import useCart from "../Hooks/useCart";
import { Product } from "../Models/Product";
import type { ButtonProps } from "./Button";
import Button from "./Button";
import { IconMinus, IconPlus, IconTrash } from "../Utils/SVGIcons";
import { useNotification } from "../Context/Notify";
import { useUserContext } from "../Context/User";
import type { MError } from "../Utils/Error";

export interface ButtonCartProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

export function ButtonCart({ product, ...props }: ButtonCartProps) {
  const { user } = useUserContext();
  const notify = useNotification();
  const { cart } = useCartContext();
  const { addToCart } = useCart();
  // console.log(cart?.products, product);
  const cartItem = cart?.products.filter((item) => {
    return item.id == product.id;
  })[0];

  return <Btn className={`w-full ${props.className}`}
    cartAmount={cartItem?.amount}
    disabled={product.stocks==0}
    onChangeCartAmount={(newAmount: number) => {
      if (user == null) {
        notify("error", "Please login first before adding to cart.");
        return;
      }
      addToCart(product, newAmount).catch(e => notify("error", (e as MError).toErrorList().join('\n')));
    }}
    onClick={(e) => {
      e.stopPropagation();
      if (user == null) {
        notify("error", "Please login first before adding to cart.");
        return;
      }
      addToCart(product, 1).catch(e => notify("error", e.message));;
    }}>
    { product.stocks > 0 && (props.children || "Add to cart")}
    { product.stocks == 0 && "Out of stock"}
  </Btn>
}

export function ButtonCartDelete({ product, ...props }: ButtonCartProps) {
  const notify = useNotification();
  const { removeFromCart } = useCart();

  return <Button
   onClick={(e) => {
    e.stopPropagation();
    removeFromCart(product);
    notify("info", `Deleted ${product.name} from cart`);
   }}
   pType="icon" pColor="red" className={props.className}>
    <IconTrash className="fill-red-800"/>
  </Button>
}

interface BtnProps extends ButtonProps {
  cartAmount?: number,
  onChangeCartAmount?: (amount: number) => void
};

function Btn(props: BtnProps) {
  const amount = props.cartAmount || 0;
  if (amount >= 1) {
    return <div className={`flex gap-4 items-center ${props.className}`}>
      <Button className="aspect-square size-8 fill-white" onClick={(e) => {
        e.stopPropagation();
        if (props.onChangeCartAmount)
          props.onChangeCartAmount(amount-1);
      }}><IconMinus /></Button>
      <p>{amount}</p>
      <Button className="aspect-square size-8 fill-white" onClick={(e) => {
        e.stopPropagation();
        if (props.onChangeCartAmount)
          props.onChangeCartAmount(amount+1);
      }}
      ><IconPlus /></Button>
    </div>
  }

  const btnProps = {
    ...props,
  };
  delete btnProps.cartAmount;
  delete btnProps.onChangeCartAmount;
  return <Button
    {...btnProps}>
    {props.children}
  </Button>
}
import { useCartContext } from "../Context/Cart";
import useCart from "../Hooks/useCart";
import type { Product } from "../Models/Product";
import type { ButtonProps } from "./Button";
import Button from "./Button";

export function ButtonCart({ product }: { product: Product }) {
  const { cart } = useCartContext();
  const { addToCart } = useCart();
  const cartItem = cart?.products.filter((item) => {
    return item.id == product?.id;
  })[0];

  return <Btn className="fraunces-regular w-full mt-4 text-sm"
    cartAmount={cartItem?.amount}
    onChangeCartAmount={(newAmount: number) => {
      addToCart(product, newAmount);
    }}
    onClick={(e) => {
      e.stopPropagation();
      addToCart(product, 1);
    }}>
    Add to cart
  </Btn>
}

export interface ButtonCartProps extends ButtonProps {
  cartAmount?: number,
  onChangeCartAmount?: (amount: number) => void
};

function Btn(props: ButtonCartProps) {
  const amount = props.cartAmount || 0;
  if (amount >= 1) {
    return <div className={`flex gap-1 justify-between items-center ${props.className}`}>
      <Button onClick={() => {
        if (props.onChangeCartAmount)
          props.onChangeCartAmount(amount-1);
      }}>-</Button>
      {amount}
      <Button onClick={() => {
        if (props.onChangeCartAmount)
          props.onChangeCartAmount(amount+1);
      }}
      >+</Button>
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
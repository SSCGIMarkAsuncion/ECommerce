import { IconBoxStacks } from "../Utils/SVGIcons";
import { Theme } from "../Utils/Theme";
import Button from "./Button";

export default function OrderSuccessfullyCreated({ title = "Order placed successfully!", subtitle = "Thank you for shopping with us. Your order is now being processed."}: { title?: string, subtitle?: string }) {
  return <div
   className={`w-full bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded}`}>
    <IconBoxStacks className="size-20"/>
    <div>
      <p className="mt-2">{title}</p>
      <p className="text-primary-500 text-sm">{subtitle}</p>
      <div className="flex gap-2 mt-2 justify-center text-sm">
        <Button href="/products">Shop Again</Button>
        <Button href="/myorders">View My Orders</Button>
      </div>
    </div>
  </div>
}
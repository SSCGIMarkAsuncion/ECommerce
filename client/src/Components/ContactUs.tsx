import Button from "./Button";
import Input, { TextArea } from "./Input";

export default function ContactUs() {
  return <form action="mailto:kape@kalakal.com" className="fraunces-regular">
    <h1 className="text-lg font-semibold">Contact us</h1>
    <div className="*:flex-1 flex gap-1">
      <Input required id="email" label="Email:" placeholder="john@email.com" type="email" />
      <Input id="name" placeholder="John" label="Name:" />
    </div>
    <TextArea required id="body" placeholder="..." label="Comment:" rows={5} />
    <Button type="submit" className="mt-2">Submit</Button>
  </form>
}
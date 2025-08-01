import Button from "./Button";
import Input, { TextArea } from "./Input";

export default function ContactUs() {
  return <form action="mailto:kapekalakal@email.com">
    <div className="*:flex-1 flex gap-1">
      <Input required id="email" label="Email:" type="email" />
      <Input id="name" label="Name:" />
    </div>
    <TextArea required id="comment" label="Comment:" rows={5} />
    <Button type="submit" className="mt-2">Submit</Button>
  </form>
}
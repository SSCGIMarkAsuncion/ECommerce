import { useCallback, type FormEvent } from "react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Navbar from "../Components/Navbar";
import { Theme } from "../Utils/Theme";

export default function Login() {
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("submit");
  }, []);

  return <div className="h-full w-full bg-primary-50">
    <Navbar className="bg-primary-950" />
    <div className="pt-[var(--appbar-height)]">
      <div className={`my-8 w-[80%] mx-auto p-4 bg-white ${Theme.rounded}`}>
      <img src="/kape_kalakal.png" className="w-[30vw] mx-auto h-auto" />
      <h1 className="fraunces-regular text-4xl text-center">Login</h1>

      <form className="text-lg px-8" onSubmit={onSubmit}>
        <Input required id="email" label="Email" type="text" placeholder="john@email.com" />
        <Button className="w-full mt-2" type="submit">Login</Button>
      </form>

      </div>
    </div>
    {/* <Footer /> */}
  </div>;
}
import { useCallback, useRef, useState } from "react";
import Button from "../Components/Button";
import Input, { InputPassword } from "../Components/Input";
import Navbar from "../Components/Navbar";
import { Theme } from "../Utils/Theme";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";
import type { MError } from "../Utils/Error";
import { checkPassword } from "../Utils/FormValidators";
import FormError from "../Components/FormError";
import FormHeader from "../Components/FormHeader";

export default function Register() {
  const [ errs, setErrs ] = useState<string[]>([]);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const { authRegister } = useAuth();

  const password1Ref = useRef<HTMLInputElement>(null);

  const validatePass2 = (value: string) => {
    if (password1Ref.current == null) {
      return "Password do not match";
    }
    if (value !== password1Ref.current.value) {
      return "Password do not match";
    }
    return "";
  }

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    setLoading(true);
    authRegister(data)
      .then(() => {
        navigate("/");
      })
      .catch((err: MError) => {
        const keys = Object.keys(err.msg)
        let merrs: string[] = [];
        keys.forEach((key) => {
          merrs.push(err.msg[key]);
        });
        setLoading(false);
        setErrs(merrs);
      });
  }, []);

  return <div className="w-full h-full bg-primary-50">
    <Navbar className="bg-primary-950" />
    <div className="h-full py-[var(--appbar-height)] bg-[inherit]">
      <div className={`my-8 w-[90%] md:w-[60%] mx-auto p-4 bg-white shadow-black shadow-xs/15 ${Theme.rounded}`}>
        <FormHeader />
        <form className="text-lg md:text-sm px-8" onSubmit={onSubmit}>
          <FormError errors={errs} />
          <Input required id="email" label="Email"
            type="email" placeholder="john@email.com" />
          <Input required id="username" label="Username"
            type="text" placeholder="john, john123, john_213" />
          <div className="my-2">
            <InputPassword ref={password1Ref} required id="password" label="Password" validators={[checkPassword]} />
            <InputPassword required id="password2" label="Retype Password" validators={[validatePass2]} />
          </div>
          <Button loading={loading} className="w-full my-4" type="submit">Register</Button>
        </form>
      </div>
    </div>
    {/* <Footer /> */}
  </div>;
}
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
import User from "../Models/User";
import Footer from "../Components/Footer";

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
    const user = User.from(data);
    setLoading(true);
    authRegister(user)
      .then(() => {
        navigate("/");
      })
      .catch((err: MError) => {
        let merrs = err.toErrorList();
        setLoading(false);
        setErrs(merrs);
      });
  }, []);

  return <div className="w-full h-full bg-primary-50">
    <Navbar className="bg-primary-950" />
    <div className="min-h-full py-[var(--appbar-height)] bg-[inherit]">
      <div className={`fraunces-regular my-8 w-[98%] md:min-w-[40svw] md:w-[30%] mx-auto px-2 py-8 bg-white shadow-black shadow-xs/15 ${Theme.rounded}`}>
        <FormHeader title="Register" />
        <form className="text-lg md:text-sm px-8" onSubmit={onSubmit}>
          <FormError errors={errs} />
          <Input required id="email" label="Email"
            type="email" placeholder="john@email.com" />
          <Input required id="username" label="Username"
            type="text" placeholder="john, john123, john_213" />
          <div className="my-2">
            <InputPassword ref={password1Ref} required id="password" label="Password" validators={[checkPassword]} />
            <InputPassword required id="password2" label="Confirm Password" validators={[validatePass2]} />
          </div>
          <Button loading={loading} className="w-full mt-4" type="submit">Register</Button>
          <div className="fraunces-regular">
            <span>Already have an account? <a className="text-primary-900 font-semibold hover:underline" href="/register" onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}>Login</a></span>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>;
}
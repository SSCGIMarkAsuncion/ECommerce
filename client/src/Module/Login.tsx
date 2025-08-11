import { useCallback, useState } from "react";
import Button from "../Components/Button";
import Input, { InputPassword } from "../Components/Input";
import Navbar from "../Components/Navbar";
import { Theme } from "../Utils/Theme";
import { useNavigate } from "react-router";
import { MError } from "../Utils/Error";
import FormError from "../Components/FormError";
import FormHeader from "../Components/FormHeader";
import User from "../Models/User";
import { useUserContext } from "../Context/User";
import Footer from "../Components/Footer";

export default function Login() {
  const [ errs, setErrs ] = useState<string[]>([]);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const { userDispatcher: { login }} = useUserContext();

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const user = User.from(data);
    setLoading(true);
    login(user)
      .then(() => {
        navigate(-1);
      })
      .catch((err: MError) => {
        let merrs: string[] = err.toErrorList();
        setLoading(false);
        setErrs(merrs);
      });
  }, []);

  return <div className="w-full h-full bg-primary-50">
    <Navbar className="bg-primary-950" />
    <div className="min-h-full py-[var(--appbar-height)] bg-[inherit]">
      <div className={`fraunces-regular my-8 w-[98%] md:min-w-[40svw] md:w-[30%] mx-auto px-2 py-8 bg-white shadow-black shadow-xs/15 ${Theme.rounded}`}>
        <FormHeader title="Login" />
        <form className="text-lg md:text-sm px-8" onSubmit={onSubmit}>
          <FormError errors={errs} />
          <Input required id="email" label="Email"
            type="email" placeholder="john@email.com" />
          <InputPassword required id="password" label="Password" />
          <Button loading={loading} className="w-full mt-4" type="submit">Login</Button>
          <div className="fraunces-regular">
            <span>No account? <a className="text-primary-900 font-semibold hover:underline" href="/register" onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}>Register</a></span>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>;
}
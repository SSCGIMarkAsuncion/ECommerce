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
import { useUser } from "../Context/User";

export default function Login() {
  const [ errs, setErrs ] = useState<string[]>([]);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const { userDispatcher: { login }} = useUser();

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const user = User.from(data);
    setLoading(true);
    login(user)
      .then(() => {
        navigate("/");
      })
      .catch((err: MError) => {
        let merrs: string[] = err.toErrorList();
        setLoading(false);
        setErrs(merrs);
      });
  }, []);

  return <div className="w-full h-full bg-primary-50">
    <Navbar className="bg-primary-950" />
    <div className="h-full py-[var(--appbar-height)] bg-[inherit]">
      <div className={`my-8 w-[90%] md:w-[60%] mx-auto p-4 bg-white shadow-black shadow-xs/15 ${Theme.rounded}`}>
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
    {/* <Footer /> */}
  </div>;
}
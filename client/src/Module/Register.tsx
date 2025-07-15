import { useCallback, useState } from "react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Navbar from "../Components/Navbar";
import { Theme } from "../Utils/Theme";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";
import type { MError } from "../Utils/Error";

export default function Register() {
  const [ errs, setErrs ] = useState<string[]>([]);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const { authRegister } = useAuth();

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    setLoading(true);
    authRegister(data)
      .then((res) => {
        console.log(res);
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

  return <div className="w-full bg-primary-50">
    <Navbar className="bg-primary-950" />
    <div className="h-full py-[var(--appbar-height)] bg-[inherit]">
      <div className={`h-full my-8 w-[90%] md:w-[60%] mx-auto p-4 bg-white shadow-black shadow-xs/15 ${Theme.rounded}`}>
      <img src="/kape_kalakal.png" className="w-[30vw] mx-auto h-auto" />
      <h1 className="fraunces-regular text-4xl text-center">Login</h1>
      <form className="text-lg px-8" onSubmit={onSubmit}>
        {
          errs.length > 0 && <div className="mt-1 bg-red-400/85 border-2 border-dashed text-white border-red-400 p-4 rounded-lg text-sm">
          {
            errs.map((err, i) => {
              return <p key={i} className="mb-2 animate-appear">{err}</p>;
            })
          }
          </div>
        }
        <Input required id="email" label="Email"
          type="email" placeholder="john@email.com" />
        <Input required id="password" label="Password"
          type="password" />
        <Input required id="password2" label="Password"
          type="password" />
        <Button loading={loading} className="w-full my-4" type="submit">Login</Button>
      </form>

      </div>
    </div>
    {/* <Footer /> */}
  </div>;
}
import { useEffect } from "react";
import { useUser } from "../Context/User";
import { MError } from "../Utils/Error";
import type { User } from "../Models/User";

const api = import.meta.env.VITE_API;
// const host = encodeURI(import.meta.env.VITE_HOST);

export default function useAuth() {
  const { userDispatcher } = useUser();

  const authLogin = async (data: FormData) => {
    const json = Object.fromEntries(data.entries());
    const res = await fetch(`${api}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json)
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status < 300) {
      return resjson;
    }
    throw new MError(resjson);
  };

  const authRegister = async(data: FormData) => {
    const json = Object.fromEntries(data.entries());
    const res = await fetch(`${api}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json)
    });

    if (res.status >= 200 && res.status < 300) {
      return "";
    }
    const resjson = await res.json();
    throw new MError(resjson);
  };

  const authLogout = async (cb: () => void) => {
    await fetch(`${api}/auth/logout`, {
      method: "GET",
      credentials: "include"
    });

    cb();
  };

  const authVerify = async () => {
    const res = await fetch(`${api}/auth/verify`, {
      method: "GET",
      credentials: "include"
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status < 300) {
      return resjson;
    }
    throw new MError(resjson);
  }

  const verifyAndSetUser = (onFail?: () => void, adminOnly?: boolean) => {
    useEffect(() => {
      authVerify()
        .then((user: User) => {
          if (adminOnly && user.role == "user") {
            if (onFail)
              onFail();
            return;
          }
          userDispatcher({ type: "assign", user });
        })
        .catch( e => {
          console.log("ERR", e);
          if (onFail)
            onFail();
        });
    }, []);
  };

  return {
    authLogin,
    authLogout,
    authVerify,
    authRegister,
    verifyAndSetUser
  }
}
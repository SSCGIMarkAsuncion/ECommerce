import { MError } from "../Utils/Error";

const api = import.meta.env.VITE_API;
// const host = encodeURI(import.meta.env.VITE_HOST);

export default function useAuth() {
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

  return {
    authLogin,
    authLogout,
    authVerify
  }
}
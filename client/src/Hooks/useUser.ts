import User from "../Models/User";
import { MError } from "../Utils/Error";

const api = `${import.meta.env.VITE_API}/users`;
export default function useUsers() {
  const getUsers = async () => {
    const res = await fetch(`${api}/`, {
      credentials: "include"
    });
    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      const mapped = (resjson as any[]).map((u) => new User(u));
      return mapped;
    }
    throw new MError(resjson);
  };

  const updateUser = async (update: User) => {
    const res = await fetch(`${api}/update/${update.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: update.toJson()
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      return new User(resjson);
    }
    throw new MError(resjson);
  };

  const createUser = async (user: User) => {
    const res = await fetch(`${api}/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: user.toJson()
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status <= 399) {
      return new User(resjson);
    }
    throw new MError(resjson);
  };

  const deleteUser = async (user: User) => {
    const res = await fetch(`${api}/delete/${user.id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.status >= 200 && res.status <= 399) {
      return null;
    }
    const resjson = await res.json();
    throw new MError(resjson);
  };

  return {
    getUsers,
    deleteUser,
    updateUser,
    createUser
  };
}
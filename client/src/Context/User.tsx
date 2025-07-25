import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import User from "../Models/User";
import useAuth from "../Hooks/useAuth";
import { MError } from "../Utils/Error";
import { useNavigate } from "react-router";

// NULL = has not been checked yet
// MError = has been verified but is invalid
// User = TOKEN is valid
export type TUserContext = User | null;
export interface TUserContextDispatcher {
  login: (user: User) => Promise<void>,
  logout: () => void,
  error: MError | null
};
const UserContext = createContext<TUserContext>(null);
const UserContextDispatcher = createContext<TUserContextDispatcher | null>(null);

export function useUser() {
  return {
    user: useContext(UserContext),
    userDispatcher: useContext(UserContextDispatcher)!
  };
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [ user, setUser ] = useState<TUserContext>(null);
  const [ error, setError ] = useState<MError | null>(null);
  const { authVerify, authLogout, authLogin } = useAuth();

  const logout = useCallback(async () => {
    authLogout(() => {
      setUser(null);
      setError(null);
    });
  }, []);

  const login = useCallback(async (user: User) => {
    const u = await authLogin(user);
    setUser(u);
  }, []);

  useEffect(() => {
    async function a() {
      try {
        const user = await authVerify();
        setUser(user);
        setError(null);
      }
      catch (e) {
        console.log("ERR::AUTH", e);
        setError(new MError(e));
      }
    }
    a();
  }, [])

  return <UserContext.Provider value={user}>
    <UserContextDispatcher.Provider value={{
      error,
      logout,
      login
    }}>
      {children}
    </UserContextDispatcher.Provider>
  </UserContext.Provider>
}

// use after UserContextProvider
export function AdminOnly({ children }: { children: ReactNode }) {
  const { user, userDispatcher: { error } } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (error || (user && !user.isAdmin())) {
      navigate("/login");
    }
  }, [error, user]);

  if (error || !user) {
    return null;
  }

  return <>
    {children}
  </>;
}

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  const { user, userDispatcher: { error } } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (error || !user) {
      navigate("/");
    }
  }, [error, user]);

    if (error || !user) {
    return null;
  }

  return <>
    {children}
  </>;
}
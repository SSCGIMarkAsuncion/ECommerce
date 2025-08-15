import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import User from "../Models/User";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";
import Loading from "../Components/Loading";

export type TUserContext = User | null;
export interface TUserContextDispatcher {
  login: (user: User) => Promise<void>,
  logout: () => void,
  // error: MError | null,
  loading: boolean
};
const UserContext = createContext<TUserContext>(null);
const UserContextDispatcher = createContext<TUserContextDispatcher | null>(null);

export function useUserContext() {
  return {
    user: useContext(UserContext),
    userDispatcher: useContext(UserContextDispatcher)!
  };
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [ user, setUser ] = useState<TUserContext>(null);
  // const [ error, setError ] = useState<MError | null>(null);
  const [ loading, setLoading ] = useState(true);
  const { authVerify, authLogout, authLogin } = useAuth();

  const logout = useCallback(async () => {
    authLogout(() => {
      setUser(null);
      // setError(null);
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
        // setError(null);
      }
      catch (e) {
        console.log("ERR::CONTEXT_AUTH", e);
        // setError(new MError(e));
      }
      setLoading(false);
    }
    a();
  }, [])

  return <UserContext.Provider value={user}>
    <UserContextDispatcher.Provider value={{
      // error,
      logout,
      login,
      loading
    }}>
      {children}
    </UserContextDispatcher.Provider>
  </UserContext.Provider>
}

// use after UserContextProvider
export function AdminOnly({ children }: { children: ReactNode }) {
  const { user, userDispatcher: { loading } } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user || (user && !user.isAdmin())) {
      navigate("/");
    }
  }, [loading, user]);

  if (loading) {
    return <Loading />
  }

  return <>
    {children}
  </>;
}

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  const { user, userDispatcher: { loading } } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/");
    }
  }, [user, loading]);

  return <>
    {children}
  </>;
} 
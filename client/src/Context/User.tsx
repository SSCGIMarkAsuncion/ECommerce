import { createContext, useContext, useReducer, type ActionDispatch, type ReactNode } from "react";
import User from "../Models/User";

const UserContext = createContext<User | null>(null);
const UserContextDispatcher = createContext<ActionDispatch<[action: UserContextAction]> | null>(null);

export function useUser() {
  return {
    user: useContext(UserContext),
    userDispatcher: useContext(UserContextDispatcher)!
  };
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [ initial, dispatcher ] = useReducer(reducer, null!);

  return <UserContext.Provider value={initial}>
    <UserContextDispatcher.Provider value={dispatcher}>
      {children}
    </UserContextDispatcher.Provider>
  </UserContext.Provider>
}

export interface UserContextAction {
  type: "assign" | "remove",
  user: User | null
};

function reducer(prev: User | null, action: UserContextAction) {
  switch (action.type) {
    case "assign":
      return action.user;
    case "remove":
      return null;
  }
  return prev;
}
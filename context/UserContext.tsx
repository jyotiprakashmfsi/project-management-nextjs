'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface User {
  id?: number;
  email?: string;
  fname?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User ) => void;
  setToken: (token: string ) => void;
  logout: () => void;
} 

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = Cookies.get("user");
    if (savedUser === undefined || savedUser === 'undefined' || savedUser === null) return null;
    return JSON.parse(savedUser);
  });

  const [token, setTokenState] = useState<string | null>(
    Cookies.get("token") || null
  );

  const setToken = (newToken: string) => {
    Cookies.set("token", newToken, { expires: 7 });
    setTokenState(newToken);
  };

  const updateUser = (newUser: User) => {
    console.log("Updating user in context:", newUser);
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 });
    console.log("User cookie set:", Cookies.get("user"));
    setUser(newUser);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setTokenState(null);
  };

  return (
    <UserContext.Provider
      value={{ user, token, setUser: updateUser, setToken, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser is not valid");
  }
  return context;
}

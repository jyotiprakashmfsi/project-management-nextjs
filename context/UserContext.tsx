'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  email?: string | null;
  name?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
} 

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }
    // console.log(session);
    
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name});
      setToken(session.user.accessToken as string || null);
    } else {
      setUser(null);
      setToken(null);
    }
    
    setIsLoading(false);
  }, [session, status]);

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <UserContext.Provider
      value={{ 
        user, 
        token, 
        logout,
        isLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

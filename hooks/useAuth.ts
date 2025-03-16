'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  
  const login = async (provider: string, credentials?: Record<string, string>) => {
    if (provider === 'credentials' && credentials) {
      return await signIn('credentials', {
        redirect: false,
        ...credentials
      });
    }
    return await signIn(provider);
  };
  
  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };
  
  return {
    user: session?.user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}

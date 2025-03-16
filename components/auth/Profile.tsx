'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Profile() {
  const { data: session } = useSession();
  
  if (!session?.user) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div className="flex items-center space-x-4">
        {session.user.image ? (
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <span className="text-indigo-800 dark:text-indigo-200 font-medium text-lg">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {session.user.name || 'User'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {session.user.email}
          </p>
        </div>
      </div>
    </div>
  );
}

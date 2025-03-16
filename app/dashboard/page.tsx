'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session)

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashbaard</h1>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Name:</span> {session?.user?.name || 'N/A'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email:</span> {session?.user?.email || 'N/A'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">User ID:</span> {session?.user?.id || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Projects</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage your projects and tasks</p>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Settings</h3>
                <p className="text-gray-600 dark:text-gray-400">Update your profile and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

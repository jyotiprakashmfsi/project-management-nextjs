'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
        </div>
        <h1 className="text-2xl font-bold text-center text-neutral-800 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-neutral-600 mb-6 text-center">
          We're sorry, but the page you are looking for does not exist.
        </p>
        <div className="flex justify-center">
          <Link href="/" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

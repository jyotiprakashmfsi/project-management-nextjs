"use client";

import ProtectedRoute from "@/components/protected/protected-route";
import Sidebar  from '@/components/sidebar';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
    </ProtectedRoute>
  );
}
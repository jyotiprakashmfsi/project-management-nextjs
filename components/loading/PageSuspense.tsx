import { Suspense, ReactNode } from "react";
import { FullPageSkeleton, DashboardSkeleton } from "@/components/ui/skeleton";

interface PageSuspenseProps {
  children: ReactNode;
  type?: "full" | "dashboard";
}

/**
 * PageSuspense component that wraps content in a Suspense boundary
 * and shows a skeleton loading state while the content is loading
 */
export default function PageSuspense({ 
  children, 
  type = "full" 
}: PageSuspenseProps) {
  return (
    <Suspense fallback={type === "full" ? <FullPageSkeleton /> : <DashboardSkeleton />}>
      {children}
    </Suspense>
  );
}

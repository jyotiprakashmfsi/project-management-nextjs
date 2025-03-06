import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-12 w-12 rounded-full", className)} />;
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-24 rounded-md", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-40 w-full rounded-lg", className)} />;
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

export function FullPageSkeleton() {
  return (
    <div className="w-full h-screen p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <SkeletonText className="h-8 w-64" />
        <div className="flex items-center gap-4">
          <SkeletonButton />
          <SkeletonCircle className="h-10 w-10" />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col gap-4 col-span-1">
          <SkeletonText className="h-6 w-3/4" />
          <SkeletonText className="h-6 w-1/2" />
          <SkeletonText className="h-6 w-2/3" />
          <SkeletonText className="h-6 w-3/5" />
          <SkeletonText className="h-6 w-4/5" />
        </div>

        {/* Content area */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <SkeletonText className="h-7 w-48" />
            <SkeletonButton className="w-32" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 border rounded-lg">
                <SkeletonText className="h-6 w-3/4" />
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-2/3" />
                <div className="flex justify-between items-center mt-4">
                  <SkeletonAvatar />
                  <SkeletonText className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <SkeletonText className="h-8 w-64" />
        <SkeletonButton />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <SkeletonText className="h-6 w-1/2 mb-2" />
            <SkeletonText className="h-8 w-3/4 mb-1" />
            <SkeletonText className="h-4 w-1/3" />
          </div>
        ))}
      </div>
      
      <SkeletonText className="h-7 w-48 mb-4" />
      <div className="grid grid-cols-1 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 border rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <SkeletonCircle className="h-8 w-8" />
              <div>
                <SkeletonText className="h-5 w-40 mb-1" />
                <SkeletonText className="h-4 w-24" />
              </div>
            </div>
            <SkeletonText className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
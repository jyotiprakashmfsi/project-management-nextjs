import { Suspense } from "react";
import PageSuspense from "@/components/loading/PageSuspense";

// This is an async component that simulates data fetching
async function ExampleContent() {
  // Simulate a data fetch that takes some time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Example Page</h1>
      <p className="mb-4">This page demonstrates the use of the PageSuspense component.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Item {item}</h2>
            <p>This is a sample item that was loaded after the skeleton.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExamplePage() {
  return (
    <PageSuspense>
      <ExampleContent />
    </PageSuspense>
  );
}

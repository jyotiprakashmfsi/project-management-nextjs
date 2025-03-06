import { Suspense } from "react";
import PageSuspense from "@/components/loading/PageSuspense";

// This is an async component that simulates data fetching
async function DashboardContent() {
  // Simulate a data fetch that takes some time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">New Project</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {["Total Projects", "In Progress", "Completed"].map((title, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold mb-1">{(i + 1) * 5}</p>
            <p className="text-xs text-green-500">+{i + 2} this week</p>
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
      <div className="grid grid-cols-1 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 border rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <p className="font-medium">Project {i + 1}</p>
                <p className="text-sm text-gray-500">Last updated 2d ago</p>
              </div>
            </div>
            <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PageSuspense type="dashboard">
      <DashboardContent />
    </PageSuspense>
  );
}

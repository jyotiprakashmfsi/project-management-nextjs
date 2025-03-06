import DashboardComponent from "@/components/dashboard";
import Sidebar from "@/components/ui/sidebar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard of project management.",
};


export default function ProjectPage() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className="p-8">
          <div className="flex justify-between">
            <div className="text-black/70 flex gap-2 items-center mb-6">
              <span className="hover:text-black">Tasks Scheduler</span>
              <span>/</span>
              <span className="text-black">Dashboard</span>
            </div>
          </div>
          <DashboardComponent />
        </div>
      </div>
    </div>
  );
}

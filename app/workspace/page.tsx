import Sidebar from "@/components/sidebar";

export default function ProjectPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 w-full">
        <div className="p-8">
          <div className="flex justify-between">
            <div className="text-black/70 flex gap-2 items-center mb-6">
              <span className="hover:text-black">Tasks Scheduler</span>
              <span>/</span>
              <span className="text-black">Project</span>
            </div>
            {/* <NotificationComponent /> */}
          </div>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
}

import ProjectComponent from "@/components/project/project-component";
import Sidebar from "@/components/ui/sidebar";



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
              <span className="text-black">Project</span>
            </div>
            {/* <NotificationComponent /> */}
          </div>
          <ProjectComponent/>
        </div>
      </div>
    </div>
  );
}

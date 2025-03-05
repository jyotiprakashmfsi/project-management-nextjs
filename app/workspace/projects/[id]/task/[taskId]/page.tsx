import Sidebar from "@/components/ui/sidebar";
import TaskDetails from "@/components/tasks/task-details";

export default function TasksPage() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className="p-8">
          <div className="flex justify-between">
            <div className="text-neutral-500 flex gap-2 items-center mb-6">
              <span className="hover:text-black">Tasks Scheduler</span>
              <span>/</span>
              <span className="hover:text-black">Project</span>
              <span>/</span>
              <span className="text-black">Task</span>
            </div>
          </div>
          <TaskDetails />
        </div>
      </div>
    </div>
  );
}

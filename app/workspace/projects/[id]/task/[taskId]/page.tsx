import Sidebar from "@/components/sidebar";
import TaskDetails from "@/components/tasks/task-details";

export default function TasksPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className="p-8">
          <div className="flex justify-between">
            <div className="text-black/70 flex gap-2 items-center mb-6">
              <span className="hover:text-black">Tasks Scheduler</span>
              <span>/</span>
              <span className="text-black">Tasks</span>
            </div>
          </div>
          <TaskDetails />
        </div>
      </div>
    </div>
  );
}

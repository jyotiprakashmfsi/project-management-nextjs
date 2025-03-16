import { Metadata, ResolvingMetadata } from "next";
import { TaskService } from "@/services/api-services/taskService";
import { ProjectService } from "@/services/api-services/projectService";
import Sidebar from "@/components/ui/sidebar";
import TaskDetails from "@/components/tasks/task-details";

type Props = {
  params: { id: string; taskId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const projectId = parseInt(params.id);
  const taskId = parseInt(params.taskId);
  
  const taskService = new TaskService();
  const projectService = new ProjectService();
  
  const [task, project] = await Promise.all([
    taskService.getTaskById(taskId),
    projectService.getProjectById(projectId)
  ]);
  
  const projectName = project ? project.project_name : "Project";
  const taskName = task ? task.title : "Task";
  const taskDescription = task ? task.description : "Task details";
  const taskStatus = task ? task.status : "unknown";
  
  return {
    title: `${taskName} | ${projectName}`,
    description: taskDescription,
    openGraph: {
      title: `${taskName} | ${projectName}`,
      description: taskDescription,
      type: "website",
    },
    other: {
      "task-status": taskStatus,
      "project-id": projectId.toString(),
      "task-id": taskId.toString(),
    }
  };
}

async function TasksPage({ params }: Props) {

  
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

export default TasksPage;

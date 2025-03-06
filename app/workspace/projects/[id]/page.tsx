import { Metadata, ResolvingMetadata } from "next";
import { ProjectService } from "@/services/api-services/projectService";
import Sidebar from "@/components/ui/sidebar";
import ProjectComponent from "@/components/project/project-component";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate metadata dynamically based on project data
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = parseInt(params.id);
  
  // Fetch project data
  const projectService = new ProjectService();
  const project = await projectService.getProjectById(id);
  
  const title = project ? `${project.name} | Project Details` : "Project Details";
  const description = project ? project.description : "View project details and tasks";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

async function ProjectPage({ params }: Props) {
  const id = parseInt(params.id);
  
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
          </div>
          <ProjectComponent />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;

import NewProjectComponent from "@/components/project/new-project";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Project",
  description: "Create new project.",
};

export default function NewProjectPage() {

  return (
    <div>
      <NewProjectComponent/>
    </div>
  );
}

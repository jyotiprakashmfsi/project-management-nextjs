import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Overview of a running project.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
        {children}
    </div>
  );
}
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams",
  description: "Teams",
};

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
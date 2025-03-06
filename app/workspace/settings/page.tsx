import SettingsPageComponent from "@/components/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page of project management.",
};


export default function SignupPage() {

  return (
    <div>
      <SettingsPageComponent/>
    </div>
  );
}

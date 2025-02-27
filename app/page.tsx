"use client"
import { useRouter } from "next/navigation";
import heroImage from "../assets/heroImage.png";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";

export default function HomeComponent() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">
            Project Management
          </div>
          <div className="flex gap-4 text-black items-center">
            <p>
              {mounted && user ? "Hello " + user.fname : ""}
            </p>
            <button
              onClick={handleGetStarted}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {mounted ? (user ? "Dashboard" : "Login") : "Loading..."}
            </button> 
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 flex items-center">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl text-black font-bold leading-tight">
              Connect every team, task, and project together and{" "}
                <span className="text-indigo-600">Stay on Track</span>
              </h1>
              <p className="text-xl text-black">
                Boost your productivity with our intuitive project management
                platform.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Start Now
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* <Image src={heroImage} alt="Task Scheduler" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
import heroImage from "../../public/heroImage.png";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">
            Project Management
          </div>
          <div className="flex gap-4 text-black items-center">
            <p className="font-medium">
              {mounted && user ? "Hello " + user.fname : ""}
            </p>
            <button
              onClick={handleGetStarted}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {mounted ? (user ? "Dashboard" : "Login") : "Loading..."}
            </button> 
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      <div className="min-h-screen relative flex items-center">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-6xl text-black font-bold leading-tight">
                Connect every team, task, and project together and{" "}
                <span className="text-indigo-600 relative">
                  Stay on Track
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-indigo-200 -z-10 transform -rotate-1"></span>
                </span>
              </h1>
              <p className="text-xl text-gray-700">
                Boost your productivity with our intuitive project management
                platform. Streamline workflows, collaborate seamlessly, and deliver projects on time.
              </p>
              <div className="flex gap-4 items-center">
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Now
                </motion.button>
                
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
              <div className="relative bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-2xl overflow-hidden border border-indigo-100">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative z-10"
                >
                  <Image 
                    src={heroImage} 
                    alt="Task Scheduler" 
                    className="rounded-lg transform hover:scale-[1.02] transition-transform duration-500"
                    priority
                  />
                </motion.div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                className="absolute -top-6 -right-6 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Easy to use</span>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <span className="text-indigo-500 text-xl">⚡</span>
                <span className="font-medium">Boost productivity</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

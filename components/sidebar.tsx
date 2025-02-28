'use client';

import React from 'react';
import Link from 'next/link';
import {
  RiDashboardLine,
  RiSettings4Line,
  RiTeamLine,
  RiLogoutCircleLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiHomeSmile2Line,
  RiFolder2Line,
  RiUserLine,
  RiTaskLine,
} from "react-icons/ri";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { projectUserApi } from "@/services/client-services/project-users/api";
import { useRouter } from 'next/navigation';

interface Project {
  project_id: number;
  project_name: string;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a browser environment before accessing window
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setIsSidebarOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const menuItems = [
    { path: "/", label: "Home", icon: <RiHomeSmile2Line size={20} /> },
    {
      path: "/workspace",
      label: "Dashboard",
      icon: <RiDashboardLine size={20} />,
    },
    { path: "/workspace/teams", label: "Teams", icon: <RiTeamLine size={20} /> },
    {
      path: "/workspace/settings",
      label: "Settings",
      icon: <RiSettings4Line size={20} />,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUserProjects();
    }
  }, [user]);

  const fetchUserProjects = async () => {
    try {
      if (!user?.id) throw new Error('User not found');
      const userProjects = await projectUserApi.getUserProjects(user!.id);
      console.log("userProjects", userProjects)
      setProjects(userProjects);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: number) => {
    if (router) {
      router.push(`/projects/${projectId}`);
    }
  };

  return (
    <aside className="w-64 z-50 h-full text-white">
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          {isSidebarOpen ? (
            <RiCloseLine size={24} className="text-gray-800" />
          ) : (
            <RiMenuLine size={24} className="text-gray-800" />
          )}
        </button>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Project Manager</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      if (router) {
                        router.push(item.path);
                      }
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-md transition-colors ${
                      location?.pathname === item.path
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}

              <li>
                <div className="px-4 py-2">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <RiFolder2Line size={20} />
                      <span>My Projects</span>
                    </div>
                    {showDropdown ? (
                      <RiArrowUpSLine size={20} />
                    ) : (
                      <RiArrowDownSLine size={20} />
                    )}
                  </button>

                  {showDropdown && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {loading ? (
                        <li className="text-sm text-gray-500 py-1">
                          Loading...
                        </li>
                      ) : projects.length > 0 ? (
                        projects.map((project) => (
                          <li key={project.project_id}>
                            <button
                              onClick={() => {
                                if (router) {
                                  router.push(`/workspace/projects/${project.project_id}`);
                                }
                              }}
                              className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors"
                            >
                              {project.project_name}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500 py-1">
                          No projects found
                        </li>
                      )}
                    </ul>
                  )}

                  {showDropdown && (
                    <ul className="mt-2 space-y-1">
                      <li>
                        <button
                          onClick={() => {
                            if (router) {
                              router.push('/workspace/projects/new');
                            }
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <span>+ New Project</span>
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </ul>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <RiUserLine size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.fname || "User"}</p>
                <p className="text-sm text-gray-500">{user?.email || ""}</p>
              </div>
            </div>

            <div className="mt-4">
              <button
                    onClick={() => {
                      logout();
                      if (router) {
                        router.push("/login");
                      }
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <RiLogoutCircleLine size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </aside>
  );
};

export default Sidebar;

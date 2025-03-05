'use client';
import { useEffect, useState } from "react";
import { projectApi } from "@/services/client-services/project/api";
import { taskApi } from "@/services/client-services/tasks/api";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { FiClock, FiCheckCircle, FiAlertCircle, FiActivity, FiUsers } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { projectUserApi } from "@/services/client-services/project-users/api";
import { useUser } from "@/context/UserContext";

export default function DashboardComponent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  });
  const router = useRouter();
  const { user } = useUser();


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch projects
        const projectsData = await projectUserApi.getUserProjects(user?.id || 0);
        console.log("projectsData", projectsData)
        setProjects(projectsData || []);
        setStats(prev => ({ ...prev, totalProjects: projectsData.total || 0 }));

        // Fetch recent tasks
        const tasksData = await taskApi.getUserTasks(user?.id || 0);
        setRecentTasks(tasksData.tasks || []);

        // Calculate task statistics
        if (tasksData.data) {
          const completed = tasksData.data.filter((task: Task) => task.status === 'completed').length;
          const inProgress = tasksData.data.filter((task: Task) => task.status === 'in-progress').length;
          const notStarted = tasksData.data.filter((task: Task) => task.status === 'not-started').length;
          
          setStats(prev => ({
            ...prev,
            completedTasks: completed,
            inProgressTasks: inProgress,
            pendingTasks: notStarted
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-neutral-500';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-6 text-black">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-indigo-100 p-3 mr-4">
                <FiActivity className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Projects</p>
                <p className="text-2xl font-semibold">{stats.totalProjects}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Completed Tasks</p>
                <p className="text-2xl font-semibold">{stats.completedTasks}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <FiClock className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">In Progress</p>
                <p className="text-2xl font-semibold">{stats.inProgressTasks}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <FiAlertCircle className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Pending Tasks</p>
                <p className="text-2xl font-semibold">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>
          
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
            </div>
            <div className="p-6">
              {projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">{project.project_name}</div>
                            <div className="text-sm text-neutral-500 truncate max-w-xs">{project.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
                                project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-neutral-100 text-neutral-800'}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {formatDate(project.createdAt || '')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => router.push(`/project/${project.id}`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-neutral-500">No projects found</p>
                  <button 
                    onClick={() => router.push('/projects/new')}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Project
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
            </div>
            <div className="p-6">
              {recentTasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {recentTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">{task.title}</div>
                            <div className="text-sm text-neutral-500 truncate max-w-xs">{task.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`${getPriorityColor(task.priority)} font-medium`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {formatDate(task.end_time)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-neutral-500">No tasks found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions and Task Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/workspace/projects/new')}
                  className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 flex items-center"
                >
                  <span className="mr-2">+</span> Create New Project
                </button>
                <button 
                  onClick={() => router.push('/workspace/teams')}
                  className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 flex items-center"
                >
                  <FiUsers className="mr-2" /> Manage Team
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Task Status</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">Completed</span>
                    <span className="text-sm font-medium text-neutral-700">
                      {stats.completedTasks}/{stats.completedTasks + stats.inProgressTasks + stats.pendingTasks || 1}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${stats.completedTasks + stats.inProgressTasks + stats.pendingTasks > 0 
                          ? (stats.completedTasks / (stats.completedTasks + stats.inProgressTasks + stats.pendingTasks)) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">In Progress</span>
                    <span className="text-sm font-medium text-neutral-700">
                      {stats.inProgressTasks}/{stats.completedTasks + stats.inProgressTasks + stats.pendingTasks || 1}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ 
                        width: `${stats.completedTasks + stats.inProgressTasks + stats.pendingTasks > 0 
                          ? (stats.inProgressTasks / (stats.completedTasks + stats.inProgressTasks + stats.pendingTasks)) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">Pending</span>
                    <span className="text-sm font-medium text-neutral-700">
                      {stats.pendingTasks}/{stats.completedTasks + stats.inProgressTasks + stats.pendingTasks || 1}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ 
                        width: `${stats.completedTasks + stats.inProgressTasks + stats.pendingTasks > 0 
                          ? (stats.pendingTasks / (stats.completedTasks + stats.inProgressTasks + stats.pendingTasks)) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

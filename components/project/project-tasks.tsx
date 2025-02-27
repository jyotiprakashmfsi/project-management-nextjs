'use client';
import { useEffect, useState } from "react";
import { Task } from "../../types/task";
import TaskModal from "../tasks/task-modal";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { projectUserApi } from "@/services/client-services/project-users/api";
import { taskApi } from "@/services/client-services/tasks/api";
import { useRouter } from "next/navigation";

interface ProjectTasksProps {
    projectId: number;
}

interface ProjectUser {
    id: number;
    fname: string;
    email: string;
    user_id: number;
}

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const fetchProjectUsers = async () => {
        try {
            const users = await projectUserApi.getProjectUsers(projectId);
            console.log("users", users);
            setProjectUsers(users.users);
        } catch (error) {
            console.error("Failed to fetch project users:", error);
        }
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const projectTasks = await taskApi.getProjectTasks(projectId);
            setTasks(projectTasks);
        } catch (error) {
            toast.error("Failed to fetch project tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchTasks();
            fetchProjectUsers();
        }
    }, [projectId]);

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        
        try {
            await taskApi.deleteTask(taskId);
            toast.success("Task deleted successfully");
            fetchTasks();
        } catch (error) {
            toast.error("Failed to delete task");
        }
        setOpenMenuId(null);
    };

    const handleViewTask = (taskId: number) => {
        router?.push(`${projectId}/task/${taskId}`);
    };

    const getAssignedUserName = (userId: number) => {
        const user = projectUsers.find(u => u.user_id === userId);
        return user ? user.fname : "Unassigned";
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 text-black">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl text-black font-bold">Tasks</h2>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border rounded-md px-3 py-1.5 text-sm bg-gray-100 text-gray-800 focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button
                    onClick={handleCreateTask}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Create Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks
                    .filter(task => selectedStatus === 'all' || task.status === selectedStatus)
                    .map((task) => (
                    <div
                        key={task.id}
                        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow relative"
                        onClick={() => handleViewTask(task.id)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === task.id ? null : task.id);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <BsThreeDotsVertical className="h-5 w-5 text-gray-500" />
                                </button>
                                {openMenuId === task.id && (
                                    <div 
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit Task
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete Task
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>
                        <div className="flex gap-2 text-sm mb-2">
                            <span className={`px-2 py-1 rounded ${
                                task.status === 'not-started' ? 'bg-gray-100 text-gray-800' :
                                task.status === 'started' ? 'bg-blue-100 text-blue-800' :
                                task.status === 'finished' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Due: {new Date(task.end_time).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                {getAssignedUserName(task.assigned_to)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={selectedTask}
                    projectId={projectId}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchTasks();
                    }}
                />
            )}
        </div>
    );
}

'use client';
import { useEffect, useState, useRef } from "react";
import { Task } from "../../types/task";
import TaskModal from "../tasks/task-modal";
import TaskSlider from "../tasks/task-slider";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { projectUserApi } from "@/services/client-services/project-users/api";
import { taskApi } from "@/services/client-services/tasks/api";
import { useRouter } from "next/navigation";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ProjectTasksProps {
    projectId: number;
}

interface ProjectUser {
    id: number;
    fname: string;
    email: string;
    user_id: number;
}

const TASK_STATUS = {
    NOT_STARTED: 'not-started',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed'
};

const ItemTypes = {
    TASK: 'task'
};

interface TaskDragItem {
    id: number;
    status: string;
}

const TaskCard = ({ 
    task, 
    onEdit, 
    onDelete, 
    onView, 
    getAssignedUserName, 
    openMenuId, 
    setOpenMenuId,
    onDrop,
    projectId
}: {task: Task, onEdit: (task: Task) => void, onDelete: (id: number) => void, onView: (id: number) => void, getAssignedUserName: (id: number) => string, openMenuId: number | null, setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>, onDrop: (id: number, status: string) => void, projectId: number}) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id, status: task.status } as TaskDragItem,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    
    drag(dragRef);
    const router = useRouter();


    return (
        <div
            ref={dragRef}
            key={task.id}
            className={`bg-white rounded-lg shadow-md p-4 cursor-move hover:shadow-lg transition-shadow relative mb-3 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            onClick={(e) => {
                e.stopPropagation();
                onView(task.id);
            }}
            style={{ opacity: isDragging ? 0.5 : 1 }}
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
                                onClick={() => router?.push(`${projectId}/task/${task.id}`)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => onEdit(task)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Edit Task
                            </button>
                            <button
                                onClick={() => onDelete(task.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Delete Task
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>
            <div className="flex justify-between flex-col md:flex-row sm:items-center items-start text-sm text-gray-500 mb-3">
                <span>Due: {new Date(task.end_time).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                    }`}></span>
                    {getAssignedUserName(task.assigned_to)}
                </span>
            </div>
        </div>
    );
};

const TaskColumn = ({ title, status, tasks, onDrop, children }: { title: string, status: string, tasks: Task[], onDrop: (id: number, status: string) => void, children: React.ReactNode }) => {
    const dropRef = useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item: TaskDragItem) => onDrop(item.id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    
    drop(dropRef);

    return (
        <div 
            ref={dropRef} 
            className={`bg-gray-50 p-4 rounded-lg shadow transition-colors duration-200 ${isOver ? 'bg-blue-100 border-2 border-blue-300' : ''}`}
        >
            <h3 className="font-semibold text-lg mb-4 text-gray-800 text-center">{title}</h3>
            <div className="min-h-[200px]">
                {children}
            </div>
        </div>
    );
};

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

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
            console.log("Tasks fetched:", projectTasks);
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
        setSelectedTaskId(taskId);
        setIsSliderOpen(true);
    };

    const getAssignedUserName = (userId: number) => {
        const user = projectUsers.find(u => u.user_id === userId);
        return user ? user.fname : "Unassigned";
    };

    const handleTaskDrop = async (taskId: number, newStatus: string) => {
        try {
            const taskToUpdate = tasks.find(task => task.id === taskId);
            if (!taskToUpdate || taskToUpdate.status === newStatus) return;

            // optimistically update UI
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );

            // update in backend
            await taskApi.updateTask(taskId, { status: newStatus });
            toast.success(`Task moved to ${newStatus.replace(/-/g, ' ')}`);
        } catch (error) {
            toast.error("Failed to update task status");
            fetchTasks();
        }
    };

    if (loading) return <div>Loading...</div>;

    // filter tasks by status
    const notStartedTasks = tasks.filter(task => task.status === TASK_STATUS.NOT_STARTED);
    const inProgressTasks = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
    const completedTasks = tasks.filter(task => task.status === TASK_STATUS.COMPLETED);

    return (
        <DndProvider backend={HTML5Backend}>
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
                            <option value={TASK_STATUS.NOT_STARTED}>Not Started</option>
                            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                            <option value={TASK_STATUS.COMPLETED}>Completed</option>
                        </select>
                    </div>
                    <button
                        onClick={handleCreateTask}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Create Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TaskColumn 
                        title="Not Started" 
                        status={TASK_STATUS.NOT_STARTED} 
                        tasks={notStartedTasks} 
                        onDrop={handleTaskDrop}
                    >
                        {selectedStatus === 'all' || selectedStatus === TASK_STATUS.NOT_STARTED ? (
                            notStartedTasks.length > 0 ? (
                                notStartedTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onView={handleViewTask}
                                        getAssignedUserName={getAssignedUserName}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                        onDrop={handleTaskDrop}
                                        projectId={projectId}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-400 text-center py-4">No tasks</div>
                            )
                        ) : null}
                    </TaskColumn>

                    <TaskColumn 
                        title="In Progress" 
                        status={TASK_STATUS.IN_PROGRESS} 
                        tasks={inProgressTasks} 
                        onDrop={handleTaskDrop}
                    >
                        {selectedStatus === 'all' || selectedStatus === TASK_STATUS.IN_PROGRESS ? (
                            inProgressTasks.length > 0 ? (
                                inProgressTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onView={handleViewTask}
                                        getAssignedUserName={getAssignedUserName}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                        onDrop={handleTaskDrop}
                                        projectId={projectId}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-400 text-center py-4">No tasks</div>
                            )
                        ) : null}
                    </TaskColumn>

                    <TaskColumn 
                        title="Completed" 
                        status={TASK_STATUS.COMPLETED} 
                        tasks={completedTasks} 
                        onDrop={handleTaskDrop}
                    >
                        {selectedStatus === 'all' || selectedStatus === TASK_STATUS.COMPLETED ? (
                            completedTasks.length > 0 ? (
                                completedTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onView={handleViewTask}
                                        getAssignedUserName={getAssignedUserName}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                        onDrop={handleTaskDrop}
                                        projectId={projectId}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-400 text-center py-4">No tasks</div>
                            )
                        ) : null}
                    </TaskColumn>
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

                <TaskSlider
                    taskId={selectedTaskId}
                    isOpen={isSliderOpen}
                    onClose={() => setIsSliderOpen(false)}
                    onTaskUpdated={fetchTasks}
                />
            </div>
        </DndProvider>
    );
}

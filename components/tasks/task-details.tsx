'use client';
import React, { useEffect, useRef, useState } from "react";
import { Task } from "../../types/task";
import { taskApi } from "../../services/client-services/tasks/api";
import toast from "react-hot-toast";
import { projectUserApi } from "../../services/client-services/project-users/api";
import { BsCalendar3, BsClock, BsPerson, BsFlag, BsCheckCircle, BsPaperclip, BsDownload } from "react-icons/bs";
import { useUser } from "../../context/UserContext";
import { client } from "@/utils/filestack";
import { getLocalTimeString } from "@/helper/date";
import { useParams } from "next/navigation";

interface ProjectUser {
    id: number;
    fname: string;
    email: string;
    user_id: number;
}

interface FileUpload {
    url: string;
    filename: string;
}

export default function TaskDetails() {
    const params = useParams();
    const tId= params.taskId;
    const taskId= Array.isArray(tId) ? tId[0] : tId;
    const [task, setTask] = useState<Task | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {user} = useUser();

    const fetchProjectUsers = async (projectId: number) => {
        try {
            const response = await projectUserApi.getProjectUsers(projectId);
            setProjectUsers(response.users);
        } catch (error) {
            console.error("Failed to fetch project users:", error);
        }
    };

    const fetchTask = async () => {
        if (!taskId) return;
        try {
            setLoading(true);
            // console.log("Params are: ", params);
            const taskData = await taskApi.getTaskById(parseInt(taskId));
            setTask(taskData.task);
            console.log("taskData", taskData)
            if (taskData.task.project_id) {
                fetchProjectUsers(taskData.task.project_id);
            }
        } catch (error) {
            console.error("Error fetching task:", error);
            toast.error("Failed to fetch task details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [task?.task_json?.messages]);

    const getAssignedUserName = (userId: number) => {
        const user = projectUsers.find((u) => u.user_id === userId);
        return user ? user.fname : "Unknown User";
    };

    const handleFileUpload = async () => {
        try {
            const result = await client.picker({
                fromSources: ["local_file_system", "url"],
                maxFiles: 5,
                uploadInBackground: false,
                onUploadDone: (res) => {
                    const files = res.filesUploaded.map(file => ({
                        url: file.url,
                        filename: file.filename
                    }));
                    setUploadedFiles(prev => [...prev, ...files]);
                    toast.success("Files uploaded successfully");
                }
            }).open();
            console.log("result", result)
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file");
        }
    };

    const handleAddMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || (!newMessage.trim() && uploadedFiles.length === 0)) return;

        const updatedTask = {
            ...task,
            status: "in-progress",
            task_json: {
                messages: [
                    ...(task.task_json?.messages || []),
                    {
                        content: newMessage,
                        posted_at: getLocalTimeString(new Date()),
                        posted_by: user?.id || 0,
                        files: uploadedFiles.length > 0 ? uploadedFiles : undefined
                    }
                ]
            }
        };
        console.log("updatedTask", updatedTask)

        try {
            await taskApi.updateTask(task.id, updatedTask);
            setNewMessage("");
            setUploadedFiles([]);
            fetchTask();
            toast.success("Message added successfully");
        } catch (error) {
            console.error("Error adding message:", error);
            toast.error("Failed to add message");
        }
    };

    const handleMarkAsComplete = async () => {
        if (!task) return;

        const updatedTask = {
            ...task,
            status: "completed",
            task_json: {
                messages: [
                    ...(task.task_json?.messages || []),
                    {
                        content: "Task marked as complete",
                        posted_at: getLocalTimeString(new Date()),
                        posted_by: user?.id || 0,
                    }
                ]
            }
        };

        try {
            await taskApi.updateTask(task.id, updatedTask);
            fetchTask();
            toast.success("Task marked as complete");
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status");
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;
    if (!task) return <div className="flex items-center justify-center text-black h-full">Task not found</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-gray-50 -mb-4 text-black">
            <div className="bg-white p-6 shadow-sm">
                <div className="flex justify-between sm:flex-row flex-col sm:items-center items-start mb-4">
                    <h1 className="text-2xl font-bold text-black">{task.title}</h1>
                    {task.status !== 'completed' && (
                        <button
                            onClick={handleMarkAsComplete}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            <BsCheckCircle />
                            Mark as Complete
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <BsPerson className="text-gray-400" />
                        <div>
                            <div className="text-sm text-gray-500">Assigned To</div>
                            <div className="font-medium">{getAssignedUserName(task.assigned_to)}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BsCalendar3 className="text-gray-400" />
                        <div>
                            <div className="text-sm text-gray-500">Due Date</div>
                            <div className="font-medium">{getLocalTimeString(new Date(task.end_time))}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BsFlag className="text-gray-400" />
                        <div>
                            <div className="text-sm text-gray-500">Priority</div>
                            <div className="font-medium capitalize">{task.priority}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <BsClock className="text-gray-400" />
                        <div>
                            <div className="text-sm text-gray-500">Status</div>
                            <div className={`font-medium capitalize ${
                                task.status === 'completed' ? 'text-green-600' :
                                task.status === 'in-progress' ? 'text-blue-600' :
                                'text-gray-600'
                            }`}>
                                {task.status.replace('-', ' ')}
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4">{task.description}</p>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-2 font-mono text-sm">
                        {task.task_json?.messages.map((message: any, index: any) => (
                            <div key={index} className="flex mb-3">
                                <div className="flex items-start gap-2 text-gray-600">
                                    <span className="text-gray-400 min-w-[150px]">{getLocalTimeString(new Date(message.posted_at))}</span>
                                    <span className="text-blue-600 min-w-[120px]">{getAssignedUserName(message.posted_by)}</span>
                                    <span>{message.content}</span>
                                </div>
                                {message.files && message.files.length > 0 && (
                                    <div className=" ml-4 flex flex-col gap-1">
                                        {message.files.map((file: any, fileIndex: any) => (
                                            <a
                                                key={fileIndex}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <BsDownload className="text-sm" />
                                                {file.filename}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-4 bg-white border-t">
                    {uploadedFiles.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    <BsPaperclip className="text-gray-500" />
                                    <span className="text-gray-700">{file.filename}</span>
                                    <button
                                        onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleAddMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleFileUpload}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <BsPaperclip />
                            Attach
                        </button>
                        <button
                            type="submit"
                            disabled={!newMessage.trim() && uploadedFiles.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

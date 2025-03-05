"use client";
import React, { useEffect, useRef, useState } from "react";
import { Task } from "../../types/task";
import { taskApi } from "../../services/client-services/tasks/api";
import toast from "react-hot-toast";
import { projectUserApi } from "../../services/client-services/project-users/api";
import {
  BsCalendar3,
  BsClock,
  BsPerson,
  BsFlag,
  BsCheckCircle,
  BsPaperclip,
  BsDownload,
  BsX,
} from "react-icons/bs";
import { useUser } from "../../context/UserContext";
import { client } from "@/utils/filestack";
import { getLocalTimeString } from "@/helper/date";

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

interface TaskSliderProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export default function TaskSlider({
  taskId,
  isOpen,
  onClose,
  onTaskUpdated,
}: TaskSliderProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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
      const taskData = await taskApi.getTaskById(taskId);
      setTask(taskData.task);
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
    if (isOpen && taskId) {
      fetchTask();
    }
  }, [isOpen, taskId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [task?.task_json?.messages]);

  const getAssignedUserName = (userId: number) => {
    const user = projectUsers.find((u) => u.user_id === userId);
    return user ? user.fname : "Unknown User";
  };

  const handleFileUpload = async () => {
    try {
      const result = await client
        .picker({
          fromSources: ["local_file_system", "url"],
          maxFiles: 5,
          uploadInBackground: false,
          onUploadDone: (res) => {
            const files = res.filesUploaded.map((file) => ({
              url: file.url,
              filename: file.filename,
            }));
            setUploadedFiles((prev) => [...prev, ...files]);
            toast.success("Files uploaded successfully");
          },
        })
        .open();
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
            files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
          },
        ],
      },
    };

    try {
      await taskApi.updateTask(task.id, updatedTask);
      setNewMessage("");
      setUploadedFiles([]);
      fetchTask();
      onTaskUpdated();
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
          },
        ],
      },
    };

    try {
      await taskApi.updateTask(task.id, updatedTask);
      fetchTask();
      onTaskUpdated();
      toast.success("Task marked as complete");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-xl">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-black">Task Details</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <BsX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  Loading...
                </div>
              ) : !task ? (
                <div className="flex items-center justify-center h-full text-black">
                  Task not found
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="bg-white">
                    <div className="flex justify-between sm:flex-row flex-col sm:items-center items-start mb-4">
                      <h1 className="text-2xl font-bold text-black">
                        {task.title}
                      </h1>
                      {task.status !== "completed" && (
                        <button
                          onClick={handleMarkAsComplete}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <BsCheckCircle />
                          Mark as Complete
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <BsPerson className="text-neutral-400" />
                        <div>
                          <div className="text-sm text-neutral-500">
                            Assigned To
                          </div>
                          <div className="font-medium">
                            {getAssignedUserName(task.assigned_to)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BsCalendar3 className="text-neutral-400" />
                        <div>
                          <div className="text-sm text-neutral-500">
                            Due Date
                          </div>
                          <div className="font-medium">
                            {getLocalTimeString(new Date(task.end_time))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BsFlag className="text-neutral-400" />
                        <div>
                          <div className="text-sm text-neutral-500">
                            Priority
                          </div>
                          <div className="font-medium capitalize">
                            {task.priority}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BsClock className="text-neutral-400" />
                        <div>
                          <div className="text-sm text-neutral-500">Status</div>
                          <div className="font-medium capitalize">
                            {task.status.replace(/-/g, " ")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <h3 className="text-lg font-medium mb-2">Activity</h3>
                    <div className="flex-1 overflow-y-auto p-6">
                              <div className="space-y-2 font-mono text-sm">
                                {task.task_json?.messages.map(
                                  (message: any, index: any) => (
                                    <div key={index} className="flex mb-3">
                                      <div className="flex items-start gap-2 text-neutral-600">
                                        <span className="text-blue-600 min-w-[120px]">
                                          {getAssignedUserName(
                                            message.posted_by
                                          )}
                                        </span>
                                        <span>{message.content}</span>
                                      </div>
                                      {message.files &&
                                        message.files.length > 0 && (
                                          <div className=" ml-4 flex flex-col gap-1">
                                            {message.files.map(
                                              (file: any, fileIndex: any) => (
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
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  )
                                )}
                                <div ref={messagesEndRef} />
                              </div>
                            </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Message Input */}
            {task && task.status !== "completed" && (
              <div className="border-t p-4">
                <form onSubmit={handleAddMessage} className="space-y-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    rows={3}
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <BsPaperclip className="text-gray-500" />
                            <span className="text-sm truncate max-w-[200px]">
                              {file.filename}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setUploadedFiles((files) =>
                                files.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <BsX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <BsPaperclip />
                      Attach
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      disabled={
                        !newMessage.trim() && uploadedFiles.length === 0
                      }
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

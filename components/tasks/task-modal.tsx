import { useEffect, useState } from 'react';
import { Task, TaskCreateData } from '../../types/task';
import toast from 'react-hot-toast';
import { projectUserApi } from '@/services/client-services/project-users/api';
import { taskApi } from '@/services/client-services/tasks/api';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    projectId: number;
    onSuccess: () => void;
}

export default function TaskModal({ isOpen, onClose, task, projectId, onSuccess }: TaskModalProps) {
    const [formData, setFormData] = useState<TaskCreateData>({
        title: '',
        description: '',
        status: 'not-started',
        end_time: new Date().toISOString().split('T')[0],
        project_id: projectId,
        assigned_to: 0,
        priority: 'medium',
        task_json: {
            messages: []
        }
    });
    const [users, setUsers] = useState<{ id: number; fname: string; user_id: number }[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                end_time: new Date(task.end_time).toISOString().split('T')[0],
                project_id: task.project_id,
                assigned_to: task.assigned_to,
                priority: task.priority || 'medium',
                task_json: task.task_json || { messages: [] }
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'not-started',
                end_time: new Date().toISOString().split('T')[0],
                project_id: projectId,
                assigned_to: 0,
                priority: 'medium',
                task_json: {
                    messages: []
                }
            });
        }
    }, [task, projectId]);

    const fetchUsers = async () => {
        try {
            const response = await projectUserApi.getProjectUsers(projectId);
            console.log("users", response.users)
            setUsers(response.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("formData", formData)
        
        try {
            if (task) {
                await taskApi.updateTask(task.id, formData);
                toast.success('Task updated successfully');
            } else {
                await taskApi.createTask(formData);
                toast.success('Task created successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(task ? 'Failed to update task' : 'Failed to create task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed text-black inset-0 z-50 overflow-y-auto bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
                                Assign To
                            </label>
                            <select
                                id="assigned_to"
                                value={formData.assigned_to}
                                onChange={(e) => setFormData({ ...formData, assigned_to: Number(e.target.value) })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.user_id}>{user.fname}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="not-started">Not Started</option>
                                <option value="started">In Progress</option>
                                <option value="finished">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {task ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

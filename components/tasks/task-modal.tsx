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
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        assigned_to?: string;
        priority?: string;
        end_time?: string;
    }>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: 'not-started',
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
        // Clear errors when task changes
        setErrors({});
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

    const validateField = (name: string, value: any) => {
        let error = '';
        
        switch (name) {
            case 'title':
                if (!value.trim()) {
                    error = 'Title is required';
                } else if (value.trim().length < 3) {
                    error = 'Title must be at least 3 characters';
                } else if (value.trim().length > 100) {
                    error = 'Title must be less than 100 characters';
                }
                break;
            case 'description':
                if (value.trim().length > 500) {
                    error = 'Description must be less than 500 characters';
                }
                break;
            case 'assigned_to':
                if (!value) {
                    error = 'Please assign this task to a user';
                }
                break;
            case 'end_time':
                if (!value) {
                    error = 'End time is required';
                } else {
                    const endDate = new Date(value);
                    const today = new Date();
                    if (endDate < today) {
                        error = 'End time cannot be in the past';
                    }
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing again
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields before submission
        const newErrors: any = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (['title', 'description', 'assigned_to', 'end_time'].includes(key)) {
                const error = validateField(key, value);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors before submitting');
            return;
        }
        
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
        <div className="fixed text-black inset-0 z-50 overflow-y-auto bg-gray-900/50 bg-opacity-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                <div className="p-6">
                    <h3 id="task-modal-title" className="text-lg font-medium text-gray-900 mb-4">
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
                                name="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600" id="title-error" role="alert">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                onBlur={handleBlur}
                                rows={3}
                                className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600" id="description-error" role="alert">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
                                Assign To
                            </label>
                            <select
                                id="assigned_to"
                                name="assigned_to"
                                value={formData.assigned_to}
                                onChange={(e) => handleChange('assigned_to', Number(e.target.value))}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full rounded-md border ${errors.assigned_to ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.assigned_to}
                                aria-describedby={errors.assigned_to ? "assigned-to-error" : undefined}
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.user_id}>{user.fname}</option>
                                ))}
                            </select>
                            {errors.assigned_to && (
                                <p className="mt-1 text-sm text-red-600" id="assigned-to-error" role="alert">{errors.assigned_to}</p>
                            )}
                        </div>

                        {/* <div>
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
                        </div> */}

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={(e) => handleChange('priority', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                aria-describedby="priority-hint"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <span id="priority-hint" className="sr-only">Select the priority level for this task</span>
                        </div>

                        <div>
                            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                id="end_time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={(e) => handleChange('end_time', e.target.value)}
                                onBlur={handleBlur}
                                className={`mt-1 p-1 block w-full rounded-md border ${errors.end_time ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.end_time}
                                aria-describedby={errors.end_time ? "end-time-error" : undefined}
                            />
                            {errors.end_time && (
                                <p className="mt-1 text-sm text-red-600" id="end-time-error" role="alert">{errors.end_time}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                aria-label="Cancel and close form"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                aria-label={task ? "Update task" : "Create new task"}
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

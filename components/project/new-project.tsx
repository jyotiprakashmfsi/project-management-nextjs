'use client';
import { useUser } from '@/context/UserContext';
import { projectApi } from '@/services/client-services/project/api';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function NewProjectComponent() {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear the specific field error when user starts typing
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
        
        setError('');
    };

    const validateField = (name: string, value: string) => {
        let fieldError = '';
        
        if (name === 'name') {
            if (!value.trim()) {
                fieldError = 'Project name is required';
            } else if (value.trim().length < 3) {
                fieldError = 'Project name must be at least 3 characters';
            }
        } else if (name === 'description') {
            if (!value.trim()) {
                fieldError = 'Project description is required';
            } else if (value.trim().length < 10) {
                fieldError = 'Project description must be at least 10 characters';
            }
        }
        
        return fieldError;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value);
        
        setErrors({
            ...errors,
            [name]: fieldError
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(user)
        e.preventDefault();
        
        // Validate all fields before submission
        const nameError = validateField('name', formData.name);
        const descriptionError = validateField('description', formData.description);
        
        if (nameError || descriptionError) {
            setErrors({
                name: nameError,
                description: descriptionError
            });
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            if (!user?.id) throw new Error('User not found');
            
            await projectApi.createProject({
                ...formData,
                created_by: user.id
            });
            router.push('/workspace');
        } catch (err: any) {
            setError(err.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 id="new-project-form-title" className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Your New Project
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Let's get started by setting up your project
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-labelledby="new-project-form-title">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4" role="alert" aria-live="assertive">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                // required
                                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter project name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                minLength={3}
                                aria-required="true"
                                aria-invalid={errors.name ? 'true' : 'false'}
                                aria-describedby={errors.name ? "name-error" : "name-hint"}
                            />
                            {errors.name ? (
                                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                                    {errors.name}
                                </p>
                            ) : (
                                <span id="name-hint" className="sr-only">Project name must be at least 3 characters</span>
                            )}
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                // required
                                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Describe your project"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                                minLength={10}
                                aria-required="true"
                                aria-invalid={errors.description ? 'true' : 'false'}
                                aria-describedby={errors.description ? "description-error" : "description-hint"}
                            />
                            {errors.description ? (
                                <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                                    {errors.description}
                                </p>
                            ) : (
                                <span id="description-hint" className="sr-only">Project description must be at least 10 characters</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            aria-busy={loading}
                            aria-disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewProjectComponent;

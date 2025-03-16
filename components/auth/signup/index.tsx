'use client';
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

interface ValidationErrors {
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function SignupComponent() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        
        if (formData.fname.length < 2) {
            errors.fname = 'First name must be at least 2 characters';
        }
        
        if (formData.lname.length < 2) {
            errors.lname = 'Last name must be at least 2 characters';
        }

        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!formData.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateField = (name: string, value: string): boolean => {
        const errors = { ...validationErrors };
        
        switch (name) {
            case 'fname':
                if (value.length < 2) {
                    errors.fname = 'First name must be at least 2 characters';
                } else {
                    delete errors.fname;
                }
                break;
                
            case 'lname':
                if (value.length < 2) {
                    errors.lname = 'Last name must be at least 2 characters';
                } else {
                    delete errors.lname;
                }
                break;
                
            case 'email':
                if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    errors.email = 'Please enter a valid email address';
                } else {
                    delete errors.email;
                }
                break;
                
            case 'password':
                if (value.length < 8) {
                    errors.password = 'Password must be at least 8 characters';
                } else if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
                    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                } else {
                    delete errors.password;
                }
                
                if (formData.confirmPassword) {
                    if (value !== formData.confirmPassword) {
                        errors.confirmPassword = 'Passwords do not match';
                    } else {
                        delete errors.confirmPassword;
                    }
                }
                break;
                
            case 'confirmPassword':
                if (value !== formData.password) {
                    errors.confirmPassword = 'Passwords do not match';
                } else {
                    delete errors.confirmPassword;
                }
                break;
        }
        
        setValidationErrors(errors);
        return !errors[name as keyof ValidationErrors];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${formData.fname} ${formData.lname}`,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // After successful registration, sign in the user
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Account created successfully!');
                router.push('/workspace');
                router.refresh();
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        try {
            signIn('google', { 
                callbackUrl: '/workspace',
            });
        } catch (error) {
            console.error('Google sign-in error:', error);
            toast.error('An error occurred with Google sign-in');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="w-full flex justify-start px-8 absolute top-4">
                <a 
                    href="/"
                    className="text-indigo-600 hover:text-indigo-500 font-medium text-sm dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    /Home
                </a>
            </div>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 id="signup-form-title" className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-black dark:text-gray-300">
                        Get started with your project management journey
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-labelledby="signup-form-title">
                    <div className="rounded-md space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    First Name
                                </label>
                                <input
                                    id="fname"
                                    name="fname"
                                    type="text"
                                    className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={formData.fname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-required="true"
                                    aria-invalid={!!validationErrors.fname}
                                    aria-describedby={validationErrors.fname ? "fname-error" : undefined}
                                />
                                {validationErrors.fname && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="fname-error" role="alert">{validationErrors.fname}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Last Name
                                </label>
                                <input
                                    id="lname"
                                    name="lname"
                                    type="text"
                                    className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={formData.lname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-required="true"
                                    aria-invalid={!!validationErrors.lname}
                                    aria-describedby={validationErrors.lname ? "lname-error" : undefined}
                                />
                                {validationErrors.lname && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="lname-error" role="alert">{validationErrors.lname}</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-required="true"
                                aria-invalid={!!validationErrors.email}
                                aria-describedby={validationErrors.email ? "email-error" : undefined}
                            />
                            {validationErrors.email && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="email-error" role="alert">{validationErrors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-required="true"
                                    aria-invalid={!!validationErrors.password}
                                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    ) : (
                                        <FiEye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="password-error" role="alert">{validationErrors.password}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-required="true"
                                    aria-invalid={!!validationErrors.confirmPassword}
                                    aria-describedby={validationErrors.confirmPassword ? "confirm-password-error" : undefined}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    ) : (
                                        <FiEye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="confirm-password-error" role="alert">{validationErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label="Sign in to an existing account">
                                Already have an account? Sign in
                            </a>
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
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <FaGoogle className="h-5 w-5 mr-2" />
                            <span>Sign up with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupComponent;

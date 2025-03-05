'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '@/services/client-services/auth/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface ValidationErrors {
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function Signup() {
    const router = useRouter();
    const { setToken, setUser } = useUser();
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        setMounted(true);
    }, []);

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
            console.log('Starting signup process...');
            
            const signupData = {
                fname: formData.fname + " " + formData.lname,
                email: formData.email,
                password: formData.password
            };
            
            console.log('Submitting signup data...');
            const signupResponse = await authService.signup(signupData);
            console.log("Signup response:", signupResponse);
            
            console.log('Attempting to login with new credentials...');
            const loginResponse = await authService.login({
                email: formData.email,
                password: formData.password
            });

            console.log("Login response:", loginResponse);

            if (!loginResponse.user || !loginResponse.token) {
                console.error("Login response missing user or token:", loginResponse);
                toast.error('Login failed after account creation. Please try logging in manually.');
                setLoading(false);
                router.push('/login');
                return;
            }
            
            console.log("Setting token:", loginResponse.token);
            console.log("Setting user:", loginResponse.user);
            
            setToken(loginResponse.token);
            setUser(loginResponse.user);
            
            Cookies.set("user", JSON.stringify(loginResponse.user), { expires: 7 });
            
            console.log("After setting user and token");
            console.log("User cookie after direct set:", Cookies.get("user"));

            toast.success('Account created successfully!');

            router.push('/workspace/projects/new');
        } catch (err: any) {
            console.error('Error during signup/login process:', err);
            toast.error(err.message || 'Failed to create account');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full flex justify-start px-8 absolute top-4">
        <a 
          href="/"
          className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
        >
          /Home
        </a>
      </div>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-black">
                        Get started with your project management journey
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    <div className="rounded-md space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="fname" className="block text-sm font-medium text-black">
                                    First Name
                                </label>
                                <input
                                    id="fname"
                                    name="fname"
                                    type="text"
                                    required
                                    className={`mt-1 appearance-none rounded relative block w-full px-3 py-2 border ${
                                        validationErrors.fname ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    value={formData.fname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {validationErrors.fname && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.fname}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lname" className="block text-sm font-medium text-black">
                                    Last Name
                                </label>
                                <input
                                    id="lname"
                                    name="lname"
                                    type="text"
                                    required
                                    className={`mt-1 appearance-none rounded relative block w-full px-3 py-2 border ${
                                        validationErrors.lname ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    value={formData.lname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {validationErrors.lname && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.lname}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`mt-1 appearance-none rounded relative block w-full px-3 py-2 border ${
                                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                                        validationErrors.password ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FiEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                                        validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
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
                        >
                            {loading ? 'Creating Account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

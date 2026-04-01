import React, { useState } from 'react'
import { useRouter } from '../../router/hooks'
import { useAuthContext } from '../../auth/hooks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Form, Field } from '../../components/hook-form'


const signInSchema = zod.object({
    identifier: zod.string().min(1, 'Identifier is required'),
    password: zod.string().min(1, 'Password is required'),
});

export default function SignInViewPage() {
    const router = useRouter();
    const { checkUserSession } = useAuthContext();

    const [errorMsg, setErrorMsg] = useState('');

    const defaultValues = {
        identifier: '',
        password: '',
    };

    const methods = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            // TODO: Implement login logic
            console.log('Login data:', data);
        } catch (error) {
            console.error('Login error:', error);
            setErrorMsg(error.message || 'An error occurred during login');
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Sign in to your Chicken Game account
                    </p>
                </div>
                
                {/* Error Message */}
                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-6 0v8a8 8 0 011 6 0v8a8 8 0 011 6 0zM12 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm0 10a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                            <span>{errorMsg}</span>
                        </div>
                    </div>
                )}
                
                {/* Form Fields */}
                <div className="space-y-5">
                    <Field.Text 
                        name="identifier" 
                        type="text" 
                        placeholder="Enter your email or username"
                    />
                    <Field.Text 
                        name="password" 
                        type="password" 
                        placeholder="Enter your password"
                    />
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8a8 8 0 018 8 0zM12 14a1 1 0 011 1v1a1 1 0 11-2 0V14a1 1 0 011-1zm0 10a1 1 0 100 2 1 1 0 000-2z" />
                            </svg>
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
                
                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a href="#" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">
                            Sign up
                        </a>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <a href="#" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>
        </Form>
    )
}

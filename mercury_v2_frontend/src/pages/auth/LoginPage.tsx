import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialLoginButtons } from '../../components/auth/SocialLoginButtons';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export const LoginPage = () => {
    const { loginMutation } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <AuthLayout 
            title="Welcome back" 
            subtitle="Enter your details to access your workspace."
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input 
                    label="Email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                />
                
                <div className="space-y-1">
                    <Input 
                        label="Password" 
                        name="password"
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {loginMutation.isError && (
                         <p className="text-sm text-red-500 text-right">
                             Login failed. Please check your credentials.
                         </p>
                    )}
                    <div className="flex justify-end">
                        <Link to="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full h-12 text-base shadow-lg shadow-primary-500/20"
                    loading={loginMutation.isPending}
                >
                    Sign in
                </Button>
            </form>

            <div className="mt-6">
                <SocialLoginButtons />
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    );
};

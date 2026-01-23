import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialLoginButtons } from '../../components/auth/SocialLoginButtons';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export const SignupPage = () => {
    const { signupMutation } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
             setPasswordError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        signupMutation.mutate({
            email: formData.email,
            password: formData.password,
            name: formData.name
        });
    };

    return (
        <AuthLayout 
            title="Create an account" 
            subtitle="Start designing with AI today."
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <Input 
                    label="Full Name" 
                    name="name"
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                />
                
                <Input 
                    label="Email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                />
                
                <Input 
                    label="Password" 
                    name="password"
                    type="password" 
                    placeholder="Create a password" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                />

                 <Input 
                    label="Confirm Password" 
                    name="confirmPassword"
                    type="password" 
                    placeholder="Confirm your password" 
                    required 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={passwordError}
                />
                
                {signupMutation.isError && (
                     <p className="text-sm text-red-500 text-center">
                         Signup failed. Please try again.
                     </p>
                )}

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full h-12 text-base shadow-lg shadow-primary-500/20 mt-2"
                    loading={signupMutation.isPending}
                >
                    Create account
                </Button>
            </form>

            <div className="mt-6">
                <SocialLoginButtons />
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    );
};

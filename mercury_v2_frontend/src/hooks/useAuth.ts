import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, type LoginRequest, type RegisterRequest } from '../features/auth/api/auth.api';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      // 1. Save Token
      const { access_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      
      // 2. Invalidate/Prefetch calls if needed
      queryClient.invalidateQueries({ queryKey: ['me'] });

      // 3. Redirect
      navigate('/');
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      // Optional: Toast notification here
    },
  });

  // Signup Mutation
  const signupMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.signup(data),
    onSuccess: (response) => {
      // 1. Save Token (Auto login after signup)
      const { access_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      
      // 2. Redirect
      navigate('/');
    },
    onError: (error) => {
       console.error('Signup Failed:', error);
    },
  });

  const logout = () => {
      localStorage.removeItem('accessToken');
      navigate('/login');
      queryClient.clear();
  };

  return {
    loginMutation,
    signupMutation,
    logout
  };
};

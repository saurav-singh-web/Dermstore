// src/pages/Login.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { AxiosError } from 'axios';
import { showToast } from '../store/toastSlice';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Future: replace with real API
    try {
      // Simulate backend auth response
      const { data } = await axios.post('/auth/login', { email, password });
      dispatch(loginSuccess({ name: data.name, email: data.email, token: data.token }));     
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('name', data.name);
      dispatch(showToast({ message: 'Logged out successfully', type: 'info' }))
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
  setError(error.response?.data?.message || 'Login failed');
    }
  };

 return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
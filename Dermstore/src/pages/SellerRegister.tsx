// src/pages/SellerRegister.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sellerLoginSuccess } from '../store/sellerAuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosInstance';

export default function SellerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
const { data } = await axios.post('/seller/register', { name, email, password });
    dispatch(sellerLoginSuccess({ email: data.email, token: data.token }));
    localStorage.setItem('seller_token', data.token);
    localStorage.setItem('seller_email', data.email);
    navigate('/seller/dashboard');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Registration failed');
  }
};

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
          required className="w-full border px-4 py-2 rounded" />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email"
          required className="w-full border px-4 py-2 rounded" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"
          required className="w-full border px-4 py-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register as Seller</button>
      </form>
      <p className="mt-4 text-sm">
        Already a seller? <Link to="/seller/login" className="text-blue-600">Login</Link>
      </p>
      <p className="mt-2 text-sm"><Link to="/" className="text-gray-600">← Return to Home</Link></p>
    </div>
  );
}

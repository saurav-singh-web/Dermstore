// src/pages/SellerNewProduct.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

export default function SellerNewProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'', brand:'', price:'', stock:'', image:'' });

  const handleChange = (e: any) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
      await axios.post('/products', {
        title: form.title,
        description: form.description,
        category: form.category,
        brand: form.brand,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image: form.image,
      });
      navigate('/seller/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Product creation failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl text-center font-bold mb-6">🛒 List a New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange}
          required className="w-full border px-4 py-2 rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
          required className="w-full border px-4 py-2 rounded" rows={3} />
        <div className="flex gap-4">
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange}
            required className="flex-1 border px-4 py-2 rounded" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange}
            className="flex-1 border px-4 py-2 rounded" />
        </div>
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange}
          className="w-full border px-4 py-2 rounded" />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange}
          className="w-full border px-4 py-2 rounded" />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange}
          className="w-full border px-4 py-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit Product</button>
      </form>
    </div>
  );
}

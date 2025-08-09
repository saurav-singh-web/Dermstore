// src/pages/SellerEditProduct.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { updateSellerProduct } from '../store/sellerProductsSlice';
import axios from '../utils/axiosInstance';
import { showToast } from '../store/toastSlice';


export default function SellerEditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    image: ''
  });

 useEffect(() => {
   axios.get(`/products/${id}`).then(res => {
    const p = res.data;
    setForm({
      title: p.title || '',
      description: p.description || '',
      price: p.price?.toString() || '',
      stock: p.stock?.toString() || '',
      category: p.category || '',
      brand: p.brand || '',
      image: p.image || ''
    });
    setLoading(false);
  })
   .catch(err => {
      console.error("Error fetching product:", err);
      setLoading(false);
    });
}, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (!id) return;

    try {
    const { data: updatedProduct } = await axios.put(`/products/${id}`, {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      brand: form.brand,
      image: form.image,
    });

    dispatch(updateSellerProduct(updatedProduct)); // sync Redux
    dispatch(showToast({ message: 'Product updated successfully', type: 'success' }));
    navigate('/seller/dashboard');
  } catch (err: any) {
    console.error("Update failed:", err);
    alert("Failed to update product.");
  }
};

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'price', 'stock', 'category', 'brand', 'image'].map((field) => (
          <input
            key={field}
            type={field === 'price' || field === 'stock' ? 'number' : 'text'}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        ))}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows={4}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}

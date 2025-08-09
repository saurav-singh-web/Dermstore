// src/pages/SellerDashboard.tsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sellerLogout } from '../store/sellerAuthSlice';
import { showToast } from '../store/toastSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import type { RootState } from '../store';

interface Product {
    title: string;
    description:string,
    price: number;
    stock:number,
    category?: string;
    brand:string,
    image?: string;
    _id: string;
}

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.sellerAuth.email);
  const [products, setProducts] = useState<Product[]>([]);

   useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axios.get<Product[]>('/products/me');
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error('Expected array from API, but got:', res.data);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
    }
    loadProducts();
  }, []);

  const handleLogout = () => {
    dispatch(sellerLogout());
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_email');
    navigate('/');
  };

   const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      dispatch(showToast({ message: 'Deleted successfully', type: 'success' }));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {email}</h1>
        <button onClick={handleLogout} className="text-red-600 border px-4 py-1 rounded">
          Logout
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Products</h2>
        <Link to="/seller/new-product" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add New Product
        </Link>
      </div>

      {!Array.isArray(products) || products.length === 0 ? (
        <p className="text-gray-600">No products listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="border rounded p-4 shadow bg-white flex flex-col justify-between">
              {p.image && (
                <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold mt-2 truncate">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="mt-1 text-blue-600 font-bold">₹{p.price}</p>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <Link to={`/seller/edit-product/${p._id}`} className="text-blue-600">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p._id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

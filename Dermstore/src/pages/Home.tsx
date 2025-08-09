// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Fuse from 'fuse.js';
import axios from '../utils/axiosInstance';

import HeroBanner from '../components/HeroBanner';
import FeaturedSection from '../components/FeaturedSection';
import DealOfDay from '../components/DealOfDay';
import ProductCard from '../components/ProductCard';
import type { RootState } from '../store';
import type { Product } from '../types/product';

const categories = ['All', 'Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Body'];
const fuseOptions = { keys: ['title', 'description', 'category'], threshold: 0.3 };

export default function Home() {
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const favoriteCategory = useSelector((state: RootState) => state.preferences.favoriteCategory);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = products.filter(p => activeCategory === 'All' || p.category === activeCategory);
  const filtered = searchQuery.trim()
    ? new Fuse(byCategory, fuseOptions).search(searchQuery).map(r => r.item)
    : byCategory;

  useEffect(() => {
    setShowToast(searchQuery.trim() !== '' && filtered.length === 0);
  }, [searchQuery, filtered]);

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load products.</div>;

  const recommended = products.filter(p => p.category === favoriteCategory).slice(0, 5);

  return (
    <div className="p-6">
      <HeroBanner />

      {/* CATEGORY FILTER TABS */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 sm:gap-4 whitespace-nowrap pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border text-sm flex-shrink-0 transition ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-700 text-sm">
        Results: <strong>{filtered.length}</strong>
      </div>

      {showToast && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          No products matched your search.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => <ProductCard key={p._id} product={p} />)}
      </div>

      {products[0] && <DealOfDay product={products[0]} expiresAt={new Date(Date.now() + 1000 * 60 * 60 * 5)} />}
      <FeaturedSection title="Recommended For You" products={recommended} />
    </div>
  );
}
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/toastSlice';
import { updateCartOnServer } from '../store/cartSlice';
import type { AppDispatch } from '../store';
import type { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';



export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Details');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
const [related, setRelated] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Product>(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
  if (product?.category) {
    axios.get<Product[]>('/products')
      .then(res => {
        const relatedProducts = res.data
          .filter(p => p.category === product.category && p._id !== product._id)
          .slice(0, 3);
        setRelated(relatedProducts);
      });
  }
}, [product]);
  const handleAddToCart  = () => {
    if (!product) return;
    dispatch(updateCartOnServer({ productId: product._id, quantity }));
    dispatch(showToast({ message: 'Added to cart!', type: 'success' }));
  };

   const submitReview = () => {
    dispatch(showToast({ message: 'Review submitted!', type: 'success' }));
    setReviewRating(5);
    setReviewText('');
  };

  if (loading) return <div className="p-6">Loading product...</div>;
  if (!product) return <div className="p-6 text-red-600">Product not found.</div>;

    return (
     <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-10">
  {/* Product Image + Info */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Image */}
    <img
      src={product.image}
      alt={product.title}
      className="w-full h-64 sm:h-96 object-cover rounded shadow"
    />

    {/* Product Details */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold">{product.title}</h1>
      <p className="text-sm text-gray-600 mt-1">{product.brand || 'Brand'}</p>

      <div className="flex items-center gap-3 mt-2 text-sm">
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
          In Stock ({product.stock ?? 'N/A'})
        </span>
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          ⭐ {product.rating.toFixed(1)}
        </span>
      </div>

      <p className="mt-4 text-gray-700 text-sm">{product.description}</p>
      <p className="text-xl font-bold text-blue-600 my-3">${product.price.toFixed(2)}</p>

      <div className="flex gap-3 mt-4">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 border rounded px-3 py-2"
        />
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>

      {/* Extra Info */}
      <div className="mt-6 space-y-2 text-sm text-gray-700">
        {product.sizes?.length && (
          <div><strong>Sizes:</strong> {product.sizes.join(', ')}</div>
        )}
        {product.ingredients?.length && (
          <div><strong>Ingredients:</strong> {product.ingredients.join(', ')}</div>
        )}
        {product.benefits?.length && (
          <div><strong>Benefits:</strong> {product.benefits.join(', ')}</div>
        )}
        {product.tags?.length && (
          <div><strong>Tags:</strong> {product.tags.join(', ')}</div>
        )}
      </div>
    </div>
  </div>

  {/* Tabs */}
  <div className="space-y-4">
    <div className="flex flex-wrap gap-4 border-b pb-2">
      {['Details', 'Ingredients', 'Benefits', 'Reviews'].map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`pb-1 ${
            activeTab === t ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-600'
          }`}
        >
          {t}
        </button>
      ))}
    </div>

    {/* Tab Content */}
    {activeTab === 'Details' && product.directions && (
      <p className="text-gray-700">{product.directions}</p>
    )}

    {activeTab === 'Ingredients' && product.ingredients?.length && (
      <ul className="list-disc list-inside text-gray-700">
        {product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
    )}

    {activeTab === 'Benefits' && product.benefits?.length && (
      <ul className="list-disc list-inside text-gray-700">
        {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    )}

    {activeTab === 'Reviews' && (
      <div className="space-y-4">
       {product.reviews?.length ? (
         product.reviews.map((r, i) => (
         <div key={i} className="border p-4 rounded">
          <div className="flex justify-between text-sm">
            <strong>{r.user}</strong>
            <span>⭐ {r.rating.toFixed(1)}</span>
          </div>
            <p className="mt-1">{r.comment}</p>
         </div>
         ))
             ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}


        {/* Review Form */}
        <div className="mt-6 p-4 border rounded space-y-4">
          <h3 className="font-semibold">Add your review</h3>
          <select
            value={reviewRating}
            onChange={(e) => setReviewRating(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>{s} Stars</option>
            ))}
          </select>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Your review..."
            className="w-full border p-2 rounded"
          />
          <button
            onClick={submitReview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Related Products */}
  {related.length > 0 && (
    <div>
      <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((p) => (
          <div key={p._id} onClick={() => navigate(`/product/${p._id}`)} className="cursor-pointer">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )}
</div>

  );
}
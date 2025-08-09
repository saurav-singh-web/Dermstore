import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { Product } from '../types/product';
import { updateCartOnServer } from '../store/cartSlice';
import { showToast } from '../store/toastSlice';
import type { AppDispatch } from '../store';

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAdd = () => {
    dispatch(updateCartOnServer({ productId: product._id, quantity: 1 }));
    dispatch(showToast({ message: `"${product.title}" added to cart 🛒`, type: 'success' }));
  };

  return (
    <div className="group relative border rounded-md shadow-sm hover:shadow-lg overflow-hidden transition duration-300 transform hover:scale-[1.02] bg-white">
      {/* BADGES */}
      <div className="absolute top-2 left-2 flex gap-2 z-10">
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
          ⭐ Bestseller
        </span>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
          In Stock
        </span>
      </div>

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover transition duration-300 group-hover:brightness-95"
        />
      </Link>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
          <Link
            to={`/product/${product._id}`}
            className="text-sm text-blue-600 underline group-hover:hidden"
          >
            View
          </Link>
        </div>
      </div>

      {/* QUICK ADD-TO-CART BUTTON */}
      <button
        onClick={handleAdd}
        className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs px-3 py-1.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        + Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

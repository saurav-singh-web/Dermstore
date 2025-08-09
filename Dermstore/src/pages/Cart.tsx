import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchCart, updateCartOnServer } from '../store/cartSlice';
import { showToast } from '../store/toastSlice';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, couponCode, discountAmount } = useSelector((state: RootState) => state.cart);
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart()).then((action: any) => {
      if (action.payload?.couponCode) {
        setCoupon(action.payload.couponCode);
      }
    });
  }, [dispatch]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  const totalPrice = subtotal - (discountAmount ?? 0);

  const handleRemove = (productId: string) => {
    dispatch(updateCartOnServer({ productId, quantity: 0 }));
    dispatch(showToast({ message: 'Removed from cart', type: 'info' }));
  };

  const handleQtyChange = (productId: string, qty: number) => {
    if (qty < 1) return;
    dispatch(updateCartOnServer({ productId, quantity: qty }));
  };

  const handleCouponApply = () => {
    if (coupon === 'SAVE10') {
      const first = items[0];
      if (first) {
        dispatch(updateCartOnServer({
          productId: first.product._id,
          quantity: first.quantity,
          couponCode: coupon
        }));
        dispatch(showToast({ message: 'Coupon applied!', type: 'success' }));
      }
    } else {
      dispatch(showToast({ message: 'Invalid coupon', type: 'error' }));
    }
  };

  if (loading) return <div className="p-6">Loading cart...</div>;
  if (!items.length) return <div className="p-6">Your cart is empty.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {items
          .filter(item => item.product)
          .map(item => (
            <div key={item._id} className="flex gap-4 items-center border-b pb-4">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.title}</h3>
                <p>${item.product.price.toFixed(2)}</p>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e =>
                    handleQtyChange(item.product._id, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
              </div>
              <button
                onClick={() => handleRemove(item.product._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
      </div>

      <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p>Items: {items.filter(item => item.product).length}</p>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>

        <div className="mt-4">
          <input
            type="text"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <button
            onClick={handleCouponApply}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Apply
          </button>
        </div>

        {discountAmount ? (
          <p className="text-green-700 mt-2">
            Coupon <strong>{couponCode}</strong> applied — saved: ${discountAmount.toFixed(2)}
          </p>
        ) : null}

        <hr className="my-4" />
        <p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>

        <button
          onClick={() => navigate('/checkout')}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

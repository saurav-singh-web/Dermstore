// src/pages/Checkout.tsx
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch  } from '../store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../store/toastSlice';
import { saveAddress } from '../store/addressSlice';
import { placeOrder } from '../store/orderSlice';

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => state.cart.items);
  const saved = useSelector((state: RootState) => state.address.saved);
  const { couponCode, discountAmount = 0 } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalPrice = subtotal - discountAmount;

  const [isEditing, setIsEditing] = useState(!saved);
  const [form, setForm] = useState(
    saved ?? { name: '', email: '', address: '', city: '', zip: '', country: '' }
  );

  useEffect(() => {
    if (saved) {
      setForm(saved);
      setIsEditing(false);
    }
  }, [saved]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  if (Object.values(form).some(val => !val.trim())) {
    dispatch(showToast({ message: 'Please fill all required fields', type: 'error' }));
    return;
  }

   dispatch(saveAddress(form));
  
  const result = await dispatch(placeOrder({ form }));

  if (placeOrder.fulfilled.match(result)) {
    dispatch(showToast({ message: 'Order placed successfully!', type: 'success' }));
    navigate('/');
  } else {
    dispatch(showToast({ message: 'Failed to place order', type: 'error' }));
  }
};

if (!items.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-600">
        Your cart is empty.
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Details Section */}
        <div className="bg-gray-50 p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Billing Details</h2>

          {!isEditing && saved ? (
            <div className="space-y-2">
              {Object.entries(form).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>{' '}
                  {value}
                </div>
              ))}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Edit Address
              </button>
            </div>
          ) : (
            <form
                className="space-y-4"
                onSubmit={(e) => {
                e.preventDefault();
                dispatch(saveAddress(form));
                setIsEditing(false);
                dispatch(showToast({ message: 'Address saved', type: 'success' }));
                }}
                >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'email', 'city', 'zip', 'country'].map((key) => (
               <input
               key={key}
               type={key === 'email' ? 'email' : 'text'}
               name={key}
               placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
               value={form[key as keyof typeof form] || ''}
               onChange={handleInput}
               className="w-full border px-4 py-2 rounded"
               required
               />
               ))}
              </div>
              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleInput}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
              >
                {saved ? 'Save Address & Place Order' : 'Save Address & Continue'}
              </button>
            </form>
          )}
        </div>
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between">
                <div>
                  {item.product.title} × {item.quantity}
                </div>
                <div>${(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {discountAmount > 0 && couponCode && (
            <p className="text-green-700 mt-2">
              Coupon <strong>{couponCode}</strong> applied — saved: ${discountAmount.toFixed(2)}
            </p>
          )}
          <div className="flex justify-between text-lg font-bold mt-2">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

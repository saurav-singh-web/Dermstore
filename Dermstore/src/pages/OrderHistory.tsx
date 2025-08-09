// src/pages/OrderHistory.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchOrders } from '../store/orderSlice';
import type { Order, OrderItem } from '../types/order';


export default function OrderHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p>Loading your past orders...</p>;
  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      {orders.map((order: Order) => (
        <div key={order._id} className="border p-4 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between">
            <div>
              <strong>Order ID:</strong> {order._id}
            </div>
            <div>
              <strong>Items:</strong> {order.items.length} 
              <strong>Qty:</strong> {order.totalQuantity} 
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {order.items.map((item: OrderItem) => (
              <div key={item.product._id} className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.title}</h4>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ${item.priceAtAdding.toFixed(2)}
                  </p>
                </div>
                <div className="font-semibold">
                  ${(item.quantity * item.priceAtAdding).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
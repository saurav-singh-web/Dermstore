// src/components/Toast.tsx
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { useEffect } from 'react';
import { clearToast } from '../store/toastSlice';
import { useState } from 'react';
export default function Toast() {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.toast);
  const [visible, setVisible] = useState(false);

   useEffect(() => {
    if (message && type) {
      setVisible(true);

      const hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => dispatch(clearToast()), 300); 
      }, 3000);

      return () => clearTimeout(hideTimer);
    }
  }, [message, type, dispatch]);

    if (!message || !type) return null;

  const styleMap: Record<'success' | 'error' | 'info' | 'warning', string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };


  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
    <div className={`transition-all duration-300 px-6 py-3 rounded-lg text-white shadow-lg ${styleMap[type]} ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
    >
    {message}
      </div>
    </div>
  );
}

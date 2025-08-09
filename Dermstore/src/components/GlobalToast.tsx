// src/components/GlobalToast.tsx
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../store/toastSlice';
import { useEffect } from 'react';
import type { RootState } from '../store';

export default function GlobalToast() {
  const { message, type } = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  const toastStyleMap = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  };

  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 border rounded-md shadow z-50 ${toastStyleMap[type ?? 'info']}`}
    >
      <span className="mr-2">{iconMap[type ?? 'info']}</span>
      {message}
    </div>
  );
}
// src/components/ProtectedRoute.tsx
import { useSelector, useDispatch  } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { showToast } from '../store/toastSlice';
import type { RootState } from '../store';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    dispatch(showToast({ message: 'Please login to continue', type: 'warning' }));
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };
export default function SellerProtectedRoute({ children }: Props) {
  const isAuthenticated = useSelector((state: RootState) => state.sellerAuth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

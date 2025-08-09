import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../store/authSlice';
import { showToast } from '../store/toastSlice';
import type { RootState } from '../store';
import { setSearchQuery } from '../store/searchSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const hideIcons = ['/login', '/register'].includes(location.pathname);

  // ✅ Logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
    navigate('/login');
  };

  // ✅ Update search query for homepage filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setSearchQuery(value));

    if (location.pathname !== '/') {
      navigate('/'); // Go to homepage to see filtered results
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">Dermstore</Link>

      {/* Seller login */}
      <Link
        to="/seller/login"
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Seller
      </Link>

      {/* Simple Search Input */}
      <div className="flex flex-1 max-w-md w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Filter products..."
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Cart / Login / Logout */}
      {!hideIcons && (
        <nav className="flex gap-4 text-sm">
          <Link to="/cart" className="hover:text-blue-500">Cart</Link>
          {auth.isAuthenticated ? (
            <button onClick={handleLogout} className="hover:text-blue-500">
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-blue-500">Login</Link>
          )}
        </nav>
      )}
    </header>
  );
}

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Header from '../components/Header';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/UserProtectedRoute';
import SellerLogin from '../pages/SellerLogin';
import SellerRegister from '../pages/SellerRegister';
import SellerDashboard from '../pages/SellerDashboard';
import SellerProtectedRoute from '../components/SellerProtectedRoute';
import SellerNewProduct from '../pages/SellerNewProduct';
import SellerEditProduct from '../pages/SellerEditProduct';


const Layout = () => (
  <>
    <Header />
    <main className="p-4">
      <Outlet />
    </main>
  </>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Seller routes outside layout */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/dashboard" element={
          <SellerProtectedRoute>
            <SellerDashboard />
          </SellerProtectedRoute>
        } />
        <Route path="/seller/new-product" element={
          <SellerProtectedRoute>
            <SellerNewProduct />
          </SellerProtectedRoute>
        } />
        <Route path="/seller/edit-product/:id" element={
          <SellerProtectedRoute>
            <SellerEditProduct />
          </SellerProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}


function NotFound() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
    </div>
  );
}

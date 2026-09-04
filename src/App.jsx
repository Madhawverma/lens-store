import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Storefront from './pages/Storefront';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import OrderTracking from './pages/OrderTracking';
import { OrderProvider } from './context/OrderContext';

function ProtectedAdmin() {
  const isAuthenticated = localStorage.getItem('verma_admin_session') === 'true';
  return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
}

export function App() {
  return (
    <ProductProvider>
      <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />
        </Routes>
      </Router>
      </OrderProvider>
    </ProductProvider>
  );
}

export default App;

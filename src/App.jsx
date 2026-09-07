import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Storefront from './pages/Storefront';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import OrderTracking from './pages/OrderTracking';
import { OrderProvider } from './context/OrderContext';
import { auth, firebaseEnabled, isAdminUser, signOutUser } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function ProtectedAdmin() {
  const [state, setState] = useState({ loading: true, authorized: false });

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setState({ loading: false, authorized: false });
      return undefined;
    }
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, authorized: false });
        return;
      }
      try {
        const authorized = await isAdminUser(user);
        if (!authorized) await signOutUser();
        setState({ loading: false, authorized });
      } catch {
        await signOutUser();
        setState({ loading: false, authorized: false });
      }
    });
  }, []);

  if (state.loading) return <main className="admin-login-page"><p>Checking admin access...</p></main>;
  return state.authorized ? <AdminPanel /> : <AdminLogin />;
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

import React, { useState } from 'react';
import { LockKeyhole, LogIn, Store, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { firebaseEnabled, resetAdminPassword, signInAdmin } from '../lib/firebase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const validLocalLogin = loginId.trim() === '8770152422' && password === '1318';
      const validLogin = firebaseEnabled ? await signInAdmin(loginId.trim(), password) : validLocalLogin;
      if (validLogin) {
        localStorage.setItem('verma_admin_session', 'true');
        navigate('/admin');
        return;
      }
      setError('Login ID ya password galat hai.');
    } catch (loginError) {
      const messages = {
        'auth/invalid-credential': 'Email/Login ID ya password galat hai.',
        'auth/user-not-found': 'Firebase Authentication Users में admin user नहीं मिला.',
        'auth/wrong-password': 'Admin password galat hai.',
        'auth/invalid-email': 'Valid Firebase email या 8770152422 डालें.',
        'auth/operation-not-allowed': 'Firebase में Email/Password sign-in enable करें.'
      };
      setError(messages[loginError.code] || `Firebase login failed: ${loginError.code || 'unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setResetMessage('');
    if (!loginId.trim()) {
      setError('Pehle admin email enter karein.');
      return;
    }
    try {
      await resetAdminPassword(loginId.trim());
      setResetMessage('Password reset email bhej diya gaya hai. Inbox check karein.');
    } catch (resetError) {
      const messages = {
        'auth/user-not-found': 'Is email ka Firebase admin user nahi mila.',
        'auth/invalid-email': 'Valid admin email enter karein.',
        'auth/operation-not-allowed': 'Firebase mein Email/Password sign-in enable karein.'
      };
      setError(messages[resetError.code] || `Reset failed: ${resetError.code || 'unknown error'}`);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <Store size={24} />
          <span>Shree Ganesh Optical Shop</span>
        </div>
        <h1>Admin Login</h1>
        <p>Store manage karne ke liye login karein.</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label htmlFor="admin-login-id">Admin Email</label>
          <div className="admin-login-input">
            <UserRound size={18} />
            <input id="admin-login-id" type="email" value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="Enter admin email" required />
          </div>
          <label htmlFor="admin-password">Password</label>
          <div className="admin-login-input">
            <LockKeyhole size={18} />
            <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" required />
          </div>
          {error && <p className="admin-login-error">{error}</p>}
          {resetMessage && <p className="admin-login-success">{resetMessage}</p>}
          <button type="submit" className="admin-login-submit" disabled={isSubmitting}><LogIn size={18} /> {isSubmitting ? 'Signing in...' : 'Login to Admin Panel'}</button>
          <button type="button" className="admin-reset-btn" onClick={handleResetPassword}>Reset password</button>
        </form>
        <button type="button" className="admin-login-back" onClick={() => navigate('/')}>Back to Storefront</button>
      </section>
    </main>
  );
}

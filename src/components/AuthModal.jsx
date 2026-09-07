import React, { useState } from 'react';
import { X, CheckCircle, LogIn, Mail, LockKeyhole, UserRound } from 'lucide-react';
import './AuthModal.css';
import { firebaseEnabled, registerCustomer, signInCustomer, signInCustomerWithGoogle } from '../lib/firebase';

export const AuthModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'google') {
        await signInCustomerWithGoogle();
      } else if (mode === 'register') {
        await registerCustomer(form.name, form.email, form.password);
      } else {
        await signInCustomer(form.email, form.password);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (authError) {
      const messages = {
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/operation-not-allowed': 'Enable Email/Password and Google sign-in in Firebase.',
        'auth/unauthorized-domain': 'Add this website domain in Firebase Authentication > Settings > Authorized domains.',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled.'
      };
      setError(messages[authError.code] || 'Sign-in failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInCustomerWithGoogle();
    } catch (authError) {
      const messages = {
        'auth/unauthorized-domain': 'Add this website domain in Firebase Authentication > Settings > Authorized domains.'
      };
      setError(messages[authError.code] || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="auth-overlay animate-fade-in" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-logo-row">
            <span className="auth-brand">Shree Ganesh Optical Shop</span>
            <span className="auth-tag">(Verma Ji Ki Dukan)</span>
          </div>
          <button className="auth-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="auth-body">
          {submitted ? (
            <div className="auth-success-view animate-fade-in">
              <CheckCircle size={44} className="text-green mb-2" />
              <h3>Google Account Ready!</h3>
              <p>You are now logged in. Enjoy customized prescription orders and faster checkout.</p>
            </div>
          ) : (
            <>
              <div className="auth-toggle-tabs">
                <button type="button" className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
                <button type="button" className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
              </div>
              <h3 className="auth-title">{mode === 'register' ? 'Create your customer account' : 'Login to continue'}</h3>
              <p className="auth-subtitle">Use email/password or Google to checkout, manage orders, and save prescriptions.</p>
              <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}
                {mode === 'register' && <div className="form-group"><label htmlFor="customer-name">Name</label><div className="input-with-icon"><UserRound size={16} className="field-icon" /><input id="customer-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div></div>}
                <div className="form-group"><label htmlFor="customer-email">Email</label><div className="input-with-icon"><Mail size={16} className="field-icon" /><input id="customer-email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div></div>
                <div className="form-group"><label htmlFor="customer-password">Password</label><div className="input-with-icon"><LockKeyhole size={16} className="field-icon" /><input id="customer-password" type="password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div></div>
                <button type="submit" className="btn-pink auth-submit-btn" disabled={!firebaseEnabled}><LogIn size={17} /> {mode === 'register' ? 'Create Account' : 'Login with Email'}</button>
                <button type="button" className="btn-pink auth-submit-btn" disabled={!firebaseEnabled} onClick={handleGoogleSignIn}><LogIn size={17} /> Continue with Google</button>
                {!firebaseEnabled && <p className="auth-error">Customer Google login requires Firebase configuration.</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

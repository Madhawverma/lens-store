import React, { useState } from 'react';
import { X, CheckCircle, LogIn } from 'lucide-react';
import './AuthModal.css';
import { firebaseEnabled, signInCustomerWithGoogle } from '../lib/firebase';

export const AuthModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInCustomerWithGoogle();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (authError) {
      setError(authError.code === 'auth/popup-closed-by-user' ? 'Google sign-in was cancelled.' : 'Google sign-in failed. Please try again.');
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
              <h3 className="auth-title">Login or Register with Google</h3>
              <p className="auth-subtitle">Sign in with Google to continue to checkout, manage orders, and save prescriptions.</p>
              <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-pink auth-submit-btn" disabled={!firebaseEnabled}>
                  <LogIn size={17} /> Continue with Google
                </button>
                {!firebaseEnabled && <p className="auth-error">Customer Google login requires Firebase configuration.</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

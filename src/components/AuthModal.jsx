import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import './AuthModal.css';
import { registerCustomer, signInCustomer } from '../lib/firebase';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phoneOrEmail.includes('@')) {
      setError('Customer login ke liye valid email address use karein.');
      return;
    }
    try {
      if (isLogin) {
        await signInCustomer(phoneOrEmail.trim(), password);
      } else {
        await registerCustomer(name, phoneOrEmail.trim(), password);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (authError) {
      const messages = {
        'auth/email-already-in-use': 'Is email se account pehle se bana hua hai.',
        'auth/invalid-credential': 'Email ya password galat hai.',
        'auth/weak-password': 'Password kam se kam 6 characters ka hona chahiye.',
        'auth/invalid-email': 'Valid email address enter karein.'
      };
      setError(messages[authError.code] || 'Login/register nahi ho paya. Firebase Auth settings check karein.');
    }
  };

  return (
    <div className="auth-overlay animate-fade-in" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-logo-row">
            <span className="auth-brand">Verma Ji Ki Dukan</span>
            <span className="auth-tag">"चश्मा"</span>
          </div>
          <button className="auth-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="auth-body">
          {submitted ? (
            <div className="auth-success-view animate-fade-in">
              <CheckCircle size={44} className="text-green mb-2" />
              <h3>{isLogin ? 'Welcome Back!' : 'Account Created Successfully!'}</h3>
              <p>You are now logged in. Enjoy customized prescription orders and faster checkout.</p>
            </div>
          ) : (
            <>
              <div className="auth-toggle-tabs">
                <button 
                  className={`auth-tab ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
                <button 
                  className={`auth-tab ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>

              <h3 className="auth-title">
                {isLogin ? 'Login to Your Account' : 'Create New Account'}
              </h3>
              <p className="auth-subtitle">
                {isLogin 
                  ? 'Access your orders, saved prescriptions & exclusive club discounts.'
                  : 'Join 40,000+ customers enjoying premium optical comfort.'}
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} className="field-icon" />
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Jaspreet Singh" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Mobile Number or Email</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="field-icon" />
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 9876543210 or user@example.com" 
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="forgot-pass-row">
                    <span className="forgot-link">Forgot Password?</span>
                  </div>
                )}

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="btn-pink auth-submit-btn">
                  {isLogin ? 'Sign In to Verma Ji Ki Dukan' : 'Register Account'} <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

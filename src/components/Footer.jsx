import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, CreditCard, Send, Check } from 'lucide-react';
import './Footer.css';

export const Footer = ({ onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="site-footer">
      {/* Upper Newsletter Box */}
      <div className="container">
        <div className="footer-newsletter-banner">
          <div className="newsletter-info">
            <span className="newsletter-tag">EXCLUSIVE CLUB OFFERS</span>
            <h3>Get 15% Off Your First Prescription Eyewear</h3>
            <p>Subscribe to receive early access to new arrivals, turban-friendly frames & secret flash sales.</p>
          </div>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              required
              placeholder="Enter your email address..." 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-btn">
              {subscribed ? <><Check size={16} /> Subscribed</> : <><Send size={16} /> Join Club</>}
            </button>
          </form>
        </div>

        {/* Main Footer Grid */}
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="brand-name">Shree Ganesh Optical Shop</span>
              <span className="brand-hi">श्री गणेश</span>
              <span className="brand-legacy">(Verma Ji Ki Dukan)</span>
            </div>
            <p className="footer-desc">
              Shree Ganesh Optical Shop brings comfortable eyewear, lightweight frames, and everyday style from Sehore, Madhya Pradesh.
            </p>
            <div className="footer-social-links">
              <a href="https://www.instagram.com/madhaw.18" target="_blank" rel="noreferrer" className="social-icon" title="Instagram @madhaw.18">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/login/" target="_blank" rel="noreferrer" className="social-icon" title="Facebook Login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UC2WdOZO7FoBcuJbKxaDp0ag" target="_blank" rel="noreferrer" className="social-icon" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li onClick={() => onSelectCategory('all')}>All Eyewear</li>
              <li onClick={() => onSelectCategory('eyeglasses')}>Eyeglasses Collection</li>
              <li onClick={() => onSelectCategory('sunglasses')}>Sunglasses & UV Lenses</li>
              <li onClick={() => onSelectCategory('turban-friendly')}>Turban Fit Special (60% Off)</li>
              <li onClick={() => onSelectCategory('computer-glasses')}>Zero Power Computer Specs</li>
              <li onClick={() => onSelectCategory('day-night')}>Day-Night Photochromic</li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Policies</h4>
            <ul className="footer-links">
              <li>Track Order Live</li>
              <li>Shipping & Global Delivery</li>
              <li>7-Day Refund & Free Exchange</li>
              <li>Prescription Guide</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Direct Support Contacts */}
          <div className="footer-col support-col">
            <h4 className="footer-heading">Direct Optical Support</h4>
            <div className="support-card">
              <div className="support-line">
                <Phone size={16} className="text-pink" />
                <div>
                  <small>WhatsApp & Call</small>
                  <a href="https://wa.me/918770152422" target="_blank" rel="noreferrer"><strong>+91 87701 52422</strong></a>
                </div>
              </div>
              <div className="support-line">
                <Mail size={16} className="text-blue" />
                <div>
                  <small>Customer Support Email</small>
                  <a href="mailto:madhawverma@gmail.com"><strong>madhawverma@gmail.com</strong></a>
                </div>
              </div>
              <div className="support-line">
                <MapPin size={16} className="text-green" />
                <div>
                  <small>Headquarters</small>
                  <span>Sehore, Madhya Pradesh, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          <p className="copyright-text">
            Copyright 2026 © <strong>Shree Ganesh Optical Shop</strong>. All Rights Reserved. Sehore, Madhya Pradesh.
          </p>
          <div className="payment-badges-row">
            <span className="pay-pill">UPI</span>
            <span className="pay-pill">Google Pay</span>
            <span className="pay-pill">PhonePe</span>
            <span className="pay-pill">Visa</span>
            <span className="pay-pill">Mastercard</span>
            <span className="pay-pill">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

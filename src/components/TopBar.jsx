import React from 'react';
import './TopBar.css';

export const TopBar = ({ onShopNowClick, onAdminLogin }) => {
  const devotionalItems = Array.from({ length: 14 }, (_, index) => (
    index % 2 === 0 ? 'जय माता दी' : 'श्री गणेशाय नमः'
  ));
  const tickerItems = [
    "🚚 Shipping Worldwide",
    "✈️ Express Shipping to 🇨🇦 🇺🇸 🇬🇧 🇦🇺",
    "🇮🇳 Free Shipping in India",
    "💙 Blue UV Lenses at ₹1",
    "Raksha Bandhan Special: Extra 15% Off on Prepaid Orders — Use Code : Rakhi 😍",
    "🚚 Shipping Worldwide",
    "✈️ Express Shipping to 🇨🇦 🇺🇸 🇬🇧 🇦🇺",
    "🇮🇳 Free Shipping in India",
    "💙 Blue UV Lenses at ₹1",
    "Raksha Bandhan Special: Extra 15% Off on Prepaid Orders — Use Code : Rakhi 😍"
  ];

  return (
    <>
      <div className="devotional-bar" aria-label="Devotional message">
        <div className="devotional-track">
          {devotionalItems.map((item, idx) => <span key={idx}>{item}</span>)}
        </div>
      </div>
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="ticker">
            <div className="ticker-track">
              {tickerItems.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
            </div>
          </div>
          <div className="top-bar-actions">
            <button className="admin-login-top-btn" onClick={onAdminLogin}>
              Admin Login
            </button>
            <button className="cta-btn" onClick={onShopNowClick}>Shop Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/products';
import './Testimonials.css';

export const Testimonials = () => {
  return (
    <section className="testimonials-section container">
      <div className="section-header-wrap text-center-header">
        <span className="section-subtitle">CUSTOMER'S REVIEWS & LOVE</span>
        <h2 className="section-title">What Our 40,000+ Customers Say</h2>
        <div className="stars-summary-row">
          <div className="stars-list">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <span><strong>4.9 out of 5.0</strong> Overall Store Rating based on 40,000+ verified orders</span>
        </div>
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS_DATA.map((t) => (
          <div key={t.id} className="testimonial-card">
            <Quote size={28} className="quote-icon" />
            
            <div className="t-rating-row">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span className="t-date">{t.date}</span>
            </div>

            <p className="t-text">"{t.text}"</p>

            <div className="t-product-tag">
              Product: <strong>{t.product}</strong>
            </div>

            <div className="t-author-row">
              <div className="t-avatar">
                {t.author.charAt(0)}
              </div>
              <div className="t-author-details">
                <span className="t-name">{t.author}</span>
                <span className="t-location">{t.city}, India</span>
              </div>
              {t.verified && (
                <div className="t-verified-badge" title="Verified Buyer">
                  <CheckCircle size={14} className="text-green" />
                  <span>Verified Buyer</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

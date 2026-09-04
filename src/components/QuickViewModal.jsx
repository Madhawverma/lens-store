import React from 'react';
import { X, Star, ShoppingBag, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import './QuickViewModal.css';

export const QuickViewModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onSelectLens,
  onToggleWishlist,
  isWishlisted
}) => {
  if (!isOpen || !product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="quickview-overlay animate-fade-in" onClick={onClose}>
      <div className="quickview-card" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="qv-grid">
          {/* Visual Showcase */}
          <div className="qv-gallery">
            <div className="qv-main-img-wrap">
              <img src={product.image} alt={product.name} className="qv-img" />
              <span className="qv-badge-discount">{discount}% OFF</span>
            </div>
            {product.hoverImage && (
              <div className="qv-sub-thumbs">
                <img src={product.image} alt="Front View" className="qv-thumb active" />
                <img src={product.hoverImage} alt="Side View" className="qv-thumb" />
              </div>
            )}
          </div>

          {/* Product Specifications & Order Actions */}
          <div className="qv-details">
            <div className="qv-category-row">
              <span className="qv-type">{product.type}</span>
              <span className="qv-code">Model #{product.code}</span>
            </div>

            <h2 className="qv-title">{product.name}</h2>

            <div className="qv-rating-row">
              <div className="qv-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span className="qv-rating-val">{product.rating}</span>
              <span className="qv-reviews-count">({product.reviewsCount} customer reviews)</span>
            </div>

            <div className="qv-price-row">
              <span className="qv-current-price">₹{product.price}</span>
              <span className="qv-original-price">₹{product.originalPrice}</span>
              <span className="qv-tax-note">Inclusive of all taxes & free shipping</span>
            </div>

            <p className="qv-description">{product.description}</p>

            {/* Spec Attributes */}
            <div className="qv-specs-box">
              <div className="spec-row">
                <span className="spec-lbl">Color:</span>
                <span className="spec-val"><strong>{product.color}</strong></span>
              </div>
              <div className="spec-row">
                <span className="spec-lbl">Frame Shape:</span>
                <span className="spec-val">{product.shape}</span>
              </div>
              <div className="spec-row">
                <span className="spec-lbl">Gender / Fit:</span>
                <span className="spec-val">{product.gender} ({product.category === 'turban-friendly' ? 'Turban Fit' : 'Standard'})</span>
              </div>
            </div>

            {/* Features Bullet List */}
            {product.features && (
              <div className="qv-features-wrap">
                <span className="feat-header">Highlights:</span>
                <div className="feat-tags">
                  {product.features.map((f, i) => (
                    <span key={i} className="feat-pill">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="qv-actions">
              <button 
                className="btn-pink qv-add-lens-btn"
                onClick={() => {
                  onClose();
                  onSelectLens(product);
                }}
              >
                <Sparkles size={16} /> Select Prescription Lenses
              </button>
              
              <div className="qv-sub-actions">
                <button 
                  className="btn-outline qv-frame-only-btn"
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingBag size={16} /> Buy Frame Only (₹{product.price})
                </button>

                <button 
                  className={`qv-wish-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => onToggleWishlist(product)}
                  title="Save to wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? "#ff4081" : "none"} color={isWishlisted ? "#ff4081" : "#334155"} />
                </button>
              </div>
            </div>

            <div className="qv-trust-banner">
              <ShieldCheck size={16} className="text-green" />
              <span>7 Days No-Questions-Asked Free Exchange • 1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

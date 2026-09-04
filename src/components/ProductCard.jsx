import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Sparkles } from 'lucide-react';
import './ProductCard.css';

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted, 
  onQuickView,
  onSelectLens
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-media-wrap">
        {/* Badges */}
        <div className="product-badges">
          {product.badge && (
            <span className={`prod-badge ${product.badge.toLowerCase().includes('bestseller') ? 'gold' : 'pink'}`}>
              {product.badge}
            </span>
          )}
          <span className="prod-badge discount">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Wishlist Button */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "#ff4081" : "none"} color={isWishlisted ? "#ff4081" : "#475569"} />
        </button>

        {/* Product Image Swap on Hover */}
        <div className="product-img-container" onClick={() => onQuickView(product)}>
          <img 
            src={isHovered && product.hoverImage ? product.hoverImage : product.image} 
            alt={product.name} 
            className="product-img" 
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Quick View Button */}
        <button className="quick-view-overlay-btn" onClick={() => onQuickView(product)}>
          <Eye size={15} /> Quick View
        </button>
      </div>

      <div className="product-info">
        <div className="product-meta-row">
          <span className="prod-type">{product.type} • {product.shape}</span>
          <div className="prod-rating">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating}</span>
            <small>({product.reviewsCount})</small>
          </div>
        </div>

        <h3 className="prod-name" onClick={() => onQuickView(product)}>
          {product.name}
        </h3>

        <p className="prod-color-code">Color: <strong>{product.color}</strong> | Code: #{product.code}</p>

        <div className="prod-price-row">
          <div className="price-group">
            <span className="current-price">₹{salePrice}</span>
            <span className="original-price">₹{product.discount ? product.price : product.originalPrice}</span>
          </div>
        </div>

        <div className="card-actions-row">
          <button 
            className="btn-select-lens"
            onClick={() => onSelectLens(product)}
          >
            <Sparkles size={14} /> Add Lenses
          </button>
          
          <button 
            className="btn-quick-cart"
            onClick={() => onAddToCart(product)}
            title="Add frame directly to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

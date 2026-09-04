import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import './WishlistDrawer.css';

export const WishlistDrawer = ({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onRemoveFromWishlist, 
  onMoveToCart 
}) => {
  if (!isOpen) return null;

  return (
    <div className="wishlist-overlay animate-fade-in" onClick={onClose}>
      <div className="wishlist-card" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-header">
          <div className="wishlist-title-wrap">
            <Heart size={20} fill="#ff4081" color="#ff4081" />
            <h3>My Saved Wishlist ({wishlistItems.length})</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wishlist-body">
          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist-view">
              <Heart size={48} className="empty-heart-icon" />
              <h4>No items in your wishlist</h4>
              <p>Save items you like and come back to them anytime!</p>
              <button className="btn-pink" onClick={onClose}>
                Explore Products
              </button>
            </div>
          ) : (
            <div className="wishlist-items-grid">
              {wishlistItems.map((product) => (
                <div key={product.id} className="wishlist-item-card">
                  <img src={product.image} alt={product.name} className="wishlist-img" />
                  
                  <div className="wishlist-item-info">
                    <span className="wishlist-prod-type">{product.type}</span>
                    <h4 className="wishlist-prod-name">{product.name}</h4>
                    <span className="wishlist-prod-price">₹{product.price}</span>
                    
                    <div className="wishlist-card-actions">
                      <button 
                        className="btn-pink btn-sm w-100"
                        onClick={() => {
                          onMoveToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                      >
                        <ShoppingBag size={14} /> Move to Bag
                      </button>
                      
                      <button 
                        className="remove-wishlist-btn"
                        onClick={() => onRemoveFromWishlist(product.id)}
                        title="Remove from saved"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

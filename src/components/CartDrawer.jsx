import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import './CartDrawer.css';

export const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart,
  isCustomerLoggedIn,
  onRequireLogin
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', paymentMethod: 'Cash on Delivery', deliveryDate: '', eyeTestRequested: false });
  const { createOrder } = useOrders();

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = subtotal - discountAmount;
  const freeShippingThreshold = 999;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toLowerCase() === 'rakhi') {
      setDiscountApplied(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      alert("Invalid coupon code. Try using 'Rakhi' for 15% off!");
    }
  };

  const handleCheckout = () => {
    if (!isCustomerLoggedIn) {
      onRequireLogin();
      return;
    }
    const order = createOrder({ items: cartItems, total: finalTotal + (subtotal >= freeShippingThreshold ? 0 : 99), customer });
    setPlacedOrder(order);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
    setCheckoutSuccess(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutSuccess(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="cart-drawer-overlay animate-fade-in" onClick={onClose}>
      <div className="cart-drawer-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} className="text-pink" />
            <h3>Your Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h3>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="free-shipping-bar-wrap">
          <div className="shipping-text">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-green">🎉 You've unlocked <strong>FREE Express Shipping!</strong></span>
            ) : (
              <span>Add <strong>₹{freeShippingThreshold - subtotal}</strong> more for Free Shipping</span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div className="shipping-progress-fill" style={{ width: `${freeShippingProgress}%` }}></div>
          </div>
        </div>

        {/* Cart Body */}
        <div className="cart-body">
          {checkoutSuccess ? (
            <div className="checkout-success-box animate-fade-in">
              <div className="success-icon-wrap">
                <ShieldCheck size={48} className="text-green" />
              </div>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for choosing Shree Ganesh Optical Shop. Your order is now visible to our team.</p>
              <span className="order-id">Order ID: {placedOrder?.id}</span>
              <Link className="track-order-link" to={`/track/${placedOrder?.id}`} onClick={onClose}>Track this order</Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-icon-circle">
                <ShoppingBag size={40} />
              </div>
              <h4>Your bag is empty!</h4>
              <p>Looks like you haven't added any stylish eyewear yet.</p>
              <button className="btn-pink" onClick={onClose}>
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.lens?.id || 'frame'}`} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button 
                        className="cart-item-remove"
                        onClick={() => onRemoveItem(item.id, item.lens?.id)}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-specs">
                      <span>Color: {item.color}</span>
                      {item.lens && (
                        <div className="cart-lens-tag">
                          <Sparkles size={12} /> {item.lens.title}
                        </div>
                      )}
                      {item.prescriptionNote && (
                        <div className="cart-presc-note">Note: "{item.prescriptionNote}"</div>
                      )}
                    </div>

                    <div className="cart-item-bottom">
                      <div className="qty-controls">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.lens?.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.lens?.id, item.quantity + 1)}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-pricing">
                        <span className="item-unit-calc">₹{item.totalPrice} × {item.quantity}</span>
                        <span className="item-total-val">₹{item.totalPrice * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="cart-footer">
            <div className="checkout-customer-fields">
              <input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Your name" required />
              <input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Phone number" inputMode="tel" required />
              <input value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="Delivery address" required />
              <select value={customer.paymentMethod} onChange={(event) => setCustomer({ ...customer, paymentMethod: event.target.value })}>
                <option>Cash on Delivery</option>
                <option>UPI</option>
                <option>Card on Delivery</option>
              </select>
              <label className="delivery-date-field">Preferred delivery date
                <input type="date" min={new Date().toISOString().split('T')[0]} value={customer.deliveryDate} onChange={(event) => setCustomer({ ...customer, deliveryDate: event.target.value })} required />
              </label>
              <label className="eye-test-option">
                <input type="checkbox" checked={customer.eyeTestRequested} onChange={(event) => setCustomer({ ...customer, eyeTestRequested: event.target.checked })} />
                <span>Request a free eye test with my frame order</span>
              </label>
            </div>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input 
                type="text" 
                placeholder="Promo Code (Try 'Rakhi')" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="submit" className="coupon-apply-btn">
                Apply
              </button>
            </form>

            {discountApplied && (
              <div className="discount-applied-pill">
                <span>🎉 'Rakhi' applied (15% discount)</span>
                <span className="text-green">- ₹{discountAmount}</span>
              </div>
            )}

            <div className="cart-summary-breakdown">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountApplied && (
                <div className="summary-line text-green">
                  <span>Special Discount (15%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Shipping</span>
                <span className="text-green">{subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}</span>
              </div>
              <div className="summary-line total-line">
                <strong>Grand Total</strong>
                <strong className="grand-total-val">₹{finalTotal}</strong>
              </div>
            </div>

            <button className="btn-pink checkout-btn" onClick={handleCheckout} disabled={!customer.name || !customer.phone || !customer.address || !customer.deliveryDate}>
              Proceed to Secure Checkout <ArrowRight size={18} />
            </button>

            <div className="secure-badge-footer">
              <ShieldCheck size={14} className="text-green" />
              <span>100% Safe & Encrypted Payments • 7 Days Easy Exchange</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

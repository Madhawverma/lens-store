import React, { useState } from 'react';
import { X, Sparkles, Check, Info } from 'lucide-react';
import { LENS_OPTIONS } from '../data/products';
import './LensModal.css';

export const LensModal = ({ product, isOpen, onClose, onAddWithLens }) => {
  const [selectedLens, setSelectedLens] = useState(LENS_OPTIONS[0]);
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);
  const [prescriptionType, setPrescriptionType] = useState('single');
  const [powerNote, setPowerNote] = useState('');

  if (!isOpen || !product) return null;

  const customLens = product.customLensPrice > 0 ? {
    id: `custom-${product.id}`,
    title: 'Customize Lens',
    badge: 'CUSTOM',
    price: Number(product.customLensPrice),
    subtitle: 'Prescription lenses customized for your frame.',
    features: ['Custom prescription', 'Made for your frame', 'Store-fitted lenses']
  } : null;
  const lensOptions = customLens ? [...LENS_OPTIONS, customLens] : LENS_OPTIONS;
  const activeOption = lensOptions.some((lens) => lens.id === selectedLens.id) ? selectedLens : lensOptions[0];
  const activePrice = selectedVariantPrice ?? activeOption.price;
  const activeLens = activePrice === activeOption.price ? activeOption : {
    ...activeOption,
    id: `${activeOption.id}-${activePrice}`,
    title: `${activeOption.title} - ₹${activePrice}`,
    price: activePrice
  };
  const totalPrice = product.price + activeLens.price;

  const handleConfirm = () => {
    onAddWithLens(product, activeLens, powerNote);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="lens-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="lens-modal-header">
          <div>
            <span className="modal-subtitle">CUSTOMIZE YOUR VISION</span>
            <h2 className="modal-title">Select Lenses for {product.name}</h2>
          </div>
          <button className="close-icon-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="lens-modal-body">
          {/* Selected Product summary */}
          <div className="selected-prod-strip">
            <img src={product.image} alt={product.name} className="strip-img" />
            <div className="strip-info">
              <h4>{product.name}</h4>
              <p>Frame Color: <strong>{product.color}</strong> | Model: #{product.code}</p>
              <span className="strip-price">Frame Price: ₹{product.price}</span>
            </div>
          </div>

          <h3 className="options-title">1. Choose Lens Package</h3>
          <div className="lens-options-grid">
            {lensOptions.map((lens) => (
              <div 
                key={lens.id} 
                className={`lens-option-card ${activeOption.id === lens.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedLens(lens);
                  setSelectedVariantPrice(null);
                }}
              >
                <div className="lens-card-top">
                  <div>
                    <span className="lens-badge">{lens.badge}</span>
                    <h4 className="lens-title">{lens.title}</h4>
                  </div>
                  <div className="lens-price-tag">
                    {lens.id === 'zero-power' ? '₹1' : lens.id.startsWith('custom-') ? 'Customize' : `₹${lens.price}`}
                  </div>
                </div>

                <p className="lens-subtitle">{lens.subtitle}</p>

                <ul className="lens-features-list">
                  {lens.features.map((feat, i) => (
                    <li key={i}>
                      <Check size={14} className="feat-check" /> {feat}
                    </li>
                  ))}
                </ul>

                <div className="radio-indicator">
                  <div className={`radio-dot ${activeOption.id === lens.id ? 'selected' : ''}`}></div>
                </div>

                {activeOption.id === lens.id && lens.variants && (
                  <div className="lens-variants" onClick={(event) => event.stopPropagation()}>
                    <span className="lens-variants-label">Choose your price</span>
                    <div className="lens-variants-list">
                      {lens.variants.map((variant) => (
                        <button
                          type="button"
                          key={variant}
                          className={activePrice === variant ? 'lens-variant active' : 'lens-variant'}
                          onClick={() => setSelectedVariantPrice(variant)}
                        >
                          ₹{variant}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prescription Notes */}
          <h3 className="options-title mt-4">2. Prescription Details (Optional)</h3>
          <div className="presc-box">
            <div className="presc-types">
              <label className={`presc-chip ${prescriptionType === 'single' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="ptype" 
                  checked={prescriptionType === 'single'} 
                  onChange={() => setPrescriptionType('single')} 
                />
                Provide on WhatsApp Later
              </label>
              <label className={`presc-chip ${prescriptionType === 'enter' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="ptype" 
                  checked={prescriptionType === 'enter'} 
                  onChange={() => setPrescriptionType('enter')} 
                />
                Enter Power Note
              </label>
            </div>

            {prescriptionType === 'enter' ? (
              <input 
                type="text" 
                className="power-input"
                placeholder="e.g. Left: -1.50 Sph, Right: -1.25 Sph, Axis 90" 
                value={powerNote}
                onChange={(e) => setPowerNote(e.target.value)}
              />
            ) : (
              <div className="whatsapp-help-note">
                <Info size={16} className="text-blue" />
                <span>Our optometrist will contact you on WhatsApp (+91 87701 52422) after order placement to collect your prescription photo/specs slip.</span>
              </div>
            )}
          </div>
        </div>

        <div className="lens-modal-footer">
          <div className="total-calculation">
            <span className="calc-label">Total Amount:</span>
            <div className="calc-price-group">
              <span className="total-val">₹{totalPrice}</span>
              <span className="total-breakup">(Frame ₹{product.price} + Lens ₹{activeLens.price})</span>
            </div>
          </div>

          <div className="modal-footer-actions">
            <button className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-pink" onClick={handleConfirm}>
              <Sparkles size={16} /> Add to Cart with Lenses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

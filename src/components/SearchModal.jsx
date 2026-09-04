import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import './SearchModal.css';

export const SearchModal = ({ isOpen, onClose, products, onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShape, setSelectedShape] = useState('all');

  if (!isOpen) return null;

  const shapes = ['all', 'Aviator', 'Square', 'Round', 'Geometric', 'Rectangular', 'Rimless'];

  const filtered = products.filter((p) => {
    const matchesQuery = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesShape = selectedShape === 'all' || p.shape.toLowerCase() === selectedShape.toLowerCase();

    return matchesQuery && matchesShape;
  });

  return (
    <div className="search-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Search size={22} className="search-lead-icon" />
          <input 
            type="text" 
            placeholder="Search by model, shape, color (e.g. 'Turban', 'Black', 'Aviator', '4265')..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={18} />
            </button>
          )}
          <button className="close-search-btn" onClick={onClose}>
            ESC
          </button>
        </div>

        {/* Quick Shape Filters */}
        <div className="search-quick-tags">
          <span className="filter-lbl">Quick Shapes:</span>
          {shapes.map((shape) => (
            <button 
              key={shape} 
              className={`shape-chip ${selectedShape === shape ? 'active' : ''}`}
              onClick={() => setSelectedShape(shape)}
            >
              {shape === 'all' ? 'All Shapes' : shape}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="search-results-area">
          <div className="results-count-row">
            <span>Found <strong>{filtered.length}</strong> matching eyewear models</span>
            {filtered.length > 0 && <span className="instock-pill">● Ready for Fast Dispatch</span>}
          </div>

          {filtered.length === 0 ? (
            <div className="no-search-results">
              <Sparkles size={36} className="text-pink mb-2" />
              <h4>No matching frames found</h4>
              <p>Try searching for terms like "Golden", "Polarized", "Turban", "Blue", or "Square".</p>
            </div>
          ) : (
            <div className="search-results-grid">
              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="search-result-card"
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                >
                  <img src={item.image} alt={item.name} className="search-thumb" />
                  <div className="search-info">
                    <span className="search-category">{item.type} • {item.shape}</span>
                    <h4 className="search-title">{item.name}</h4>
                    <span className="search-price">₹{item.price} <small>₹{item.originalPrice}</small></span>
                  </div>
                  <ArrowRight size={16} className="search-arrow" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

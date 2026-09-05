import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import './Hero.css';

export const Hero = ({ onExploreClick, onTurbanClick }) => {
  return (
    <section className="hero-section container">
      <div className="hero-split-grid">
        {/* Left Content Side */}
        <div className="hero-text-side">
          <span className="hero-badge-tag">NEW COLLECTION</span>
          
          <h1 className="hero-main-heading">
            Find your perfect <br />
            eyewear look
          </h1>

          <p className="hero-subtext">
            We’re all about finding you that perfect pair. Experience the difference it makes when everything fits just right. Let’s find yours together.
          </p>

          <div className="hero-cta-buttons">
            <button className="btn-navy-pill" onClick={() => onExploreClick('eyeglasses')}>
              Eye Glasses
            </button>
            <button className="btn-cyan-pill" onClick={() => onExploreClick('sunglasses')}>
              Sun Glasses
            </button>
          </div>

          <div className="hero-trust-stars-row">
            <div className="stars-icons">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span className="rating-label"><strong>4.9/5.0</strong> STORE RATING</span>
          </div>

          <div className="hero-customers-badge">
            <CheckCircle size={17} className="text-cyan-check" />
              <span><strong>40,000+</strong> Customers Enjoying Shree Ganesh Optical Shop</span>
          </div>
        </div>

        {/* Right Images Dual Cards */}
        <div className="hero-models-side">
          {/* Card 1: New Arrival Model (User's Photo with glasses) */}
          <div className="model-portrait-card" role="button" tabIndex={0} onClick={() => onExploreClick('new-arrivals')} onKeyDown={(event) => event.key === 'Enter' && onExploreClick('new-arrivals')}>
            <img 
              src="/images/user_model.png" 
              alt="New Arrival Glasses" 
              className="model-img" 
            />
            <div className="model-overlay-tag">
              <span>New Arrival</span>
            </div>
          </div>

          {/* Card 2: Turban Fit Model */}
          <div className="model-portrait-card turban-card" role="button" tabIndex={0} onClick={onTurbanClick} onKeyDown={(event) => event.key === 'Enter' && onTurbanClick()}>
            <img 
              src="/images/turban_model.jpg" 
              alt="Turban Fit Eyewear" 
              className="model-img" 
            />
            <div className="model-overlay-tag">
              <span>Turban Fit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

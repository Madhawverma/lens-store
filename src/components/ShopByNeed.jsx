import React from 'react';
import './ShopByNeed.css';

export const ShopByNeed = ({ onSelectNeed }) => {
  const needs = [
    {
      title: 'CASUAL',
      subtitle: 'Everyday Ease',
      color: '#5c242a',
      bgColor: '#d49b9c',
      img: '/images/user_model.png'
    },
    {
      title: 'WORK',
      subtitle: 'Office & Meetings',
      color: '#1f5a8a',
      bgColor: '#75b5e3',
      img: '/images/woman_model.jpg'
    },
    {
      title: 'PARTY',
      subtitle: 'Weekend & Night Out',
      color: '#395637',
      bgColor: '#a2c0a0',
      img: '/images/woman_sunglasses.jpg'
    },
    {
      title: 'ETHNIC',
      subtitle: 'Festive & Traditional',
      color: '#6c442c',
      bgColor: '#e2be9e',
      img: '/images/turban_model.jpg'
    }
  ];

  return (
    <section className="shop-by-need-section container">
      <div className="need-header">
        <h2 className="need-main-title">Shop by need</h2>
        <p className="need-subtext">Get the perfect fit for every need</p>
      </div>

      <div className="needs-cards-grid">
        {needs.map((item, idx) => (
          <div 
            key={idx} 
            className="need-item-card"
            onClick={() => onSelectNeed(item.title)}
          >
            <div className="need-title-overlay" style={{ color: item.color }}>
              {item.title}
            </div>
            <div className="need-portrait-box" style={{ backgroundColor: item.bgColor }}>
              <img src={item.img} alt={item.title} className="need-img" />
            </div>
          </div>
        ))}
      </div>

      {/* Mint Green Banner: New Design Frame */}
      <div className="new-design-banner">
        <div className="banner-left-model">
          <img src="/images/user_model.png" alt="Model Left" />
        </div>

        <div className="banner-center-content">
          <h3 className="banner-big-title">New Design Frame</h3>
          <p className="banner-sub">Discover the latest frames from Verma Ji Ki Dukan</p>
          <button className="btn-cyan-shop" onClick={() => onSelectNeed('all')}>
            Shop Now
          </button>
        </div>

        <div className="banner-right-model">
          <img src="/images/woman_model.jpg" alt="Model Right" />
        </div>
      </div>
    </section>
  );
};

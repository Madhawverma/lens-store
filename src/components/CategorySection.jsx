import React from 'react';
import './CategorySection.css';

export const CategorySection = ({ onSelectCategory }) => {
  const eyeglassesPeople = [
    {
      title: 'Men',
      img: '/images/user_model.png',
      bgColor: '#dbeafe'
    },
    {
      title: 'Women',
      img: '/images/woman_model.jpg',
      bgColor: '#e0f2fe'
    },
    {
      title: 'Turban',
      img: '/images/turban_model.jpg',
      bgColor: '#dbeafe',
      badge: '60% off'
    },
    {
      title: 'Essentials',
      img: '/images/user_model.png',
      bgColor: '#bae6fd'
    }
  ];

  const sunglassesPeople = [
    {
      title: 'Men',
      img: '/images/user_model.png',
      bgColor: '#fef08a'
    },
    {
      title: 'Women',
      img: '/images/woman_sunglasses.jpg',
      bgColor: '#fef9c3'
    },
    {
      title: 'Turban',
      img: '/images/turban_model.jpg',
      bgColor: '#fef08a',
      badge: '60% off'
    },
    {
      title: 'Essentials',
      img: '/images/woman_sunglasses.jpg',
      bgColor: '#fef9c3'
    }
  ];

  const vermaJiSpecials = [
    {
      title: 'Zero Power',
      img: '/images/user_model.png',
      bgColor: '#dcfce7'
    },
    {
      title: 'Progressive',
      img: '/images/woman_model.jpg',
      bgColor: '#ecfdf5'
    },
    {
      title: 'One Power',
      img: '/images/turban_model.jpg',
      bgColor: '#dcfce7',
      badge: 'Exclusive'
    },
    {
      title: 'Clip-on',
      img: '/images/woman_sunglasses.jpg',
      bgColor: '#f8fafc',
      badge: 'HOT CHOICE'
    }
  ];

  return (
    <div className="section-categories-wrapper container">
      {/* 4 Trust Value Icons Bar */}
      <div className="trust-four-bar">
        <div className="trust-four-item">
          <span className="trust-symbol">💎</span>
          <span>PREMIUM QUALITY PRODUCTS</span>
        </div>
        <div className="trust-four-item">
          <span className="trust-symbol">↩️</span>
          <span>EASY EXCHANGE PROCESS</span>
        </div>
        <div className="trust-four-item">
          <span className="trust-symbol">📦</span>
          <span>SECURE & FAST SHIPPING</span>
        </div>
        <div className="trust-four-item">
          <span className="trust-symbol">🏆</span>
          <span>BEST CUSTOMER SUPPORT</span>
        </div>
      </div>

      {/* Main Title Heading */}
      <div className="store-intro-heading">
        <h2>Best Eyewear Store in India – Verma Ji Ki Dukan</h2>
        <p>A wide range of eyewear for men, women, and kids</p>
      </div>

      {/* Section 1: Eyeglasses */}
      <div className="category-block">
        <h3 className="category-heading-title">Eyeglasses</h3>
        <div className="portrait-grid">
          {eyeglassesPeople.map((item, idx) => (
            <div 
              key={idx} 
              className="portrait-card"
              role="button"
              tabIndex={0}
              style={{ backgroundColor: item.bgColor }}
              onClick={() => onSelectCategory('eyeglasses', item.title)}
              onKeyDown={(event) => event.key === 'Enter' && onSelectCategory('eyeglasses', item.title)}
            >
              {item.badge && <span className="portrait-badge cyan">{item.badge}</span>}
              <div className="portrait-img-box">
                <img src={item.img} alt={item.title} className="portrait-img" />
              </div>
              <span className="portrait-title">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Sunglasses */}
      <div className="category-block">
        <h3 className="category-heading-title">Sunglasses</h3>
        <div className="portrait-grid">
          {sunglassesPeople.map((item, idx) => (
            <div 
              key={idx} 
              className="portrait-card"
              role="button"
              tabIndex={0}
              style={{ backgroundColor: item.bgColor }}
              onClick={() => onSelectCategory('sunglasses', item.title)}
              onKeyDown={(event) => event.key === 'Enter' && onSelectCategory('sunglasses', item.title)}
            >
              {item.badge && <span className="portrait-badge cyan">{item.badge}</span>}
              <div className="portrait-img-box">
                <img src={item.img} alt={item.title} className="portrait-img" />
              </div>
              <span className="portrait-title">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Specials (Zero Power, Progressive, One Power, Clip-on) */}
      <div className="category-block">
        <h3 className="category-heading-title">Verma Ji Ki Dukan Specials</h3>
        <div className="portrait-grid">
          {vermaJiSpecials.map((item, idx) => (
            <div 
              key={idx} 
              className="portrait-card"
              role="button"
              tabIndex={0}
              style={{ backgroundColor: item.bgColor }}
              onClick={() => onSelectCategory('clip-on', item.title)}
              onKeyDown={(event) => event.key === 'Enter' && onSelectCategory('clip-on', item.title)}
            >
              {item.badge && <span className="portrait-badge cyan">{item.badge}</span>}
              <div className="portrait-img-box">
                <img src={item.img} alt={item.title} className="portrait-img" />
              </div>
              <span className="portrait-title">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

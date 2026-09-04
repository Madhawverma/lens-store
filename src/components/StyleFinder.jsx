import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './StyleFinder.css';

export const StyleFinder = ({ onSelectStyle }) => {
  const [activeGender, setActiveGender] = useState('men');

  const menLooks = [
    {
      title: 'CEO Look',
      img: '/images/user_model.png',
    },
    {
      title: 'Street Style',
      img: '/images/user_model.png',
    },
    {
      title: 'Nawab Style',
      img: '/images/turban_model.jpg',
    },
    {
      title: 'Athletic Look',
      img: '/images/turban_model.jpg',
    }
  ];

  const womenLooks = [
    {
      title: 'Glam Queen',
      img: '/images/woman_sunglasses.jpg',
    },
    {
      title: 'Boss Lady',
      img: '/images/woman_model.jpg',
    },
    {
      title: 'Ethnic Queen',
      img: '/images/woman_model.jpg',
    },
    {
      title: 'Athletic Look',
      img: '/images/woman_sunglasses.jpg',
    }
  ];

  const currentLooks = activeGender === 'men' ? menLooks : womenLooks;

  return (
    <section className="style-finder-section container">
      <div className="finder-header">
        <div className="finder-title-row">
          <span className="finder-main-word">Style</span>
          <span className="finder-black-pill">FINDER</span>
        </div>
        <p className="finder-subtext">Discover every look, for every you</p>
      </div>

      <div className="finder-layout-grid">
        {/* Gender Selection Card */}
        <div className="finder-sidebar-card">
          <div className="gender-tabs-toggle">
            <button 
              className={`gender-tab-btn ${activeGender === 'men' ? 'active' : ''}`}
              onClick={() => setActiveGender('men')}
            >
              Men
            </button>
            <button 
              className={`gender-tab-btn ${activeGender === 'women' ? 'active' : ''}`}
              onClick={() => setActiveGender('women')}
            >
              Women
            </button>
          </div>

          <h3 className="gender-lead-title">{activeGender === 'men' ? 'Men' : 'Women'}</h3>
          <span className="explore-all-text">Explore All</span>
          
          <button className="finder-circle-arrow-btn">
            <ArrowRight size={18} />
          </button>
        </div>

        {/* 4 Looks Columns */}
        <div className="finder-looks-grid">
          {currentLooks.map((look, idx) => (
            <div 
              key={idx} 
              className="look-item-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectStyle(look.title)}
              onKeyDown={(event) => event.key === 'Enter' && onSelectStyle(look.title)}
            >
              <img src={look.img} alt={look.title} className="look-img" />
              <div className="look-bottom-label">
                <span>{look.title.split(' ')[0]}</span>
                <strong>{look.title.split(' ')[1] || 'Look'}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

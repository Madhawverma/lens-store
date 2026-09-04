import React from 'react';
import './CategoryPills.css';

export const CategoryPills = ({ onSelectCategory }) => {
  const topPillCategories = [
    {
      id: 'new-arrivals',
      title: 'New arrival',
      img: '/images/pill_new-arrivals.png'
    },
    {
      id: 'eyeglasses',
      title: 'Eyeglasses',
      img: '/images/pill_eyeglasses.png'
    },
    {
      id: 'sunglasses',
      title: 'Sunglasses',
      img: '/images/pill_sunglasses.png'
    },
    {
      id: 'turban-friendly',
      title: 'Turban Friendly',
      img: '/images/pill_turban-friendly.png'
    },
    {
      id: 'power-sunglasses',
      title: 'Power Glasses',
      img: '/images/pill_power-glasses.png'
    },
    {
      id: 'clip-on',
      title: 'Clip-on',
      img: '/images/pill_clip-on.png'
    }
  ];

  return (
    <div className="category-pills-bar container">
      <div className="pills-grid">
        {topPillCategories.map((cat) => (
          <div 
            key={cat.id} 
            className="pill-card"
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="pill-img-frame">
              <img src={cat.img} alt={cat.title} className="pill-img" />
            </div>
            <span className="pill-title">{cat.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

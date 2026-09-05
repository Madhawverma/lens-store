import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './StyleShowcase.css';

export const StyleShowcase = () => {
  const scrollRef = useRef(null);

  const styleItems = [
    {
      title: 'CEO Look',
      img: '/images/user_model.png',
      tag: 'Glasses Elegance'
    },
    {
      title: 'Nawab Style',
      img: '/images/turban_model.jpg',
      tag: 'Turban Fit'
    },
    {
      title: 'Street Style',
      img: '/images/woman_sunglasses.jpg',
      tag: 'Bold & Sharp'
    },
    {
      title: 'Everyday Classic',
      img: '/images/woman_model.jpg',
      tag: 'Comfort First'
    }
  ];

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="style-showcase-section container">
      <div className="showcase-header">
        <span className="showcase-nation-tag">SHREE GANESH OPTICAL SHOP</span>
        <h2 className="showcase-main-title">From Everyday Looks to Iconic Styles</h2>
        <p className="showcase-subtitle">
            Trusted by thousands of happy customers who’ve upgraded their style and vision with Shree Ganesh Optical Shop’s high-quality eyewear.
        </p>

        <div className="showcase-arrows">
          <button className="arrow-circle" onClick={() => handleScroll('left')}>
            <ChevronLeft size={18} />
          </button>
          <button className="arrow-circle active" onClick={() => handleScroll('right')}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="showcase-slider" ref={scrollRef}>
        {styleItems.map((item, idx) => (
          <div key={idx} className="showcase-slide-card">
            <img src={item.img} alt={item.title} className="showcase-slide-img" />
          </div>
        ))}
      </div>
    </section>
  );
};

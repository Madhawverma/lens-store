import React from 'react';
import './ShapeGrid.css';

export const ShapeGrid = ({ onSelectShape }) => {
  const shapes = [
    { name: 'Wayfarer', img: '/images/shape_wayfarer.png' },
    { name: 'Clubmaster', img: '/images/shape_clubmaster.png' },
    { name: 'Cat Eye', img: '/images/shape_cateye_round.png' },
    { name: 'Aviator', img: '/images/shape_aviator.png' },
    { name: 'Round Wire', img: '/images/shape_round_wire.png' },
    { name: 'Round Thick', img: '/images/shape_round_thick.png' },
    { name: 'Keyhole', img: '/images/shape_keyhole_round.png' },
    { name: 'Geometric', img: '/images/shape_geometric_square.png' }
  ];

  return (
    <section className="shape-grid-section container">
      <div className="shape-header">
        <h2 className="shape-main-title">Get the perfect shape</h2>
      </div>

      <div className="shapes-grid-boxes">
        {shapes.map((item, idx) => (
          <div 
            key={idx} 
            className="shape-item-box"
            onClick={() => onSelectShape(item.name)}
          >
            <div className="shape-img-wrap">
              <img src={item.img} alt={item.name} className="shape-img" />
            </div>
            <span className="shape-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

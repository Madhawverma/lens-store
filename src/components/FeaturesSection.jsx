import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  Eye, 
  Droplet, 
  Layers, 
  Wind, 
  Zap 
} from 'lucide-react';
import './FeaturesSection.css';

export const FeaturesSection = () => {
  const traits = [
    {
      icon: <Zap size={24} className="trait-icon text-blue" />,
      title: "Blocks Blue Lights",
      desc: "Filters out 98% of harmful high-energy blue-violet rays emitted by phone, laptop & TV screens."
    },
    {
      icon: <Layers size={24} className="trait-icon text-pink" />,
      title: "Anti-Reflective Coating",
      desc: "Eliminates annoying glare and halos, ensuring crystal-clear optical clarity for night drive."
    },
    {
      icon: <Sun size={24} className="trait-icon text-gold" />,
      title: "100% UV Protection",
      desc: "Complete UV400 shield protecting eyes against UVA and UVB solar damage."
    },
    {
      icon: <ShieldCheck size={24} className="trait-icon text-green" />,
      title: "Scratch Resistant",
      desc: "Tough diamond-hard nano-film coating protects your lenses against daily abrasive wear."
    },
    {
      icon: <Droplet size={24} className="trait-icon text-blue" />,
      title: "Repels Water & Smudges",
      desc: "Super-hydrophobic and oleophobic layers make liquids and oily fingerprints slide right off."
    },
    {
      icon: <Wind size={24} className="trait-icon text-primary" />,
      title: "Repels Dust Particles",
      desc: "Anti-static coating prevents dust, lint, and ambient debris from sticking to the lens."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-banner-header">
          <span className="section-subtitle">ADVANCED OPTICAL CRAFT</span>
          <h2 className="section-title">We Take Vision & Protection Seriously</h2>
          <p className="features-desc">
            Every Verma Ji Ki Dukan frame and lens goes through a stringent 14-point quality inspection to deliver supreme comfort, zero distortion, and timeless durability.
          </p>
        </div>

        <div className="traits-grid">
          {traits.map((trait, index) => (
            <div key={index} className="trait-card">
              <div className="trait-icon-box">
                {trait.icon}
              </div>
              <div className="trait-content">
                <h4 className="trait-title">{trait.title}</h4>
                <p className="trait-desc">{trait.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

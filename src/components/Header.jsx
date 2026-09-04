import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  CheckCircle, 
  Sparkles,
  Glasses,
  ShieldCheck
} from 'lucide-react';
import './Header.css';

export const Header = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAuth,
  activeCategory,
  onSelectCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navLinks = [
    {
      id: 'new-arrivals',
      label: 'New Arrivals',
      badge: 'Hot'
    },
    {
      id: 'eyeglasses',
      label: 'Eyeglasses',
      hasMegaMenu: true,
      subSections: [
        {
          title: 'By Gender',
          items: ['Men', 'Women', 'Unisex', 'Kids']
        },
        {
          title: 'By Price',
          items: ['Under ₹500', 'Under ₹1000', 'Under ₹1500', 'Above ₹1500']
        },
        {
          title: 'By Color',
          items: ['Black', 'Brown', 'Blue', 'Leopard', 'Pink', 'Transparent', 'Golden', 'Silver', 'Gunmetal']
        },
        {
          title: 'By Shape',
          items: ['Rectangular', 'Square', 'Round', 'Geometric', 'Aviators', 'Double Bar', 'Hexagon', 'Butterfly', 'Oval']
        },
        {
          title: 'By Style',
          items: ['Full Frame', 'Half Frame', 'Rimless Frame']
        }
      ]
    },
    {
      id: 'sunglasses',
      label: 'Sunglasses',
      hasMegaMenu: true,
      subSections: [
        {
          title: 'By Gender',
          items: ['Men', 'Women', 'Unisex']
        },
        {
          title: 'By Price',
          items: ['Under ₹500', 'Under ₹1000', 'Under ₹1500', 'Above ₹1500']
        },
        {
          title: 'By Color',
          items: ['Black', 'Blue', 'Brown', 'Mirror', 'Transparent', 'Pink', 'White', 'Yellow']
        },
        {
          title: 'By Shape',
          items: ['Aviator', 'Round', 'Square', 'Hexagon', 'Butterfly', 'Cat Eye', 'Rectangular', 'Oversized']
        }
      ]
    },
    {
      id: 'turban-friendly',
      label: 'Turban Friendly',
      badge: 'Exclusive',
      subLinks: [
        'Turban Friendly Eyeglasses',
        'Turban Friendly Sunglasses',
        'Turban Fit Polarized Sunglasses',
        'Rimless Turban Glasses'
      ]
    },
    {
      id: 'day-night',
      label: 'Day Night Photochromic'
    },
    {
      id: 'clip-on',
      label: 'Clip-on Switch',
      badge: '2-in-1'
    },
    {
      id: 'under-499',
      label: 'Flexible Under 499'
    },
    {
      id: 'computer-glasses',
      label: 'Computer Glasses'
    }
  ];

  return (
    <header className="site-header">
      {/* Upper Info Row */}
      <div className="header-top container">
        <div className="contact-info">
          <a href="tel:+918770152422" className="contact-item">
            <Phone size={13} />
            <span>+91 87701 52422</span>
          </a>
          <a href="mailto:madhawverma@gmail.com" className="contact-item">
            <Mail size={13} />
            <span>madhawverma@gmail.com</span>
          </a>
        </div>

        <div className="trust-pills">
          <span className="trust-pill"><CheckCircle size={12} className="text-green" /> 4.9/5 Store Rating</span>
          <span className="trust-pill"><Sparkles size={12} className="text-gold" /> 40,000+ Happy Customers</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="header-main container">
        <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>

        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => onSelectCategory('all')}>
          <div className="logo-icon-wrap">
            <Glasses className="logo-icon" size={26} />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Verma Ji Ki Dukan</span>
            <span className="logo-hindi">"चश्मा"</span>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="header-search-bar" onClick={onOpenSearch}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for Eyeglasses, Sunglasses, Turban fit, Colors..." 
            readOnly 
          />
          <button className="search-badge">Search</button>
        </div>

        {/* Header Action Icons */}
        <div className="header-actions">
          <button className="action-btn" onClick={onOpenSearch} title="Search" id="mobile-search-btn">
            <Search size={22} />
          </button>

          <button className="action-btn" onClick={onOpenAuth} title="My Account">
            <User size={22} />
            <span className="action-label">Login</span>
          </button>

          <Link className="action-btn" to="/admin" title="Admin Panel">
            <ShieldCheck size={22} />
            <span className="action-label">Admin</span>
          </Link>

          <button className="action-btn" onClick={onOpenWishlist} title="Wishlist">
            <div className="badge-wrap">
              <Heart size={22} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </div>
            <span className="action-label">Wishlist</span>
          </button>

          <button className="action-btn cart-btn-highlight" onClick={onOpenCart} title="Cart">
            <div className="badge-wrap">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="action-badge pink">{cartCount}</span>}
            </div>
            <span className="action-label">Cart</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="header-nav">
        <div className="container nav-inner">
          <ul className="nav-menu">
            {navLinks.map((nav) => (
              <li 
                key={nav.id} 
                className={`nav-item ${activeCategory === nav.id ? 'active' : ''} ${nav.hasMegaMenu || nav.subLinks ? 'has-dropdown' : ''}`}
                onMouseEnter={() => setActiveDropdown(nav.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => {
                  onSelectCategory(nav.id);
                  setMobileMenuOpen(false);
                }}
              >
                <div className="nav-link-content">
                  <span>{nav.label}</span>
                  {nav.badge && <span className="nav-item-badge">{nav.badge}</span>}
                  {(nav.hasMegaMenu || nav.subLinks) && <ChevronDown size={14} className="dropdown-arrow" />}
                </div>

                {/* Mega Menu for Eyeglasses / Sunglasses */}
                {nav.hasMegaMenu && activeDropdown === nav.id && (
                  <div className="mega-menu animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="mega-menu-grid">
                      {nav.subSections.map((sec, i) => (
                        <div key={i} className="mega-menu-col">
                          <h4 className="mega-col-title">{sec.title}</h4>
                          <ul className="mega-links">
                            {sec.items.map((item, j) => (
                              <li key={j} onClick={() => {
                                onSelectCategory(nav.id, item);
                                setActiveDropdown(null);
                              }}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="mega-menu-banner">
                        <span className="banner-tag">Flat 60% Off</span>
                        <h4>Turban Friendly Collection</h4>
                        <p>Comfort designed for daily wear without temple pain.</p>
                        <button className="btn-pink btn-sm" onClick={() => {
                          onSelectCategory('turban-friendly');
                          setActiveDropdown(null);
                        }}>
                          Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Simple Dropdown for Turban Friendly */}
                {nav.subLinks && activeDropdown === nav.id && (
                  <div className="simple-dropdown animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <ul>
                      {nav.subLinks.map((link, idx) => (
                        <li key={idx} onClick={() => {
                          onSelectCategory(nav.id, link);
                          setActiveDropdown(null);
                        }}>
                          {link}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="mobile-drawer-header">
            <div className="brand-logo">
              <Glasses size={22} />
              <span>Verma Ji Ki Dukan</span>
            </div>
            <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <ul className="mobile-nav-list">
            <li onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}>All Products</li>
            {navLinks.map((nav) => (
              <li key={nav.id} onClick={() => { onSelectCategory(nav.id); setMobileMenuOpen(false); }}>
                <div className="mobile-item-row">
                  <span>{nav.label}</span>
                  {nav.badge && <span className="nav-item-badge">{nav.badge}</span>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mobile-drawer-footer">
            <button className="btn-pink w-100 mb-2" onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}>
              Login / Register
            </button>
            <div className="mobile-support">
              <p>Customer Care: <strong>+91 87701 52422</strong></p>
              <p>Email: madhawverma@gmail.com</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

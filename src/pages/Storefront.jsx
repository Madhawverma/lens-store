import React, { useState, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { CategoryPills } from '../components/CategoryPills';
import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { StyleShowcase } from '../components/StyleShowcase';
import { ProductCard } from '../components/ProductCard';
import { LensModal } from '../components/LensModal';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { SearchModal } from '../components/SearchModal';
import { AuthModal } from '../components/AuthModal';
import { QuickViewModal } from '../components/QuickViewModal';
import { FeaturesSection } from '../components/FeaturesSection';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { StyleFinder } from '../components/StyleFinder';
import { ShopByNeed } from '../components/ShopByNeed';
import { ShapeGrid } from '../components/ShapeGrid';
import { ProductGridSection } from '../components/ProductGridSection';
import { useProducts } from '../context/ProductContext';
import { Filter, SlidersHorizontal, Sparkles, MessageCircle, Check, ArrowDown, ArrowUp } from 'lucide-react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export function Storefront() {
  const navigate = useNavigate();
  const { products: allProducts } = useProducts();

  // State variables
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterSubCat, setFilterSubCat] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [shapeFilter, setShapeFilter] = useState('all');
  const [catalogVisibleCount, setCatalogVisibleCount] = useState(25);
  
  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Active selected item for Modals
  const [selectedLensProduct, setSelectedLensProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Category & Filter Handler
  const handleSelectCategory = (catId, subItem = null) => {
    setActiveCategory(catId);
    if (subItem) {
      setFilterSubCat(subItem);
    } else {
      setFilterSubCat('all');
    }
      setCatalogVisibleCount(25);
    // Smooth scroll to catalog section
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add Frame Directly to Cart
  const handleAddToCart = (product) => {
    const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && !item.lens);
      if (existing) {
        return prev.map((item) => 
          item.id === product.id && !item.lens 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, totalPrice: salePrice }];
    });
    setIsCartOpen(true);
  };

  // Add Product with Customized Lens to Cart
  const handleAddWithLens = (product, lens, note) => {
    const salePrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.lens?.id === lens.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          lens,
          prescriptionNote: note,
          totalPrice: salePrice + lens.price
        }
      ];
    });
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId, lensId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId, lensId);
      return;
    }
    setCartItems((prev) => 
      prev.map((item) => 
        item.id === productId && (item.lens?.id === lensId || (!item.lens && !lensId))
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (productId, lensId) => {
    setCartItems((prev) => 
      prev.filter((item) => !(item.id === productId && (item.lens?.id === lensId || (!item.lens && !lensId))))
    );
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      if (exists) {
        return prev.filter((i) => i.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Filtered Products Catalog
  const filteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return allProducts.filter((item) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'new-arrivals' && !item.isNew) return false;
        if (activeCategory === 'under-499' && item.price > 499) return false;
        if (activeCategory !== 'new-arrivals' && activeCategory !== 'under-499' && item.category !== activeCategory) return false;
      }

      // Tab filter
      if (activeTab === 'eyeglasses' && item.type !== 'Eyeglasses') return false;
      if (activeTab === 'sunglasses' && item.type !== 'Sunglasses') return false;
      if (activeTab === 'turban' && item.category !== 'turban-friendly') return false;

      // Price filter
      if (priceFilter === 'under-1000' && item.price >= 1000) return false;
      if (priceFilter === 'under-1500' && (item.price < 1000 || item.price >= 1500)) return false;
      if (priceFilter === 'above-1500' && item.price < 1500) return false;

      // Shape filter
      if (shapeFilter !== 'all' && item.shape.toLowerCase() !== shapeFilter.toLowerCase()) return false;

      return true;
    });
  }, [allProducts, activeCategory, activeTab, priceFilter, shapeFilter]);

  const displayedFeatured = useMemo(() => {
    if (filteredProducts && filteredProducts.length >= 3) {
      return filteredProducts.slice(0, 4);
    }
    if (filteredProducts && filteredProducts.length > 0) {
      const set = new Set(filteredProducts.map((p) => p.id));
      const complement = (allProducts || []).filter((p) => !set.has(p.id));
      return [...filteredProducts, ...complement].slice(0, 4);
    }
    return (allProducts || []).slice(0, 4);
  }, [filteredProducts, allProducts]);

  const visibleCatalogProducts = filteredProducts.slice(0, catalogVisibleCount);
  const catalogGroups = [
    { id: 'all', label: 'All' },
    { id: 'eyeglasses', label: 'Eyeglasses' },
    { id: 'sunglasses', label: 'Sunglasses' },
    { id: 'clip-on', label: 'Clip-on' },
    { id: 'computer-glasses', label: 'Computer Glasses' },
    { id: 'turban-friendly', label: 'Turban Friendly' },
    { id: 'day-night', label: 'Day-Night' }
  ];

  return (
    <div className="app-layout">
      {/* 1. Animated Top Announcement Ticker */}
      <TopBar onShopNowClick={() => handleSelectCategory('all')} onAdminLogin={() => navigate('/admin')} />

      {/* 2. Header with Mega Menus & Navigation */}
      <Header 
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Top Category Frame Pills Bar */}
      <CategoryPills onSelectCategory={handleSelectCategory} />

      {/* 4. Hero Showcase with Dual Model Cards */}
      <Hero 
        onExploreClick={(cat) => handleSelectCategory(cat)}
        onTurbanClick={() => handleSelectCategory('turban-friendly')}
      />

      {/* 5. Category People Grid (Eyeglasses, Sunglasses, Specials) */}
      <CategorySection onSelectCategory={handleSelectCategory} />

      {/* 6. Main Catalog & Featured Collections */}
      <main id="catalog-section" className="catalog-section container">
        <div className="featured-section-split">
          {/* Left Title & Features info */}
          <div className="featured-info-col">
            <span className="hot-choice-tag">HOT CHOICE</span>
            <h2 className="featured-main-title">Our Featured Collection</h2>
            <ul className="featured-bullets-list">
              <li><Check size={16} className="text-cyan-check" /> Premium quality</li>
              <li><Check size={16} className="text-cyan-check" /> Happening styles</li>
              <li><Check size={16} className="text-cyan-check" /> Perfect for all occasion</li>
              <li><Check size={16} className="text-cyan-check" /> Inspire others</li>
            </ul>
          </div>

          {/* Right Product Grid */}
          <div className="featured-products-grid">
            {displayedFeatured.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onSelectLens={(p) => setSelectedLensProduct(p)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.some((i) => i.id === product.id)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </main>

      <section className="catalog-all-section container">
        <div className="catalog-all-heading">
          <h2>All Products</h2>
          <span>{filteredProducts.length} styles available</span>
        </div>
        <div className="catalog-group-tabs" aria-label="Product categories">
          {catalogGroups.map((group) => (
            <button key={group.id} className={activeCategory === group.id ? 'catalog-group-btn active' : 'catalog-group-btn'} onClick={() => handleSelectCategory(group.id)}>
              {group.label}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {visibleCatalogProducts.map((product) => (
            <ProductCard
              key={`catalog-${product.id}`}
              product={product}
              onAddToCart={handleAddToCart}
              onSelectLens={setSelectedLensProduct}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistItems.some((item) => item.id === product.id)}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
        {catalogVisibleCount < filteredProducts.length && (
          <div className="section-footer-center">
            <button className="btn-view-more" onClick={() => setCatalogVisibleCount((count) => Math.min(count + 25, filteredProducts.length))}>
              View More ({Math.min(25, filteredProducts.length - catalogVisibleCount)} more)
            </button>
          </div>
        )}
      </section>

      {/* 7. From Everyday Looks to Iconic Styles (Showcase Slider) */}
      <StyleShowcase />

      <StyleFinder onSelectStyle={() => handleSelectCategory('all')} />
      <ShopByNeed onSelectNeed={(need) => handleSelectCategory('all')} />
      <ShapeGrid onSelectShape={(shape) => {
        setShapeFilter(shape);
        handleSelectCategory('all');
      }} />

      <ProductGridSection title="Eye Glasses" subtitle="HOT SELLER" categoryFilter="eyeglasses" maxItems={25} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} onQuickView={setQuickViewProduct} onSelectLens={setSelectedLensProduct} />
      <ProductGridSection title="Turban Friendly" subtitle="NEW INN" categoryFilter="turban-friendly" maxItems={25} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} onQuickView={setQuickViewProduct} onSelectLens={setSelectedLensProduct} />

      {/* 6. Eyeframes Traits & Features */}
      <FeaturesSection />

      {/* 7. Verified Testimonials */}
      <Testimonials />
      
      <ProductGridSection title="Computer Glasses" subtitle="LIMITED COLLECTION" categoryFilter="computer-glasses" maxItems={25} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} onQuickView={setQuickViewProduct} onSelectLens={setSelectedLensProduct} />

      {/* 8. Full Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Floating WhatsApp Support Button */}
      <a 
        href="https://wa.me/918770152422?text=Hello%20Verma%20Ji%20Ki%20Dukan%2C%20I%20need%20help%20with%20prescription%20eyewear" 
        target="_blank" 
        rel="noreferrer"
        className="whatsapp-float-btn"
        title="Chat with Optometrist on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="wa-tooltip">Chat with Optometrist</span>
      </a>

      <div className="scroll-jump-controls" aria-label="Quick page navigation">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Go to top"><ArrowUp size={18} /></button>
        <button type="button" onClick={() => document.getElementById('catalog-all-section')?.scrollIntoView({ behavior: 'smooth' })} title="Go to products"><ArrowDown size={18} /></button>
      </div>

      {/* Modals and Drawers */}
      <LensModal 
        product={selectedLensProduct}
        isOpen={Boolean(selectedLensProduct)}
        onClose={() => setSelectedLensProduct(null)}
        onAddWithLens={handleAddWithLens}
      />

      <QuickViewModal 
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectLens={(p) => setSelectedLensProduct(p)}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistItems.some((i) => i.id === quickViewProduct.id) : false}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={(id) => setWishlistItems((prev) => prev.filter((i) => i.id !== id))}
        onMoveToCart={(p) => handleAddToCart(p)}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={allProducts}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
export default Storefront;

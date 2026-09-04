import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import './ProductGridSection.css';
import { useProducts } from '../context/ProductContext';

export const ProductGridSection = ({ title, subtitle, categoryFilter, maxItems = 4, onAddToCart, onToggleWishlist, wishlistItems = [], onQuickView, onSelectLens }) => {
  const { products } = useProducts();
  const [visibleCount, setVisibleCount] = useState(maxItems);

  // Filter products based on category if provided, otherwise just take first maxItems
  const matchingProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter || p.tags?.includes(categoryFilter))
    : products;
  const displayProducts = matchingProducts.slice(0, visibleCount);

  // Fallback to all products if filter yields empty
  const items = displayProducts.length > 0 ? displayProducts : products.slice(0, maxItems);

  return (
    <section className="product-grid-section container">
      <div className="section-header-center">
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        <h2 className="section-main-title">{title}</h2>
      </div>

      <div className="product-grid-4-cols">
        {items.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistItems.some((item) => item.id === product.id)}
            onQuickView={onQuickView}
            onSelectLens={onSelectLens}
          />
        ))}
      </div>

      <div className="section-footer-center">
        {visibleCount < matchingProducts.length && (
          <button className="btn-view-more" onClick={() => setVisibleCount((count) => Math.min(count + 25, matchingProducts.length))}>
            View More ({Math.min(25, matchingProducts.length - visibleCount)} more)
          </button>
        )}
      </div>
    </section>
  );
};

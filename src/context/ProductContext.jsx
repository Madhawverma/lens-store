import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA } from '../data/products';
import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, firebaseEnabled } from '../lib/firebase';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => PRODUCTS_DATA.map((product) => ({ ...product, stock: product.stock ?? 10 })));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on initial render
    const stored = localStorage.getItem('verma_ji_store_products_v4');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.map((product) => ({ ...product, stock: product.stock ?? 10 })));
        } else {
          setProducts(PRODUCTS_DATA.map((product) => ({ ...product, stock: product.stock ?? 10 })));
          localStorage.setItem('verma_ji_store_products_v4', JSON.stringify(PRODUCTS_DATA));
        }
      } catch (e) {
        setProducts(PRODUCTS_DATA.map((product) => ({ ...product, stock: product.stock ?? 10 })));
      }
    } else {
      // If nothing in localStorage, use master data from products.js
      setProducts(PRODUCTS_DATA.map((product) => ({ ...product, stock: product.stock ?? 10 })));
      localStorage.setItem('verma_ji_store_products_v4', JSON.stringify(PRODUCTS_DATA));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !db) return;
    const syncCloudCatalog = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        if (!snapshot.empty) {
          setProducts(snapshot.docs.map((product) => ({ ...product.data(), stock: product.data().stock ?? 10 })));
          return;
        }
        for (let start = 0; start < PRODUCTS_DATA.length; start += 500) {
          const batch = writeBatch(db);
          PRODUCTS_DATA.slice(start, start + 500).forEach((product) => {
            batch.set(doc(db, 'products', String(product.id)), product);
          });
          await batch.commit();
        }
      } catch (error) {
        console.warn('Firebase catalog sync unavailable; using local catalog.', error);
      }
    };
    syncCloudCatalog();
  }, []);

  useEffect(() => {
    // Sync to localStorage whenever products change (if already loaded)
    if (isLoaded) {
      localStorage.setItem('verma_ji_store_products_v4', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  const addProduct = async (newProduct) => {
    // Generate a simple unique ID
    const productWithId = {
      ...newProduct,
      id: `p_${Date.now()}`,
      image: newProduct.image || newProduct.images?.[0],
      hoverImage: newProduct.hoverImage || newProduct.images?.[1] || newProduct.image,
      originalPrice: newProduct.originalPrice || newProduct.price,
      customLensPrice: Number(newProduct.customLensPrice || 0),
      stock: Math.max(0, Number(newProduct.stock || 0)),
      isNew: true, // mark as new arrival
      rating: 5,
      reviews: 0
    };
    
    if (firebaseEnabled && db) {
      await setDoc(doc(db, 'products', String(productWithId.id)), productWithId);
    }
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (id, changes) => {
    const updatedProduct = products.find((product) => product.id === id);
    const nextProduct = updatedProduct ? {
      ...updatedProduct,
      ...changes,
      image: changes.image || updatedProduct.image || updatedProduct.images?.[0],
      hoverImage: changes.image || changes.hoverImage || updatedProduct.hoverImage || updatedProduct.images?.[1],
      price: Number(changes.price),
      originalPrice: Number(changes.originalPrice || changes.price),
      discount: changes.discount ? Number(changes.discount) : null,
      customLensPrice: Number(changes.customLensPrice || 0)
      ,stock: Math.max(0, Number(changes.stock ?? updatedProduct.stock ?? 0))
    } : null;
    setProducts(prev => prev.map(product => product.id === id ? {
      ...product,
      ...changes,
      image: changes.image || product.image || product.images?.[0],
      hoverImage: changes.image || changes.hoverImage || product.hoverImage || product.images?.[1],
      price: Number(changes.price),
      originalPrice: Number(changes.originalPrice || changes.price),
      discount: changes.discount ? Number(changes.discount) : null,
      customLensPrice: Number(changes.customLensPrice || 0)
      ,stock: Math.max(0, Number(changes.stock ?? product.stock ?? 0))
    } : product));
    if (firebaseEnabled && db && nextProduct) setDoc(doc(db, 'products', String(id)), nextProduct);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (firebaseEnabled && db) deleteDoc(doc(db, 'products', String(id)));
  };

  const decreaseStock = (items) => {
    setProducts((current) => {
      const nextProducts = current.map((product) => {
        const quantity = items.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
        if (!quantity) return product;
        return { ...product, stock: Math.max(0, Number(product.stock ?? 0) - quantity) };
      });
      if (firebaseEnabled && db) {
        nextProducts.forEach((product) => {
          const previous = current.find((item) => item.id === product.id);
          if (previous?.stock !== product.stock) setDoc(doc(db, 'products', String(product.id)), product);
        });
      }
      return nextProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, decreaseStock }}>
      {children}
    </ProductContext.Provider>
  );
};

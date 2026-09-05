import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../lib/firebase';

const OrderContext = createContext(null);
const ORDERS_STORAGE_KEY = 'verma_ji_store_orders_v1';

function readOrders() {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(readOrders);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const syncOrders = (event) => {
      if (event.key === ORDERS_STORAGE_KEY) setOrders(readOrders());
    };
    window.addEventListener('storage', syncOrders);
    return () => window.removeEventListener('storage', syncOrders);
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !db) return undefined;
    return onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (!snapshot.empty) setOrders(snapshot.docs.map((order) => order.data()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, (error) => console.warn('Firebase order sync unavailable; using local orders.', error));
  }, []);

  const createOrder = ({ items, total, customer = {} }) => {
    const order = {
      id: `VJ-${Date.now().toString().slice(-8)}`,
      type: 'order',
      status: 'placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: items.map(({ id, name, image, quantity, totalPrice, lens }) => ({
        id, name, image, quantity, totalPrice, lens: lens?.title || null
      })),
      total,
      customer: {
        name: customer.name?.trim() || 'Guest customer',
        phone: customer.phone?.trim() || 'Not provided',
        address: customer.address?.trim() || 'Not provided',
        paymentMethod: customer.paymentMethod || 'Cash on Delivery',
        deliveryDate: customer.deliveryDate || 'To be confirmed',
        eyeTestRequested: Boolean(customer.eyeTestRequested),
        adminNote: customer.eyeTestRequested ? 'FREE EYE TEST REQUESTED with frame order.' : ''
      },
      timeline: [{ status: 'placed', at: new Date().toISOString(), note: 'Order received' }]
    };
    setOrders((current) => [order, ...current]);
    if (firebaseEnabled && db) setDoc(doc(db, 'orders', order.id), order);
    return order;
  };

  const createRepair = (repair) => {
    const now = new Date().toISOString();
    const record = {
      ...repair,
      id: `REP-${Date.now().toString().slice(-8)}`,
      type: 'repair',
      status: 'received',
      createdAt: now,
      updatedAt: now,
      timeline: [{ status: 'received', at: now, note: 'Repair request received' }]
    };
    setOrders((current) => [record, ...current]);
    if (firebaseEnabled && db) setDoc(doc(db, 'orders', record.id), record);
    return record;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order;
      const now = new Date().toISOString();
      const nextOrder = {
        ...order,
        status,
        updatedAt: now,
        timeline: [...(order.timeline || []), { status, at: now, note: `Status changed to ${status}` }]
      };
      if (firebaseEnabled && db) setDoc(doc(db, 'orders', id), nextOrder);
      return nextOrder;
    }));
  };

  const cancelOrder = (id) => updateOrderStatus(id, 'cancelled');

  return (
    <OrderContext.Provider value={{ orders, createOrder, createRepair, updateOrderStatus, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
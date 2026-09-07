import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, runTransaction, setDoc, where } from 'firebase/firestore';
import { auth, db, ensureUserProfile, firebaseEnabled, isAdminUser, updateUserProfile } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const OrderContext = createContext(null);
const ORDERS_STORAGE_KEY = 'verma_ji_store_orders_v1';

function readOrders() {
  if (firebaseEnabled) return [];
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(readOrders);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    if (firebaseEnabled) return;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (firebaseEnabled) return undefined;
    const syncOrders = (event) => {
      if (event.key === ORDERS_STORAGE_KEY) setOrders(readOrders());
    };
    window.addEventListener('storage', syncOrders);
    return () => window.removeEventListener('storage', syncOrders);
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !db) return undefined;
    let unsubscribeOrders;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeOrders?.();
      setOrders([]);
      setSyncError('');
      if (!user) return;
      const admin = await isAdminUser(user).catch(() => false);
      const ordersQuery = admin
        ? collection(db, 'orders')
        : query(collection(db, 'orders'), where('customer.uid', '==', user.uid));
      unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        setSyncError('');
        setOrders(snapshot.docs.map((order) => order.data()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }, (error) => {
        setSyncError('Orders could not be synced from Firebase.');
        console.warn('Firebase order sync unavailable.', error);
      });
    });
    return () => {
      unsubscribeOrders?.();
      unsubscribeAuth();
    };
  }, []);

  const createOrder = async ({ items, total, customer = {} }) => {
    const currentUser = auth?.currentUser;
    if (firebaseEnabled && (!db || !currentUser)) {
      throw new Error('Please sign in before placing an order.');
    }
    const createdAt = new Date().toISOString();
    const order = {
      id: `VJ-${Date.now().toString().slice(-8)}`,
      type: 'order',
      status: 'placed',
      createdAt,
      updatedAt: createdAt,
      items: items.map(({ id, name, image, quantity, totalPrice, lens }) => ({
        id, name, image, quantity, totalPrice, lens: lens?.title || null
      })),
      total,
      customer: {
        uid: currentUser?.uid || null,
        email: currentUser?.email || '',
        name: customer.name?.trim() || 'Guest customer',
        phone: customer.phone?.trim() || 'Not provided',
        address: customer.address?.trim() || 'Not provided',
        paymentMethod: customer.paymentMethod || 'Cash on Delivery',
        deliveryDate: customer.deliveryDate || 'To be confirmed',
        eyeTestRequested: Boolean(customer.eyeTestRequested),
        adminNote: customer.eyeTestRequested ? 'FREE EYE TEST REQUESTED with frame order.' : ''
      },
      timeline: [{ status: 'placed', at: createdAt, note: 'Order received' }]
    };
    if (firebaseEnabled && db && currentUser) {
      try {
        await ensureUserProfile(currentUser);
        await updateUserProfile(currentUser, {
          displayName: customer.name?.trim() || currentUser.displayName || '',
          phone: customer.phone?.trim() || '',
          address: customer.address?.trim() || ''
        });
        await runTransaction(db, async (transaction) => {
          const productRefs = items.map((item) => doc(db, 'products', String(item.id)));
          const productSnapshots = await Promise.all(productRefs.map((productRef) => transaction.get(productRef)));
          productSnapshots.forEach((snapshot, index) => {
            const available = Number(snapshot.data()?.stock ?? 10);
            if (!snapshot.exists() || available < items[index].quantity) {
              throw new Error(`${items[index].name} is no longer available in the requested quantity.`);
            }
          });
          productSnapshots.forEach((snapshot, index) => {
            transaction.update(productRefs[index], { stock: Number(snapshot.data().stock ?? 10) - items[index].quantity });
          });
          transaction.set(doc(db, 'orders', order.id), order);
        });
      } catch (error) {
        if (error.code === 'permission-denied') {
          throw new Error('Firebase permission denied. Refresh the app and sign in again before checkout.');
        }
        throw error;
      }
    }
    setOrders((current) => [order, ...current.filter((existing) => existing.id !== order.id)]);
    return order;
  };

  const createRepair = async (repair) => {
    const now = new Date().toISOString();
    const currentUser = auth?.currentUser;
    if (firebaseEnabled && (!db || !currentUser)) {
      throw new Error('Please sign in before creating a repair request.');
    }
    const record = {
      ...repair,
      id: `REP-${Date.now().toString().slice(-8)}`,
      type: 'repair',
      status: 'received',
      createdAt: now,
      updatedAt: now,
      customer: { ...repair.customer, uid: currentUser?.uid || null, email: currentUser?.email || '' },
      timeline: [{ status: 'received', at: now, note: 'Repair request received' }]
    };
    setOrders((current) => [record, ...current]);
    if (firebaseEnabled && db && currentUser) await setDoc(doc(db, 'orders', record.id), record);
    return record;
  };

  const updateOrderStatus = async (id, status) => {
    let writePromise = null;
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order;
      const now = new Date().toISOString();
      const nextOrder = {
        ...order,
        status,
        updatedAt: now,
        timeline: [...(order.timeline || []), { status, at: now, note: `Status changed to ${status}` }]
      };
      if (firebaseEnabled && db) writePromise = setDoc(doc(db, 'orders', id), nextOrder);
      return nextOrder;
    }));
    return writePromise;
  };

  const cancelOrder = (id) => updateOrderStatus(id, 'cancelled');

  return (
    <OrderContext.Provider value={{ orders, syncError, createOrder, createRepair, updateOrderStatus, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
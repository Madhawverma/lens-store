import React, { useEffect, useState } from 'react';
import { X, UserRound, Package, LogOut, Save, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { getUserProfile, signOutUser, updateUserProfile } from '../lib/firebase';
import './AccountDrawer.css';

export function AccountDrawer({ isOpen, onClose, user, onSignedOut }) {
  const { orders, cancelOrder, updateOrderStatus } = useOrders();
  const [profile, setProfile] = useState({ displayName: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !user) return;
    getUserProfile(user).then((saved) => setProfile({
      displayName: saved?.displayName || user.displayName || '',
      phone: saved?.phone || '',
      address: saved?.address || ''
    })).catch(() => setProfile({ displayName: user.displayName || '', phone: '', address: '' }));
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await updateUserProfile(user, profile);
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('Profile could not be updated. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    onSignedOut?.();
    onClose();
  };

  return (
    <div className="account-drawer-overlay" onClick={onClose}>
      <aside className="account-drawer" onClick={(event) => event.stopPropagation()}>
        <header className="account-drawer-header">
          <div><UserRound size={22} /><div><strong>{profile.displayName || 'My Account'}</strong><small>{user.email}</small></div></div>
          <button className="account-close" onClick={onClose} aria-label="Close account"><X size={21} /></button>
        </header>

        <section className="account-section">
          <h2>Profile details</h2>
          <form className="account-profile-form" onSubmit={saveProfile}>
            <label>Name<input value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} required /></label>
            <label>Phone<input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} inputMode="tel" placeholder="Your phone number" /></label>
            <label>Address<textarea value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} placeholder="Delivery address" rows="2" /></label>
            <button className="account-save-btn" disabled={isSaving}><Save size={16} /> {isSaving ? 'Saving...' : 'Save profile'}</button>
            {message && <p className="account-message">{message}</p>}
          </form>
        </section>

        <section className="account-section account-orders">
          <div className="account-section-title"><h2><Package size={19} /> My orders</h2><span>{orders.length}</span></div>
          {orders.length === 0 ? <p className="account-empty">Your orders will appear here after checkout.</p> : orders.map((order) => (
            <article className="account-order" key={order.id}>
              <div className="account-order-top"><strong>{order.id}</strong><span className={`account-status status-${order.status}`}>{order.status}</span></div>
              <p>{order.items?.length || 0} item(s) · ₹{order.total || order.amount || 0}</p>
              <small>{new Date(order.createdAt).toLocaleString()}</small>
              <div className="account-order-actions">
                <Link to={`/track/${order.id}`} onClick={onClose}><ExternalLink size={14} /> Track</Link>
                {order.type === 'order' && ['placed', 'confirmed'].includes(order.status) && <button onClick={() => cancelOrder(order.id)}>Cancel order</button>}
                {order.type === 'order' && order.status === 'delivered' && <button onClick={() => updateOrderStatus(order.id, 'return-requested')}>Request return</button>}
              </div>
            </article>
          ))}
        </section>

        <button className="account-signout" onClick={handleSignOut}><LogOut size={17} /> Sign out</button>
      </aside>
    </div>
  );
}
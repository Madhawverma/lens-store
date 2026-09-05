import React, { useState } from 'react';
import { CheckCircle, Wrench, X } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import './RepairModal.css';

export const RepairModal = ({ isOpen, onClose }) => {
  const { createRepair } = useOrders();
  const [form, setForm] = useState({ name: '', phone: '', issue: '', amount: '' });
  const [submittedRepair, setSubmittedRepair] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const repair = createRepair({
      customer: { name: form.name, phone: form.phone },
      issue: form.issue,
      amount: Number(form.amount || 0),
      total: Number(form.amount || 0)
    });
    setSubmittedRepair(repair);
    setForm({ name: '', phone: '', issue: '', amount: '' });
  };

  const handleClose = () => {
    setSubmittedRepair(null);
    onClose();
  };

  return (
    <div className="repair-modal-overlay" onClick={handleClose}>
      <div className="repair-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="repair-modal-header">
          <div>
            <span className="repair-kicker">OPTICAL CARE</span>
            <h2>Book a Frame Repair</h2>
            <p>Tell us what needs fixing and our team will contact you.</p>
          </div>
          <button className="repair-close-btn" onClick={handleClose} aria-label="Close repair form"><X size={20} /></button>
        </div>

        {submittedRepair ? (
          <div className="repair-success">
            <CheckCircle size={46} />
            <h3>Repair request received</h3>
            <p>Our repair team will contact you with the next steps.</p>
            <strong>Repair ID: {submittedRepair.id}</strong>
            <button className="btn-pink" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <form className="repair-form storefront-repair-form" onSubmit={handleSubmit}>
            <label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter your name" /></label>
            <label>Phone number<input required inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Enter your phone number" /></label>
            <label>What needs repair?<textarea required value={form.issue} onChange={(event) => setForm({ ...form, issue: event.target.value })} placeholder="Example: loose arm, broken hinge, scratched lens" /></label>
            <label>Estimated budget (optional)<input type="number" min="0" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="₹ Amount" /></label>
            <button className="btn-pink" type="submit"><Wrench size={17} /> Submit Repair Request</button>
          </form>
        )}
      </div>
    </div>
  );
};

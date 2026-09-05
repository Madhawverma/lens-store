import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, PackageCheck, Search } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import './OrderTracking.css';

const ORDER_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
const REPAIR_STEPS = ['received', 'diagnosing', 'repairing', 'ready', 'delivered'];

export default function OrderTracking() {
  const { orderId: routeOrderId } = useParams();
  const { orders } = useOrders();
  const [searchId, setSearchId] = useState(routeOrderId || '');
  const record = orders.find((order) => order.id.toLowerCase() === searchId.trim().toLowerCase());
  const steps = record?.type === 'repair' ? REPAIR_STEPS : ORDER_STEPS;
  const currentStep = record ? steps.indexOf(record.status) : -1;

  return (
    <main className="tracking-page">
      <Link to="/" className="tracking-back"><ArrowLeft size={17} /> Back to store</Link>
      <section className="tracking-shell">
        <div className="tracking-heading">
          <span className="tracking-kicker">SHREE GANESH OPTICAL SHOP</span>
          <h1>Track your {record?.type === 'repair' ? 'repair' : 'order'}</h1>
          <p>Enter the ID shared after checkout to see the latest update.</p>
        </div>
        <form className="tracking-search" onSubmit={(event) => event.preventDefault()}>
          <input value={searchId} onChange={(event) => setSearchId(event.target.value)} placeholder="Example: VJ-12345678" aria-label="Order ID" />
          <button type="submit"><Search size={17} /> Track</button>
        </form>
        {!record ? (
          <div className="tracking-empty"><PackageCheck size={34} /><strong>{searchId ? 'ID not found' : 'Ready when you are'}</strong><span>Check the ID and try again.</span></div>
        ) : (
          <div className="tracking-result">
            <div className="tracking-record-head"><div><span>Tracking ID</span><strong>{record.id}</strong></div><span className={`tracking-status status-${record.status}`}>{record.status}</span></div>
            <div className="tracking-steps">
              {steps.map((step, index) => <div className={`tracking-step ${index <= currentStep ? 'complete' : ''}`} key={step}><span>{index <= currentStep ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}</span><strong>{step}</strong></div>)}
            </div>
            <div className="tracking-meta"><span>Customer: <strong>{record.customer?.name}</strong></span><span>Last updated: <strong>{new Date(record.updatedAt).toLocaleString()}</strong></span></div>
            <div className="tracking-history"><h2>Updates</h2>{[...(record.timeline || [])].reverse().map((event, index) => <div className="history-row" key={`${event.at}-${index}`}><span className="history-dot" /><div><strong>{event.note}</strong><small>{new Date(event.at).toLocaleString()}</small></div></div>)}</div>
          </div>
        )}
      </section>
    </main>
  );
}
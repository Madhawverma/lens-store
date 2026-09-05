import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { Plus, Edit2, Trash2, Home, Package, Users, Settings, ClipboardList, Wrench, TrendingUp, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOutUser } from '../lib/firebase';
import { useOrders } from '../context/OrderContext';
import './AdminPanel.css';

export default function AdminPanel() {
  const { products, updateProduct, deleteProduct } = useProducts();
  const { orders, createRepair, updateOrderStatus } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeSection, setActiveSection] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleProductCount, setVisibleProductCount] = useState(10);
  const [language, setLanguage] = useState(() => localStorage.getItem('admin_language') || 'en');
  const [repairForm, setRepairForm] = useState({ name: '', phone: '', issue: '', amount: '' });
  const navigate = useNavigate();
  const isHindi = language === 'hi';
  const text = isHindi ? {
    storefront: 'स्टोरफ्रंट',
    products: 'प्रोडक्ट्स',
    customers: 'ग्राहक',
    settings: 'सेटिंग्स',
    productData: 'प्रोडक्ट मास्टर डेटा',
    customerTitle: 'ग्राहक',
    catalogDescription: 'अपने कैटलॉग को मैनेज करें।',
    customerDescription: 'अपने स्टोर से जुड़े लोगों को मैनेज करें।',
    logout: 'लॉगआउट',
    addProduct: 'प्रोडक्ट जोड़ें',
    allProducts: 'सभी प्रोडक्ट्स',
    eyeglasses: 'आईवियर',
    sunglasses: 'सनग्लासेस',
    clipOn: 'क्लिप-ऑन',
    computerGlasses: 'कंप्यूटर ग्लासेस',
    turbanFriendly: 'पगड़ी फ्रेंडली',
    dayNight: 'डे-नाइट',
    image: 'इमेज',
    name: 'नाम',
    category: 'कैटेगरी',
    price: 'कीमत',
    discount: 'डिस्काउंट',
    actions: 'एक्शन',
    storeOwner: 'ग्राहक / स्टोर ओनर',
    edit: 'कीमत या डिस्काउंट एडिट करें',
    delete: 'डिलीट',
    confirmDelete: 'क्या आप इसे डिलीट करना चाहते हैं?',
    language: 'भाषा'
  } : {
    storefront: 'Storefront', products: 'Products', customers: 'Customers', settings: 'Settings',
    productData: 'Products Master Data', customerTitle: 'Customers', catalogDescription: 'Manage your catalog.',
    customerDescription: 'Manage people connected with your store.', logout: 'Logout', addProduct: 'Add Product',
    allProducts: 'All Products', eyeglasses: 'Eyeglasses', sunglasses: 'Sunglasses', clipOn: 'Clip-on',
    computerGlasses: 'Computer Glasses', turbanFriendly: 'Turban Friendly', dayNight: 'Day-Night', image: 'Image',
    name: 'Name', category: 'Category', price: 'Price', discount: 'Discount', actions: 'Actions',
    storeOwner: 'Customer / Store Owner', edit: 'Edit price or discount', delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this?', language: 'Language'
  };
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem('admin_language', nextLanguage);
  };
  const handleLogout = async () => {
    await signOutUser();
    localStorage.removeItem('verma_admin_session');
    navigate('/');
  };
  const categoryGroups = [
    { id: 'all', label: text.allProducts },
    { id: 'eyeglasses', label: text.eyeglasses },
    { id: 'sunglasses', label: text.sunglasses },
    { id: 'clip-on', label: text.clipOn },
    { id: 'computer-glasses', label: text.computerGlasses },
    { id: 'turban-friendly', label: text.turbanFriendly },
    { id: 'day-night', label: text.dayNight }
  ];
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory);
  const visibleProducts = filteredProducts.slice(0, visibleProductCount);
  const orderRecords = orders.filter((record) => record.type === 'order');
  const repairRecords = orders.filter((record) => record.type === 'repair');
  const salesTotal = orderRecords.filter((order) => order.status !== 'cancelled').reduce((total, order) => total + Number(order.total || 0), 0);
  const sectionMeta = {
    products: ['Products Master Data', 'Manage your catalog.'],
    orders: ['Customer Orders', 'Review orders and update tracking status.'],
    repairs: ['Repair Desk', 'Create repair tickets and keep customers updated.'],
    sales: ['Sales Overview', 'Track captured order value and order activity.'],
    customers: ['Customers', 'Manage people connected with your store.']
  };
  const activeMeta = sectionMeta[activeSection];

  const renderRecordTable = (records, isRepair = false) => (
    <div className="table-container admin-records-table">
      <table className="products-table"><thead><tr><th>ID</th><th>Customer</th><th>{isRepair ? 'Issue' : 'Items'}</th><th>Total</th><th>Status</th><th>Track</th></tr></thead>
        <tbody>{records.length === 0 ? <tr><td colSpan="6" className="empty-records">No {isRepair ? 'repair tickets' : 'orders'} yet. New records will appear here automatically.</td></tr> : records.map((record) => <tr key={record.id}>
          <td className="record-id">{record.id}</td><td><strong>{record.customer?.name}</strong><small className="record-phone">{record.customer?.phone}</small><small className="record-phone">{record.customer?.paymentMethod} · {record.customer?.deliveryDate}</small>{record.customer?.eyeTestRequested && <small className="record-eye-test">FREE EYE TEST REQUESTED</small>}</td>
          <td>{isRepair ? record.issue : `${record.items?.length || 0} item(s)`}</td><td className="table-price">₹{record.total || record.amount || 0}</td>
          <td><select className={`status-select status-${record.status}`} value={record.status} onChange={(event) => updateOrderStatus(record.id, event.target.value)}>{(isRepair ? REPAIR_STATUSES : ORDER_STATUSES).map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
          <td><Link className="track-admin-link" to={`/track/${record.id}`} target="_blank"><ExternalLink size={15} /> View</Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  );

  const REPAIR_STATUSES = ['received', 'diagnosing', 'repairing', 'ready', 'delivered', 'cancelled'];
  const ORDER_STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Shree Ganesh Optical Shop</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/" className="nav-item">
            <Home size={20} /> {text.storefront}
          </Link>
          <button className={`nav-item ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setActiveSection('products')}>
            <Package size={20} /> {text.products}
          </button>
          <button className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => setActiveSection('orders')}><ClipboardList size={20} /> Orders <span className="nav-count">{orderRecords.length}</span></button>
          <button className={`nav-item ${activeSection === 'repairs' ? 'active' : ''}`} onClick={() => setActiveSection('repairs')}><Wrench size={20} /> Repairs <span className="nav-count">{repairRecords.length}</span></button>
          <button className={`nav-item ${activeSection === 'sales' ? 'active' : ''}`} onClick={() => setActiveSection('sales')}><TrendingUp size={20} /> Sales</button>
          <button className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`} onClick={() => setActiveSection('customers')}>
            <Users size={20} /> {text.customers}
          </button>
          <a href="#" className="nav-item">
            <Settings size={20} /> {text.settings}
          </a>
          <div className="admin-language-control">
            <span>{text.language}</span>
            <div className="admin-language-options">
              <button className={language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>English</button>
              <button className={language === 'hi' ? 'active' : ''} onClick={() => changeLanguage('hi')}>हिंदी</button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{activeMeta[0]}</h1><p>{activeMeta[1]}</p>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>{text.logout}</button>
          {activeSection === 'products' && <button className="btn-add-product" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> {text.addProduct}
          </button>}
          {activeSection === 'repairs' && <button className="btn-add-product" onClick={() => document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={18} /> New repair</button>}
        </header>

        {activeSection === 'orders' ? renderRecordTable(orderRecords) : activeSection === 'repairs' ? <>
          <form id="repair-form" className="repair-form" onSubmit={(event) => { event.preventDefault(); if (!repairForm.name || !repairForm.issue) return; createRepair({ customer: { name: repairForm.name, phone: repairForm.phone || 'Not provided' }, issue: repairForm.issue, amount: Number(repairForm.amount || 0), total: Number(repairForm.amount || 0) }); setRepairForm({ name: '', phone: '', issue: '', amount: '' }); }}>
            <input placeholder="Customer name" value={repairForm.name} onChange={(event) => setRepairForm({ ...repairForm, name: event.target.value })} required />
            <input placeholder="Phone" value={repairForm.phone} onChange={(event) => setRepairForm({ ...repairForm, phone: event.target.value })} />
            <input placeholder="Repair issue" value={repairForm.issue} onChange={(event) => setRepairForm({ ...repairForm, issue: event.target.value })} required />
            <input placeholder="Estimated amount" type="number" value={repairForm.amount} onChange={(event) => setRepairForm({ ...repairForm, amount: event.target.value })} />
            <button className="btn-add-product" type="submit"><Plus size={17} /> Create ticket</button>
          </form>{renderRecordTable(repairRecords, true)}
        </> : activeSection === 'sales' ? <div className="sales-dashboard">
          <div className="sales-stat"><span>Total order value</span><strong>₹{salesTotal}</strong><small>{orderRecords.length} customer orders</small></div><div className="sales-stat"><span>Delivered</span><strong>{orderRecords.filter((order) => order.status === 'delivered').length}</strong><small>Completed orders</small></div><div className="sales-stat"><span>In progress</span><strong>{orderRecords.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length}</strong><small>Keep customers updated</small></div>
          {renderRecordTable(orderRecords)}
        </div> : activeSection === 'customers' ? <div className="customer-card">
          <Users size={24} />
          <div>
            <h2>Verma Ji</h2>
            <p>{text.storeOwner}</p>
            <span>+91 87701 52422</span>
          </div>
        </div> : <>
          <div className="admin-category-groups">
            {categoryGroups.map((group) => (
              <button key={group.id} className={selectedCategory === group.id ? 'admin-category-group active' : 'admin-category-group'} onClick={() => { setSelectedCategory(group.id); setVisibleProductCount(10); }}>
                <span>{group.label}</span>
                <strong>{group.id === 'all' ? products.length : products.filter((product) => product.category === group.id).length}</strong>
              </button>
            ))}
          </div>
          <div className="table-container">
          <table className="products-table">
              <thead>
              <tr>
                <th>{text.image}</th>
                <th>{text.name}</th>
                <th>{text.category}</th>
                <th>{text.price}</th>
                <th>{text.discount}</th>
                <th>Stock</th>
                <th>{text.actions}</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image || product.images?.[0]} alt={product.name} className="table-img" />
                  </td>
                  <td className="table-name">{product.name}</td>
                  <td>
                    <span className={`cat-badge ${product.category}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="table-price">₹{product.price}</td>
                  <td className="table-discount">
                    {product.discount ? `${product.discount}% OFF` : '-'}
                  </td>
                  <td className={product.stock > 0 ? 'table-stock-in' : 'table-stock-out'}>
                    {product.stock > 0 ? product.stock : 'Out of Stock'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit" title={text.edit} onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}>
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title={text.delete}
                        onClick={() => {
                          if (window.confirm(text.confirmDelete)) {
                            deleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleProductCount < filteredProducts.length && (
          <button className="admin-view-more" onClick={() => setVisibleProductCount((count) => Math.min(count + 10, filteredProducts.length))}>
            View More ({Math.min(10, filteredProducts.length - visibleProductCount)} more)
          </button>
        )}
        </>}
      </main>

      {isModalOpen && (
        <ProductFormModal language={language} product={editingProduct} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} onUpdate={updateProduct} />
      )}
    </div>
  );
}

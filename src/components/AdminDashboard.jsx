import React, { useState } from 'react';
import {
  Package, Plus, Search, Upload, Check, AlertTriangle, Edit3, Trash2, Tag,
  ArrowUpRight, TrendingUp, DollarSign, Box, ShieldAlert, CheckCircle2,
  Cloud, RefreshCw, Image as ImageIcon, Loader2, Sparkles, ExternalLink,
  Mail, ShoppingBag, Eye, Copy
} from 'lucide-react';
import { Swatch } from './BrandDecorations';
import { uploadToCloudinaryCDN } from '../utils/firebase';
import { money, sizesFor, GOOGLE_APPS_SCRIPT_EMAIL_CODE, EMAIL_AUTOMATION_CONFIG } from '../data/initialData';

export default function AdminDashboard({
  products,
  setProducts,
  categories,
  setCategories,
  brands,
  setBrands,
  orders,
  onLogout,
  onOpenAddBrandModal,
  onOpenAddProductModal,
  onSeedFirebase,
  firebaseStatus,
  firebaseConfig,
  onSaveFirebaseConfig,
  editingProduct,
  setEditingProduct,
  isProductModalOpen,
  setIsProductModalOpen,
  onSaveProduct,
  onDeleteProduct,
  onQuickToggleStock,
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'categories' | 'brands' | 'firebase' | 'email'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all'); // 'all' | 'instock' | 'outofstock'
  
  // Category / Brand creation state
  const [newCatName, setNewCatName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  // Firebase config input state
  const [configText, setConfigText] = useState(() => JSON.stringify(firebaseConfig, null, 2));

  // Email webhook state
  const [emailWebhook, setEmailWebhook] = useState(() => localStorage.getItem(EMAIL_AUTOMATION_CONFIG.scriptWebhookKey) || '');
  const [emailStatus, setEmailStatus] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Garment Form state for Add/Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: categories[0]?.name || 'Formal Shirts',
    brand: brands[0]?.name || 'Zodiac',
    price: 1999,
    mrp: 2499,
    tag: 'New',
    desc: '',
    gsm: 200,
    weave: 'Fine Tailored Cotton',
    inStock: true,
    stock: { S: 5, M: 8, L: 6, XL: 4, XXL: 2 },
    images: [],
    image: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sync formData when editingProduct opens
  React.useEffect(() => {
    if (editingProduct) {
      const imgs = Array.isArray(editingProduct.images) && editingProduct.images.length > 0
        ? [...editingProduct.images]
        : (editingProduct.image ? [editingProduct.image] : []);
      
      const availableSizes = sizesFor(editingProduct.category || 'Formal Shirts');
      const curStock = typeof editingProduct.stock === 'object' && editingProduct.stock !== null ? { ...editingProduct.stock } : {};
      availableSizes.forEach(s => {
        if (curStock[s] === undefined) curStock[s] = 5;
      });

      setFormData({
        id: editingProduct.id || '',
        name: editingProduct.name || '',
        category: editingProduct.category || categories[0]?.name || 'Formal Shirts',
        brand: editingProduct.brand || brands[0]?.name || 'Zodiac',
        price: editingProduct.price || 1999,
        mrp: editingProduct.mrp || 2499,
        tag: editingProduct.tag || '',
        desc: editingProduct.desc || '',
        gsm: editingProduct.gsm || 200,
        weave: editingProduct.weave || 'Fine Tailored Cotton',
        inStock: editingProduct.inStock !== false,
        stock: curStock,
        images: imgs,
        image: imgs[0] || editingProduct.image || null,
      });
    } else {
      const defaultCat = categories[0]?.name || 'Formal Shirts';
      const availableSizes = sizesFor(defaultCat);
      const defStock = {};
      availableSizes.forEach(s => { defStock[s] = 5; });

      setFormData({
        id: `YD-${Date.now().toString().slice(-4)}`,
        name: '',
        category: defaultCat,
        brand: brands[0]?.name || 'Zodiac',
        price: 1999,
        mrp: 2499,
        tag: 'New',
        desc: '',
        gsm: 200,
        weave: 'Fine Tailored Cotton',
        inStock: true,
        stock: defStock,
        images: [],
        image: null,
      });
    }
  }, [editingProduct, isProductModalOpen, categories, brands]);

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrders = orders.length;
  const activeBrandsCount = brands.length;
  const outOfStockCount = products.filter(p => !p.inStock || (typeof p.stock === 'object' && Object.values(p.stock).reduce((a, b) => a + Number(b), 0) === 0)).length;

  // Filtered inventory
  const filteredProducts = products.filter(p => {
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) return false;
    const isOutOfStock = !p.inStock || (typeof p.stock === 'object' && Object.values(p.stock).reduce((a, b) => a + Number(b), 0) === 0);
    if (selectedStockFilter === 'instock' && isOutOfStock) return false;
    if (selectedStockFilter === 'outofstock' && !isOutOfStock) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (p.name && p.name.toLowerCase().includes(q)) ||
             (p.id && p.id.toLowerCase().includes(q)) ||
             (p.brand && p.brand.toLowerCase().includes(q)) ||
             (p.category && p.category.toLowerCase().includes(q));
    }
    return true;
  });

  // Photo upload handling (Cloudinary unsigned CDN)
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadToCloudinaryCDN(file, (p) => {
          setUploadProgress(Math.round(((i + p / 100) / files.length) * 100));
        });
        if (res?.url) uploadedUrls.push(res.url);
      }
      if (uploadedUrls.length > 0) {
        setFormData(prev => {
          const merged = [...(prev.images || []), ...uploadedUrls];
          return {
            ...prev,
            images: merged,
            image: merged[0] || prev.image,
          };
        });
      }
    } catch (err) {
      alert("Photo upload error: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (idx) => {
    setFormData(prev => {
      const updated = prev.images.filter((_, i) => i !== idx);
      return {
        ...prev,
        images: updated,
        image: updated[0] || null,
      };
    });
  };

  const handleMakeCoverPhoto = (idx) => {
    setFormData(prev => {
      const imgs = [...prev.images];
      const [picked] = imgs.splice(idx, 1);
      imgs.unshift(picked);
      return {
        ...prev,
        images: imgs,
        image: imgs[0] || null,
      };
    });
  };

  const handleSaveWebhook = () => {
    localStorage.setItem(EMAIL_AUTOMATION_CONFIG.scriptWebhookKey, emailWebhook.trim());
    setEmailStatus('Webhook URL saved to browser storage!');
    setTimeout(() => setEmailStatus(''), 3000);
  };

  const handleSendTestEmail = async () => {
    if (!emailWebhook.trim()) {
      alert("Please paste your Google Apps Script Webhook URL first.");
      return;
    }
    setIsSendingTestEmail(true);
    setEmailStatus('Sending test order confirmation email...');
    try {
      const payload = {
        orderId: "TEST-9999",
        customerName: "Test Patron",
        customerEmail: "yashaldressespune@gmail.com",
        customerPhone: "9673533839",
        deliveryAddress: "Shop No. 4 & 5, Heritage Plaza, FC Road, Pune",
        grandTotal: "₹2,999",
        paymentMethod: "Razorpay / UPI (Test Verification)",
        items: [
          { name: "Velmore Royal Jacquard Kurta Pyjama Set", quantity: 1, price: 2999, size: "L", brand: "Velmore" }
        ]
      };
      await fetch(emailWebhook.trim(), {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEmailStatus('✓ Test email dispatched to dressesyashal@gmail.com & yashaldressespune@gmail.com');
      setTimeout(() => setEmailStatus(''), 5000);
    } catch (err) {
      setEmailStatus('Failed to send test email: ' + err.message);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_EMAIL_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)', color: 'var(--ink)' }}>
      {/* Top Banner */}
      <div style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '16px 24px', borderBottom: '2px solid var(--mustard)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--mustard)', fontFamily: 'IBM Plex Mono' }}>
                AUTHENTICATED MERCHANT WORKROOM PORTAL
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(212,175,55,0.15)', color: 'var(--mustard)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Cloud Live Sync
              </span>
            </div>
            <h1 className="font-display" style={{ margin: '4px 0 0 0', fontSize: '24px', color: 'var(--ivory)' }}>
              Orders History & Inventory Management
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('firebase')}
              className="yd-btn"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--ivory)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Cloud size={14} color="var(--mustard)" /> ☁️ Firebase Cloud Setup
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className="yd-btn"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--ivory)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={14} color="var(--mustard)" /> ✉️ Email Automation
            </button>
            <button
              onClick={() => {
                const bName = prompt("Enter new Brand name (e.g., Raymond, Blackberrys):");
                if (bName && bName.trim()) {
                  if (brands.some(b => b.name.toLowerCase() === bName.trim().toLowerCase())) {
                    alert("Brand already exists!");
                  } else {
                    setBrands([...brands, { name: bName.trim() }]);
                  }
                }
              }}
              className="yd-btn"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--ivory)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: '4px' }}
            >
              + Add Brand
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="yd-btn yd-btn-primary"
              style={{ background: 'var(--mustard)', color: 'var(--ink)', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold' }}
            >
              + Add New Garment
            </button>
            <button
              onClick={onLogout}
              className="yd-btn"
              style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '8px 12px', borderRadius: '4px' }}
            >
              Lock / Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '18px 20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>TOTAL REVENUE</span>
            <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--mustard-deep)', marginTop: '4px' }}>{money(totalRevenue)}</div>
          </div>
          <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '18px 20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>TOTAL ORDERS</span>
            <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--ink)', marginTop: '4px' }}>{totalOrders}</div>
          </div>
          <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '18px 20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>ACTIVE BRANDS</span>
            <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--ink)', marginTop: '4px' }}>{activeBrandsCount}</div>
          </div>
          <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '18px 20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '1px' }}>OUT OF STOCK</span>
            <div style={{ fontSize: '26px', fontWeight: '700', color: outOfStockCount > 0 ? '#ef4444' : '#10b981', marginTop: '4px' }}>{outOfStockCount}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--line)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { key: 'inventory', label: `👔 GARMENT INVENTORY (${products.length})` },
            { key: 'orders', label: `📦 ORDER HISTORY (${orders.length})` },
            { key: 'categories', label: `🏷️ SEGMENT TYPES (${categories.length})` },
            { key: 'brands', label: `🏷️ BRANDS (${brands.length})` },
            { key: 'firebase', label: '☁️ FIREBASE CLOUD SETUP' },
            { key: 'email', label: '✉️ EMAIL AUTOMATION' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                background: activeTab === t.key ? 'var(--ink)' : 'transparent',
                color: activeTab === t.key ? 'var(--mustard)' : 'var(--ink-soft)',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '6px 6px 0 0',
                fontFamily: 'IBM Plex Mono',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INVENTORY */}
        {activeTab === 'inventory' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                <input
                  type="text"
                  placeholder="Search garments by name, SKU, brand..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--ivory)', color: 'var(--ink)', fontSize: '13px' }}
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--ivory)', color: 'var(--ink)', fontSize: '13px' }}
              >
                <option value="all">All Segments ({categories.length})</option>
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>

              <select
                value={selectedStockFilter}
                onChange={e => setSelectedStockFilter(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--ivory)', color: 'var(--ink)', fontSize: '13px' }}
              >
                <option value="all">All Stock Statuses</option>
                <option value="instock">In Stock Only</option>
                <option value="outofstock">Out of Stock Only</option>
              </select>
            </div>

            {/* Inventory Table */}
            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(26,18,36,0.04)', borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 16px' }}>Garment & Brand</th>
                      <th style={{ padding: '14px 16px' }}>Segment</th>
                      <th style={{ padding: '14px 16px' }}>Price</th>
                      <th style={{ padding: '14px 16px' }}>Stock per Size</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const isOut = !p.inStock || (typeof p.stock === 'object' && Object.values(p.stock).reduce((a, b) => a + Number(b), 0) === 0);
                      const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.15s ease' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '44px', height: '44px', borderRadius: '4px', overflow: 'hidden', background: 'var(--parchment)', flexShrink: 0, position: 'relative' }}>
                                {imgs[0] ? (
                                  <img src={imgs[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${p.c1 || '#1B2A4A'}, ${p.c2 || '#0D1830'})` }}>
                                    <Swatch p={p} size={28} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: 'var(--ink)' }}>{p.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <span>{p.brand}</span> • <span>SKU: {p.id}</span>
                                  {imgs.length > 0 && <span style={{ color: 'var(--mustard-deep)' }}>📷 {imgs.length} photo(s)</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{p.category}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--mustard-deep)' }}>{money(p.price)}</span>
                            {p.mrp && p.mrp > p.price && (
                              <span style={{ fontSize: '11px', color: 'var(--ink-soft)', textDecoration: 'line-through', marginLeft: '6px' }}>{money(p.mrp)}</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {typeof p.stock === 'object' && p.stock !== null ? (
                                Object.entries(p.stock).map(([sz, qty]) => (
                                  <span
                                    key={sz}
                                    style={{
                                      fontSize: '10px',
                                      fontFamily: 'IBM Plex Mono',
                                      padding: '2px 6px',
                                      borderRadius: '3px',
                                      background: Number(qty) > 0 ? 'rgba(26,18,36,0.06)' : 'rgba(239,68,68,0.1)',
                                      color: Number(qty) > 0 ? 'var(--ink)' : '#ef4444',
                                      border: '1px solid var(--line)'
                                    }}
                                  >
                                    {sz}:{qty}
                                  </span>
                                ))
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Stock: {p.stock || 0}</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button
                              onClick={() => onQuickToggleStock(p.id)}
                              style={{
                                border: 'none',
                                background: isOut ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                                color: isOut ? '#dc2626' : '#16a34a',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              {isOut ? '● OUT OF STOCK' : '● IN STOCK'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                style={{ background: 'transparent', border: '1px solid var(--line)', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', color: 'var(--ink)' }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete ${p.name} from catalog?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', color: '#dc2626' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Patron Orders & Invoices ({orders.length})</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(26,18,36,0.04)', borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 16px' }}>Order ID & Date</th>
                    <th style={{ padding: '14px 16px' }}>Customer & Address</th>
                    <th style={{ padding: '14px 16px' }}>Bag Items</th>
                    <th style={{ padding: '14px 16px' }}>Payment Info</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--ink)' }}>{o.id}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '2px' }}>{new Date(o.date).toLocaleString('en-IN')}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--ink)' }}>{o.customer?.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>📞 {o.customer?.phone}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', maxWidth: '280px', marginTop: '2px' }}>{o.customer?.address}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {o.items?.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '12px', marginBottom: '4px' }}>
                            • <strong>{it.name}</strong> <span style={{ color: 'var(--ink-soft)' }}>({it.size} × {it.quantity})</span>
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontWeight: '600' }}>
                          ✓ {o.paymentMethod || 'Paid'}
                        </span>
                        {o.transactionId && <div style={{ fontSize: '10px', color: 'var(--ink-soft)', marginTop: '4px', fontFamily: 'IBM Plex Mono' }}>Ref: {o.transactionId}</div>}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--mustard-deep)', fontSize: '15px' }}>
                        {money(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES / SEGMENTS */}
        {activeTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Active Segments ({categories.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((c, idx) => {
                  const count = products.filter(p => p.category === c.name).length;
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--parchment)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                      <div>
                        <span style={{ fontWeight: '600' }}>{c.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--ink-soft)', marginLeft: '8px' }}>({count} garments)</span>
                      </div>
                      <button
                        onClick={() => {
                          if (count > 0) {
                            alert(`Cannot remove "${c.name}" because it still has ${count} garments.`);
                            return;
                          }
                          setCategories(categories.filter(cat => cat.name !== c.name));
                        }}
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Add Custom Segment</h3>
              <input
                type="text"
                placeholder="Segment name (e.g. Linen Kurtas, Nehru Jackets)..."
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)', marginBottom: '14px' }}
              />
              <button
                onClick={() => {
                  if (newCatName.trim()) {
                    if (categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
                      alert("Segment already exists!");
                    } else {
                      setCategories([...categories, { name: newCatName.trim(), icon: 'Shirt' }]);
                      setNewCatName('');
                    }
                  }
                }}
                className="yd-btn yd-btn-primary"
                style={{ width: '100%', padding: '10px', background: 'var(--ink)', color: 'var(--ivory)' }}
              >
                + Add Segment
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BRANDS */}
        {activeTab === 'brands' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Active Brands ({brands.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
                {brands.map((b, idx) => {
                  const count = products.filter(p => p.brand === b.name).length;
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--parchment)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                      <div>
                        <span style={{ fontWeight: '600' }}>{b.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--ink-soft)', marginLeft: '8px' }}>({count} garments)</span>
                      </div>
                      <button
                        onClick={() => {
                          setBrands(brands.filter(brand => brand.name !== b.name));
                        }}
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Add Custom Brand / Label</h3>
              <input
                type="text"
                placeholder="Brand name (e.g. Raymond, Manyavar)..."
                value={newBrandName}
                onChange={e => setNewBrandName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)', marginBottom: '14px' }}
              />
              <button
                onClick={() => {
                  if (newBrandName.trim()) {
                    if (brands.some(b => b.name.toLowerCase() === newBrandName.trim().toLowerCase())) {
                      alert("Brand already exists!");
                    } else {
                      setBrands([...brands, { name: newBrandName.trim() }]);
                      setNewBrandName('');
                    }
                  }
                }}
                className="yd-btn yd-btn-primary"
                style={{ width: '100%', padding: '10px', background: 'var(--ink)', color: 'var(--ivory)' }}
              >
                + Add Brand
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: FIREBASE CLOUD SETUP */}
        {activeTab === 'firebase' && (
          <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '24px', borderRadius: '8px', maxWidth: '800px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>☁️ Firebase Firestore Cloud Configuration</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.6', marginBottom: '20px' }}>
              Yashal Dresses uses Firebase Firestore to sync garments, brands, categories, and customer orders across all devices in real time.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                Firebase Config JSON
              </label>
              <textarea
                rows={10}
                value={configText}
                onChange={e => setConfigText(e.target.value)}
                style={{ width: '100%', padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(configText);
                    onSaveFirebaseConfig(parsed);
                    alert("Firebase configuration saved and activated!");
                  } catch (err) {
                    alert("Invalid JSON format: " + err.message);
                  }
                }}
                className="yd-btn yd-btn-primary"
                style={{ padding: '10px 20px', background: 'var(--ink)', color: 'var(--ivory)' }}
              >
                Save Firebase Config
              </button>
              <button
                onClick={onSeedFirebase}
                className="yd-btn"
                style={{ padding: '10px 20px', background: 'var(--mustard)', color: 'var(--ink)', border: 'none', fontWeight: 'bold' }}
              >
                ⚡ Seed Initial 52 Garments to Firestore
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: EMAIL AUTOMATION */}
        {activeTab === 'email' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '24px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>✉️ Automated Email Notifications</h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.6', marginBottom: '18px' }}>
                Send instant bespoke invoices and notifications to your customers from <strong>{EMAIL_AUTOMATION_CONFIG.senderEmail}</strong> and receive instant shop alerts at <strong>{EMAIL_AUTOMATION_CONFIG.storeEmail}</strong>.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  Google Apps Script Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={emailWebhook}
                  onChange={e => setEmailWebhook(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)', fontSize: '13px' }}
                />
              </div>

              {emailStatus && (
                <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)', color: 'var(--ink)', fontSize: '12px', marginBottom: '16px' }}>
                  {emailStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSaveWebhook}
                  className="yd-btn yd-btn-primary"
                  style={{ padding: '10px 18px', background: 'var(--ink)', color: 'var(--ivory)' }}
                >
                  Save Webhook URL
                </button>
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  className="yd-btn"
                  style={{ padding: '10px 18px', background: 'var(--mustard)', color: 'var(--ink)', border: 'none', fontWeight: 'bold' }}
                >
                  {isSendingTestEmail ? 'Sending...' : 'Test Send Order Confirmed Email'}
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--ivory)', border: '1px solid var(--line)', padding: '24px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px' }}>Google Apps Script (Code.gs)</h4>
                <button
                  onClick={handleCopyScript}
                  className="yd-btn"
                  style={{ padding: '6px 12px', background: copiedScript ? '#10b981' : 'var(--ink)', color: 'var(--ivory)', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Copy size={13} /> {copiedScript ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={GOOGLE_APPS_SCRIPT_EMAIL_CODE}
                style={{ width: '100%', padding: '12px', fontFamily: 'IBM Plex Mono', fontSize: '11px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)', lineHeight: '1.4' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT GARMENT MODAL */}
      {isProductModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'var(--ivory)', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '10px', border: '2px solid var(--mustard)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px' }}>
              <h2 className="font-display" style={{ margin: 0, fontSize: '20px', color: 'var(--ink)' }}>
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalog'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Garment Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Zodiac Milano Classic Full Sleeve Shirt"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Brand / Label</label>
                <select
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)' }}
                >
                  {brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Segment / Category</label>
                <select
                  value={formData.category}
                  onChange={e => {
                    const newCat = e.target.value;
                    const newSizes = sizesFor(newCat);
                    const newStock = {};
                    newSizes.forEach(s => { newStock[s] = formData.stock[s] || 5; });
                    setFormData({ ...formData, category: newCat, stock: newStock });
                  }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)' }}
                >
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={e => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--parchment)' }}
                  />
                </div>
              </div>
            </div>

            {/* Size Stock Breakdown */}
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--parchment)', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                STOCK PER SIZE QUANTITIES
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px' }}>
                {Object.entries(formData.stock).map(([sz, qty]) => (
                  <div key={sz}>
                    <span style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Size {sz}</span>
                    <input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={e => setFormData({
                        ...formData,
                        stock: { ...formData.stock, [sz]: Math.max(0, parseInt(e.target.value) || 0) }
                      })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--ivory)', textAlign: 'center', fontWeight: 'bold' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Upload Area (Cloudinary CDN) */}
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--parchment)', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>
                  GARMENT PHOTOS (CLOUDINARY CDN)
                </label>
                <label style={{ cursor: 'pointer', background: 'var(--ink)', color: 'var(--ivory)', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} color="var(--mustard)" /> Upload Photos
                  <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {isUploading && (
                <div style={{ padding: '10px', background: 'rgba(212,175,55,0.15)', borderRadius: '6px', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                  Uploading photos to Cloudinary CDN ({uploadProgress}%)...
                </div>
              )}

              {formData.images && formData.images.length > 0 ? (
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '90px', height: '110px', borderRadius: '6px', overflow: 'hidden', border: idx === 0 ? '2px solid var(--mustard)' : '1px solid var(--line)', flexShrink: 0 }}>
                      <img src={imgUrl} alt={`Garment ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {idx === 0 && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--mustard)', color: 'var(--ink)', fontSize: '9px', fontWeight: 'bold', textAlign: 'center', padding: '1px 0' }}>
                          COVER
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                        {idx !== 0 && (
                          <button onClick={() => handleMakeCoverPhoto(idx)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
                            ★
                          </button>
                        )}
                        <button onClick={() => handleRemovePhoto(idx)} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '10px', cursor: 'pointer', marginLeft: 'auto' }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--ink-soft)', fontSize: '12px', border: '1px dashed var(--line)', borderRadius: '6px' }}>
                  No photos attached yet. Upload real garment pictures to host them on Cloudinary CDN.
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="yd-btn"
                style={{ padding: '10px 18px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!formData.name.trim()) {
                    alert("Please enter a garment title.");
                    return;
                  }
                  const totalStock = Object.values(formData.stock).reduce((a, b) => a + Number(b), 0);
                  const updatedProd = {
                    ...formData,
                    inStock: totalStock > 0,
                    image: formData.images[0] || null,
                  };
                  onSaveProduct(updatedProd);
                  setIsProductModalOpen(false);
                }}
                className="yd-btn yd-btn-primary"
                style={{ padding: '10px 24px', background: 'var(--mustard)', color: 'var(--ink)', border: 'none', fontWeight: 'bold' }}
              >
                Save Garment Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

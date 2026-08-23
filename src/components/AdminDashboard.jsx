import React, { useState } from "react";
import {
  LayoutDashboard, Package, Plus, Search, Upload, Check, AlertTriangle,
  FolderPlus, Edit3, Trash2, Tag, ArrowUpRight, TrendingUp, DollarSign,
  Box, ShieldAlert, CheckCircle, Eye, EyeOff, Sliders, Cloud, Key,
  RefreshCw, CheckCircle2, Image as ImageIcon, Loader2, Sparkles, ExternalLink
} from "lucide-react";
import { Swatch } from "./BrandDecorations";
import {
  uploadGarmentPhoto,
  deleteProductFromFirestore,
  seedFirestoreCatalog,
  getFirebaseInstance
} from "../utils/firebase";
import {
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
  isFirebaseConfigured
} from "../utils/firebaseConfig";

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function AdminDashboard({
  products, saveProducts, categories, saveCategories, orders
}) {
  const [activeTab, setActiveTab] = useState("inventory"); // inventory | segments
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSegment, setFilterSegment] = useState("all");
  const [filterStockStatus, setFilterStockStatus] = useState("all"); // all | instock | outofstock | lowstock

  // State for Add/Edit Product Modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new/edited product
  const [prodForm, setProdForm] = useState({
    id: "",
    name: "",
    category: "Shirts",
    brand: "Zodiac",
    price: 1499,
    mrp: 1999,
    tag: "New",
    desc: "",
    c1: "#1B2A4A",
    c2: "#0D1830",
    image: null,
    images: [],
    stock: { S: 10, M: 10, L: 8, XL: 5, XXL: 2 },
    inStock: true
  });

  // State for Image Upload progress
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMsg, setUploadStatusMsg] = useState("");
  const [directImageUrl, setDirectImageUrl] = useState("");

  // Firebase Setup Modal & Status
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isCloudConfigured, setIsCloudConfigured] = useState(() => isFirebaseConfigured());
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => {
    const cfg = getActiveFirebaseConfig();
    return JSON.stringify(cfg, null, 2);
  });
  const [firebaseMsg, setFirebaseMsg] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

  // State for creating a new custom Segment/Category
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentIcon, setNewSegmentIcon] = useState("Shirt");
  const [segmentMsg, setSegmentMsg] = useState("");

  // Summary Metrics
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalProductsCount = products.length;
  
  const outOfStockCount = products.filter((p) => {
    const totalStock = typeof p.stock === 'object'
      ? Object.values(p.stock).reduce((a, b) => a + Number(b), 0)
      : Number(p.stock || 0);
    return !p.inStock || totalStock === 0;
  }).length;

  const lowStockCount = products.filter((p) => {
    const totalStock = typeof p.stock === 'object'
      ? Object.values(p.stock).reduce((a, b) => a + Number(b), 0)
      : Number(p.stock || 0);
    return p.inStock && totalStock > 0 && totalStock <= 5;
  }).length;

  // Filtered product inventory list
  const filteredInventory = products.filter((p) => {
    const totalStock = typeof p.stock === 'object'
      ? Object.values(p.stock).reduce((a, b) => a + Number(b), 0)
      : Number(p.stock || 0);

    const isOut = !p.inStock || totalStock === 0;
    const isLow = p.inStock && totalStock > 0 && totalStock <= 5;

    if (filterSegment !== "all" && p.category !== filterSegment) return false;
    if (filterStockStatus === "instock" && isOut) return false;
    if (filterStockStatus === "outofstock" && !isOut) return false;
    if (filterStockStatus === "lowstock" && !isLow) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle multiple image files upload
  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingImage(true);
    setUploadProgress(15);
    setUploadStatusMsg("Optimizing & uploading garment photos...");

    try {
      const garmentRef = prodForm.id || prodForm.name || `garment_${Date.now()}`;
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadGarmentPhoto(file, `${garmentRef}_${i}`, (p) => {
          const overall = Math.round(((i + p / 100) / files.length) * 100);
          setUploadProgress(overall);
        });
        if (res?.url) uploadedUrls.push(res.url);
      }

      if (uploadedUrls.length > 0) {
        setProdForm((prev) => {
          const existing = Array.isArray(prev.images) && prev.images.length > 0
            ? prev.images
            : (prev.image ? [prev.image] : []);
          const merged = [...existing, ...uploadedUrls];
          return {
            ...prev,
            images: merged,
            image: merged[0] || null
          };
        });
        setUploadStatusMsg(`✓ ${uploadedUrls.length} photo(s) attached!`);
        setTimeout(() => setUploadStatusMsg(""), 3500);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setUploadStatusMsg("Upload error: " + err.message);
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleAddDirectUrl = () => {
    const url = directImageUrl.trim();
    if (!url) return;
    setProdForm((prev) => {
      const existing = Array.isArray(prev.images) && prev.images.length > 0
        ? prev.images
        : (prev.image ? [prev.image] : []);
      const merged = [...existing, url];
      return {
        ...prev,
        images: merged,
        image: merged[0] || null
      };
    });
    setDirectImageUrl("");
  };

  const handleRemovePhoto = (indexToRemove) => {
    setProdForm((prev) => {
      const existing = Array.isArray(prev.images) ? prev.images : (prev.image ? [prev.image] : []);
      const updated = existing.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated[0] || null
      };
    });
  };

  const handleMakeCoverPhoto = (indexToCover) => {
    setProdForm((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      if (indexToCover < 0 || indexToCover >= existing.length) return prev;
      const [selected] = existing.splice(indexToCover, 1);
      existing.unshift(selected);
      return {
        ...prev,
        images: existing,
        image: existing[0] || null
      };
    });
  };

  const handleMovePhoto = (fromIdx, direction) => {
    setProdForm((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const toIdx = fromIdx + direction;
      if (toIdx < 0 || toIdx >= existing.length) return prev;
      const temp = existing[fromIdx];
      existing[fromIdx] = existing[toIdx];
      existing[toIdx] = temp;
      return {
        ...prev,
        images: existing,
        image: existing[0] || null
      };
    });
  };

  const handleClearAllPhotos = () => {
    if (window.confirm("Remove all attached photos from this garment?")) {
      setProdForm((prev) => ({ ...prev, images: [], image: null }));
    }
  };

  // Open Edit Modal
  const openEditModal = (p) => {
    setEditingProduct(p);
    const existingImgs = Array.isArray(p.images) && p.images.length > 0
      ? [...p.images]
      : (p.image ? [p.image] : []);
    setProdForm({
      id: p.id || "",
      name: p.name || "",
      category: p.category || categories[0]?.name || "Shirts",
      brand: p.brand || "Zodiac",
      price: p.price || 1499,
      mrp: p.mrp || 1999,
      tag: p.tag || "New",
      desc: p.desc || "",
      c1: p.c1 || "#1B2A4A",
      c2: p.c2 || "#0D1830",
      images: existingImgs,
      image: existingImgs[0] || p.image || null,
      stock: typeof p.stock === 'object' ? { ...p.stock } : { S: 10, M: 10, L: 8, XL: 5, XXL: 2 },
      inStock: p.inStock
    });
    setDirectImageUrl("");
    setIsModalOpen(true);
  };

  // Open Add New Product Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setProdForm({
      id: "",
      name: "",
      category: categories[0]?.name || "Shirts",
      brand: "Zodiac",
      price: 1499,
      mrp: 1999,
      tag: "New",
      desc: "",
      c1: "#1B2A4A",
      c2: "#0D1830",
      images: [],
      image: null,
      stock: { S: 10, M: 10, L: 8, XL: 5, XXL: 2 },
      inStock: true
    });
    setDirectImageUrl("");
    setIsModalOpen(true);
  };

  // Toggle inStock status for a product
  const handleToggleStockStatus = (productId) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    saveProducts(updated);
  };

  // Update size stock for a product directly from table
  const handleUpdateStockQty = (productId, sizeKey, newQty) => {
    const qtyNum = Math.max(0, parseInt(newQty, 10) || 0);
    const updated = products.map((p) => {
      if (p.id === productId) {
        const currentStock = typeof p.stock === 'object' ? { ...p.stock } : { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
        currentStock[sizeKey] = qtyNum;
        const total = Object.values(currentStock).reduce((a, b) => a + Number(b), 0);
        return {
          ...p,
          stock: currentStock,
          inStock: total > 0 && p.inStock
        };
      }
      return p;
    });
    saveProducts(updated);
  };

  // Save product from modal form (Add or Edit)
  const handleSaveProductForm = (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.category) return;

    const totalFormStock = Object.values(prodForm.stock).reduce((a, b) => a + Number(b), 0);
    const finalInStock = totalFormStock > 0 && prodForm.inStock;

    const cleanImages = Array.isArray(prodForm.images) ? prodForm.images.filter(Boolean) : (prodForm.image ? [prodForm.image] : []);
    const primaryImage = cleanImages[0] || prodForm.image || null;

    const payload = {
      ...prodForm,
      images: cleanImages,
      image: primaryImage,
      inStock: finalInStock
    };

    let savedProd;
    if (editingProduct) {
      // Update existing
      savedProd = { ...editingProduct, ...payload };
      const updated = products.map((p) => (p.id === editingProduct.id ? savedProd : p));
      saveProducts(updated);
    } else {
      // Add new product
      const newId = `YD-${100 + products.length + Math.floor(Math.random() * 90)}`;
      savedProd = {
        ...payload,
        id: newId,
        inStock: finalInStock,
        rating: "4.8",
        reviews: 1,
        sizes: Object.keys(prodForm.stock)
      };
      saveProducts([savedProd, ...products]);
    }

    if (savedProd) {
      saveProductToFirestore(savedProd).catch(() => {});
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product from the workroom catalog?")) {
      saveProducts(products.filter((p) => p.id !== id));
      deleteProductFromFirestore(id).catch(() => {});
    }
  };

  // Add a new Segment / Category
  const handleAddNewSegment = (e) => {
    e.preventDefault();
    if (!newSegmentName.trim()) return;

    const exists = categories.some((c) => c.name.toLowerCase() === newSegmentName.trim().toLowerCase());
    if (exists) {
      setSegmentMsg("Segment already exists!");
      return;
    }

    const newCat = { name: newSegmentName.trim(), icon: newSegmentIcon };
    saveCategories([...categories, newCat]);
    setNewSegmentName("");
    setSegmentMsg("🎉 New Segment added successfully!");
    setTimeout(() => setSegmentMsg(""), 2500);
  };

  // Remove a Segment / Category
  const handleDeleteSegment = (categoryName) => {
    if (categories.length <= 1) {
      alert("Cannot remove the only remaining segment. At least one segment is required.");
      return;
    }
    const count = products.filter((p) => p.category === categoryName).length;
    const confirmMsg = count > 0
      ? `Are you sure you want to remove the "${categoryName}" segment? Note: ${count} garment(s) currently belong to this segment.`
      : `Remove segment "${categoryName}"?`;

    if (window.confirm(confirmMsg)) {
      saveCategories(categories.filter((c) => c.name !== categoryName));
      setSegmentMsg(`✓ Segment "${categoryName}" removed!`);
      setTimeout(() => setSegmentMsg(""), 2500);
    }
  };

  // Save Firebase configuration
  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(firebaseConfigInput);
      saveCustomFirebaseConfig(parsed);
      const isConfigured = isFirebaseConfigured(parsed);
      setIsCloudConfigured(isConfigured);
      setFirebaseMsg(isConfigured ? "🎉 Firebase credentials saved! Connecting to cloud..." : "⚠️ Incomplete Firebase credentials.");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setFirebaseMsg("❌ Invalid JSON format. Please paste the Firebase config object JSON.");
    }
  };

  // Reset Firebase config
  const handleClearFirebaseConfig = () => {
    if (window.confirm("Disconnect Firebase and switch to local offline demo mode?")) {
      clearCustomFirebaseConfig();
      setIsCloudConfigured(false);
      setFirebaseMsg("Switched to local demo mode.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Force seed catalog to Firestore
  const handleForceSeedCatalog = async () => {
    const { db, isLive } = getFirebaseInstance();
    if (!isLive || !db) {
      alert("Please connect Firebase first.");
      return;
    }
    setIsSeeding(true);
    try {
      await seedFirestoreCatalog(db);
      setFirebaseMsg("✅ Store catalog pushed to Firebase Cloud Firestore successfully!");
    } catch (err) {
      setFirebaseMsg("Failed to seed catalog: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[var(--mustard)] text-[var(--ink)] font-mono text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
              SELLER WORKROOM PORTAL
            </span>
            <span className="text-xs text-gray-500 font-mono">Yashal Admin v2.4</span>
            
            {/* Live Cloud Status Pill */}
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border transition-colors ${
                isCloudConfigured
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
              }`}
              title="Click to manage Firebase Cloud sync"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isCloudConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              {isCloudConfigured ? "Cloud Live Sync Active" : "Local Demo Mode (Connect Cloud)"}
            </button>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">Merchant Inventory &amp; Segments</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="yd-btn border border-gray-300 px-3.5 py-2.5 text-xs flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100"
            title="Configure Firebase Cloud Credentials"
          >
            <Cloud size={15} className={isCloudConfigured ? "text-emerald-600" : "text-amber-500"} />
            <span className="hidden md:inline">Firebase Cloud</span> Setup
          </button>
          <button
            onClick={() => { setActiveTab("segments"); }}
            className="yd-btn border border-[var(--ink)] px-4 py-2.5 text-xs flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100"
          >
            <FolderPlus size={15} /> Add New Segment
          </button>
          <button
            onClick={openAddModal}
            className="yd-btn yd-btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5 shadow"
            style={{ background: "var(--mustard)", color: "var(--ink)" }}
          >
            <Plus size={16} /> Add New Garment
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-mono font-medium">TOTAL REVENUE</span>
            <DollarSign size={16} className="yd-mustard" />
          </div>
          <p className="font-display text-2xl font-bold text-gray-900">{money(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 font-mono mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {orders.length} orders processed
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-mono font-medium">TOTAL PRODUCTS</span>
            <Package size={16} className="text-blue-600" />
          </div>
          <p className="font-display text-2xl font-bold text-gray-900">{totalProductsCount}</p>
          <p className="text-[11px] text-gray-500 font-mono mt-1">{categories.length} segments active</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-mono font-medium">OUT OF STOCK</span>
            <ShieldAlert size={16} className="text-red-600" />
          </div>
          <p className="font-display text-2xl font-bold text-red-600">{outOfStockCount}</p>
          <p className="text-[11px] text-red-500 font-mono mt-1">Requires restock</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-mono font-medium">LOW STOCK (&le; 5)</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <p className="font-display text-2xl font-bold text-amber-600">{lowStockCount}</p>
          <p className="text-[11px] text-amber-600 font-mono mt-1">Selling out fast</p>
        </div>
      </div>

      {/* Dashboard Sub-Nav Tabs */}
      <div className="flex border-b border-[var(--line)] mb-6 gap-6 text-sm font-mono font-semibold">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "inventory" ? "border-[var(--mustard-deep)] text-[var(--ink)]" : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          <Box size={16} /> Inventory &amp; Stock Control ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("segments")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "segments" ? "border-[var(--mustard-deep)] text-[var(--ink)]" : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          <Tag size={16} /> Segments &amp; Categories ({categories.length})
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          
          {/* Inventory Filters & Search Bar */}
          <div className="bg-white p-4 rounded-lg border border-[var(--line)] flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full flex items-center gap-2 bg-gray-100 rounded px-3 py-2 border border-gray-200">
              <Search size={16} className="text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, ID, or segment..."
                className="bg-transparent outline-none text-xs w-full text-gray-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Segment Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-gray-500">Segment:</span>
                <select
                  value={filterSegment}
                  onChange={(e) => setFilterSegment(e.target.value)}
                  className="yd-select py-1.5 px-3 text-xs w-auto"
                >
                  <option value="all">All Segments</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-gray-500">Status:</span>
                <select
                  value={filterStockStatus}
                  onChange={(e) => setFilterStockStatus(e.target.value)}
                  className="yd-select py-1.5 px-3 text-xs w-auto"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="instock">In Stock Only</option>
                  <option value="outofstock">Out of Stock Only</option>
                  <option value="lowstock">Low Stock Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Inventory Table */}
          <div className="bg-white rounded-lg border border-[var(--line)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-700 font-mono border-b uppercase">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Segment</th>
                    <th className="py-3 px-4">Price / MRP</th>
                    <th className="py-3 px-4">Stock Qty per Size</th>
                    <th className="py-3 px-4">Status Toggle</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        No garments match the current inventory filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((p) => {
                      const stockObj = typeof p.stock === 'object' ? p.stock : { S: 0 };
                      const totalStock = Object.values(stockObj).reduce((a, b) => a + Number(b), 0);
                      const isOut = !p.inStock || totalStock === 0;

                      return (
                        <tr key={p.id} className={`hover:bg-gray-50/80 ${isOut ? "bg-gray-50/50 opacity-80" : ""}`}>
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Swatch p={p} className="w-12 h-12 rounded border shrink-0" />
                              <div>
                                <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                                <span className="font-mono text-[10px] text-gray-500">{p.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* Segment / Category */}
                          <td className="py-3 px-4">
                            <span className="font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium text-[10px]">
                              {p.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{money(p.price)}</div>
                            <div className="text-[10px] line-through text-gray-400">{money(p.mrp)}</div>
                          </td>

                          {/* Size-wise Stock Editor Inputs */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {Object.entries(stockObj).map(([sz, q]) => (
                                <div key={sz} className="flex items-center border rounded bg-gray-50 px-1.5 py-0.5">
                                  <span className="font-mono text-[10px] text-gray-600 mr-1">{sz}:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={q}
                                    onChange={(e) => handleUpdateStockQty(p.id, sz, e.target.value)}
                                    className="w-10 text-center text-xs font-bold outline-none bg-transparent"
                                  />
                                </div>
                              ))}
                              <span className="text-[10px] font-mono text-gray-500 ml-1">
                                (Total: {totalStock})
                              </span>
                            </div>
                          </td>

                          {/* In Stock / Out of Stock Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStockStatus(p.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                                isOut
                                  ? "bg-red-100 text-red-700 border border-red-300"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              }`}
                            >
                              {isOut ? (
                                <>
                                  <EyeOff size={12} /> OUT OF STOCK
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={12} /> IN STOCK
                                </>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                                title="Edit Garment"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 hover:bg-red-100 rounded text-red-600"
                                title="Delete Garment"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEGMENTS & CATEGORIES MANAGEMENT */}
      {activeTab === "segments" && (
        <div className="grid md:grid-cols-[1fr_360px] gap-8">
          
          {/* Segment List */}
          <div className="bg-white p-6 rounded-lg border border-[var(--line)] shadow-sm">
            <h3 className="font-display text-lg font-semibold mb-4">Active Garment Segments ({categories.length})</h3>
            <p className="text-xs text-gray-500 mb-4">
              Products can be assigned to any segment below. Adding a new segment automatically surfaces it on the storefront navigation rail and filters.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <div key={c.name} className="p-3 border rounded-lg flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="yd-mustard" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                        <p className="text-[10px] font-mono text-gray-500">{count} products in segment</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSegment(c.name)}
                      className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-[10px] font-mono font-bold transition-all"
                      title={`Remove ${c.name} segment`}
                    >
                      ✕ Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form to Add New Segment */}
          <div className="bg-white p-6 rounded-lg border border-[var(--line)] shadow-sm h-fit">
            <h3 className="font-display text-base font-semibold mb-2 flex items-center gap-2">
              <FolderPlus size={18} className="yd-mustard" /> Create New Segment
            </h3>
            <p className="text-xs text-gray-500 mb-4">Add a new category (e.g. "Summer Shorts", "Sherwanis", "Blazers").</p>

            <form onSubmit={handleAddNewSegment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Segment / Category Name *</label>
                <input
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  placeholder="e.g. Blazers &amp; Suits"
                  className="w-full border rounded px-3 py-2 text-xs outline-none focus:border-[var(--ink)]"
                  required
                />
              </div>

              {segmentMsg && (
                <p className="text-xs font-mono text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                  {segmentMsg}
                </p>
              )}

              <button
                type="submit"
                className="yd-btn yd-btn-primary w-full py-3 text-xs font-bold shadow"
                style={{ background: "var(--ink)", color: "var(--ivory)" }}
              >
                Add Segment to Storefront
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative border border-gray-300 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {editingProduct ? `Edit Garment — ${editingProduct.id}` : "Add New Garment to Catalog"}
                </h2>
                <p className="text-xs text-gray-500 font-mono">
                  {isCloudConfigured ? "🟢 Live Sync: Updates instantly for all customers" : "🟠 Demo Mode: Stored locally"}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Garment Name *</label>
                  <input
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="e.g. Linen Oxford Shirt"
                    className="w-full border rounded px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Assign to Segment / Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="yd-select text-xs py-2"
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full border rounded px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    value={prodForm.mrp}
                    onChange={(e) => setProdForm({ ...prodForm, mrp: Number(e.target.value) })}
                    className="w-full border rounded px-3 py-2 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              {/* Garment Image Upload & Visual Customizer */}
              <div className="border p-4 rounded bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                    <ImageIcon size={14} className="yd-mustard" /> Garment Photos ({prodForm.images?.length || 0} Attached)
                  </p>
                  {prodForm.images && prodForm.images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllPhotos}
                      className="text-[10px] font-mono text-red-600 hover:text-red-800 underline"
                    >
                      Clear All Photos
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 hover:border-gray-900 bg-white rounded-lg p-3 text-center transition-colors">
                      <span className="font-mono text-xs font-bold text-gray-800 flex items-center justify-center gap-1.5">
                        <span>📸</span>
                        <span>{isUploadingImage ? "Processing photos..." : "+ Choose / Drop Multiple Photos"}</span>
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Select one or multiple photos from phone / computer</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Direct URL input */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste direct image Web URL (https://...)"
                      value={directImageUrl}
                      onChange={(e) => setDirectImageUrl(e.target.value)}
                      className="flex-1 border bg-white rounded px-2.5 py-1.5 text-[11px] font-mono outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddDirectUrl}
                      disabled={!directImageUrl.trim()}
                      className="yd-btn px-3 py-1.5 text-[11px] font-bold bg-gray-800 text-white hover:bg-black disabled:opacity-40"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {/* Upload progress & status */}
                {isUploadingImage && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[var(--mustard-deep)] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Uploading ({uploadProgress}%)...
                    </p>
                  </div>
                )}

                {uploadStatusMsg && (
                  <p className="text-[11px] font-mono text-emerald-700 mt-1.5 font-medium">
                    {uploadStatusMsg}
                  </p>
                )}

                {/* Photos Gallery Grid */}
                {prodForm.images && prodForm.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                    {prodForm.images.map((imgSrc, idx) => {
                      const isCover = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`relative group bg-white rounded-lg border-2 overflow-hidden shadow-sm transition-all ${
                            isCover ? 'border-[var(--mustard-deep)] ring-2 ring-[var(--mustard)]/40' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="h-20 w-full bg-gray-100 relative">
                            <img src={imgSrc} alt={`Garment ${idx + 1}`} className="w-full h-full object-cover" />
                            
                            <div className="absolute top-1 left-1">
                              {isCover ? (
                                <span className="bg-[var(--mustard)] text-[var(--ink)] font-mono text-[8px] font-extrabold px-1 py-0.5 rounded shadow">
                                  ★ COVER
                                </span>
                              ) : (
                                <span className="bg-black/70 text-white font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="p-1 bg-gray-50 flex items-center justify-between text-[9px] font-mono border-t">
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => handleMakeCoverPhoto(idx)}
                                className="text-amber-800 hover:text-black font-bold truncate underline"
                              >
                                Set Cover
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-bold">Cover Photo</span>
                            )}

                            <div className="flex gap-0.5 ml-auto">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(idx, -1)}
                                  className="px-1 py-0.2 bg-white border rounded hover:bg-gray-100 text-gray-700 font-bold"
                                  title="Move Left"
                                >
                                  ←
                                </button>
                              )}
                              {idx < prodForm.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(idx, 1)}
                                  className="px-1 py-0.2 bg-white border rounded hover:bg-gray-100 text-gray-700 font-bold"
                                  title="Move Right"
                                >
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-2 bg-white rounded border text-center text-gray-400 font-mono text-[10px]">
                    No photos attached yet. Default gradient will be used.
                  </div>
                )}

                {/* Dual fabric color pickers */}
                <div className="pt-2 border-t flex items-center justify-between flex-wrap gap-2 text-[11px]">
                  <span className="font-mono text-gray-600">Dual Fabric Gradient (Fallback):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={prodForm.c1}
                      onChange={(e) => setProdForm({ ...prodForm, c1: e.target.value })}
                      className="h-7 w-9 cursor-pointer border rounded"
                      title="Primary Color"
                    />
                    <input
                      type="color"
                      value={prodForm.c2}
                      onChange={(e) => setProdForm({ ...prodForm, c2: e.target.value })}
                      className="h-7 w-9 cursor-pointer border rounded"
                      title="Secondary Color"
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-mono">Storefront Preview:</span>
                  <div className="relative">
                    <Swatch p={prodForm} className="w-14 h-14 rounded-lg border shadow-sm object-cover" />
                    {prodForm.image && (
                      <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5">
                        <Check size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stock Quantity Inputs per size */}
              <div className="border p-4 rounded bg-gray-50">
                <p className="text-xs font-semibold text-gray-800 mb-2">Initial Stock Quantity per Size:</p>
                <div className="flex flex-wrap gap-3">
                  {["S", "M", "L", "XL", "XXL"].map((sz) => (
                    <div key={sz} className="flex flex-col items-center">
                      <span className="text-[11px] font-mono font-bold mb-1">{sz}</span>
                      <input
                        type="number"
                        min="0"
                        value={prodForm.stock[sz] ?? 0}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                          setProdForm({ ...prodForm, stock: { ...prodForm.stock, [sz]: val } });
                        }}
                        className="w-14 text-center border rounded py-1 text-xs font-mono font-bold bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.desc}
                  onChange={(e) => setProdForm({ ...prodForm, desc: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={prodForm.inStock}
                  onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                  className="yd-checkbox"
                />
                <label htmlFor="inStockCheck" className="text-xs font-medium cursor-pointer">
                  Mark item as active &amp; In-Stock for customers
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="yd-btn yd-btn-outline px-5 py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="yd-btn yd-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow"
                  style={{ background: "var(--mustard)", color: "var(--ink)" }}
                >
                  <Sparkles size={14} />
                  {editingProduct ? "Save & Sync Garment" : "Create & Publish Garment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FIREBASE CLOUD SETUP MODAL */}
      {isFirebaseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl relative border border-gray-300 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Cloud className="yd-mustard" size={22} />
                <h2 className="font-display text-xl font-bold">Firebase Cloud Connection</h2>
              </div>
              <button onClick={() => setIsFirebaseModalOpen(false)} className="text-gray-500 hover:text-black font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border bg-amber-50/70 border-amber-200">
                <p className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> How to get free Firebase Keys (Takes 2 minutes):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800">
                  <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-semibold">console.firebase.google.com</a> and create a project.</li>
                  <li>Click <strong>Firestore Database</strong> &rarr; Create Database (Start in test mode).</li>
                  <li>Click <strong>Storage</strong> &rarr; Get Started (Start in test mode for garment photos).</li>
                  <li>Go to <strong>Project Settings</strong> &rarr; Scroll down &rarr; Copy <code>firebaseConfig</code> object.</li>
                </ol>
              </div>

              <form onSubmit={handleSaveFirebaseConfig} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Paste Firebase Config JSON Object:
                  </label>
                  <textarea
                    rows={8}
                    value={firebaseConfigInput}
                    onChange={(e) => setFirebaseConfigInput(e.target.value)}
                    placeholder='{\n  "apiKey": "AIzaSy...",\n  "projectId": "yashal-dresses",\n  "storageBucket": "yashal-dresses.appspot.com"\n}'
                    className="w-full font-mono text-[11px] border rounded p-3 bg-gray-900 text-amber-300 outline-none"
                    required
                  />
                </div>

                {firebaseMsg && (
                  <p className="font-mono text-[11px] p-2 rounded bg-gray-100 border text-gray-800">
                    {firebaseMsg}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="submit"
                    className="yd-btn yd-btn-primary py-2.5 px-4 text-xs font-bold flex-1"
                    style={{ background: "var(--ink)", color: "var(--ivory)" }}
                  >
                    Save &amp; Connect Live Sync
                  </button>

                  {isCloudConfigured && (
                    <button
                      type="button"
                      onClick={handleForceSeedCatalog}
                      disabled={isSeeding}
                      className="yd-btn border border-gray-300 py-2.5 px-3 text-xs bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <RefreshCw size={13} className={isSeeding ? "animate-spin" : ""} />
                      Seed Initial Catalog to Cloud
                    </button>
                  )}

                  {isCloudConfigured && (
                    <button
                      type="button"
                      onClick={handleClearFirebaseConfig}
                      className="yd-btn border border-red-300 text-red-700 py-2.5 px-3 text-xs hover:bg-red-50"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

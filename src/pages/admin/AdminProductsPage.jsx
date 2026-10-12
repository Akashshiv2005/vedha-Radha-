import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ShieldCheck, 
  Clock, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  Trash2, 
  X, 
  Store, 
  Check, 
  RotateCcw,
  Gem,
  Info
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminProductsPage({
  isAddModalOpen = false,
  setIsAddModalOpen = () => {},
  searchQuery: externalSearchQuery = '',
  setSearchQuery: setExternalSearchQuery = () => {}
}) {
  const { 
    products = [], 
    addProduct, 
    updateProduct, 
    deleteProduct,
    markProductSoldInShowroom, 
    releaseReservation 
  } = useAdmin();

  // Internal search state fallback if external not passed
  const [internalSearch, setInternalSearch] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
  const setSearchQuery = setExternalSearchQuery || setInternalSearch;

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [uniqueFilter, setUniqueFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Table selection & pagination state
  const [selectedSkus, setSelectedSkus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Row action menu dropdown state
  const [openActionSku, setOpenActionSku] = useState(null);
  const actionMenuRef = useRef(null);

  // Detail Drawer & Edit Modal State
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    sku: '',
    category: 'Silver Jewellery',
    subCategory: 'Anklets & Kolusu',
    purity: '925 Sterling Silver',
    grossWeight: '45.00 g',
    netWeight: '45.00 g',
    price: '12,800',
    numericPrice: 12800,
    isUnique: true,
    status: 'available',
    availability: 'in_stock',
    image: '/images/product_anklet.jpg',
    description: '',
    hallmarkDetails: '925 Fineness Stamped',
    stockQty: 1,
    location: 'Showroom Counter 3 - Silver Section'
  });

  // Close action popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenActionSku(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(query);
        const matchesSku = (p.sku || '').toLowerCase().includes(query);
        const matchesCategory = (p.category || '').toLowerCase().includes(query);
        const matchesSubtitle = (p.subtitle || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesCategory && !matchesSubtitle) {
          return false;
        }
      }

      // 2. Category Filter
      if (categoryFilter !== 'all') {
        const cat = (p.category || '').toLowerCase();
        if (categoryFilter === 'gold' && !cat.includes('gold')) return false;
        if (categoryFilter === 'silver_jewellery' && !(cat.includes('silver') && cat.includes('jewel'))) return false;
        if (categoryFilter === 'silver_articles' && !(cat.includes('silver') && (cat.includes('article') || cat.includes('pooja') || cat.includes('utensil')))) return false;
        if (categoryFilter === 'temple' && !cat.includes('temple')) return false;
        if (categoryFilter === 'bridal' && !cat.includes('bridal')) return false;
        if (categoryFilter === 'coins' && !(cat.includes('coin') || cat.includes('bar'))) return false;
      }

      // 3. Status Filter
      if (statusFilter !== 'all') {
        const stat = (p.status || '').toLowerCase();
        if (statusFilter === 'available' && stat !== 'available') return false;
        if (statusFilter === 'reserved' && stat !== 'reserved') return false;
        if (statusFilter === 'sold' && !(stat.includes('sold'))) return false;
      }

      // 4. Unique Item Filter
      if (uniqueFilter !== 'all') {
        if (uniqueFilter === 'unique' && !p.isUnique) return false;
        if (uniqueFilter === 'regular' && p.isUnique) return false;
      }

      // 5. Availability Filter
      if (availabilityFilter !== 'all') {
        const isSold = (p.status || '').toLowerCase().includes('sold');
        const qty = Number(p.stockQty) || 0;
        if (availabilityFilter === 'in_stock' && (isSold || (p.availability === 'out_of_stock' && qty <= 0))) {
          return false;
        }
        if (availabilityFilter === 'out_of_stock' && (!isSold && (p.availability !== 'out_of_stock' && qty > 0))) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, uniqueFilter, availabilityFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, uniqueFilter, availabilityFilter]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  // Checkbox handlers
  const isAllSelected = currentItems.length > 0 && currentItems.every(p => selectedSkus.includes(p.sku));
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSkus(prev => prev.filter(sku => !currentItems.some(p => p.sku === sku)));
    } else {
      const currentSkus = currentItems.map(p => p.sku);
      setSelectedSkus(prev => Array.from(new Set([...prev, ...currentSkus])));
    }
  };

  const handleToggleSelectRow = (sku) => {
    setSelectedSkus(prev => 
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      subtitle: 'One of a kind • Handcrafted',
      sku: `SA-${Math.floor(100 + Math.random() * 899)}`,
      category: 'Silver Jewellery',
      subCategory: 'Anklets & Kolusu',
      purity: '925 Sterling Silver',
      grossWeight: '45.00 g',
      netWeight: '45.00 g',
      price: '12,800',
      numericPrice: 12800,
      isUnique: true,
      status: 'available',
      availability: 'in_stock',
      image: '/images/product_anklet.jpg',
      description: 'Traditional handcrafted piece sculpted by master artisans for the authentic showroom gallery.',
      hallmarkDetails: '925 Fineness Stamped',
      stockQty: 1,
      location: 'Showroom Counter 3 - Silver Section'
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price ? String(product.price).replace(/[^0-9,]/g, '') : '',
      numericPrice: product.numericPrice || 0
    });
    setOpenActionSku(null);
    setIsAddModalOpen(true);
  };

  // Open View Details Drawer
  const handleOpenDetail = (product) => {
    setSelectedDetailProduct(product);
    setOpenActionSku(null);
    setIsDetailDrawerOpen(true);
  };

  // Form Submit (Add or Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const cleanNumeric = parseInt(String(formData.price).replace(/[^0-9]/g, ''), 10) || 0;
    const formattedPrice = cleanNumeric.toLocaleString('en-IN');

    const productPayload = {
      ...formData,
      price: formattedPrice,
      numericPrice: cleanNumeric,
      updatedDate: 'Today',
      updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdated: `Today\n${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    if (editingProduct) {
      updateProduct(editingProduct.sku, productPayload);
    } else {
      addProduct(productPayload);
    }
    setIsAddModalOpen(false);
  };

  // Quick action: Delete product
  const handleDeleteProduct = (sku) => {
    if (window.confirm(`Are you sure you want to remove product ${sku} from the inventory?`)) {
      deleteProduct(sku);
      setOpenActionSku(null);
    }
  };

  // Helper: Format price display
  const renderPrice = (product) => {
    if (product.numericPrice) {
      return product.numericPrice.toLocaleString('en-IN');
    }
    if (product.price) {
      return String(product.price).replace(/[^0-9,]/g, '').trim() || product.price;
    }
    return '0';
  };

  // Helper: Format updated date & time into 2 lines
  const renderUpdatedTime = (product) => {
    if (product.updatedDate && product.updatedTime) {
      return (
        <div>
          <div className="text-[12.5px] font-medium text-[#292521] leading-tight">
            {product.updatedDate}
          </div>
          <div className="text-[11.5px] text-[#736B63] mt-0.5 leading-tight">
            {product.updatedTime}
          </div>
        </div>
      );
    }
    if (product.lastUpdated) {
      const parts = product.lastUpdated.split('\n');
      return (
        <div>
          <div className="text-[12.5px] font-medium text-[#292521] leading-tight">
            {parts[0]}
          </div>
          {parts[1] && (
            <div className="text-[11.5px] text-[#736B63] mt-0.5 leading-tight">
              {parts[1]}
            </div>
          )}
        </div>
      );
    }
    return <span className="text-[12px] text-[#736B63]">Recently</span>;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 pb-12 font-admin-body">
      
      {/* ================= 1. PAGE HEADER (Matches Reference Screenshot) ================= */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Title & Subtitle */}
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5C1D27] text-white text-[11px] font-semibold font-admin-body tracking-widest uppercase">
            SCREEN 2 • INVENTORY
          </span>
          <h1 className="font-admin-heading text-[28px] sm:text-[32px] font-semibold text-[#1C1917] tracking-tight leading-tight mt-1">
            Products
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5 font-normal font-admin-body">
            Manage gallery and availability.
          </p>
        </div>

        {/* Right: Tagline & Highlighted Safeguard Notice */}
        <div className="flex flex-col items-start sm:items-end gap-2.5">
          {/* Brand Tagline */}
          <div className="flex items-center gap-2.5 text-right hidden sm:flex">
            <span className="w-8 h-[1px] bg-[#C49A45]" />
            <div className="text-[10px] tracking-[0.22em] text-[#7A7167] uppercase font-medium leading-tight">
              <div>TIMELESS CRAFTSMANSHIP</div>
              <div>A RICHER TOMORROW</div>
            </div>
          </div>

          {/* Highlighted Notice: Unique item reserved safeguard */}
          <div className="w-full sm:w-auto bg-[#F7F0E1] border border-[#E8DCBE] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-[#EFE3C8] border border-[#DFCEAA] flex items-center justify-center flex-shrink-0 text-[#8C6527]">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="text-[13px] leading-snug">
              <span className="font-semibold text-[#292521]">Unique item reserved — </span>
              <span className="text-[#695D4E]">blocked from duplicate orders.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. FOUR FILTERS + ADD PRODUCT BUTTON (Inline Alignment) ================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4 pt-1">
        {/* 4 Compact Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 flex-1 max-w-4xl">
          {/* Filter 1: Category */}
          <div>
            <label className="block text-[12px] font-semibold text-[#292521] mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none bg-[#FFFFFF] border border-[#E2DCD2] hover:border-[#C49A45] rounded-lg px-3 py-2 text-[13px] text-[#292521] font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] transition cursor-pointer pr-8"
              >
                <option value="all">All categories</option>
                <option value="gold">Gold Jewellery</option>
                <option value="silver_jewellery">Silver Jewellery</option>
                <option value="silver_articles">Silver Articles</option>
                <option value="temple">Temple Jewellery</option>
                <option value="bridal">Bridal Jewellery</option>
                <option value="coins">Coins &amp; Bars</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736B63] pointer-events-none" />
            </div>
          </div>

          {/* Filter 2: Status */}
          <div>
            <label className="block text-[12px] font-semibold text-[#292521] mb-1">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-[#FFFFFF] border border-[#E2DCD2] hover:border-[#C49A45] rounded-lg px-3 py-2 text-[13px] text-[#292521] font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] transition cursor-pointer pr-8"
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736B63] pointer-events-none" />
            </div>
          </div>

          {/* Filter 3: Unique item */}
          <div>
            <label className="block text-[12px] font-semibold text-[#292521] mb-1">
              Unique item
            </label>
            <div className="relative">
              <select
                value={uniqueFilter}
                onChange={(e) => setUniqueFilter(e.target.value)}
                className="w-full appearance-none bg-[#FFFFFF] border border-[#E2DCD2] hover:border-[#C49A45] rounded-lg px-3 py-2 text-[13px] text-[#292521] font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] transition cursor-pointer pr-8"
              >
                <option value="all">All items</option>
                <option value="unique">Unique (1-of-1)</option>
                <option value="regular">Regular Stock</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736B63] pointer-events-none" />
            </div>
          </div>

          {/* Filter 4: Availability */}
          <div>
            <label className="block text-[12px] font-semibold text-[#292521] mb-1">
              Availability
            </label>
            <div className="relative">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full appearance-none bg-[#FFFFFF] border border-[#E2DCD2] hover:border-[#C49A45] rounded-lg px-3 py-2 text-[13px] text-[#292521] font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] transition cursor-pointer pr-8"
              >
                <option value="all">All availability</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736B63] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Add Product Button aligned directly on the right */}
        <div className="flex-shrink-0 self-end">
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 rounded-lg bg-[#8D6725] hover:bg-[#78551B] active:bg-[#684914] text-white text-[14px] font-semibold font-admin-body shadow-2xs flex items-center justify-center gap-1.5 transition duration-150 h-[38px] whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add product</span>
          </button>
        </div>
      </div>

      {/* Selected Items Batch Actions Bar */}
      {selectedSkus.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#C49A45]/40 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8D6725]" />
            <span className="text-[13px] font-medium text-[#292521]">
              <strong>{selectedSkus.length}</strong> product{selectedSkus.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSkus([])}
              className="text-[12.5px] text-[#736B63] hover:text-[#292521] px-2.5 py-1 rounded transition"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* ================= 3. PRODUCT INVENTORY TABLE CARD ================= */}
      <div className="bg-[#FFFFFF] border border-[#EDE8E1] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto min-h-[360px]">
          <table className="w-full text-left border-collapse text-[13.5px] tabular-nums">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#EDE8E1] bg-[#FCFBF9] text-[#736B63] text-[13px] font-medium">
                {/* Checkbox Header */}
                <th className="py-3.5 pl-5 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-[#D5CFC5] text-[#8D6725] focus:ring-[#8D6725]/30 cursor-pointer accent-[#8D6725]"
                    aria-label="Select all products"
                  />
                </th>

                {/* Product Column */}
                <th className="py-3.5 px-4 font-semibold text-[#292521] min-w-[240px]">
                  Product
                </th>

                {/* SKU Column */}
                <th className="py-3.5 px-3 font-semibold text-[#292521] min-w-[100px]">
                  SKU
                </th>

                {/* Category Column */}
                <th className="py-3.5 px-3 font-semibold text-[#292521] min-w-[130px]">
                  Category
                </th>

                {/* Item Type Column */}
                <th className="py-3.5 px-3 font-semibold text-[#292521] min-w-[100px]">
                  Item type
                </th>

                {/* Price Column */}
                <th className="py-3.5 px-3 font-semibold text-[#292521] min-w-[100px]">
                  Price
                </th>

                {/* Status Column */}
                <th className="py-3.5 px-3 font-semibold text-[#292521] min-w-[120px]">
                  Status
                </th>

                {/* Updated Column */}
                <th className="py-3.5 px-3 font-semibold text-[#292521] min-w-[120px]">
                  Updated
                </th>

                {/* Actions Column */}
                <th className="py-3.5 pr-5 pl-3 font-semibold text-[#292521] text-right min-w-[90px]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#EDE8E1] text-[#292521]">
              {currentItems.map((product) => {
                const isSelected = selectedSkus.includes(product.sku);
                const isUnique = !!product.isUnique;

                // Status configuration matching the reference screenshot badges
                const stat = (product.status || 'available').toLowerCase();
                let statusBadge = null;

                if (stat === 'reserved') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FDF3DE] text-[#9A6700] border border-[#F0DCB0]/50 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-[#9A6700] stroke-[2.2]" />
                      <span>Reserved</span>
                    </span>
                  );
                } else if (stat.includes('sold')) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FCE8E6] text-[#C5221F] border border-[#F5C2BE]/50 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5221F]" />
                      <span>Sold</span>
                    </span>
                  );
                } else {
                  // Default / Available
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]/60 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#137333]" />
                      <span>Available</span>
                    </span>
                  );
                }

                return (
                  <tr 
                    key={product.sku}
                    className={`hover:bg-[#FAF7F2] transition-colors duration-100 ${
                      isSelected ? 'bg-[#FAF6EE]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 pl-5 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(product.sku)}
                        className="w-4 h-4 rounded border-[#D5CFC5] text-[#8D6725] focus:ring-[#8D6725]/30 cursor-pointer accent-[#8D6725]"
                        aria-label={`Select ${product.name}`}
                      />
                    </td>

                    {/* Product Image & Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        {/* Jewellery Thumbnail */}
                        <div 
                          onClick={() => handleOpenDetail(product)}
                          className="w-14 h-14 rounded-lg bg-[#24211D] border border-[#E8E2D9] overflow-hidden flex-shrink-0 cursor-pointer group shadow-sm flex items-center justify-center"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/product_anklet.jpg';
                            }}
                          />
                        </div>

                        {/* Title & Subtitle */}
                        <div className="min-w-0 max-w-xs">
                          <h4
                            onClick={() => handleOpenDetail(product)}
                            className="font-semibold text-[14px] text-[#292521] hover:text-[#8D6725] cursor-pointer truncate transition leading-snug"
                            title={product.name}
                          >
                            {product.name}
                          </h4>
                          <p className="text-[12px] text-[#736B63] truncate mt-0.5 leading-snug">
                            {product.subtitle || (isUnique ? 'One of a kind • Handcrafted' : (product.subCategory || 'Showroom Collection'))}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-4 px-3 text-[13px] font-medium text-[#4A423A] font-admin-mono whitespace-nowrap">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-3 text-[13px] text-[#4A423A] whitespace-nowrap">
                      {product.category}
                    </td>

                    {/* Item Type Badge */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      {isUnique ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#F4EBD9] text-[#8D6725] border border-[#E6D7BA]/60">
                          Unique
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-[#EFEFEF] text-[#736B63] border border-[#E2DFD9]/60">
                          Regular
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-3 text-[14px] font-medium text-[#292521] whitespace-nowrap">
                      {renderPrice(product)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      {statusBadge}
                    </td>

                    {/* Updated Date & Time */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      {renderUpdatedTime(product)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 pr-5 pl-3 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionSku(openActionSku === product.sku ? null : product.sku);
                        }}
                        className="p-1.5 rounded-lg border border-[#E5E0D8] bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#736B63] hover:text-[#292521] transition shadow-sm"
                        title="Actions"
                        aria-label="Product actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Popover */}
                      {openActionSku === product.sku && (
                        <div 
                          ref={actionMenuRef}
                          className="absolute right-5 mt-1 w-48 bg-white border border-[#E5E0D8] rounded-xl shadow-xl z-30 py-1.5 text-left animate-in fade-in zoom-in-95 duration-100 font-admin-body text-[13px]"
                        >
                          <button
                            onClick={() => handleOpenDetail(product)}
                            className="w-full px-3.5 py-2 text-[#292521] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition text-left"
                          >
                            <Eye className="w-4 h-4 text-[#736B63]" />
                            <span>View Specs</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="w-full px-3.5 py-2 text-[#292521] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition text-left"
                          >
                            <Edit3 className="w-4 h-4 text-[#736B63]" />
                            <span>Edit Piece</span>
                          </button>

                          {/* Quick Sold Action */}
                          {!stat.includes('sold') && (
                            <button
                              onClick={() => {
                                markProductSoldInShowroom(product.sku);
                                setOpenActionSku(null);
                              }}
                              className="w-full px-3.5 py-2 text-[#C24141] hover:bg-[#FDECEC] flex items-center gap-2.5 transition text-left font-medium"
                            >
                              <Store className="w-4 h-4" />
                              <span>Mark Sold at POS</span>
                            </button>
                          )}

                          {/* Release Reservation Action */}
                          {stat === 'reserved' && (
                            <button
                              onClick={() => {
                                releaseReservation(product.sku);
                                setOpenActionSku(null);
                              }}
                              className="w-full px-3.5 py-2 text-[#9A6700] hover:bg-[#FDF3DE] flex items-center gap-2.5 transition text-left font-medium"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Release Hold</span>
                            </button>
                          )}

                          <div className="border-t border-[#F0ECE6] my-1" />

                          <button
                            onClick={() => handleDeleteProduct(product.sku)}
                            className="w-full px-3.5 py-2 text-[#C24141] hover:bg-[#FDECEC] flex items-center gap-2.5 transition text-left font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Piece</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Empty state when no products match */}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E5E0D8] mx-auto flex items-center justify-center text-[#96702E]">
                        <Search className="w-5 h-5" />
                      </div>
                      <h4 className="font-admin-body text-[18px] sm:text-[20px] font-semibold text-[#292521]">
                        No Jewellery Items Found
                      </h4>
                      <p className="text-[13.5px] text-[#736B63]">
                        No products match your current search query or active filter combination.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('all');
                          setStatusFilter('all');
                          setUniqueFilter('all');
                          setAvailabilityFilter('all');
                        }}
                        className="px-4 py-2 rounded-lg bg-[#8D6725] text-white text-[13px] font-medium hover:bg-[#78551B] transition shadow-sm"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 4. PAGINATION FOOTER (Matches Reference Screenshot) ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Left: Product count text */}
        <div className="text-[13.5px] text-[#736B63]">
          Showing <span className="font-medium text-[#292521]">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-medium text-[#292521]">{endIndex}</span> of{' '}
          <span className="font-medium text-[#292521]">{totalItems}</span> products
        </div>

        {/* Right: Prev, Active Page, Next Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center transition shadow-sm ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed bg-white text-[#9CA3AF]'
                : 'bg-white hover:bg-[#FAF7F2] text-[#4A423A] cursor-pointer'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[32px] h-8 px-2.5 rounded-lg text-[13px] font-medium transition shadow-sm flex items-center justify-center ${
                  isActive
                    ? 'bg-[#8D6725] text-white shadow-[#8D6725]/20'
                    : 'bg-white border border-[#E2DCD2] text-[#4A423A] hover:bg-[#FAF7F2]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`w-8 h-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center transition shadow-sm ${
              currentPage === totalPages || totalPages === 0
                ? 'opacity-40 cursor-not-allowed bg-white text-[#9CA3AF]'
                : 'bg-white hover:bg-[#FAF7F2] text-[#4A423A] cursor-pointer'
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 5. ADD / EDIT PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-admin-body">
            {/* Modal Header */}
            <div className="bg-[#35151B] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Gem className="w-5 h-5 text-[#C49A45]" />
                <h3 className="font-admin-body font-semibold text-[20px] sm:text-[22px] text-white">
                  {editingProduct ? `Edit Piece — ${editingProduct.sku}` : 'Register New Jewellery Piece'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-[13.5px] text-[#292521]">
              {/* Notice Banner */}
              <div className="bg-[#F7F0E1] border border-[#E8DCBE] p-3 rounded-xl text-[#78551B] text-[12.5px] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-[#8D6725] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Showroom Guardrail:</strong> Unique 1-of-1 pieces are shielded with exclusive reservation locking to prevent concurrent customer claims.
                </div>
              </div>

              {/* Row 1: Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. Handcrafted Silver Anklet"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Subtitle / Craft Description
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. One of a kind • Handcrafted"
                  />
                </div>
              </div>

              {/* Row 2: SKU, Category & SubCategory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] font-admin-mono focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. SA-001"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#8D6725]/30"
                  >
                    <option value="Silver Jewellery">Silver Jewellery</option>
                    <option value="Gold Jewellery">Gold Jewellery</option>
                    <option value="Silver Articles">Silver Articles</option>
                    <option value="Temple Jewellery">Temple Jewellery</option>
                    <option value="Bridal Jewellery">Bridal Jewellery</option>
                    <option value="Coins & Bars">Coins & Bars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Purity / Fineness *
                  </label>
                  <input
                    type="text"
                    value={formData.purity}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#8D6725]/30"
                    placeholder="e.g. 925 Sterling Silver"
                  />
                </div>
              </div>

              {/* Row 3: Price, Status & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[14px] font-semibold text-[#8D6725] focus:outline-none focus:ring-2 focus:ring-[#8D6725]/30"
                    placeholder="12,800"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3 py-2 text-[13.5px] focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3 py-2 text-[13.5px] focus:outline-none"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Unique 1-of-1 item toggle */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[13.5px] text-[#292521] block">
                    ⭐ Unique (One-of-a-Kind Item)
                  </span>
                  <span className="text-[12px] text-[#736B63] block">
                    Blocks simultaneous holds across showroom POS and online storefront.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isUnique}
                    onChange={(e) => setFormData({ ...formData, isUnique: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8D6725]"></div>
                </label>
              </div>

              {/* Image Selector */}
              <div>
                <label className="block text-[12px] font-semibold text-[#4A423A] mb-1.5">
                  Jewellery Visual Image
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { path: '/images/product_anklet.jpg', label: 'Silver Anklet' },
                    { path: '/images/product_gold_chain.jpg', label: 'Gold Chain' },
                    { path: '/images/product_silver_bowl.jpg', label: 'Silver Bowl' },
                    { path: '/images/product_gold_earrings.jpg', label: 'Gold Earrings' },
                    { path: '/images/product_necklace.jpg', label: 'Temple Necklace' }
                  ].map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.path })}
                      className={`border-2 rounded-xl p-1 text-left transition overflow-hidden bg-[#221F1C] ${
                        formData.image === img.path ? 'border-[#8D6725] ring-2 ring-[#C49A45]/40' : 'border-[#E2DCD2]'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-14 object-cover rounded-lg" />
                      <span className="text-[10.5px] font-medium block truncate mt-1 text-center text-white">{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-[#EDE8E1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#E2DCD2] text-[#4A423A] hover:bg-[#FAF7F2] font-medium text-[13.5px] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#8D6725] hover:bg-[#78551B] text-white font-medium text-[13.5px] shadow-sm transition"
                >
                  {editingProduct ? 'Save Changes' : 'Register Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 6. PRODUCT DETAIL DRAWER ================= */}
      {isDetailDrawerOpen && selectedDetailProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FFFFFF] w-full max-w-md h-full shadow-2xl border-l border-[#EDE8E1] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 font-admin-body">
            {/* Drawer Header */}
            <div className="p-4 bg-[#35151B] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-[#C49A45]" />
                <span className="font-admin-body font-semibold text-[20px]">Piece Specifications</span>
              </div>
              <button 
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[13.5px]">
              <div className="rounded-xl overflow-hidden border border-[#EDE8E1] bg-[#1E1B18] shadow-sm">
                <img 
                  src={selectedDetailProduct.image} 
                  alt={selectedDetailProduct.name}
                  className="w-full h-56 object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-admin-mono font-medium bg-[#FAF7F2] border border-[#E2DCD2] text-[#8D6725] px-2 py-0.5 rounded">
                    {selectedDetailProduct.sku}
                  </span>
                  {selectedDetailProduct.isUnique && (
                    <span className="text-[11.5px] font-medium bg-[#F4EBD9] text-[#8D6725] px-2 py-0.5 rounded">
                      Unique Item
                    </span>
                  )}
                </div>
                <h3 className="font-admin-body font-semibold text-[20px] sm:text-[22px] text-[#292521] mt-1.5 leading-snug">
                  {selectedDetailProduct.name}
                </h3>
                <p className="text-[20px] font-semibold text-[#8D6725] mt-0.5 tabular-nums">
                  ₹ {renderPrice(selectedDetailProduct)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE8E1]">
                <div>
                  <span className="text-[12px] text-[#736B63] block">Category</span>
                  <span className="font-medium text-[#292521] text-[13.5px]">{selectedDetailProduct.category}</span>
                </div>
                <div>
                  <span className="text-[12px] text-[#736B63] block">Purity</span>
                  <span className="font-medium text-[#292521] text-[13.5px]">{selectedDetailProduct.purity || 'Hallmarked'}</span>
                </div>
                <div>
                  <span className="text-[12px] text-[#736B63] block">Gross Weight</span>
                  <span className="font-medium text-[#292521] text-[13.5px] font-admin-mono">{selectedDetailProduct.grossWeight || '45.00 g'}</span>
                </div>
                <div>
                  <span className="text-[12px] text-[#736B63] block">Status</span>
                  <span className="font-medium text-[#292521] text-[13.5px] capitalize">
                    {selectedDetailProduct.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#292521] text-[13px] mb-1">Showroom Location</h4>
                <p className="text-[#736B63] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE8E1] text-[13px]">
                  {selectedDetailProduct.location || 'Showroom Counter 3'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#292521] text-[13px] mb-1">Artisan Description</h4>
                <p className="text-[#736B63] leading-relaxed bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE8E1] text-[13px]">
                  {selectedDetailProduct.description || 'Authentic jewellery piece handcrafted with classical South-Indian silversmithing traditions.'}
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EDE8E1] flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  handleOpenEdit(selectedDetailProduct);
                }}
                className="px-4 py-2 rounded-lg bg-[#8D6725] text-white text-[13.5px] font-medium hover:bg-[#78551B] transition shadow-sm"
              >
                Edit Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Gem, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Lock, 
  Store, 
  Unlock, 
  Eye, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  X, 
  ShieldCheck, 
  Image as ImageIcon,
  Tag,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminProductsPage({
  isAddModalOpen = false,
  setIsAddModalOpen = () => {}
}) {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    markProductSoldInShowroom, 
    releaseReservation, 
    markProductUnavailable 
  } = useAdmin();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [uniqueFilter, setUniqueFilter] = useState('all'); // 'all' | 'unique_only' | 'standard_only'

  // Edit / Detail Drawer State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Silver',
    subCategory: 'Anklets & Kolusu',
    purity: '925 Sterling Silver',
    grossWeight: '45.00 g',
    netWeight: '45.00 g',
    price: '₹ 8,500',
    numericPrice: 8500,
    isPriceOnRequest: false,
    isUnique: true,
    status: 'available',
    image: '/images/product_anklet.jpg',
    isSampleImage: true,
    sampleImageNote: 'Sample reference photo — Handcrafted piece varies slightly in ghungroo engraving',
    description: '',
    hallmarkDetails: '925 Fineness Stamped (Sample / Subject to lab verification)',
    stockQty: 1,
    location: 'Showroom Counter 3'
  });

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.purity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesUnique = 
      uniqueFilter === 'all' || 
      (uniqueFilter === 'unique_only' && p.isUnique) || 
      (uniqueFilter === 'standard_only' && !p.isUnique);

    return matchesSearch && matchesCategory && matchesStatus && matchesUnique;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      sku: `VR-${selectedCategory !== 'all' ? selectedCategory.slice(0,3).toUpperCase() : 'JW'}-${Math.floor(100 + Math.random() * 899)}`,
      category: 'Silver',
      subCategory: 'Handcrafted Ornaments',
      purity: '925 Sterling Silver',
      grossWeight: '32.50 g',
      netWeight: '32.50 g',
      price: '₹ 6,800',
      numericPrice: 6800,
      isPriceOnRequest: false,
      isUnique: true,
      status: 'available',
      image: '/images/product_anklet.jpg',
      isSampleImage: true,
      sampleImageNote: 'Sample reference photo from showroom collection',
      description: 'Handcrafted authentic piece with traditional south-Indian artisan motifs.',
      hallmarkDetails: 'Showroom Benchmark (Editable field)',
      stockQty: 1,
      location: 'Showroom Main Floor'
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.sku, formData);
    } else {
      addProduct(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleViewDetail = (product) => {
    setSelectedDetailProduct(product);
    setIsDetailDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E3D9CC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-[#5C1D27] text-white rounded">
              Screen 2 • Inventory & Gallery
            </span>
            <span className="text-xs text-gray-500 font-medium">Multi-Channel Showroom Catalog</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1614] mt-1">
            Jewellery Stock & 1-of-1 Piece Registry
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Identify unique handcrafted creations vs repeatable stock, manage showroom availability, and prevent duplicate reservations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white text-xs font-semibold shadow flex items-center gap-2 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add New Jewellery Piece</span>
        </button>
      </div>

      {/* Filter Bar & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3D9CC] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU, product name, silver/gold purity or weight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="gold">Gold Jewellery</option>
              <option value="silver">Silver & Kolusu</option>
              <option value="bridal">Bridal Collections</option>
              <option value="coins & bars">Coins & Bars</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available (Online & Floor)</option>
              <option value="reserved">Reserved (Customer Hold)</option>
              <option value="sold_showroom">Sold in Showroom</option>
              <option value="sold_online">Sold Online</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* 1-of-1 Unique toggle */}
            <select
              value={uniqueFilter}
              onChange={(e) => setUniqueFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="unique_only">⭐ 1-of-1 Unique Only</option>
              <option value="standard_only">Repeatable Stock</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#EFE8DD] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow text-[#5C1D27]' : 'text-gray-500 hover:text-black'}`}
                title="Density Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow text-[#5C1D27]' : 'text-gray-500 hover:text-black'}`}
                title="Visual Card Gallery View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary Pill */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of {products.length} registered showroom items
          </span>
          <span className="italic text-gray-400">
            * Sample images are clearly labelled with reference disclaimers
          </span>
        </div>
      </div>

      {/* Main Content: Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-[#E3D9CC] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EFEB] text-[#4A3F39] border-b border-[#E3D9CC] font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Purity & Wt</th>
                  <th className="py-3 px-3">Display Price</th>
                  <th className="py-3 px-3">Stock Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Updated</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredProducts.map(product => {
                  let statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  let statusLabel = 'Available';

                  if (product.status === 'reserved') {
                    statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
                    statusLabel = 'Reserved (Hold)';
                  } else if (product.status === 'sold_showroom') {
                    statusBadgeClass = 'bg-rose-100 text-rose-800 border-rose-200';
                    statusLabel = 'Sold in Showroom';
                  } else if (product.status === 'sold_online') {
                    statusBadgeClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                    statusLabel = 'Sold Online';
                  } else if (product.status === 'unavailable') {
                    statusBadgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
                    statusLabel = 'Unavailable';
                  }

                  return (
                    <tr key={product.sku} className="hover:bg-[#FAF7F2] transition">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 group">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-200 shadow-sm" 
                            />
                            {product.isSampleImage && (
                              <span 
                                className="absolute -bottom-1 -right-1 bg-[#5C1D27] text-white text-[8px] px-1 py-0.2 rounded font-mono font-bold"
                                title={product.sampleImageNote || 'Sample reference image'}
                              >
                                SAMPLE
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <span className="font-mono text-[10px] font-bold text-[#5C1D27] bg-[#5C1D27]/10 px-1.5 py-0.5 rounded">
                              {product.sku}
                            </span>
                            <h4 
                              onClick={() => handleViewDetail(product)}
                              className="font-bold text-gray-900 truncate hover:text-[#5C1D27] cursor-pointer mt-0.5"
                            >
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 truncate">{product.location}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-gray-700 font-medium">
                        {product.category}
                        <span className="block text-[10px] text-gray-400 font-normal">{product.subCategory}</span>
                      </td>

                      {/* Purity & Weight */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-900">{product.purity}</span>
                        <span className="block text-[10px] text-gray-500 font-mono">Gross: {product.grossWeight}</span>
                      </td>

                      {/* Display Price */}
                      <td className="py-3 px-3 font-serif font-bold text-[#5C1D27]">
                        {product.price}
                      </td>

                      {/* Stock Type */}
                      <td className="py-3 px-3">
                        {product.isUnique ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FAF5EE] text-[#7A5B20] border border-[#C5A059] px-2 py-0.5 rounded-full">
                            <Gem className="w-3 h-3 text-[#C5A059]" /> 1-of-1 Unique
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">
                            Stock: {product.stockQty} pcs
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadgeClass}`}>
                          {statusLabel}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3 px-3 text-[11px] text-gray-500 whitespace-nowrap">
                        {product.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewDetail(product)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-[#EFE8DD] transition"
                            title="View full piece specs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#5C1D27] hover:bg-[#EFE8DD] transition"
                            title="Edit product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Quick Showroom Sold Action */}
                          {product.status !== 'sold_showroom' && (
                            <button
                              onClick={() => markProductSoldInShowroom(product.sku)}
                              className="px-2 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 text-[10px] font-bold transition"
                              title="Mark sold at showroom counter"
                            >
                              Mark Sold
                            </button>
                          )}

                          {/* Quick Release if reserved */}
                          {product.status === 'reserved' && (
                            <button
                              onClick={() => releaseReservation(product.sku)}
                              className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-[10px] font-bold transition"
                              title="Release hold back to available"
                            >
                              Release
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.sku}
              className="bg-white border border-[#E3D9CC] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-[#F4EFE6] overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="text-[10px] font-mono font-bold bg-[#1C1614]/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                      {product.sku}
                    </span>
                    {product.isUnique && (
                      <span className="text-[9px] font-bold bg-[#FAF5EE] text-[#7A5B20] border border-[#C5A059] px-2 py-0.5 rounded-full shadow-sm">
                        ⭐ 1-of-1 Handcrafted
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                      product.status === 'available' ? 'bg-emerald-600 text-white' :
                      product.status === 'reserved' ? 'bg-amber-600 text-white' :
                      'bg-rose-700 text-white'
                    }`}>
                      {product.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {product.isSampleImage && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-1 truncate">
                      Sample reference visual • Verify piece
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>{product.category} • {product.subCategory}</span>
                    <span className="font-mono">{product.grossWeight}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-[#5C1D27] cursor-pointer" onClick={() => handleViewDetail(product)}>
                    {product.name}
                  </h3>

                  <div className="flex items-baseline justify-between pt-1 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{product.purity}</span>
                    <span className="font-serif font-bold text-base text-[#5C1D27]">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#FAF7F2] border-t border-[#E8DFD3] flex items-center justify-between">
                <button
                  onClick={() => handleViewDetail(product)}
                  className="text-xs font-semibold text-[#5C1D27] hover:underline"
                >
                  View Details
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {product.status !== 'sold_showroom' && (
                    <button
                      onClick={() => markProductSoldInShowroom(product.sku)}
                      className="px-2.5 py-1 rounded-lg bg-rose-900 text-white hover:bg-rose-950 text-[10px] font-bold"
                    >
                      Sold in POS
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white border border-dashed border-[#D5C7B3] rounded-2xl p-12 text-center">
          <Gem className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <h4 className="font-serif font-bold text-base text-gray-800">No Matching Jewellery Found</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter selection.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setUniqueFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#5C1D27] text-white text-xs font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] border border-[#C5A059]/40 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#5C1D27] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Gem className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-lg text-white">
                  {editingProduct ? `Edit Piece — ${editingProduct.sku}` : 'Register New Jewellery Piece'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-[#2C2420]">
              {/* Top Banner Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Operational Rule:</strong> Hallmarks, certifications, and weights are editable catalog fields. Never invent binding certificates. Reused catalog photos are flagged with a sample indicator.
                </div>
              </div>

              {/* Grid 1: Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                    placeholder="e.g. Traditional Chettinad Silver Kolusu"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Inventory SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid 2: Category, Subcategory, Purity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Bridal">Bridal & Sets</option>
                    <option value="Coins & Bars">Coins & Bars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Material / Purity Grade *
                  </label>
                  <input
                    type="text"
                    value={formData.purity}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs focus:outline-none"
                    placeholder="e.g. 925 Sterling Silver / 22K 916"
                  />
                </div>
              </div>

              {/* Grid 3: Weights & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Gross Weight
                  </label>
                  <input
                    type="text"
                    value={formData.grossWeight}
                    onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                    placeholder="e.g. 84.50 g"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Net Metal Weight
                  </label>
                  <input
                    type="text"
                    value={formData.netWeight}
                    onChange={(e) => setFormData({ ...formData, netWeight: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                    placeholder="e.g. 84.50 g"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Display Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#5C1D27]"
                    placeholder="₹ 14,800"
                  />
                </div>
              </div>

              {/* 1-of-1 Unique piece toggle + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-[#F5EFEB] rounded-xl border border-[#E3D9CC]">
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isUnique}
                      onChange={(e) => setFormData({ ...formData, isUnique: e.target.checked })}
                      className="mt-1 text-[#5C1D27] rounded focus:ring-[#5C1D27]"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">
                        ⭐ 1-of-1 Handcrafted Unique Piece
                      </span>
                      <span className="text-[10px] text-gray-600 leading-snug block">
                        Enforces zero-duplicate guardrail: Only 1 customer can hold/reserve at a time.
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="available">Available (Showroom + Online)</option>
                    <option value="reserved">Reserved (Customer Hold)</option>
                    <option value="sold_showroom">Sold in Showroom</option>
                    <option value="unavailable">Unavailable (Vault Maintenance)</option>
                  </select>
                </div>
              </div>

              {/* Image Selector / Reused Asset Notice */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Sample / Reference Showroom Image
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { path: '/images/product_anklet.jpg', label: 'Silver Anklet' },
                    { path: '/images/product_necklace.jpg', label: 'Gold Necklace' },
                    { path: '/images/product_bangles.jpg', label: 'Gold Bangles' },
                    { path: '/images/col_silver.jpg', label: 'Silver Pooja' }
                  ].map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.path })}
                      className={`border-2 rounded-xl p-1 text-left transition overflow-hidden ${
                        formData.image === img.path ? 'border-[#5C1D27] ring-2 ring-[#C5A059]' : 'border-gray-200'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-16 object-cover rounded-lg" />
                      <span className="text-[9px] font-medium block truncate mt-1 text-center">{img.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sampleImgCheckbox"
                    checked={formData.isSampleImage}
                    onChange={(e) => setFormData({ ...formData, isSampleImage: e.target.checked })}
                    className="text-[#5C1D27] rounded"
                  />
                  <label htmlFor="sampleImgCheckbox" className="text-[11px] text-gray-600">
                    Tag as <strong>"Sample Reference Visual"</strong> (clearly notifies customer that actual handcrafted piece may have subtle artisan variations)
                  </label>
                </div>
              </div>

              {/* Hallmarking & Certification notes */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Purity Mark / Benchmark Inscription (Optional Staff Note)
                </label>
                <input
                  type="text"
                  value={formData.hallmarkDetails}
                  onChange={(e) => setFormData({ ...formData, hallmarkDetails: e.target.value })}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                  placeholder="e.g. 925 Stamped / BIS 916 Laser Mark"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Artisanal Craftsmanship Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl p-2.5 text-xs"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#E3D9CC] flex items-center justify-between">
                <span className="text-[10px] text-gray-500 italic">
                  Changes reflect instantly in showroom reservation engine
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white font-medium shadow"
                  >
                    {editingProduct ? 'Save Changes' : 'Register Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Drawer */}
      {isDetailDrawerOpen && selectedDetailProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] w-full max-w-md h-full shadow-2xl border-l border-[#C5A059]/40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-[#5C1D27] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-[#C5A059]" />
                <span className="font-serif font-bold text-sm">Piece Specifications</span>
              </div>
              <button 
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <img 
                src={selectedDetailProduct.image} 
                alt={selectedDetailProduct.name}
                className="w-full h-52 object-cover rounded-2xl border border-[#D5C7B3] shadow-sm"
              />

              {selectedDetailProduct.isSampleImage && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                  <strong>Sample Asset Disclaimer:</strong> {selectedDetailProduct.sampleImageNote}
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono uppercase bg-[#5C1D27] text-white px-2 py-0.5 rounded">
                  {selectedDetailProduct.sku}
                </span>
                <h3 className="font-serif font-bold text-base text-gray-900 mt-1">
                  {selectedDetailProduct.name}
                </h3>
                <p className="text-sm font-serif font-bold text-[#5C1D27] mt-0.5">
                  {selectedDetailProduct.price}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-[#E3D9CC]">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Purity</span>
                  <span className="font-bold text-gray-800">{selectedDetailProduct.purity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Gross Weight</span>
                  <span className="font-bold text-gray-800 font-mono">{selectedDetailProduct.grossWeight}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Status</span>
                  <span className="font-bold text-emerald-800 uppercase">{selectedDetailProduct.status.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Uniqueness</span>
                  <span className="font-bold text-[#7A5B20]">
                    {selectedDetailProduct.isUnique ? '1-of-1 Handcrafted' : 'Repeatable Stock'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-[11px] mb-1">Showroom Location / Safe</h4>
                <p className="text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                  {selectedDetailProduct.location}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-[11px] mb-1">Description</h4>
                <p className="text-gray-600 leading-relaxed bg-white p-2.5 rounded-xl border border-gray-200">
                  {selectedDetailProduct.description}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F5EFEB] border-t border-[#E3D9CC] flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  handleOpenEdit(selectedDetailProduct);
                }}
                className="px-4 py-2 rounded-xl bg-[#5C1D27] text-white text-xs font-semibold"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

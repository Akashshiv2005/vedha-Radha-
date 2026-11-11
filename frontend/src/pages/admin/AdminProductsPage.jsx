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
  Info,
  Upload,
  Loader2,
  ScanQrCode,
  Scale
} from 'lucide-react';
import QRScannerModal from '../../components/admin/QRScannerModal';
import { useAdmin } from '../../context/AdminContext';
import { productsClient } from '../../api/productsClient';
import { 
  JEWELLERY_CATEGORIES, 
  PRODUCT_TYPES, 
  getCategoriesForProductType, 
  getSubcategoriesForTypeAndCategory, 
  inferProductTypeFromCategory, 
  normalizeProductType 
} from '../../data/categoryData';

export default function AdminProductsPage({
  isAddModalOpen = false,
  setIsAddModalOpen = () => {},
  searchQuery: externalSearchQuery = '',
  setSearchQuery: setExternalSearchQuery = () => {}
}) {
  const { 
    products = [], 
    refreshProducts,
    addProduct, 
    updateProduct, 
    deleteProduct,
    deleteProducts,
    markProductSoldInShowroom, 
    releaseReservation,
    addToast
  } = useAdmin();

  // Synchronize inventory on mount
  useEffect(() => {
    if (typeof refreshProducts === 'function') {
      refreshProducts();
    }
  }, []);

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
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Row action menu dropdown state
  const [openActionSku, setOpenActionSku] = useState(null);
  const actionMenuRef = useRef(null);

  // Detail Drawer & Edit Modal State
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState(null);
  const [activeImageSlot, setActiveImageSlot] = useState(0);
  const fileInputSlot0Ref = useRef(null);
  const fileInputSlot1Ref = useRef(null);
  const fileInputSlot2Ref = useRef(null);
  const fileInputRefs = [fileInputSlot0Ref, fileInputSlot1Ref, fileInputSlot2Ref];

  // QR Scanner Modal State & Comparison Diff
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrComparisonDiff, setQrComparisonDiff] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    sku: '',
    qrCode: '',
    productType: 'Silver',
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
    images: ['/images/product_anklet.jpg'],
    description: '',
    hallmarkDetails: '925 Fineness Stamped',
    stockQty: 1,
    location: 'Showroom Counter 3 - Silver Section'
  });

  // 1. Available categories based on selected product type
  const availableCategories = useMemo(() => {
    if (!formData.productType) return [];
    return getCategoriesForProductType(formData.productType);
  }, [formData.productType]);

  // 2. Available subcategories based on selected product type & jewellery category
  const availableSubcategories = useMemo(() => {
    if (!formData.category) return [];
    return getSubcategoriesForTypeAndCategory(formData.productType, formData.category);
  }, [formData.productType, formData.category]);

  // Handle Product Type change (First Dropdown): clears category and subcategory, sets default purity
  const handleProductTypeChange = (e) => {
    const nextType = e.target.value;
    let nextPurity = formData.purity;
    if (nextType === 'Gold') {
      nextPurity = '22K 916 BIS Hallmarked';
    } else if (nextType === 'Silver') {
      nextPurity = '925 Sterling Silver';
    } else if (nextType === 'Coins & Bars') {
      nextPurity = '24K 999 Pure Gold';
    }

    setFormData(prev => ({
      ...prev,
      productType: nextType,
      category: '',
      subCategory: '',
      purity: nextPurity
    }));
  };

  // Handle Jewellery Category change (Second Dropdown): clears subcategory, sets category default purity
  const handleJewelleryCategoryChange = (e) => {
    const nextCategory = e.target.value;
    const catConfig = availableCategories.find(c => c.name.toLowerCase() === nextCategory.toLowerCase());

    let nextPurity = formData.purity;
    if (catConfig && catConfig.defaultPurity) {
      nextPurity = catConfig.defaultPurity;
    }

    setFormData(prev => ({
      ...prev,
      category: nextCategory,
      subCategory: '',
      purity: nextPurity
    }));
  };

  // Handle Subcategory / Style change (Third Dropdown)
  const handleSubCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      subCategory: e.target.value
    }));
  };

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
        const matchesSubCategory = (p.subCategory || p.sub_category || '').toLowerCase().includes(query);
        const matchesSubtitle = (p.subtitle || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesCategory && !matchesSubCategory && !matchesSubtitle) {
          return false;
        }
      }

      // 2. Category Filter
      if (categoryFilter !== 'all') {
        const cat = (p.category || '').toLowerCase();
        const pt = (p.productType || p.product_type || '').toLowerCase();
        const goldStorefront = [
          'earrings', 'rings', 'bangle & bracelets', 'bangles', 'necklace', 'necklaces',
          'nosepin', 'occasion', 'chains', 'pendant', 'pendants', 'anklets', 'toe rings'
        ];
        if (categoryFilter === 'gold' && !(pt === 'gold' || cat.includes('gold') || goldStorefront.includes(cat))) return false;
        if (categoryFilter === 'silver_jewellery' && !(pt === 'silver' || (cat.includes('silver') && cat.includes('jewel')))) return false;
        if (categoryFilter === 'silver_articles' && !(cat.includes('silver') && (cat.includes('article') || cat.includes('pooja') || cat.includes('utensil')))) return false;
        if (categoryFilter === 'temple' && !cat.includes('temple')) return false;
        if (categoryFilter === 'bridal' && !cat.includes('bridal')) return false;
        if (categoryFilter === 'coins' && !(pt.includes('coin') || pt.includes('bar') || cat.includes('coin') || cat.includes('bar'))) return false;
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
    setQrComparisonDiff(null);
    setFormData({
      name: '',
      subtitle: 'One of a kind • Handcrafted',
      sku: `SA-${Math.floor(100 + Math.random() * 899)}`,
      qrCode: '',
      productType: 'Silver',
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
      images: ['/images/product_anklet.jpg'],
      description: 'Traditional handcrafted piece sculpted by master artisans for the authentic showroom gallery.',
      hallmarkDetails: '925 Fineness Stamped',
      stockQty: 1,
      location: 'Showroom Counter 3 - Silver Section'
    });
    setEditingProduct(null);
    setActiveImageSlot(0);
    setIsAddModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEdit = (product, retainDiff = false) => {
    if (!retainDiff) {
      setQrComparisonDiff(null);
    }
    const inferredType = product.productType || 
      normalizeProductType(product.product_type) || 
      inferProductTypeFromCategory(product.category);

    const initialImages = (Array.isArray(product.images) && product.images.length > 0)
      ? product.images.filter(img => typeof img === 'string' && img.trim().length > 0).slice(0, 3)
      : (product.image ? [product.image] : ['/images/neutral_product_placeholder.svg']);

    setEditingProduct(product);
    setFormData({
      ...product,
      qrCode: product.qrCode || product.qr_code || product.sku || '',
      grossWeight: product.grossWeight || product.gross_weight || '',
      netWeight: product.netWeight || product.net_weight || '',
      hallmarkDetails: product.hallmarkDetails || product.hallmark_details || '',
      location: product.location || '',
      productType: inferredType,
      category: product.category || '',
      subCategory: product.subCategory || product.sub_category || '',
      purity: product.purity || '',
      price: product.price ? String(product.price).replace(/[^0-9,]/g, '') : '',
      numericPrice: product.numericPrice || 0,
      images: initialImages,
      image: initialImages[0] || '/images/neutral_product_placeholder.svg'
    });
    setOpenActionSku(null);
    setActiveImageSlot(0);
    setIsAddModalOpen(true);
  };

  // QR Scan Handler: Identifies Product in PostgreSQL or Pre-populates Registration
  const handleQRScanSuccess = async (parsedData, rawPayload, preFetchedProduct = undefined) => {
    if (!parsedData || (!parsedData.sku && !parsedData.productCode)) {
      addToast('Invalid QR Code', 'No valid product identifier found in scanned payload.', 'danger');
      return;
    }

    const targetCode = (parsedData.sku || parsedData.productCode).trim();

    try {
      // 1. Search PostgreSQL by SKU or QR identifier (use pre-fetched product if available)
      const existing = preFetchedProduct !== undefined ? preFetchedProduct : await productsClient.getProduct(targetCode);

      if (existing) {
        // CASE A: EXISTING PRODUCT FOUND
        const diffs = [];
        const existingWeight = existing.grossWeight || existing.gross_weight;
        const scannedGrossWeight = parsedData.gross_weight || parsedData.grossWeight;
        if (scannedGrossWeight && existingWeight && scannedGrossWeight.trim() !== existingWeight.trim()) {
          diffs.push({
            field: 'grossWeight',
            label: 'Gross Weight',
            current: existingWeight,
            scanned: scannedGrossWeight
          });
        }
        if (parsedData.purity && existing.purity && parsedData.purity.toLowerCase() !== existing.purity.toLowerCase()) {
          diffs.push({
            field: 'purity',
            label: 'Purity / Fineness',
            current: existing.purity,
            scanned: parsedData.purity
          });
        }
        if (parsedData.rate && existing.price && Number(parsedData.rate) !== Number(existing.price)) {
          diffs.push({
            field: 'rate',
            label: 'Scanned Tag Rate vs System Price',
            current: `₹${Number(existing.price).toLocaleString('en-IN')}`,
            scanned: `₹${Number(parsedData.rate).toLocaleString('en-IN')}`
          });
        }

        setQrComparisonDiff({
          existing,
          scanned: parsedData,
          diffs,
          rawPayload
        });

        // Open edit form for existing piece
        handleOpenEdit(existing, true);

        // Populate qrCode if empty
        setFormData(prev => ({
          ...prev,
          qrCode: existing.qrCode || existing.qr_code || targetCode
        }));

        addToast(
          'Product Identified',
          `Found "${existing.name}" (${existing.sku}) in PostgreSQL. Form populated for verification.`,
          'info'
        );
      } else {
        // CASE B: NEW PRODUCT REGISTRATION
        setQrComparisonDiff(null);
        setEditingProduct(null);

        const inferredType = parsedData.productType || parsedData.product_type || (parsedData.category && parsedData.category.toLowerCase().includes('gold') ? 'Gold' : 'Silver');
        const inferredCategory = parsedData.category || (inferredType === 'Gold' ? 'Earrings' : 'Silver Jewellery');
        const defaultSubs = getSubcategoriesForTypeAndCategory(inferredType, inferredCategory);
        const sub = defaultSubs[0] || '';

        const scannedGrossWeight = parsedData.gross_weight || parsedData.grossWeight || '';
        const scannedNetWeight = parsedData.net_weight || parsedData.netWeight || scannedGrossWeight;

        setFormData({
          name: parsedData.description || '',
          subtitle: parsedData.description ? `${parsedData.description} • Handcrafted` : 'One of a kind • Handcrafted',
          sku: targetCode,
          qrCode: targetCode,
          productType: inferredType,
          category: inferredCategory,
          subCategory: sub,
          purity: parsedData.purity || '',
          grossWeight: scannedGrossWeight,
          netWeight: scannedNetWeight,
          price: parsedData.rate ? String(parsedData.rate) : '0',
          numericPrice: parsedData.rate || 0,
          isUnique: true,
          status: 'available',
          availability: 'in_stock',
          image: '/images/neutral_product_placeholder.svg',
          images: ['/images/neutral_product_placeholder.svg'],
          description: parsedData.description
            ? `${parsedData.description} - Tag code ${targetCode}.`
            : `Authentic handcrafted jewellery piece tagged under code ${targetCode}.`,
          hallmarkDetails: parsedData.hallmarkDetails || parsedData.hallmark_details || (parsedData.brand ? `${parsedData.brand} BIS Hallmarked` : ''),
          stockQty: parsedData.quantity || 1,
          location: ''
        });

        setActiveImageSlot(0);
        setIsAddModalOpen(true);

        addToast(
          'New Jewellery Piece',
          `Tag code ${targetCode} is ready for registration. Complete required fields and confirm.`,
          'info'
        );
      }
    } catch (err) {
      console.error('Error during QR product lookup:', err);
      addToast('Lookup Failed', 'Error connecting to database to verify scanned code.', 'danger');
    }
  };

  // Open View Details Drawer
  const handleOpenDetail = (product) => {
    setSelectedDetailProduct(product);
    setOpenActionSku(null);
    setIsDetailDrawerOpen(true);
  };

  // MinIO Multi-Image Upload Handler (Slot-targeted, max 3 images total)
  const handleImageUpload = async (e, slotIndex = 0) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const lowerName = (file.name || '').toLowerCase();
    const hasValidExt = validExts.some(ext => lowerName.endsWith(ext));
    if (!hasValidExt) {
      addToast('Invalid Image', 'Please upload a JPEG, PNG, or WebP image.', 'warning');
      return;
    }

    // Check size limit: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      addToast('Upload Rejected', 'Image exceeds maximum allowed size of 5 MB.', 'warning');
      return;
    }

    setUploadingSlotIndex(slotIndex);
    try {
      const res = await productsClient.uploadImage(file);
      if (res.success) {
        setFormData(prev => {
          const current = [...(prev.images || [])];
          if (slotIndex >= current.length) {
            current.push(res.imageUrl);
          } else {
            current[slotIndex] = res.imageUrl;
          }
          const capped = current.slice(0, 3);
          return {
            ...prev,
            images: capped,
            image: capped[0] || res.imageUrl,
            image_url: capped[0] || res.objectKey
          };
        });
        addToast('Photo Uploaded', `Slot ${slotIndex + 1} image safely stored in MinIO storage.`, 'success');
      } else {
        addToast('Upload Failed', res.error || 'Failed to upload photo to MinIO.', 'danger');
      }
    } catch (err) {
      addToast('Upload Error', 'Network error during image upload.', 'danger');
    } finally {
      setUploadingSlotIndex(null);
      if (fileInputRefs[slotIndex]?.current) {
        fileInputRefs[slotIndex].current.value = '';
      }
    }
  };

  // Remove specific image slot
  const handleRemoveImageSlot = (slotIndex) => {
    setFormData(prev => {
      const updated = (prev.images || []).filter((_, idx) => idx !== slotIndex);
      return {
        ...prev,
        images: updated,
        image: updated[0] || '/images/neutral_product_placeholder.svg',
        image_url: updated[0] || '/images/neutral_product_placeholder.svg'
      };
    });
  };

  // Set catalog preset for a slot
  const handleSelectPresetForSlot = (presetPath, slotIndex) => {
    setFormData(prev => {
      const current = [...(prev.images || [])];
      if (slotIndex >= current.length) {
        current.push(presetPath);
      } else {
        current[slotIndex] = presetPath;
      }
      const capped = current.slice(0, 3);
      return {
        ...prev,
        images: capped,
        image: capped[0] || presetPath,
        image_url: capped[0] || presetPath
      };
    });
  };

  // Form Submit (Add or Edit) with strict 3-image validation and DB synchronization
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const cleanNumeric = parseInt(String(formData.price).replace(/[^0-9]/g, ''), 10) || 0;

    // Verify subcategory compatibility before submit
    const currentAllowedSubs = getSubcategoriesForTypeAndCategory(formData.productType, formData.category);
    let validSubCategory = formData.subCategory ? formData.subCategory.trim() : null;
    if (validSubCategory && currentAllowedSubs.length > 0 && !currentAllowedSubs.some(s => s.toLowerCase() === validSubCategory.toLowerCase())) {
      validSubCategory = null;
    }

    const resolvedProductType = formData.productType || inferProductTypeFromCategory(formData.category);

    // Filter and strictly cap images at 3
    const cleanImages = (formData.images || [])
      .filter(img => typeof img === 'string' && img.trim().length > 0)
      .slice(0, 3);

    if (cleanImages.length === 0) {
      cleanImages.push(formData.image || '/images/neutral_product_placeholder.svg');
    }

    const productPayload = {
      ...formData,
      productType: resolvedProductType,
      product_type: resolvedProductType,
      category: formData.category ? formData.category.trim() : '',
      subCategory: validSubCategory,
      sub_category: validSubCategory,
      qr_code: formData.qrCode ? formData.qrCode.trim() : (formData.sku ? formData.sku.trim() : null),
      qrCode: formData.qrCode ? formData.qrCode.trim() : (formData.sku ? formData.sku.trim() : null),
      gross_weight: formData.grossWeight ? formData.grossWeight.trim() : null,
      grossWeight: formData.grossWeight ? formData.grossWeight.trim() : null,
      net_weight: formData.netWeight ? formData.netWeight.trim() : null,
      netWeight: formData.netWeight ? formData.netWeight.trim() : null,
      hallmark_details: formData.hallmarkDetails ? formData.hallmarkDetails.trim() : null,
      hallmarkDetails: formData.hallmarkDetails ? formData.hallmarkDetails.trim() : null,
      location: formData.location ? formData.location.trim() : null,
      images: cleanImages,
      image: cleanImages[0],
      image_url: cleanImages[0],
      price: cleanNumeric,
      numericPrice: cleanNumeric,
      updatedDate: 'Today',
      updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdated: `Today\n${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.sku, productPayload);
      if (res?.success) {
        setQrComparisonDiff(null);
        setIsAddModalOpen(false);
      }
    } else {
      const res = await addProduct(productPayload);
      if (res?.success) {
        setQrComparisonDiff(null);
        setIsAddModalOpen(false);
      }
    }
  };

  // Quick action: Delete product
  const handleDeleteProduct = async (sku) => {
    if (window.confirm(`Are you sure you want to remove product ${sku} from the inventory?`)) {
      setOpenActionSku(null);
      await deleteProduct(sku);
    }
  };

  // Batch action: Delete selected products
  const handleDeleteSelected = async () => {
    if (selectedSkus.length === 0) return;
    const count = selectedSkus.length;
    if (window.confirm(`Are you sure you want to remove ${count} selected product${count > 1 ? 's' : ''} from the inventory?`)) {
      setIsDeletingSelected(true);
      try {
        if (typeof deleteProducts === 'function') {
          await deleteProducts(selectedSkus);
        } else {
          for (const sku of selectedSkus) {
            await deleteProduct(sku);
          }
        }
        setSelectedSkus([]);
      } finally {
        setIsDeletingSelected(false);
      }
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
              <span className="font-semibold text-[#292521]">Unique item reserved - </span>
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

        {/* Actions aligned directly on the right */}
        <div className="flex-shrink-0 self-end flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQRScannerOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-[#8D6725] text-[#8D6725] hover:bg-[#8D6725]/10 active:bg-[#8D6725]/20 text-[14px] font-semibold font-admin-body shadow-2xs flex items-center justify-center gap-1.5 transition duration-150 h-[38px] whitespace-nowrap cursor-pointer"
            title="Scan jewellery tag QR code with camera"
          >
            <ScanQrCode className="w-4 h-4 stroke-[2.2]" />
            <span>Scan QR Code</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 rounded-lg bg-[#8D6725] hover:bg-[#78551B] active:bg-[#684914] text-white text-[14px] font-semibold font-admin-body shadow-2xs flex items-center justify-center gap-1.5 transition duration-150 h-[38px] whitespace-nowrap cursor-pointer"
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
              disabled={isDeletingSelected}
              className="text-[12.5px] text-[#736B63] hover:text-[#292521] px-2.5 py-1 rounded transition disabled:opacity-50 cursor-pointer"
            >
              Deselect All
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={isDeletingSelected}
              className="px-3 py-1.5 rounded-lg bg-[#C24141] hover:bg-[#A83232] active:bg-[#8F2828] text-white text-[12.5px] font-medium font-admin-body shadow-2xs flex items-center justify-center gap-1.5 transition duration-150 disabled:opacity-50 cursor-pointer"
              title="Delete selected products"
            >
              {isDeletingSelected ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Delete</span>
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
                const isInactive = product.is_active === false || product.isActive === false;
                let statusBadge = null;

                if (isInactive || stat === 'unavailable' || stat === 'archived' || stat === 'deleted') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#F1F3F4] text-[#5F6368] border border-[#DADCE0] whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5F6368]" />
                      <span>Unavailable</span>
                    </span>
                  );
                } else if (stat === 'reserved') {
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
                              e.target.src = '/images/neutral_product_placeholder.svg';
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
                  {editingProduct ? `Edit Piece - ${editingProduct.sku}` : 'Register New Jewellery Piece'}
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

              {/* QR Tag Verification & Comparison Banner (Case A) */}
              {qrComparisonDiff && editingProduct && (
                <div className="bg-[#FAF7F2] border border-[#C49A45] rounded-xl p-3.5 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScanQrCode className="w-4 h-4 text-[#8D6725]" />
                      <span className="text-[13px] font-bold text-[#78551B]">
                        QR Scanned Tag Verification
                      </span>
                    </div>
                    <span className="text-[11px] font-admin-mono px-2 py-0.5 rounded bg-[#8D6725]/15 text-[#78551B] font-semibold border border-[#8D6725]/30">
                      Tag: {qrComparisonDiff.scanned?.sku || qrComparisonDiff.scanned?.productCode}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#4A423A] leading-relaxed">
                    Identified matching product in PostgreSQL. Review current database specifications against the scanned jewellery tag below.
                  </p>
                  {qrComparisonDiff.diffs?.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-[#8D6725] uppercase tracking-wider block">
                        Detected Discrepancies:
                      </span>
                      {qrComparisonDiff.diffs.map((d, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] text-[12px] flex items-center justify-between shadow-2xs">
                          <div>
                            <span className="font-semibold text-[#292521]">{d.label}: </span>
                            <span className="text-[#C24141] line-through mr-2 font-admin-mono">{d.current}</span>
                            <span className="text-[#2E7D32] font-semibold font-admin-mono">Tag: {d.scanned}</span>
                          </div>
                          {d.field === 'grossWeight' && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, grossWeight: d.scanned, netWeight: d.scanned }))}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#8D6725]/10 text-[#8D6725] hover:bg-[#8D6725]/20 cursor-pointer"
                            >
                              Apply Tag Weight
                            </button>
                          )}
                          {d.field === 'purity' && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, purity: d.scanned }))}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#8D6725]/10 text-[#8D6725] hover:bg-[#8D6725]/20 cursor-pointer"
                            >
                              Apply Tag Purity
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11.5px] text-[#2E7D32] flex items-center gap-1.5 pt-1 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Physical jewellery tag matches current PostgreSQL database specifications.</span>
                    </div>
                  )}
                </div>
              )}

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

              {/* Row 2: SKU, Product Type (Dropdown 1) & Purity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[12px] font-semibold text-[#4A423A]">
                      SKU Code *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsQRScannerOpen(true)}
                      className="text-[11px] text-[#8D6725] hover:text-[#78551B] font-semibold flex items-center gap-1 cursor-pointer"
                      title="Scan QR Code to auto-fill"
                    >
                      <ScanQrCode className="w-3 h-3" />
                      <span>Scan QR</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value, qrCode: formData.qrCode || e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] font-admin-mono focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. SA-001"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Product Type *
                  </label>
                  <select
                    value={formData.productType || ''}
                    onChange={handleProductTypeChange}
                    required
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#8D6725]/30 cursor-pointer"
                  >
                    <option value="" disabled>Select Product Type</option>
                    {PRODUCT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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

              {/* Row 2b: Jewellery Category (Dropdown 2) & Subcategory / Style (Dropdown 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Jewellery Category *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={handleJewelleryCategoryChange}
                    required
                    disabled={!formData.productType}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#8D6725]/30 disabled:bg-[#FAF7F2] disabled:text-[#9CA3AF] disabled:cursor-not-allowed cursor-pointer"
                  >
                    <option value="" disabled>
                      {formData.productType ? 'Select Category' : 'Select product type first'}
                    </option>
                    {availableCategories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                    {/* Preserve custom / previous category if editing legacy product */}
                    {formData.category && !availableCategories.some(c => c.name.toLowerCase() === formData.category.toLowerCase()) && (
                      <option value={formData.category}>{formData.category}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Subcategory / Style
                  </label>
                  <select
                    value={formData.subCategory || ''}
                    onChange={handleSubCategoryChange}
                    disabled={!formData.category || availableSubcategories.length === 0}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#8D6725]/30 disabled:bg-[#FAF7F2] disabled:text-[#9CA3AF] disabled:cursor-not-allowed cursor-pointer"
                  >
                    <option value="">
                      {!formData.category 
                        ? 'Select category first' 
                        : availableSubcategories.length === 0 
                          ? 'No subcategories (optional)' 
                          : 'Select subcategory / style (optional)'}
                    </option>
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    {/* Preserve custom / previous subcategory if editing legacy product */}
                    {formData.subCategory && !availableSubcategories.some(s => s.toLowerCase() === formData.subCategory.toLowerCase()) && (
                      <option value={formData.subCategory}>{formData.subCategory}</option>
                    )}
                  </select>
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

              {/* Row 4b: Weight & Hallmark Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Gross Weight
                  </label>
                  <input
                    type="text"
                    value={formData.grossWeight || ''}
                    onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] font-admin-mono focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. 15.350 g"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Net Weight
                  </label>
                  <input
                    type="text"
                    value={formData.netWeight || ''}
                    onChange={(e) => setFormData({ ...formData, netWeight: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] font-admin-mono focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. 15.350 g"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Hallmark Inscription
                  </label>
                  <input
                    type="text"
                    value={formData.hallmarkDetails || ''}
                    onChange={(e) => setFormData({ ...formData, hallmarkDetails: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. VRTM 925 BIS Hallmarked"
                  />
                </div>
              </div>

              {/* Row 4c: QR Tag Identifier & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    QR Tag Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.qrCode || ''}
                    onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] font-admin-mono focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. 26FPC25G23"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                    Showroom Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none"
                    placeholder="e.g. Showroom Counter 3 - Silver Section"
                  />
                </div>
              </div>

              {/* Product Visual Images: Maximum 3 Ordered Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#4A423A]">
                      Product Visual Images (Up to 3 Slots) *
                    </label>
                    <span className="text-[11px] text-[#736B63] block">
                      Slot 1 is the primary cover image across homepage and search. Slot 2 &amp; 3 are detail perspectives.
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#8D6725] bg-[#F4EBD9] px-2 py-0.5 rounded-full border border-[#DECDBB]">
                    {(formData.images || []).length} / 3 Uploaded
                  </span>
                </div>

                {/* 3 Dedicated Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {[0, 1, 2].map((slotIdx) => {
                    const slotImg = formData.images?.[slotIdx];
                    const isUploadingThisSlot = uploadingSlotIndex === slotIdx;
                    const slotLabels = [
                      'Slot 1 • Cover / Primary',
                      'Slot 2 • Side / Angle',
                      'Slot 3 • Detail / Hallmark'
                    ];

                    return (
                      <div 
                        key={slotIdx}
                        className={`border rounded-xl p-2.5 flex flex-col justify-between transition-all ${
                          activeImageSlot === slotIdx 
                            ? 'bg-[#FAF7F2] border-[#8D6725] ring-1 ring-[#8D6725]/30' 
                            : 'bg-[#FFFFFF] border-[#E2DCD2]'
                        }`}
                        onClick={() => setActiveImageSlot(slotIdx)}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[11px] font-bold ${slotIdx === 0 ? 'text-[#8D6725]' : 'text-[#736B63]'}`}>
                            {slotLabels[slotIdx]}
                          </span>
                          {slotImg && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImageSlot(slotIdx);
                              }}
                              className="text-[#991B1B] hover:text-[#DC2626] p-1 rounded hover:bg-[#FEE2E2] transition cursor-pointer"
                              title={`Remove Slot ${slotIdx + 1} image`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Image Preview or Upload Placeholder */}
                        {slotImg ? (
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#221F1C] border border-[#E8DCBE] mb-2 flex items-center justify-center group">
                            <img 
                              src={slotImg} 
                              alt={`Slot ${slotIdx + 1} piece`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/neutral_product_placeholder.svg';
                              }}
                            />
                            {slotIdx === 0 && (
                              <span className="absolute bottom-1.5 left-1.5 bg-[#8D6725]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                                Primary Cover
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-square w-full rounded-lg border-2 border-dashed border-[#D8CBB8] bg-[#FAF7F2] flex flex-col items-center justify-center p-3 text-center mb-2">
                            <Upload className="w-5 h-5 text-[#8D6725]/70 mb-1" />
                            <span className="text-[11px] font-semibold text-[#4A423A]">Empty Slot</span>
                            <span className="text-[9.5px] text-[#736B63] mt-0.5">JPEG, PNG, WebP &le; 5MB</span>
                          </div>
                        )}

                        {/* Slot Action Button */}
                        <div className="flex items-center gap-1.5">
                          <label className={`w-full py-1.5 px-2 rounded-lg text-center text-[11.5px] font-medium cursor-pointer transition flex items-center justify-center gap-1.5 ${
                            slotImg 
                              ? 'bg-[#F4EBD9] text-[#8D6725] hover:bg-[#EBDDC5] border border-[#DECDBB]' 
                              : 'bg-[#8D6725] text-white hover:bg-[#78551B] shadow-2xs'
                          }`}>
                            {isUploadingThisSlot ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
                            ) : (
                              <Upload className="w-3 h-3 text-current" />
                            )}
                            <span>{isUploadingThisSlot ? 'Uploading...' : slotImg ? 'Replace Image' : 'Upload Image'}</span>
                            <input
                              ref={fileInputRefs[slotIdx]}
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              onChange={(e) => handleImageUpload(e, slotIdx)}
                              disabled={isUploadingThisSlot}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Showroom Catalog Presets */}
                <div className="pt-2 border-t border-[#EDE8E1]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-[#736B63]">
                      Or choose showroom catalog preset for <strong className="text-[#8D6725]">Slot {activeImageSlot + 1}</strong>:
                    </span>
                  </div>
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
                        onClick={() => handleSelectPresetForSlot(img.path, activeImageSlot)}
                        className={`border rounded-lg p-1 text-left transition overflow-hidden bg-[#221F1C] cursor-pointer hover:border-[#8D6725] ${
                          formData.images?.[activeImageSlot] === img.path ? 'border-[#8D6725] ring-2 ring-[#8D6725]/40' : 'border-[#E2DCD2]'
                        }`}
                        title={`Assign ${img.label} to Slot ${activeImageSlot + 1}`}
                      >
                        <img src={img.path} alt={img.label} className="w-full h-12 object-cover rounded" />
                        <span className="text-[10px] font-medium block truncate mt-0.5 text-center text-white">{img.label}</span>
                      </button>
                    ))}
                  </div>
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
                  src={selectedDetailProduct.images?.[activeImageSlot] || selectedDetailProduct.image} 
                  alt={selectedDetailProduct.name}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/neutral_product_placeholder.svg';
                  }}
                />
              </div>
              {Array.isArray(selectedDetailProduct.images) && selectedDetailProduct.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {selectedDetailProduct.images.slice(0, 3).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageSlot(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 p-0.5 bg-[#221F1C] cursor-pointer transition ${
                        (selectedDetailProduct.images?.[activeImageSlot] || selectedDetailProduct.image) === img
                          ? 'border-[#8D6725] ring-2 ring-[#8D6725]/30'
                          : 'border-[#E2DCD2] opacity-75 hover:opacity-100'
                      }`}
                      title={`View Angle ${idx + 1}`}
                    >
                      <img 
                        src={img} 
                        alt={`View ${idx + 1}`} 
                        className="w-full h-full object-cover rounded" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/neutral_product_placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

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

      {/* ================= 7. QR CODE SCANNER MODAL ================= */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </div>
  );
}

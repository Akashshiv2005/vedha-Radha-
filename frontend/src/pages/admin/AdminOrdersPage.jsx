import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  RotateCw, 
  MoreVertical, 
  Clock, 
  Lock, 
  Settings as SettingsIcon, 
  Truck, 
  Store, 
  Globe, 
  Phone, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  ArrowUpDown,
  Download,
  Share2,
  FileText,
  Sparkles,
  Hourglass,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOrdersPage({
  onOpenSimulateReservation = () => {}
}) {
  const { 
    orders = [], 
    products = [],
    confirmReservation, 
    rejectReservation, 
    extendHold, 
    convertReservationToOrder, 
    updateOrderStatus, 
    updateTracking, 
    createReservation,
    createOrder,
    refreshOrders,
    addToast
  } = useAdmin();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState('receivedAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals & Drawers
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [extendHoldOrder, setExtendHoldOrder] = useState(null);
  const [extendHours, setExtendHours] = useState(24);

  // Row dropdown popover
  const [openRowActionId, setOpenRowActionId] = useState(null);
  const rowActionRef = useRef(null);
  const moreActionsRef = useRef(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rowActionRef.current && !rowActionRef.current.contains(e.target)) {
        setOpenRowActionId(null);
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target)) {
        setIsMoreActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form State for New Reservation
  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: 'Madurai',
    channel: 'Showroom',
    productSku: products[0]?.sku || 'DR-0018',
    holdHours: 24,
    notes: 'In-store customer visit requested.'
  });

  // Form State for Create Order
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    productSku: '',
    quantity: 1,
    discount: 0,
    channel: 'Showroom',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    city: 'Madurai',
    notes: ''
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderFormError, setOrderFormError] = useState(null);

  // Selected product in create order modal
  const selectedOrderProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    return products.find(p => p.sku === orderForm.productSku) || products[0];
  }, [products, orderForm.productSku]);

  // Pricing calculations for the Create Order form
  const orderPricing = useMemo(() => {
    const rawPrice = selectedOrderProduct?.numericPrice ?? selectedOrderProduct?.price ?? 0;
    const unitPrice = typeof rawPrice === 'number' 
      ? rawPrice 
      : (parseInt(String(rawPrice).replace(/[^0-9]/g, ''), 10) || 0);
    const quantity = Math.max(1, parseInt(orderForm.quantity, 10) || 1);
    const subtotal = unitPrice * quantity;
    const discount = Math.max(0, parseFloat(orderForm.discount) || 0);
    const tax = Math.round(subtotal * 0.03); // standard 3% jewellery GST
    const totalAmount = Math.max(0, subtotal - discount + tax);
    return { unitPrice, quantity, subtotal, discount, tax, totalAmount };
  }, [selectedOrderProduct, orderForm.quantity, orderForm.discount]);

  // KPI Calculations
  const kpiCounts = useMemo(() => {
    let awaiting = 0;
    let holds = 0;
    let processing = 0;
    let dispatch = 0;

    orders.forEach(o => {
      const s = (o.status || o.orderStatus || '').toLowerCase();
      if (s === 'awaiting_confirmation') awaiting++;
      else if (s === 'reserved') holds++;
      else if (s === 'processing' || s === 'confirmed') processing++;
      else if (s === 'dispatched' || s === 'dispatch_ready') dispatch++;
    });

    return {
      awaiting: awaiting,
      holds: holds,
      processing: processing,
      dispatch: dispatch
    };
  }, [orders]);

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (order.customerName || '').toLowerCase().includes(q);
        const matchesOrder = (order.orderNumber || order.id || '').toLowerCase().includes(q);
        const matchesSku = (order.productSku || '').toLowerCase().includes(q);
        const matchesPiece = (order.productName || '').toLowerCase().includes(q);
        const matchesPhone = (order.phone || '').includes(q);
        if (!matchesName && !matchesOrder && !matchesSku && !matchesPiece && !matchesPhone) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== 'all') {
        const s = (order.status || '').toLowerCase();
        if (statusFilter === 'awaiting_confirmation' && s !== 'awaiting_confirmation') return false;
        if (statusFilter === 'reserved' && s !== 'reserved') return false;
        if (statusFilter === 'processing' && !(s === 'processing' || s === 'confirmed')) return false;
        if (statusFilter === 'dispatched' && s !== 'dispatched') return false;
        if (statusFilter === 'delivered' && s !== 'delivered') return false;
        if (statusFilter === 'cancelled' && s !== 'cancelled') return false;
      }

      // Channel Filter
      if (channelFilter !== 'all') {
        const c = (order.channel || (order.fulfilmentType === 'showroom_pickup' ? 'Showroom' : 'Online')).toLowerCase();
        if (channelFilter === 'showroom' && !c.includes('showroom')) return false;
        if (channelFilter === 'online' && !c.includes('online')) return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'receivedAt') {
        valA = new Date(a.receivedAt || 0).getTime();
        valB = new Date(b.receivedAt || 0).getTime();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [orders, searchQuery, statusFilter, channelFilter, sortField, sortAsc]);

  // Pagination calculation
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  // Quick Action Handlers
  const handleConfirmHoldAction = (order) => {
    confirmReservation(order.id);
    addToast('Hold Confirmed', `Reservation ${order.orderNumber} confirmed. Piece locked for 24h.`);
  };

  const handleOpenExtendHold = (order) => {
    setExtendHoldOrder(order);
    setExtendHours(24);
  };

  const handleApplyExtendHold = () => {
    if (extendHoldOrder) {
      extendHold(extendHoldOrder.id, extendHours);
      addToast('Hold Extended', `Hold window for ${extendHoldOrder.orderNumber} extended by ${extendHours} hours.`);
      setExtendHoldOrder(null);
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenRowActionId(null);
    setIsDetailDrawerOpen(true);
  };

  const handleCreateNewReservation = (e) => {
    e.preventDefault();
    const selProd = products.find(p => p.sku === reservationForm.productSku) || products[0];
    const newRes = {
      orderNumber: `VR-2024-${Math.floor(10000 + Math.random() * 89999)}`,
      channel: reservationForm.channel,
      customerName: reservationForm.customerName,
      phone: reservationForm.phone,
      email: reservationForm.email || 'customer@example.com',
      city: reservationForm.city,
      pincode: '625001',
      deliveryAddress: `${reservationForm.city}, Tamil Nadu`,
      productSku: selProd?.sku || 'DR-0018',
      productName: selProd?.name || 'Diamond Ring',
      productPrice: selProd?.price || '₹ 2,48,000',
      numericPrice: selProd?.numericPrice || 248000,
      productImage: selProd?.image || '/images/products/gold/earrings/gold_studs_1_photo.jpg',
      isUniqueItem: selProd?.isUnique ?? true,
      orderType: 'reservation',
      fulfilmentType: reservationForm.channel === 'Showroom' ? 'showroom_pickup' : 'home_delivery',
      status: 'awaiting_confirmation',
      receivedDate: 'Today',
      receivedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      receivedAt: new Date().toISOString(),
      holdExpiresDate: 'Tomorrow',
      holdExpiresTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      holdExpiresText: 'Expires in 1 day',
      holdExpiresAt: new Date(Date.now() + reservationForm.holdHours * 3600 * 1000).toISOString(),
      nextAction: 'Confirm with customer',
      primaryAction: 'Confirm Hold',
      notes: reservationForm.notes
    };
    createReservation(newRes);
    setIsNewReservationOpen(false);
    addToast('Reservation Created', `Hold ${newRes.orderNumber} placed for ${newRes.customerName}.`);
  };

  const handleOpenCreateOrder = () => {
    setOrderFormError(null);
    setOrderForm(prev => ({
      ...prev,
      productSku: prev.productSku || products[0]?.sku || ''
    }));
    setIsCreateOrderOpen(true);
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderFormError(null);

    if (!orderForm.customerName.trim()) {
      setOrderFormError('Customer Name is required.');
      return;
    }
    if (!orderForm.phone.trim()) {
      setOrderFormError('Mobile Number is required.');
      return;
    }
    const currentSku = orderForm.productSku || products[0]?.sku;
    if (!currentSku) {
      setOrderFormError('Please select a product from inventory.');
      return;
    }

    const qty = parseInt(orderForm.quantity, 10) || 1;
    if (qty < 1) {
      setOrderFormError('Quantity must be a positive integer.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const payload = {
        customerName: orderForm.customerName.trim(),
        phone: orderForm.phone.trim(),
        email: orderForm.email?.trim() || null,
        productSku: currentSku,
        quantity: qty,
        discount: Math.max(0, parseFloat(orderForm.discount) || 0),
        tax: orderPricing.tax,
        channel: orderForm.channel,
        paymentMethod: orderForm.paymentMethod,
        paymentStatus: orderForm.paymentStatus,
        orderStatus: orderForm.orderStatus,
        city: orderForm.city?.trim() || 'Madurai',
        notes: orderForm.notes?.trim() || null
      };

      const res = await createOrder(payload);
      if (res.success) {
        setIsCreateOrderOpen(false);
        setOrderForm({
          customerName: '',
          phone: '',
          email: '',
          productSku: products[0]?.sku || '',
          quantity: 1,
          discount: 0,
          channel: 'Showroom',
          paymentMethod: 'UPI',
          paymentStatus: 'paid',
          orderStatus: 'processing',
          city: 'Madurai',
          notes: ''
        });
      } else {
        setOrderFormError(res.error || 'Failed to create order on server.');
      }
    } catch (err) {
      setOrderFormError(err.message || 'An unexpected network error occurred.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setChannelFilter('all');
    setDateRangeFilter('all');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order,Customer,Phone,Piece,SKU,Price,Received,Status,Channel\n" +
      filteredOrders.map(o => `"${o.orderNumber}","${o.customerName}","${o.phone}","${o.productName}","${o.productSku}","${o.productPrice}","${o.receivedDate || ''}","${o.status}","${o.channel || 'Showroom'}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vedha_radha_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMoreActionsOpen(false);
    addToast('Export Generated', 'Orders CSV download started.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-12 font-admin-body">
      
      {/* ================= 1. PAGE HEADER (Matches Reference Screenshot) ================= */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pt-1">
        {/* Title, Operations Tag & Subtitle */}
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5C1D27] text-white text-[11px] font-semibold font-admin-body tracking-widest uppercase">
            SCREEN 3 • OPERATIONS
          </span>
          <h1 className="font-admin-heading text-[28px] sm:text-[32px] font-semibold text-[#1C1917] tracking-tight leading-tight mt-1">
            Reservations &amp; Orders
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5 font-normal font-admin-body">
            Manage customer holds, showroom visits and order fulfilment.
          </p>
        </div>

        {/* Right Side Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
          {/* + New Reservation Button (Antique Gold) */}
          <button
            onClick={() => setIsNewReservationOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#B38E46] hover:bg-[#9E7C38] active:bg-[#8A6A2E] text-white text-[14px] font-semibold font-admin-body shadow-sm flex items-center gap-1.5 transition duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Reservation</span>
          </button>

          {/* + Create Order Button */}
          <button
            onClick={handleOpenCreateOrder}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-[#D1D5DB] text-[#292521] text-[14px] font-semibold font-admin-body shadow-sm flex items-center gap-1.5 transition duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2] text-[#6B7280]" />
            <span>Create Order</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreActionsRef}>
            <button
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 border border-[#D1D5DB] text-[#292521] text-[14px] font-semibold font-admin-body shadow-sm flex items-center gap-1 transition duration-150 cursor-pointer"
            >
              <span>More Actions</span>
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 py-1.5 text-[13px] animate-in fade-in zoom-in-95">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-3.5 py-2 text-left hover:bg-[#F9FAFB] flex items-center gap-2 text-[#292521]"
                >
                  <Download className="w-4 h-4 text-[#6B7280]" />
                  <span>Export Orders CSV</span>
                </button>
                <button
                  onClick={() => {
                    orders.filter(o => o.status === 'awaiting_confirmation').forEach(o => confirmReservation(o.id));
                    setIsMoreActionsOpen(false);
                    addToast('Batch Confirmed', 'All pending holds confirmed.');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-[#F9FAFB] flex items-center gap-2 text-[#292521]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Batch Confirm All Holds</span>
                </button>
                <button
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    onOpenSimulateReservation();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-[#F9FAFB] flex items-center gap-2 text-[#651F2B]"
                >
                  <Sparkles className="w-4 h-4 text-[#C49A45]" />
                  <span>Simulate Walk-in Request</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= 2. FOUR KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Card 1: Awaiting Confirmation */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'awaiting_confirmation' ? 'all' : 'awaiting_confirmation')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(217,119,6,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            statusFilter === 'awaiting_confirmation' 
              ? 'border-[#D97706] ring-2 ring-[#D97706]/20 bg-[#FDFBF7]' 
              : 'border-[#E9E4DC] hover:border-[#D97706]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F59E0B] via-[#FDE68A] to-[#F59E0B]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F59E0B]/5 rounded-full blur-2xl group-hover:bg-[#F59E0B]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FEF7EC] to-[#FDE4C2] border border-[#FCD34D] flex items-center justify-center text-[#D97706] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Hourglass className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#D97706] transition-colors">
              Awaiting Confirmation
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {kpiCounts.awaiting}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                requests
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#D97706] group-hover:text-white group-hover:border-[#D97706] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#B45309]">
              <Clock className="w-3.5 h-3.5 text-[#D97706] stroke-[2.2]" />
              <span>Requires response</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Showroom &amp; online intake
            </span>
          </div>
        </div>

        {/* Card 2: Active Holds */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'reserved' ? 'all' : 'reserved')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(16,185,129,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            statusFilter === 'reserved' 
              ? 'border-[#059669] ring-2 ring-[#059669]/20 bg-[#F6FCF7]' 
              : 'border-[#E9E4DC] hover:border-[#059669]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#10B981] via-[#6EE7B7] to-[#10B981]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Lock className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#059669] transition-colors">
              Active Holds
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {kpiCounts.holds}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                locked
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#059669] group-hover:text-white group-hover:border-[#059669] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#047857]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span>Safeguard lock active</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              48h customer reservation
            </span>
          </div>
        </div>

        {/* Card 3: Processing */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'processing' ? 'all' : 'processing')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(219,39,119,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            statusFilter === 'processing' 
              ? 'border-[#DB2777] ring-2 ring-[#DB2777]/20 bg-[#FDF7FA]' 
              : 'border-[#E9E4DC] hover:border-[#DB2777]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#DB2777] via-[#F472B6] to-[#DB2777]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DB2777]/5 rounded-full blur-2xl group-hover:bg-[#DB2777]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3] border border-[#FBCFE8] flex items-center justify-center text-[#DB2777] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <SettingsIcon className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#DB2777] transition-colors">
              Processing
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {kpiCounts.processing}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                in progress
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#DB2777] group-hover:text-white group-hover:border-[#DB2777] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#BE185D]">
              <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
              <span>Workshop &amp; QA pipeline</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Hallmarking &amp; custom packing
            </span>
          </div>
        </div>

        {/* Card 4: Dispatch Ready */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'dispatched' ? 'all' : 'dispatched')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(180,83,9,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            statusFilter === 'dispatched' 
              ? 'border-[#B45309] ring-2 ring-[#B45309]/20 bg-[#FDFBF7]' 
              : 'border-[#E9E4DC] hover:border-[#B45309]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B45309] via-[#FDE68A] to-[#B45309]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#B45309]/5 rounded-full blur-2xl group-hover:bg-[#B45309]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D] flex items-center justify-center text-[#B45309] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Truck className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#B45309] transition-colors">
              Dispatch Ready
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {kpiCounts.dispatch}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                parcels
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#B45309] group-hover:text-white group-hover:border-[#B45309] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#B45309]">
              <Truck className="w-3.5 h-3.5 text-[#B45309] stroke-[2.2]" />
              <span>Ready for carrier</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Armoured courier &amp; pickup
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3. SEARCH & FILTER CONTROLS BAR ================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input (Left) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search customer, order or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#C49A45] rounded-xl pl-9 pr-8 py-2 text-[13px] text-[#292521] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 shadow-xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#292521]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group (Right) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl pl-3.5 pr-8 py-2 text-[13px] font-medium text-[#292521] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="awaiting_confirmation">Awaiting Confirmation</option>
              <option value="reserved">Reserved</option>
              <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>

          {/* Channel Dropdown */}
          <div className="relative">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl pl-3.5 pr-8 py-2 text-[13px] font-medium text-[#292521] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="showroom">Showroom</option>
              <option value="online">Online</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>

          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl pl-8 pr-8 py-2 text-[13px] font-medium text-[#292521] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C49A45]/30 cursor-pointer"
            >
              <option value="all">03 Sep 2024 – 09 Sep 2024</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#6B7280] hover:text-[#292521] text-[13px] font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            title="Reset filters"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* ================= 4. ORDERS & RESERVATIONS TABLE ================= */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse text-[13.5px] tabular-nums">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FCFBF9] text-[#6B7280] text-[12.5px] font-medium">
                <th 
                  onClick={() => {
                    setSortField('orderNumber');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3.5 px-4 font-semibold text-[#4B5563] cursor-pointer hover:text-[#292521] min-w-[140px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Order</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                <th className="py-3.5 px-3 font-semibold text-[#4B5563] min-w-[150px]">
                  Customer
                </th>

                <th className="py-3.5 px-3 font-semibold text-[#4B5563] min-w-[200px]">
                  Piece / SKU
                </th>

                <th 
                  onClick={() => {
                    setSortField('receivedAt');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3.5 px-3 font-semibold text-[#4B5563] cursor-pointer hover:text-[#292521] min-w-[120px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Received</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                <th className="py-3.5 px-3 font-semibold text-[#4B5563] min-w-[130px]">
                  <div className="flex items-center gap-1">
                    <span>Hold Expires</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                <th className="py-3.5 px-3 font-semibold text-[#4B5563] min-w-[150px]">
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                <th className="py-3.5 pr-4 pl-3 font-semibold text-[#4B5563] text-right min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#E5E7EB] text-[#292521]">
              {currentItems.map((order) => {
                const isShowroom = (order.channel || '').toLowerCase().includes('showroom') || order.fulfilmentType === 'showroom_pickup';
                const stat = (order.status || '').toLowerCase();

                // Status Badge Matching Reference Screenshot
                let statusBadge = null;
                if (stat === 'awaiting_confirmation') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FFF8E7] text-[#B45309] border border-[#FDE68A] whitespace-nowrap">
                      <Hourglass className="w-3.5 h-3.5 text-[#B45309] stroke-[2.2]" />
                      <span>Awaiting Confirmation</span>
                    </span>
                  );
                } else if (stat === 'reserved') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] whitespace-nowrap">
                      <Lock className="w-3.5 h-3.5 text-[#047857] stroke-[2.2]" />
                      <span>Reserved</span>
                    </span>
                  );
                } else if (stat === 'processing' || stat === 'confirmed') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FDF2F8] text-[#BE185D] border border-[#FBCFE8] whitespace-nowrap">
                      <SettingsIcon className="w-3.5 h-3.5 text-[#BE185D] stroke-[2.2]" />
                      <span>Processing</span>
                    </span>
                  );
                } else if (stat === 'dispatched' || stat === 'dispatch_ready') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4] whitespace-nowrap">
                      <Truck className="w-3.5 h-3.5 text-[#0F766E] stroke-[2.2]" />
                      <span>Dispatched</span>
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-200 capitalize">
                      <span>{order.status.replace('_', ' ')}</span>
                    </span>
                  );
                }

                // Hold Expiry Display
                let holdExpiryDisplay = <span className="text-[#9CA3AF]">-</span>;
                if (order.holdExpiresDate && order.holdExpiresTime) {
                  const isUrgent = (order.holdExpiresText || '').toLowerCase().includes('today') || (order.holdExpiresText || '').toLowerCase().includes('1 day');
                  holdExpiryDisplay = (
                    <div className="leading-tight">
                      <div className="text-[12.5px] font-medium text-[#292521]">
                        {order.holdExpiresDate}
                      </div>
                      <div className="text-[11.5px] text-[#6B7280]">
                        {order.holdExpiresTime}
                      </div>
                      {order.holdExpiresText && (
                        <div className={`text-[11px] font-medium mt-0.5 ${isUrgent ? 'text-[#DC2626]' : 'text-[#6B7280]'}`}>
                          {order.holdExpiresText}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <tr 
                    key={order.id || order.orderNumber}
                    className="hover:bg-[#FAF7F2] transition-colors duration-100"
                  >
                    {/* Order Column */}
                    <td className="py-3.5 px-4">
                      <div 
                        onClick={() => handleOpenDetail(order)}
                        className="font-medium text-[13px] text-[#292521] hover:text-[#651F2B] cursor-pointer"
                      >
                        {order.orderNumber || order.id}
                      </div>
                      <div className="mt-0.5">
                        {isShowroom ? (
                          <span className="inline-block px-2 py-0.2 rounded-full text-[11px] font-medium bg-[#FDF4E1] text-[#9A6700] border border-[#F5E5C0]/60">
                            Showroom
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.2 rounded-full text-[11px] font-medium bg-[#EBF3FC] text-[#2563EB] border border-[#D0E2FB]/60">
                            Online
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Column */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[13px] text-[#292521]">
                        {order.customerName}
                      </div>
                      <div className="text-[12px] text-[#6B7280] font-admin-mono mt-0.5">
                        {order.phone}
                      </div>
                    </td>

                    {/* Piece / SKU Column */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => handleOpenDetail(order)}
                          className="w-10 h-10 rounded-xl bg-[#201D1A] border border-[#E5E7EB] overflow-hidden flex-shrink-0 cursor-pointer shadow-xs"
                        >
                          <img 
                            src={order.productImage} 
                            alt={order.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/product_necklace.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-[180px]">
                          <div 
                            onClick={() => handleOpenDetail(order)}
                            className="font-semibold text-[13px] text-[#292521] truncate hover:text-[#651F2B] cursor-pointer"
                          >
                            {order.productName}
                          </div>
                          <div className="text-[11.5px] text-[#6B7280] font-admin-mono">
                            SKU {order.productSku}
                          </div>
                          <div className="text-[12px] text-[#4B5563] font-medium">
                            {order.productPrice}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Received Column */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-[12.5px] font-medium text-[#292521]">
                        {order.receivedDate || (order.receivedAt ? new Date(order.receivedAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today')}
                      </div>
                      <div className="text-[11.5px] text-[#6B7280]">
                        {order.receivedTime || (order.receivedAt ? new Date(order.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:20 AM')}
                      </div>
                    </td>

                    {/* Hold Expires Column */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {holdExpiryDisplay}
                    </td>

                    {/* Status Column */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {statusBadge}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 pr-4 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Primary Button */}
                        {stat === 'awaiting_confirmation' && (
                          <button
                            onClick={() => handleConfirmHoldAction(order)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#5C1D27] hover:bg-[#48161E] text-white text-[12px] font-semibold shadow-sm transition"
                          >
                            Confirm Hold
                          </button>
                        )}

                        {stat === 'reserved' && (
                          <button
                            onClick={() => handleOpenExtendHold(order)}
                            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-[#D1D5DB] text-[#292521] text-[12px] font-semibold shadow-sm transition"
                          >
                            Extend Hold
                          </button>
                        )}

                        {(stat === 'processing' || stat === 'dispatched' || stat === 'confirmed') && (
                          <button
                            onClick={() => handleOpenDetail(order)}
                            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-[#D1D5DB] text-[#292521] text-[12px] font-semibold shadow-sm transition"
                          >
                            View Details
                          </button>
                        )}

                        {/* Three-dots contextual menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenRowActionId(openRowActionId === order.id ? null : order.id);
                            }}
                            className="p-1 rounded text-[#9CA3AF] hover:text-[#292521] hover:bg-gray-100 transition"
                            title="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openRowActionId === order.id && (
                            <div 
                              ref={rowActionRef}
                              className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 py-1.5 text-left text-[12.5px] animate-in fade-in zoom-in-95"
                            >
                              <button
                                onClick={() => handleOpenDetail(order)}
                                className="w-full px-3 py-1.5 text-[#292521] hover:bg-[#FAF7F2] flex items-center gap-2 text-left"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
                                <span>Order Details</span>
                              </button>

                              {stat === 'awaiting_confirmation' && (
                                <button
                                  onClick={() => {
                                    handleConfirmHoldAction(order);
                                    setOpenRowActionId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-[#059669] hover:bg-[#ECFDF5] flex items-center gap-2 text-left font-medium"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve Hold</span>
                                </button>
                              )}

                              {stat === 'reserved' && (
                                <button
                                  onClick={() => {
                                    convertReservationToOrder(order.id);
                                    setOpenRowActionId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-[#2563A6] hover:bg-[#EAF2FC] flex items-center gap-2 text-left font-medium"
                                >
                                  <Store className="w-3.5 h-3.5" />
                                  <span>Convert to Sale</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  rejectReservation(order.id, 'Customer cancellation request');
                                  setOpenRowActionId(null);
                                }}
                                className="w-full px-3 py-1.5 text-[#C24141] hover:bg-[#FDECEC] flex items-center gap-2 text-left font-medium"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel / Release</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty state */}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E5E7EB] mx-auto flex items-center justify-center text-[#B38E46]">
                        <Search className="w-5 h-5" />
                      </div>
                      <h4 className="font-admin-heading text-[20px] font-semibold text-[#292521]">
                        No Orders Found
                      </h4>
                      <p className="text-[13px] text-[#6B7280]">
                        No records match the selected filters or search query.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 rounded-lg bg-[#5C1D27] text-white text-[13px] font-medium hover:bg-[#48161E] transition shadow-sm"
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

      {/* ================= 5. PAGINATION FOOTER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Left: Count Text */}
        <div className="text-[13px] text-[#6B7280]">
          Showing <span className="font-medium text-[#292521]">{totalItems > 0 ? `${startIndex + 1}–${endIndex}` : '0'}</span> of{' '}
          <span className="font-medium text-[#292521]">{totalItems}</span> orders
        </div>

        {/* Right: Prev, Active Page, Next, Per Page Selector */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`w-7 h-7 rounded border border-[#D1D5DB] flex items-center justify-center transition ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed bg-white text-[#9CA3AF]'
                : 'bg-white hover:bg-gray-50 text-[#292521] cursor-pointer'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page Number 1 */}
          <button
            className="w-7 h-7 rounded border border-[#D1D5DB] bg-white text-[#292521] text-[12.5px] font-medium flex items-center justify-center shadow-2xs"
          >
            {currentPage}
          </button>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`w-7 h-7 rounded border border-[#D1D5DB] flex items-center justify-center transition ${
              currentPage === totalPages || totalPages === 0
                ? 'opacity-40 cursor-not-allowed bg-white text-[#9CA3AF]'
                : 'bg-white hover:bg-gray-50 text-[#292521] cursor-pointer'
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* 10 per page Selector */}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-[#D1D5DB] hover:border-gray-400 rounded px-2.5 py-1 text-[12px] font-medium text-[#292521] shadow-2xs cursor-pointer pr-6"
            >
              <option value={7}>7 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ================= 6. NEW RESERVATION MODAL ================= */}
      {isNewReservationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-admin-body">
            <div className="bg-[#5C1D27] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C49A45]" />
                <h3 className="font-admin-heading font-semibold text-[20px] text-white">
                  Create Showroom Reservation Hold
                </h3>
              </div>
              <button 
                onClick={() => setIsNewReservationOpen(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReservation} className="p-6 space-y-4 text-[13px] text-[#292521]">
              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Rajeshwari Sundaram"
                  value={reservationForm.customerName}
                  onChange={(e) => setReservationForm({ ...reservationForm, customerName: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 23894"
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] font-admin-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Channel
                  </label>
                  <select
                    value={reservationForm.channel}
                    onChange={(e) => setReservationForm({ ...reservationForm, channel: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px]"
                  >
                    <option value="Showroom">Showroom Walk-in</option>
                    <option value="Online">Online Concierge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Select Jewellery Piece *
                </label>
                <select
                  value={reservationForm.productSku}
                  onChange={(e) => setReservationForm({ ...reservationForm, productSku: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px]"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} ({p.sku}) • {p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Hold Duration Window
                </label>
                <select
                  value={reservationForm.holdHours}
                  onChange={(e) => setReservationForm({ ...reservationForm, holdHours: Number(e.target.value) })}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px]"
                >
                  <option value={24}>24 Hours (Standard)</option>
                  <option value={48}>48 Hours (Extended VIP)</option>
                  <option value={72}>72 Hours (Owner Clearance)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Notes / Scheduled Visit Time
                </label>
                <textarea
                  rows={2}
                  value={reservationForm.notes}
                  onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 text-[13px]"
                  placeholder="e.g. Customer visiting tomorrow morning 11:00 AM."
                />
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewReservationOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[#4B5563] hover:bg-gray-50 text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#5C1D27] hover:bg-[#48161E] text-white font-semibold text-[13px] shadow-sm"
                >
                  Register Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE ORDER MODAL ================= */}
      {isCreateOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden font-admin-body max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#5C1D27] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C49A45]" />
                <h3 className="font-admin-heading font-semibold text-[20px] text-white">
                  Create Customer Order
                </h3>
              </div>
              <button 
                onClick={() => setIsCreateOrderOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleCreateOrderSubmit} className="p-6 space-y-4 text-[13px] text-[#292521] overflow-y-auto flex-1">
              {/* Error Notice */}
              {orderFormError && (
                <div className="bg-red-50 border border-red-200 text-[#C24141] px-4 py-2.5 rounded-xl text-[12.5px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{orderFormError}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Rajeshwari Sundaram"
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                />
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 23894"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] font-admin-mono focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Selector */}
              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Select Jewellery Product *
                </label>
                <select
                  value={orderForm.productSku || (selectedOrderProduct?.sku || '')}
                  onChange={(e) => setOrderForm({ ...orderForm, productSku: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} ({p.sku}) • ₹ {Number(p.numericPrice || (typeof p.price === 'number' ? p.price : String(p.price).replace(/[^0-9]/g, '')) || 0).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-populated Product Specs Card */}
              {selectedOrderProduct && (
                <div className="bg-[#FCFBF9] border border-[#E8DCBE] rounded-xl p-3 flex items-center justify-between text-[12.5px]">
                  <div>
                    <span className="text-[#736B63]">SKU:</span>{' '}
                    <span className="font-semibold text-[#292521] font-admin-mono">{selectedOrderProduct.sku}</span>
                    <span className="text-[#D5CFC5] mx-2">•</span>
                    <span className="text-[#736B63]">Category:</span>{' '}
                    <span className="font-semibold text-[#292521]">{selectedOrderProduct.category || 'Jewellery'}</span>
                  </div>
                  <div>
                    <span className="text-[#736B63]">Unit Price:</span>{' '}
                    <span className="font-bold text-[#8D6725]">₹ {orderPricing.unitPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Quantity, Discount, Tax */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] font-admin-mono focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={orderForm.discount}
                    onChange={(e) => setOrderForm({ ...orderForm, discount: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] font-admin-mono focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    GST (3%)
                  </label>
                  <div className="w-full bg-gray-50 border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] font-admin-mono text-[#6B7280]">
                    ₹ {orderPricing.tax.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Total Calculation Summary Card */}
              <div className="bg-[#F7F0E1]/80 border border-[#E8DCBE] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-[#7A7167]">
                    Total Authoritative Amount
                  </div>
                  <div className="text-[12px] text-[#695D4E]">
                    Subtotal: ₹ {orderPricing.subtotal.toLocaleString('en-IN')} • GST (3%): +₹ {orderPricing.tax.toLocaleString('en-IN')}{orderPricing.discount > 0 ? ` • Discount: -₹ ${orderPricing.discount.toLocaleString('en-IN')}` : ''}
                  </div>
                </div>
                <div className="text-[20px] font-bold text-[#8D6725] font-admin-heading self-end sm:self-center">
                  ₹ {orderPricing.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Order Channel, Payment Method, Payment Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Order Channel
                  </label>
                  <select
                    value={orderForm.channel}
                    onChange={(e) => setOrderForm({ ...orderForm, channel: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none cursor-pointer"
                  >
                    <option value="Showroom">Showroom Walk-in</option>
                    <option value="Online">Online Concierge</option>
                    <option value="WhatsApp">WhatsApp Direct</option>
                    <option value="Phone">Phone Booking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={orderForm.paymentMethod}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none cursor-pointer"
                  >
                    <option value="UPI">UPI / QR</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="NetBanking">Bank Transfer / NEFT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Payment Status
                  </label>
                  <select
                    value={orderForm.paymentStatus}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentStatus: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none cursor-pointer"
                  >
                    <option value="paid">Paid (Immediate)</option>
                    <option value="pending">Pending Verification</option>
                    <option value="partially_paid">Partially Paid</option>
                  </select>
                </div>
              </div>

              {/* Order Status & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    Initial Order Status
                  </label>
                  <select
                    value={orderForm.orderStatus}
                    onChange={(e) => setOrderForm({ ...orderForm, orderStatus: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none cursor-pointer"
                  >
                    <option value="processing">Processing (Workshop Queue)</option>
                    <option value="confirmed">Confirmed (Vault Allocation)</option>
                    <option value="dispatch_ready">Dispatch Ready (Armoured Carrier)</option>
                    <option value="awaiting_confirmation">Awaiting Confirmation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                    City / Showroom Region
                  </label>
                  <input
                    type="text"
                    value={orderForm.city}
                    onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                    placeholder="e.g. Madurai"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Order Notes / Special Requests
                </label>
                <textarea
                  rows={2}
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 text-[13px] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none"
                  placeholder="e.g. Hallmarking certification, custom gift box, or wedding date engraving."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderOpen(false)}
                  disabled={isSubmittingOrder}
                  className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[#4B5563] hover:bg-gray-50 text-[13px] font-medium transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="px-5 py-2 rounded-lg bg-[#5C1D27] hover:bg-[#48161E] active:bg-[#381016] text-white font-semibold text-[13.5px] shadow-sm flex items-center gap-2 transition duration-150 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Order...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#C49A45]" />
                      <span>Create Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 7. EXTEND HOLD MODAL ================= */}
      {extendHoldOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full shadow-2xl p-6 font-admin-body text-[13.5px]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[#B38E46]" />
              <h3 className="font-admin-heading font-semibold text-[20px] text-[#292521]">
                Extend Reservation Hold
              </h3>
            </div>
            <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
              Extend the hold period for <strong>{extendHoldOrder.customerName}</strong> ({extendHoldOrder.orderNumber}) on <strong>{extendHoldOrder.productName}</strong>.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#4B5563] mb-1">
                  Additional Duration
                </label>
                <select
                  value={extendHours}
                  onChange={(e) => setExtendHours(Number(e.target.value))}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px]"
                >
                  <option value={12}>+ 12 Hours</option>
                  <option value={24}>+ 24 Hours (Recommended)</option>
                  <option value={48}>+ 48 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E5E7EB] pt-3">
              <button
                onClick={() => setExtendHoldOrder(null)}
                className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[#4B5563] text-[13px]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyExtendHold}
                className="px-4 py-2 rounded-lg bg-[#5C1D27] text-white font-semibold text-[13px] shadow-sm"
              >
                Confirm Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 8. ORDER DETAILS DRAWER ================= */}
      {isDetailDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-[#E5E7EB] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 font-admin-body">
            {/* Drawer Header */}
            <div className="p-4 bg-[#5C1D27] text-white flex items-center justify-between">
              <div>
                <span className="font-admin-mono text-[12px] bg-white/15 px-2 py-0.5 rounded text-white font-medium">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="font-admin-heading font-semibold text-[22px] text-white mt-1">
                  Order &amp; Hold Specifications
                </h3>
              </div>
              <button 
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-[13.5px]">
              {/* Product Card */}
              <div className="flex items-center gap-3.5 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE8E1]">
                <img 
                  src={selectedOrder.productImage} 
                  alt={selectedOrder.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] bg-[#221F1C]"
                />
                <div>
                  <span className="text-[11px] font-admin-mono font-medium text-[#651F2B] bg-[#F4E8EB] px-1.5 py-0.2 rounded">
                    SKU {selectedOrder.productSku}
                  </span>
                  <h4 className="font-semibold text-[15px] text-[#292521] mt-0.5">
                    {selectedOrder.productName}
                  </h4>
                  <p className="text-[15px] font-bold text-[#8D6725] mt-0.5">
                    {selectedOrder.productPrice}
                  </p>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 border border-[#E5E7EB] rounded-xl p-3.5">
                <h5 className="font-semibold text-[13px] text-[#292521]">Customer Contact Information</h5>
                <div className="grid grid-cols-2 gap-2 text-[12.5px]">
                  <div>
                    <span className="text-[#6B7280] block text-[11px]">Customer</span>
                    <span className="font-medium text-[#292521]">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[11px]">Phone</span>
                    <span className="font-admin-mono font-medium text-[#292521]">{selectedOrder.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[11px]">Channel</span>
                    <span className="font-medium text-[#292521]">{selectedOrder.channel || 'Showroom'}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[11px]">City</span>
                    <span className="font-medium text-[#292521]">{selectedOrder.city || 'Madurai'}</span>
                  </div>
                </div>
              </div>

              {/* Status & Next Action */}
              <div className="bg-[#FEF9EE] border border-[#FDE68A] p-3.5 rounded-xl text-[13px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-bold text-[#B45309] uppercase tracking-wider">Operational Status</span>
                  <span className="capitalize font-semibold text-[#292521]">{selectedOrder.status.replace('_', ' ')}</span>
                </div>
                <p className="text-[#78350F] text-[12.5px] leading-snug">
                  <strong>Next Action:</strong> {selectedOrder.nextAction}
                </p>
                {selectedOrder.notes && (
                  <p className="text-[#92400E] text-[12px] mt-1.5 italic">
                    "{selectedOrder.notes}"
                  </p>
                )}
              </div>

              {/* Tracking Details */}
              {selectedOrder.tracking && (
                <div className="border border-[#E5E7EB] rounded-xl p-3.5 space-y-2">
                  <h5 className="font-semibold text-[13px] text-[#292521]">Logistics &amp; Courier Tracking</h5>
                  <div className="text-[12.5px] space-y-1">
                    <p><strong className="text-[#6B7280]">Carrier:</strong> {selectedOrder.tracking.carrier}</p>
                    <p><strong className="text-[#6B7280]">Tracking ID:</strong> <span className="font-admin-mono">{selectedOrder.tracking.trackingId}</span></p>
                    <p><strong className="text-[#6B7280]">Delivery State:</strong> {selectedOrder.tracking.deliveryStatus}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
              <button
                onClick={() => {
                  rejectReservation(selectedOrder.id, 'Cancelled via drawer');
                  setIsDetailDrawerOpen(false);
                }}
                className="px-3.5 py-2 rounded-lg border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEF2F2] text-[13px] font-medium"
              >
                Release Hold
              </button>

              <div className="flex items-center gap-2">
                {selectedOrder.status === 'awaiting_confirmation' && (
                  <button
                    onClick={() => {
                      handleConfirmHoldAction(selectedOrder);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#5C1D27] text-white text-[13px] font-semibold hover:bg-[#48161E]"
                  >
                    Confirm Hold
                  </button>
                )}
                {selectedOrder.status === 'reserved' && (
                  <button
                    onClick={() => {
                      handleOpenExtendHold(selectedOrder);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#B38E46] text-white text-[13px] font-semibold hover:bg-[#9E7C38]"
                  >
                    Extend Hold
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

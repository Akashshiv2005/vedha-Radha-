import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Search, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Plus, 
  Copy, 
  Check, 
  MoreVertical, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Printer, 
  ExternalLink,
  Navigation,
  Info,
  Calendar,
  Layers,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDeliveryPage() {
  const { 
    deliveries = [], 
    updateDeliveryTracking, 
    updateDeliveryStatus, 
    createDispatch, 
    deleteDispatch,
    settings = {},
    addToast 
  } = useAdmin();

  // Filters state
  const [statusFilter, setStatusFilter] = useState('all');
  const [courierFilter, setCourierFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active filter state (applied)
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'all',
    courier: 'all',
    search: ''
  });

  // Table selection & sorting
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [sortField, setSortField] = useState('orderNumber');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // UI state
  const [copiedId, setCopiedId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    courier: '',
    trackingId: '',
    status: '',
    checkpointNote: '',
    issueDetails: '',
    sendNotification: true
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    orderNumber: `VRJ-2025-08${Math.floor(48 + Math.random() * 50)}`,
    customerName: '',
    phone: '',
    destination: '',
    pincode: '',
    courier: 'Blue Dart',
    trackingId: '',
    itemsSummary: '',
    itemPrice: '₹ '
  });

  // Details drawer
  const [detailsDrawerItem, setDetailsDrawerItem] = useState(null);

  // Pincode lookup tool drawer
  const [isPincodeToolOpen, setIsPincodeToolOpen] = useState(false);
  const [testPincode, setTestPincode] = useState('600001');
  const [pincodeResult, setPincodeResult] = useState(null);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const readyToDispatch = deliveries.filter(d => d.status === 'Ready to Dispatch').length;
    const inTransit = deliveries.filter(d => d.status === 'In Transit').length;
    // Show 12 or delivered count
    const deliveredCount = deliveries.filter(d => d.status === 'Delivered').length;
    const deliveredToday = Math.max(12, deliveredCount);
    const serviceIssues = deliveries.filter(d => d.status === 'Service Issues').length;

    return {
      readyToDispatch,
      inTransit,
      deliveredToday,
      serviceIssues
    };
  }, [deliveries]);

  // Handle clicking on stat cards to filter
  const handleStatCardClick = (targetStatus) => {
    if (appliedFilters.status === targetStatus) {
      // Toggle off
      setStatusFilter('all');
      setAppliedFilters(prev => ({ ...prev, status: 'all' }));
    } else {
      setStatusFilter(targetStatus);
      setAppliedFilters(prev => ({ ...prev, status: targetStatus }));
    }
    setCurrentPage(1);
  };

  // Filter application
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusFilter,
      courier: courierFilter,
      search: searchQuery.trim()
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCourierFilter('all');
    setSearchQuery('');
    setAppliedFilters({
      status: 'all',
      courier: 'all',
      search: ''
    });
    setCurrentPage(1);
  };

  // Filtered and sorted data
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(item => {
      // Status filter
      if (appliedFilters.status !== 'all' && item.status !== appliedFilters.status) {
        return false;
      }
      // Courier filter
      if (appliedFilters.courier !== 'all' && item.courier !== appliedFilters.courier) {
        return false;
      }
      // Search query (order, customer, tracking, destination, phone)
      if (appliedFilters.search) {
        const query = appliedFilters.search.toLowerCase();
        const matchOrder = item.orderNumber?.toLowerCase().includes(query);
        const matchCustomer = item.customerName?.toLowerCase().includes(query);
        const matchPhone = item.phone?.toLowerCase().includes(query);
        const matchTracking = item.trackingId?.toLowerCase().includes(query);
        const matchDest = item.destination?.toLowerCase().includes(query);
        if (!matchOrder && !matchCustomer && !matchPhone && !matchTracking && !matchDest) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deliveries, appliedFilters, sortField, sortOrder]);

  // Pagination calculation
  const totalOrders = filteredDeliveries.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalOrders);
  const currentDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  // Sorting helper
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Selection helpers
  const isAllSelected = currentDeliveries.length > 0 && currentDeliveries.every(d => selectedOrders.has(d.orderNumber));
  
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders(prev => {
        const next = new Set(prev);
        currentDeliveries.forEach(d => next.delete(d.orderNumber));
        return next;
      });
    } else {
      setSelectedOrders(prev => {
        const next = new Set(prev);
        currentDeliveries.forEach(d => next.add(d.orderNumber));
        return next;
      });
    }
  };

  const handleToggleSelectOrder = (orderNumber) => {
    setSelectedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderNumber)) {
        next.delete(orderNumber);
      } else {
        next.add(orderNumber);
      }
      return next;
    });
  };

  // Copy Tracking ID
  const handleCopyTracking = (id, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast('Tracking ID Copied', `Copied ${id} to clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Update Tracking Modal
  const handleOpenUpdateModal = (delivery, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    setSelectedDelivery(delivery);
    setUpdateFormData({
      courier: delivery.courier || 'Blue Dart',
      trackingId: delivery.trackingId || '',
      status: delivery.status || 'Ready to Dispatch',
      checkpointNote: '',
      issueDetails: delivery.issueDetails || '',
      sendNotification: true
    });
    setIsUpdateModalOpen(true);
  };

  // Save Tracking Updates
  const handleSaveUpdate = (e) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    updateDeliveryTracking(selectedDelivery.orderNumber, {
      courier: updateFormData.courier,
      trackingId: updateFormData.trackingId,
      status: updateFormData.status,
      checkpointNote: updateFormData.checkpointNote,
      issueDetails: updateFormData.issueDetails
    });

    if (updateFormData.sendNotification) {
      addToast('Customer Notified', `Dispatched automated SMS & WhatsApp notification to ${selectedDelivery.phone}.`);
    }

    setIsUpdateModalOpen(false);
    setSelectedDelivery(null);
  };

  // Open Create Dispatch Modal
  const handleOpenCreateModal = () => {
    setCreateFormData({
      orderNumber: `VRJ-2025-08${Math.floor(48 + Math.random() * 50)}`,
      customerName: '',
      phone: '',
      destination: '',
      pincode: '',
      courier: 'Blue Dart',
      trackingId: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      itemsSummary: 'Showroom Handcrafted Jewellery',
      itemPrice: '₹ 54,000'
    });
    setIsCreateModalOpen(true);
  };

  // Handle Create Dispatch Submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createFormData.customerName.trim() || !createFormData.destination.trim()) {
      addToast('Missing Details', 'Please enter customer name and destination city/state.', 'error');
      return;
    }

    createDispatch({
      orderNumber: createFormData.orderNumber,
      customerName: createFormData.customerName,
      phone: createFormData.phone || '+91 98000 00000',
      destination: createFormData.destination,
      pincode: createFormData.pincode || '600001',
      courier: createFormData.courier,
      trackingId: createFormData.trackingId || `AWB-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'Ready to Dispatch',
      itemsSummary: createFormData.itemsSummary,
      itemPrice: createFormData.itemPrice
    });

    setIsCreateModalOpen(false);
  };

  // Export Deliveries to CSV
  const handleExport = () => {
    const dataToExport = selectedOrders.size > 0 
      ? deliveries.filter(d => selectedOrders.has(d.orderNumber))
      : filteredDeliveries;

    if (dataToExport.length === 0) {
      addToast('No Data', 'No orders available to export.', 'info');
      return;
    }

    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Destination', 'Courier', 'Tracking ID', 'Status'];
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(d => [
        `"${d.orderNumber}"`,
        `"${d.date}"`,
        `"${d.customerName}"`,
        `"${d.phone}"`,
        `"${d.destination}"`,
        `"${d.courier}"`,
        `"${d.trackingId}"`,
        `"${d.status}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VedaRadha_Delivery_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Successful', `Exported ${dataToExport.length} consignments to CSV.`);
  };

  // Check Pincode Tool
  const checkPincodeServiceability = (e) => {
    e?.preventDefault();
    const pin = testPincode.trim();
    if (!pin || pin.length < 6) return;

    const pinNum = parseInt(pin, 10);

    if (pinNum >= 600001 && pinNum <= 600130) {
      setPincodeResult({
        status: 'serviceable_express',
        zone: 'Zone A - Greater Chennai Metro & Suburbs',
        sla: 'Same-Day / Next-Day Showroom Hand-Delivery',
        fee: 'Free above ₹5,000 (Standard: ₹150)',
        carriers: ['Showroom Express Messenger', 'BlueDart Apex Gold Secure'],
        message: 'Fully serviceable with insured delivery & OTP verification.'
      });
    } else if (pinNum >= 620001 && pinNum <= 643000) {
      setPincodeResult({
        status: 'serviceable_standard',
        zone: 'Zone B - Tamil Nadu Tier 1 & 2 Cities (Madurai, Trichy, CBE, Salem)',
        sla: '24 - 48 Hours Insured Armoured Transit',
        fee: 'Free above ₹10,000 (Standard: ₹150)',
        carriers: ['BlueDart Apex Gold Secure', 'Sequel Secured Cargo'],
        message: 'Serviceable under regular insured jewellery shipping route.'
      });
    } else if (pinNum >= 560001 && pinNum <= 580000) {
      setPincodeResult({
        status: 'serviceable_regional',
        zone: 'Zone C - South India Hubs (Bengaluru, Hyderabad, Kochi)',
        sla: '2 - 3 Working Days High-Value Logistics',
        fee: '₹ 350 Flat Secured Transit',
        carriers: ['Sequel Logistics', 'BlueDart Dedicated Air Express'],
        message: 'Serviceable with specialized high-value jewellery insurance mandate.'
      });
    } else {
      setPincodeResult({
        status: 'review_required',
        zone: 'Zone D - Extended Outstation / Remote Rural Area',
        sla: 'Staff Manual Assessment Required',
        fee: 'Custom Insured Freight Quote',
        carriers: ['Special Escort Logistics / Speed Post Insured'],
        message: 'Location outside standard auto-coverage. Staff must verify delivery security before dispatching.',
        alternatives: ['Arrange Showroom Counter Pickup with VIP Concierge', 'Request Manager Clearance for Insured High-Value Courier']
      });
    }
  };

  return (
    <div className="space-y-6 font-admin-body animate-in fade-in duration-200">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[13px] text-[#6B7280]">
        <span className="hover:text-[#292521] cursor-pointer">Home</span>
        <span className="text-[#9CA3AF]">&gt;</span>
        <span className="text-[#292521] font-medium">Delivery &amp; Logistics</span>
      </nav>

      {/* 2. Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5C1D27] text-white text-[11px] font-semibold font-admin-body tracking-widest uppercase">
            SCREEN 4 • LOGISTICS
          </span>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1C1917] tracking-tight font-admin-heading leading-tight mt-1">
            Delivery &amp; Logistics
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5 font-normal font-admin-body">
            Prepare, track and complete showroom deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Regional Pincode SLAs Quick Access */}
          <button
            onClick={() => setIsPincodeToolOpen(!isPincodeToolOpen)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#F9F7F5] border border-[#E5E7EB] rounded-xl text-[13px] font-medium text-[#4B5563] hover:bg-[#F3EFEA] transition"
            title="Check Indian Pincode Delivery SLA & Rates"
          >
            <Navigation className="w-3.5 h-3.5 text-[#B0833E]" />
            <span>Pincode SLAs</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D1D5DB] rounded-xl text-[14px] font-semibold font-admin-body text-[#374151] hover:bg-gray-50 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#6B7280]" />
            <span>Export</span>
          </button>

          {/* Create Dispatch Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[14px] font-semibold font-admin-body shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Dispatch</span>
          </button>
        </div>
      </div>

      {/* Pincode SLA Collapsible Tool (Bonus feature for operational convenience) */}
      {isPincodeToolOpen && (
        <div className="bg-[#FAF8F5] border border-[#E8DFC8] rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#B0833E]" />
              <h3 className="font-semibold text-[16px] text-[#1F1D1A]">
                Pincode Serviceability &amp; SLA Diagnostic Engine
              </h3>
            </div>
            <button 
              onClick={() => setIsPincodeToolOpen(false)}
              className="text-[#6B7280] hover:text-[#1F1D1A] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={checkPincodeServiceability} className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              maxLength={6}
              value={testPincode}
              onChange={(e) => setTestPincode(e.target.value)}
              placeholder="Enter 6-digit PIN (e.g. 600001, 560001)"
              className="w-64 bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] font-admin-mono text-[#1F1D1A] focus:outline-none focus:ring-2 focus:ring-[#A87B3B]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[13px] font-semibold transition"
            >
              Verify Pincode
            </button>
            <span className="text-[12px] text-[#6B7280] ml-2">
              Quick test: <button type="button" onClick={() => { setTestPincode('600028'); setTimeout(() => checkPincodeServiceability(), 50); }} className="underline hover:text-[#A87B3B]">600028 (Chennai)</button>, <button type="button" onClick={() => { setTestPincode('560001'); setTimeout(() => checkPincodeServiceability(), 50); }} className="underline hover:text-[#A87B3B]">560001 (BLR)</button>, <button type="button" onClick={() => { setTestPincode('799001'); setTimeout(() => checkPincodeServiceability(), 50); }} className="underline hover:text-[#A87B3B]">799001 (Tripura)</button>
            </span>
          </form>

          {pincodeResult && (
            <div className={`p-4 rounded-xl border text-[13px] ${
              pincodeResult.status.startsWith('serviceable') 
                ? 'bg-[#EAF5EE] border-[#287A52]/30 text-[#287A52]' 
                : 'bg-[#FFF5DF] border-[#D8C39A]/60 text-[#B7791F]'
            }`}>
              <div className="flex items-center justify-between font-semibold text-[#1F1D1A] mb-1">
                <span>{pincodeResult.zone}</span>
                <span className="text-[12px] bg-white px-2 py-0.5 rounded shadow-xs">{pincodeResult.sla}</span>
              </div>
              <p className="text-[#374151] mt-1">{pincodeResult.message}</p>
              <p className="text-[12px] text-[#6B7280] mt-1">Carriers: {pincodeResult.carriers.join(', ')} • Fee: {pincodeResult.fee}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
        {/* Card 1: Ready to Dispatch */}
        <div 
          onClick={() => handleStatCardClick('Ready to Dispatch')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(168,123,59,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            appliedFilters.status === 'Ready to Dispatch' 
              ? 'border-[#A87B3B] ring-2 ring-[#A87B3B]/20 bg-[#FDFBF7]' 
              : 'border-[#E9E4DC] hover:border-[#A87B3B]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#A87B3B] via-[#F4DEB7] to-[#A87B3B]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#A87B3B]/5 rounded-full blur-2xl group-hover:bg-[#A87B3B]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FDF6E9] to-[#FCEECB] border border-[#F5E2B8] flex items-center justify-center text-[#A87B3B] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Package className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#A87B3B] transition-colors">
              Ready to Dispatch
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.readyToDispatch}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                parcels
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#A87B3B] group-hover:text-white group-hover:border-[#A87B3B] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#A87B3B]">
              <Package className="w-3.5 h-3.5 stroke-[2]" />
              <span>Packed &amp; Sealed</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Awaiting armoured courier pickup
            </span>
          </div>
        </div>

        {/* Card 2: In Transit */}
        <div 
          onClick={() => handleStatCardClick('In Transit')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(37,99,235,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            appliedFilters.status === 'In Transit' 
              ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-[#F8FAFF]' 
              : 'border-[#E9E4DC] hover:border-[#2563EB]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#93C5FD] to-[#2563EB]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#2563EB]/5 rounded-full blur-2xl group-hover:bg-[#2563EB]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Truck className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#2563EB] transition-colors">
              In Transit
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.inTransit}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                shipments
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
              </span>
              <span>Armoured transit</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Secured pan-India routes
            </span>
          </div>
        </div>

        {/* Card 3: Delivered Today */}
        <div 
          onClick={() => handleStatCardClick('Delivered')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(22,163,74,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            appliedFilters.status === 'Delivered' 
              ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20 bg-[#F6FCF7]' 
              : 'border-[#E9E4DC] hover:border-[#16A34A]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#16A34A] via-[#86EFAC] to-[#16A34A]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#16A34A]/5 rounded-full blur-2xl group-hover:bg-[#16A34A]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#16A34A] transition-colors">
              Delivered Today
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.deliveredToday}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                completed
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#16A34A] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#16A34A]">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>OTP verified handovers</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Customer deliveries completed
            </span>
          </div>
        </div>

        {/* Card 4: Service Issues */}
        <div 
          onClick={() => handleStatCardClick('Service Issues')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(220,38,38,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            appliedFilters.status === 'Service Issues' 
              ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20 bg-[#FEF8F8]' 
              : 'border-[#E9E4DC] hover:border-[#DC2626]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#DC2626] via-[#FCA5A5] to-[#DC2626]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DC2626]/5 rounded-full blur-2xl group-hover:bg-[#DC2626]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FEF2F2] to-[#FECDD3] border border-[#FECACA] flex items-center justify-center text-[#DC2626] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#DC2626] transition-colors">
              Service Issues
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#DC2626] leading-none">
                {stats.serviceIssues}
              </span>
              <span className="text-[13px] font-medium font-admin-body text-[#DC2626]">
                flagged
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#DC2626] group-hover:text-white group-hover:border-[#DC2626] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#DC2626]">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
              <span>Requires attention</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Transit delays &amp; PIN review
            </span>
          </div>
        </div>
      </div>

      {/* 4. Filters & Search Box */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3.5 justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 flex-1">
            {/* Status Selector */}
            <div className="lg:col-span-3">
              <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 pr-9 text-[13.5px] text-[#374151] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none transition cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Ready to Dispatch">Ready to Dispatch</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Service Issues">Service Issues</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Courier Selector */}
            <div className="lg:col-span-3">
              <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">
                Courier
              </label>
              <div className="relative">
                <select
                  value={courierFilter}
                  onChange={(e) => setCourierFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 pr-9 text-[13.5px] text-[#374151] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none transition cursor-pointer"
                >
                  <option value="all">All Carriers</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Ekart">Ekart</option>
                  <option value="India Post">India Post</option>
                  <option value="Showroom Express">Showroom Express</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search Input */}
            <div className="lg:col-span-6 flex flex-col justify-end">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  placeholder="Search by order ID, customer name or tracking ID..."
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl pl-10 pr-9 py-2 text-[13.5px] text-[#1F2937] placeholder:text-gray-400 focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setAppliedFilters(prev => ({ ...prev, search: '' }));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reset & Apply Buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0 self-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-[#D1D5DB] bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-[13.5px] font-medium transition cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-5 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[13.5px] font-medium shadow-xs transition cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Selected Items Bulk Action Bar (when rows are checked) */}
        {selectedOrders.size > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between text-[13px] bg-[#FAF8F5] p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1F2937]">{selectedOrders.size} order(s) selected</span>
              <button 
                onClick={() => setSelectedOrders(new Set())}
                className="text-[12px] text-[#A87B3B] hover:underline ml-2"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selectedOrders.forEach(ordNum => {
                    updateDeliveryStatus(ordNum, 'In Transit', 'Bulk dispatch handed to carrier');
                  });
                  setSelectedOrders(new Set());
                  addToast('Bulk Updated', `Marked ${selectedOrders.size} orders as In Transit.`);
                }}
                className="px-3 py-1 bg-white border border-[#D1D5DB] hover:bg-gray-50 rounded-lg text-[#374151] font-medium text-[12px]"
              >
                Mark Dispatched
              </button>
              <button
                onClick={handleExport}
                className="px-3 py-1 bg-[#A87B3B] text-white hover:bg-[#92652A] rounded-lg font-medium text-[12px]"
              >
                Export Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Orders & Logistics Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13.5px] tabular-nums">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-white text-[12.5px] font-semibold text-[#4B5563]">
                {/* Select All Checkbox */}
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all orders"
                    className="w-4 h-4 rounded border-gray-300 text-[#A87B3B] focus:ring-[#A87B3B] cursor-pointer"
                  />
                </th>

                {/* Order ↕ */}
                <th 
                  onClick={() => handleSort('orderNumber')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#111827] select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Order</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>

                {/* Customer ↕ */}
                <th 
                  onClick={() => handleSort('customerName')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#111827] select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>

                {/* Destination ↕ */}
                <th 
                  onClick={() => handleSort('destination')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#111827] select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Destination</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>

                {/* Courier ↕ */}
                <th 
                  onClick={() => handleSort('courier')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#111827] select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Courier</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>

                {/* Tracking ID ↕ */}
                <th 
                  onClick={() => handleSort('trackingId')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#111827] select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tracking ID</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>

                {/* Status ↕ */}
                <th 
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#111827] select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>

                {/* Action */}
                <th className="py-3.5 px-4 whitespace-nowrap">
                  Action
                </th>

                {/* More options menu icon */}
                <th className="py-3.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0ECE6] text-[13.5px]">
              {currentDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#6B7280]">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-[#1F2937]">No delivery records found</p>
                    <p className="text-[12.5px] text-gray-400 mt-1">Try resetting the status or courier filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 bg-[#FAF7F2] border border-[#D1D5DB] rounded-lg text-[12px] font-medium text-[#374151]"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                currentDeliveries.map((item) => {
                  const isChecked = selectedOrders.has(item.orderNumber);

                  return (
                    <tr 
                      key={item.orderNumber}
                      className={`hover:bg-[#FAF8F5]/80 transition group ${
                        isChecked ? 'bg-[#FAF8F5]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOrder(item.orderNumber)}
                          aria-label={`Select ${item.orderNumber}`}
                          className="w-4 h-4 rounded border-gray-300 text-[#A87B3B] focus:ring-[#A87B3B] cursor-pointer"
                        />
                      </td>

                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#1F2937] leading-snug">
                          {item.orderNumber}
                        </div>
                        <div className="text-[12px] text-[#6B7280] leading-snug">
                          {item.date}
                        </div>
                      </td>

                      {/* Customer & Phone */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#1F2937] leading-snug">
                          {item.customerName}
                        </div>
                        <div className="text-[12px] text-[#6B7280] leading-snug">
                          {item.phone}
                        </div>
                      </td>

                      {/* Destination with MapPin icon */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#374151]">
                          <MapPin className="w-4 h-4 text-[#C49A45] flex-shrink-0" />
                          <span className="font-medium text-[13px]">{item.destination}</span>
                        </div>
                      </td>

                      {/* Courier */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#374151] font-medium text-[13px]">
                        {item.courier}
                      </td>

                      {/* Tracking ID with copy icon */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] text-[#374151]">
                            {item.trackingId}
                          </span>
                          <button
                            onClick={(e) => handleCopyTracking(item.trackingId, e)}
                            className="p-1 text-gray-400 hover:text-[#111827] rounded transition cursor-pointer"
                            title="Copy Tracking ID"
                          >
                            {copiedId === item.trackingId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.status === 'Ready to Dispatch' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FEF6E7] text-[#9A6B1F] border border-[#FDE68A]/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] inline-block" />
                            <span>Ready to Dispatch</span>
                          </span>
                        )}
                        {item.status === 'In Transit' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block" />
                            <span>In Transit</span>
                          </span>
                        )}
                        {item.status === 'Delivered' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
                            <span>Delivered</span>
                          </span>
                        )}
                        {item.status === 'Service Issues' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] inline-block" />
                            <span>Service Issue</span>
                          </span>
                        )}
                      </td>

                      {/* Action: Update Tracking button */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={(e) => handleOpenUpdateModal(item, e)}
                          className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-[#D1D5DB] rounded-lg text-[12.5px] font-medium text-[#374151] shadow-xs transition cursor-pointer"
                        >
                          Update Tracking
                        </button>
                      </td>

                      {/* Three-dots menu */}
                      <td className="py-3.5 px-2 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === item.orderNumber ? null : item.orderNumber);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#111827] rounded-lg hover:bg-gray-100 transition cursor-pointer"
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === item.orderNumber && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-3 top-10 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 py-1.5 text-[12.5px] text-[#374151] animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDetailsDrawerItem(item);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#FAF7F2] flex items-center gap-2 transition"
                            >
                              <Layers className="w-3.5 h-3.5 text-gray-400" />
                              <span>View Shipment Timeline</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleCopyTracking(item.trackingId);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#FAF7F2] flex items-center gap-2 transition"
                            >
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                              <span>Copy Tracking ID</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                addToast('WhatsApp Alert Simulated', `Sent dispatch tracking link to ${item.customerName} (${item.phone}).`);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#FAF7F2] flex items-center gap-2 text-emerald-700 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Send Customer WhatsApp</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                addToast('Label Printing', `Generating insured transit label for ${item.orderNumber}...`);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#FAF7F2] flex items-center gap-2 transition"
                            >
                              <Printer className="w-3.5 h-3.5 text-gray-400" />
                              <span>Print Consignment Label</span>
                            </button>

                            <div className="border-t border-[#F0ECE6] my-1" />

                            {item.status !== 'Delivered' && (
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  updateDeliveryStatus(item.orderNumber, 'Delivered', 'Delivered & signed by customer');
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[#ECFDF5] text-emerald-700 flex items-center gap-2 transition font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark as Delivered</span>
                              </button>
                            )}

                            {item.status !== 'Service Issues' && (
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  updateDeliveryStatus(item.orderNumber, 'Service Issues', 'Transit delay / verification needed');
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[#FEF2F2] text-red-600 flex items-center gap-2 transition font-medium"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Flag Service Issue</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Footer */}
        <div className="border-t border-[#E5E7EB] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-[#6B7280]">
          <div>
            Showing {totalOrders === 0 ? 0 : startIndex + 1}–{endIndex} of {totalOrders} orders
          </div>

          <div className="flex items-center gap-4 self-center sm:self-auto">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] text-[#6B7280]">Rows per page</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-[#D1D5DB] rounded-lg px-2.5 py-1 pr-7 text-[12.5px] text-[#374151] focus:ring-1 focus:ring-[#A87B3B] focus:outline-none cursor-pointer"
                >
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-[#4B5563]" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#A87B3B] text-white shadow-xs font-semibold'
                      : 'border border-transparent text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-[#4B5563]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: Update Tracking Modal */}
      {/* ============================================================ */}
      {isUpdateModalOpen && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-semibold text-[18px] text-[#1F1D1A]">
                  Update Consignment Tracking
                </h3>
                <span className="text-[12px] font-mono text-[#A87B3B] font-medium">
                  {selectedDelivery.orderNumber} • {selectedDelivery.customerName}
                </span>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Courier Partner
                </label>
                <select
                  value={updateFormData.courier}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, courier: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                >
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Ekart">Ekart</option>
                  <option value="India Post">India Post</option>
                  <option value="Showroom Express">Showroom Express</option>
                  <option value="Sequel Logistics">Sequel Secured Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Airway Bill (AWB) / Tracking Number
                </label>
                <input
                  type="text"
                  value={updateFormData.trackingId}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, trackingId: e.target.value }))}
                  placeholder="e.g. BD780123456IN"
                  required
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] font-mono focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Delivery Status
                </label>
                <select
                  value={updateFormData.status}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                >
                  <option value="Ready to Dispatch">Ready to Dispatch</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Service Issues">Service Issues</option>
                </select>
              </div>

              {updateFormData.status === 'Service Issues' && (
                <div>
                  <label className="block text-[12px] font-medium text-red-600 mb-1">
                    Service Issue Details / Hub Note
                  </label>
                  <textarea
                    rows={2}
                    value={updateFormData.issueDetails}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, issueDetails: e.target.value }))}
                    placeholder="e.g. Address incomplete; package held at courier hub for verification."
                    className="w-full bg-red-50/50 border border-red-200 rounded-xl p-2.5 text-[13px] text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  New Checkpoint Note (Optional)
                </label>
                <input
                  type="text"
                  value={updateFormData.checkpointNote}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, checkpointNote: e.target.value }))}
                  placeholder="e.g. Arrived at Airport sorting hub, out for delivery"
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFC8] flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendNotif"
                  checked={updateFormData.sendNotification}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, sendNotification: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#A87B3B] focus:ring-[#A87B3B]"
                />
                <label htmlFor="sendNotif" className="text-[12.5px] text-[#374151] cursor-pointer">
                  Send automated WhatsApp &amp; SMS tracking notification to customer ({selectedDelivery.phone})
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 border border-[#D1D5DB] bg-white hover:bg-gray-50 rounded-xl text-[13.5px] font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[13.5px] font-medium shadow-xs"
                >
                  Save Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: Create Dispatch Modal */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-semibold text-[18px] text-[#1F1D1A]">
                  Create Delivery Dispatch
                </h3>
                <p className="text-[12px] text-gray-500">
                  Register new jewellery consignment into delivery tracking queue
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-[13.5px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">
                    Order ID / Tag
                  </label>
                  <input
                    type="text"
                    value={createFormData.orderNumber}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                    required
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-[13.5px] font-mono focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">
                    Declared Insurance Value
                  </label>
                  <input
                    type="text"
                    value={createFormData.itemPrice}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, itemPrice: e.target.value }))}
                    placeholder="e.g. ₹ 85,000"
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={createFormData.customerName}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="e.g. Rajesh Sundaram"
                  required
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 00000"
                    required
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={createFormData.pincode}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, pincode: e.target.value }))}
                    placeholder="e.g. 600028"
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-[13.5px] font-mono focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Destination (City, State)
                </label>
                <input
                  type="text"
                  value={createFormData.destination}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  required
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">
                    Carrier
                  </label>
                  <select
                    value={createFormData.courier}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, courier: e.target.value }))}
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                  >
                    <option value="Blue Dart">Blue Dart</option>
                    <option value="Delhivery">Delhivery</option>
                    <option value="DTDC">DTDC</option>
                    <option value="Ekart">Ekart</option>
                    <option value="India Post">India Post</option>
                    <option value="Showroom Express">Showroom Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">
                    AWB / Tracking Number
                  </label>
                  <input
                    type="text"
                    value={createFormData.trackingId}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, trackingId: e.target.value }))}
                    placeholder="e.g. BD780123456IN"
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-[13.5px] font-mono focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  value={createFormData.itemsSummary}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, itemsSummary: e.target.value }))}
                  placeholder="e.g. 22K Hallmarked Antique Gold Bangle"
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13.5px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#D1D5DB] bg-white hover:bg-gray-50 rounded-xl text-[13.5px] font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[13.5px] font-medium shadow-xs"
                >
                  Register Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DRAWER: Shipment Timeline & History */}
      {/* ============================================================ */}
      {detailsDrawerItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col space-y-4 animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="text-[12px] font-mono text-[#A87B3B] font-bold">
                  {detailsDrawerItem.orderNumber}
                </span>
                <h3 className="font-semibold text-[18px] text-[#1F1D1A]">
                  Consignment Journey
                </h3>
              </div>
              <button
                onClick={() => setDetailsDrawerItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DFC8] space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient:</span>
                <span className="font-semibold text-[#1F1D1A]">{detailsDrawerItem.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact:</span>
                <span>{detailsDrawerItem.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination:</span>
                <span>{detailsDrawerItem.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Carrier / AWB:</span>
                <span className="font-mono text-[#A87B3B] font-medium">{detailsDrawerItem.courier} • {detailsDrawerItem.trackingId}</span>
              </div>
              {detailsDrawerItem.itemsSummary && (
                <div className="flex justify-between border-t border-[#E8DFC8] pt-1.5 mt-1.5">
                  <span className="text-gray-500">Parcel Content:</span>
                  <span className="text-right font-medium">{detailsDrawerItem.itemsSummary}</span>
                </div>
              )}
            </div>

            {/* Timeline checkpoints */}
            <div className="flex-1 space-y-3">
              <h4 className="text-[13px] font-semibold text-[#1F1D1A] uppercase tracking-wider">
                Tracking Milestones
              </h4>
              <div className="border-l-2 border-[#D8C39A] ml-2 pl-4 space-y-4">
                {(detailsDrawerItem.timeline || [
                  { timestamp: detailsDrawerItem.date, event: 'Consignment booked & sealed in showroom vault', user: 'Vault Supervisor' }
                ]).map((milestone, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#A87B3B] border-2 border-white" />
                    <div className="text-[12px] text-gray-400 font-mono">{milestone.timestamp}</div>
                    <div className="text-[13px] text-[#1F1D1A] font-medium">{milestone.event}</div>
                    {milestone.user && (
                      <div className="text-[11.5px] text-gray-500">Logged by: {milestone.user}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center gap-2">
              <button
                onClick={() => {
                  setDetailsDrawerItem(null);
                  handleOpenUpdateModal(detailsDrawerItem);
                }}
                className="flex-1 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[13px] font-medium transition"
              >
                Update Tracking
              </button>
              <button
                onClick={() => setDetailsDrawerItem(null)}
                className="px-4 py-2 border border-[#D1D5DB] rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

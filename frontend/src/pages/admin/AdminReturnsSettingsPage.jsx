import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Store, 
  CreditCard, 
  FileCheck, 
  Info, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MoreHorizontal, 
  X, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Phone, 
  MessageSquare,
  Printer,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminReturnsSettingsPage() {
  const { 
    returns = [], 
    settings = {}, 
    updateSettings, 
    updateReturnStatus, 
    processReturnInspection, 
    addToast 
  } = useAdmin();

  // Active filter tab
  const [activeStatusTab, setActiveStatusTab] = useState('All'); // 'All' | 'Pending' | 'Inspection' | 'Resolved' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection
  const [selectedReturnIds, setSelectedReturnIds] = useState(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Exactly 5 rows per page matching reference screenshot

  // Active menu dropdown
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals state
  const [inspectingCase, setInspectingCase] = useState(null);
  const [inspectionDecision, setInspectionDecision] = useState('return_to_inventory');
  const [inspectionNotes, setInspectionNotes] = useState('Weight matched declared. 22K (916 fineness) touchstone verified.');

  const [isEditSettingsOpen, setIsEditSettingsOpen] = useState(false);
  const [settingsFormData, setSettingsFormData] = useState({
    returnWindow: settings.returnWindow || '7 days from delivery',
    inspectionPeriod: settings.inspectionPeriod || '2-3 business days',
    returnMethod: settings.returnMethod || 'Courier / In-Store',
    refundMethod: settings.refundMethod || 'Original payment method',
    returnEligibility: settings.returnEligibility || 'Only unused & undamaged items'
  });

  const [activePolicyModal, setActivePolicyModal] = useState(null); // 'policy' | 'terms' | 'support'

  // Dynamic KPI counts
  const stats = useMemo(() => {
    const pending = returns.filter(r => r.status === 'Pending').length;
    const inspection = returns.filter(r => r.status === 'Inspection').length;
    const resolved = returns.filter(r => r.status === 'Resolved').length;
    const cancelled = returns.filter(r => r.status === 'Cancelled').length;
    return {
      total: returns.length,
      pending,
      inspection,
      resolved,
      cancelled
    };
  }, [returns]);

  // Handle clicking on KPI cards to switch tab
  const handleStatCardClick = (statusKey) => {
    setActiveStatusTab(statusKey);
    setCurrentPage(1);
  };

  // Filtered returns
  const filteredReturns = useMemo(() => {
    return returns.filter(item => {
      // Tab filter
      if (activeStatusTab !== 'All' && item.status !== activeStatusTab) {
        return false;
      }
      // Search query (id, order, customer, product, phone)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = item.id?.toLowerCase().includes(query);
        const matchOrder = item.orderId?.toLowerCase().includes(query);
        const matchCust = item.customerName?.toLowerCase().includes(query);
        const matchProd = item.productName?.toLowerCase().includes(query);
        const matchSku = item.productSku?.toLowerCase().includes(query);
        if (!matchId && !matchOrder && !matchCust && !matchProd && !matchSku) {
          return false;
        }
      }
      return true;
    });
  }, [returns, activeStatusTab, searchQuery]);

  // Pagination calculation
  const totalItems = filteredReturns.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentReturns = filteredReturns.slice(startIndex, endIndex);

  // Checkbox helpers
  const isAllSelected = currentReturns.length > 0 && currentReturns.every(r => selectedReturnIds.has(r.id));
  
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReturnIds(prev => {
        const next = new Set(prev);
        currentReturns.forEach(r => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedReturnIds(prev => {
        const next = new Set(prev);
        currentReturns.forEach(r => next.add(r.id));
        return next;
      });
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedReturnIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Save Settings Modal Submit
  const handleSaveSettingsSubmit = (e) => {
    e.preventDefault();
    updateSettings(settingsFormData);
    setIsEditSettingsOpen(false);
    addToast('Settings Saved', 'Return policies and parameters updated successfully.');
  };

  // Handle Inspection Submit
  const handleInspectionSubmit = (e) => {
    e.preventDefault();
    if (!inspectingCase) return;

    if (processReturnInspection) {
      processReturnInspection(inspectingCase.id, inspectionDecision, inspectionNotes);
    } else {
      const statusMap = {
        return_to_inventory: 'Resolved',
        mark_damaged: 'Resolved',
        escalate_owner: 'Inspection'
      };
      updateReturnStatus(inspectingCase.id, statusMap[inspectionDecision], 'Inspection Completed', inspectionNotes);
    }

    setInspectingCase(null);
  };

  return (
    <div className="space-y-6 font-admin-body animate-in fade-in duration-200">
      {/* 1. Header Banner & Generational Brand Slogan */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5C1D27] text-white text-[11px] font-semibold font-admin-body tracking-widest uppercase">
            SCREEN 5 • SETTINGS
          </span>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1C1917] tracking-tight font-admin-heading leading-tight mt-1">
            Returns &amp; Settings
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5 font-normal font-admin-body">
            Manage returns, inspections and system settings
          </p>
        </div>

        {/* Brand Tagline matching reference image */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="w-6 h-px bg-[#A87B3B] inline-block" />
          <span className="text-[11px] tracking-[0.16em] uppercase text-[#A87B3B] font-semibold">
            TRUSTED JEWELLERY FOR GENERATIONS
          </span>
        </div>
      </div>

      {/* 2. Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
        {/* Card 1: Pending Returns */}
        <div 
          onClick={() => handleStatCardClick('Pending')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(176,131,62,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            activeStatusTab === 'Pending' 
              ? 'border-[#B0833E] ring-2 ring-[#B0833E]/20 bg-[#FDFBF7]' 
              : 'border-[#E9E4DC] hover:border-[#B0833E]'
          }`}
        >
          {/* Top Accent Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B0833E] via-[#F4DEB7] to-[#B0833E]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Corner Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#B0833E]/5 rounded-full blur-2xl group-hover:bg-[#B0833E]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FEF6E7] to-[#FDE4C2] border border-[#FCD34D] flex items-center justify-center text-[#B0833E] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <RotateCcw className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#B0833E] transition-colors">
              Pending Returns
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.pending}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                requests
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#B0833E] group-hover:text-white group-hover:border-[#B0833E] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#B0833E]">
              <Clock className="w-3.5 h-3.5 text-[#B0833E] stroke-[2.2]" />
              <span>Awaiting inspection</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Customer return requests intake
            </span>
          </div>
        </div>

        {/* Card 2: Under Inspection */}
        <div 
          onClick={() => handleStatCardClick('Inspection')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(37,99,235,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            activeStatusTab === 'Inspection' 
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
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#2563EB] transition-colors">
              Under Inspection
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.inspection}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                in progress
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB]">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Purity &amp; weight QA</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Showroom vault verification
            </span>
          </div>
        </div>

        {/* Card 3: Resolved */}
        <div 
          onClick={() => handleStatCardClick('Resolved')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(22,163,74,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            activeStatusTab === 'Resolved' 
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ECFDF5] to-[#DCFCE7] border border-[#A7F3D0] flex items-center justify-center text-[#047857] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#047857] transition-colors">
              Resolved
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.resolved}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                completed
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#047857] group-hover:text-white group-hover:border-[#047857] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#047857]">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Refund / exchange complete</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Ledger adjusted &amp; restocked
            </span>
          </div>
        </div>

        {/* Card 4: Cancelled */}
        <div 
          onClick={() => handleStatCardClick('Cancelled')}
          className={`bg-white border rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(220,38,38,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
            activeStatusTab === 'Cancelled' 
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
              <XCircle className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#DC2626] transition-colors">
              Cancelled
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {stats.cancelled}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                cancelled
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#DC2626] group-hover:text-white group-hover:border-[#DC2626] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280]">
              <XCircle className="w-3.5 h-3.5 text-[#DC2626] stroke-[2.2]" />
              <span>Return request cancelled</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              No deduction or refund recorded
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid Layout: Left Column = Returns Table | Right Column = Settings Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Returns & Inspection Requests (8 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
            {/* Top Toolbar: Title, Search & Filter */}
            <div className="p-5 border-b border-[#E5E7EB] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-admin-body font-semibold text-[18px] sm:text-[20px] text-[#1F1D1A]">
                  Returns &amp; Inspection Requests
                </h2>

                <div className="flex items-center gap-2.5">
                  {/* Search input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by order ID, customer or product..."
                      className="w-full bg-white border border-[#D1D5DB] rounded-xl pl-9 pr-3 py-1.5 text-[12.5px] text-[#1F1D1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter action button */}
                  <button
                    onClick={() => {
                      if (activeStatusTab !== 'All') {
                        setActiveStatusTab('All');
                        setSearchQuery('');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D1D5DB] rounded-xl text-[12.5px] font-medium text-[#374151] hover:bg-gray-50 transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Status Tab Filter Pills matching reference screenshot */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'All', key: 'All', count: stats.total },
                  { label: 'Pending', key: 'Pending', count: stats.pending },
                  { label: 'Inspection', key: 'Inspection', count: stats.inspection },
                  { label: 'Resolved', key: 'Resolved', count: stats.resolved },
                  { label: 'Cancelled', key: 'Cancelled', count: stats.cancelled }
                ].map(tab => {
                  const isActive = activeStatusTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveStatusTab(tab.key);
                        setCurrentPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-[#5C1D27] text-white shadow-xs'
                          : 'bg-[#F9F7F5] border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3EFEA]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table of Returns */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13.5px] tabular-nums">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#4B5563]">
                    <th className="py-3 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all rows"
                        className="w-4 h-4 rounded border-gray-300 text-[#5C1D27] focus:ring-[#5C1D27] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Return ID</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Customer</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Product</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Return Reason</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Requested On</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Next Action</th>
                    <th className="py-3 px-3 whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0ECE6] text-[13px]">
                  {currentReturns.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#6B7280]">
                        <RotateCcw className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="font-medium text-[#1F1D1A]">No return records found</p>
                        <p className="text-[12px] text-gray-400 mt-1">Try selecting another filter tab or search keyword.</p>
                      </td>
                    </tr>
                  ) : (
                    currentReturns.map((row) => {
                      const isChecked = selectedReturnIds.has(row.id);

                      return (
                        <tr 
                          key={row.id}
                          className={`hover:bg-[#FAF8F5]/80 transition ${isChecked ? 'bg-[#FAF8F5]' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectRow(row.id)}
                              aria-label={`Select ${row.id}`}
                              className="w-4 h-4 rounded border-gray-300 text-[#5C1D27] focus:ring-[#5C1D27] cursor-pointer"
                            />
                          </td>

                          {/* Return ID & Order ID */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                              {row.id}
                            </div>
                            <div className="text-[11.5px] font-mono text-[#6B7280] leading-tight mt-0.5">
                              {row.orderId}
                            </div>
                          </td>

                          {/* Customer Name & Phone */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                              {row.customerName}
                            </div>
                            <div className="text-[11.5px] text-[#6B7280] leading-tight mt-0.5">
                              {row.phone}
                            </div>
                          </td>

                          {/* Product Thumbnail & SKU */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={row.productImage || '/images/col_gold.jpg'}
                                alt={row.productName}
                                className="w-9 h-9 rounded-lg object-cover border border-[#E5E7EB] flex-shrink-0 bg-stone-100"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/images/col_gold.jpg';
                                }}
                              />
                              <div className="min-w-0">
                                <div className="font-semibold text-[#1F1D1A] text-[12.5px] truncate max-w-[150px] leading-tight">
                                  {row.productName}
                                </div>
                                <div className="text-[11px] font-mono text-[#6B7280] leading-tight mt-0.5">
                                  SKU: {row.productSku}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Return Reason */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap text-[#374151] text-[12.5px]">
                            {row.returnReason}
                          </td>

                          {/* Requested On Date & Time */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <div className="text-[12.5px] text-[#1F1D1A] font-medium leading-tight">
                              {row.requestedDate}
                            </div>
                            <div className="text-[11.5px] text-[#6B7280] leading-tight mt-0.5">
                              {row.requestedTime}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            {row.status === 'Pending' && (
                              <span className="inline-block px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6E7] text-[#B45309] border border-[#FDE68A]/60">
                                Pending
                              </span>
                            )}
                            {row.status === 'Inspection' && (
                              <span className="inline-block px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]/60">
                                Inspection
                              </span>
                            )}
                            {row.status === 'Resolved' && (
                              <span className="inline-block px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/60">
                                Resolved
                              </span>
                            )}
                            {row.status === 'Cancelled' && (
                              <span className="inline-block px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]/60">
                                Cancelled
                              </span>
                            )}
                          </td>

                          {/* Next Action Button */}
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setInspectingCase(row);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#D1D5DB] rounded-lg text-[12px] font-medium text-[#374151] shadow-xs transition cursor-pointer"
                            >
                              {row.nextAction || 'View Details'}
                            </button>
                          </td>

                          {/* Three Dots Menu Icon */}
                          <td className="py-3.5 px-3 text-center relative whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === row.id ? null : row.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === row.id && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-3 top-10 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 py-1.5 text-[12px] text-[#374151] animate-in fade-in zoom-in-95 duration-100"
                              >
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setInspectingCase(row);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF7F2] flex items-center gap-2"
                                >
                                  <Scale className="w-3.5 h-3.5 text-[#B0833E]" />
                                  <span>Goldsmith Inspection</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    addToast('WhatsApp Sent', `Dispatched return update message to ${row.phone}`);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF7F2] flex items-center gap-2 text-emerald-700"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>WhatsApp Customer</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    addToast('Printing', `Printing return inspection sheet for ${row.id}...`);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF7F2] flex items-center gap-2"
                                >
                                  <Printer className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Print Dossier Sheet</span>
                                </button>
                                <div className="border-t border-[#F0ECE6] my-1" />
                                {row.status !== 'Resolved' && (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      updateReturnStatus(row.id, 'Resolved', 'View Report', 'Approved & marked resolved');
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-[#ECFDF5] text-emerald-700 font-medium flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Mark as Resolved</span>
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

            {/* Pagination Footer */}
            <div className="border-t border-[#E5E7EB] px-5 py-3.5 flex items-center justify-between text-[13px] text-[#6B7280]">
              <div>
                Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} returns
              </div>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-[#4B5563]" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition cursor-pointer ${
                      currentPage === num
                        ? 'bg-[#5C1D27] text-white shadow-xs font-semibold'
                        : 'border border-transparent text-[#374151] hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}

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

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Settings & Policies (4 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Return Settings Panel */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF3E8] border border-[#E8DFC8] flex items-center justify-center text-[#B0833E]">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[16px] text-[#1F1D1A]">
                  Return Settings
                </h3>
              </div>

              <button
                onClick={() => setIsEditSettingsOpen(true)}
                className="px-3 py-1.5 border border-[#D1D5DB] rounded-xl text-[12px] font-medium text-[#374151] hover:bg-gray-50 shadow-xs transition cursor-pointer"
              >
                Edit Settings
              </button>
            </div>

            {/* Parameters list */}
            <div className="space-y-3.5 text-[13px]">
              {/* Return Window */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 mt-0.5 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                    Return Window
                  </div>
                  <div className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                    {settings.returnWindow || '7 days from delivery'}
                  </div>
                </div>
              </div>

              {/* Inspection Period */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 mt-0.5 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                    Inspection Period
                  </div>
                  <div className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                    {settings.inspectionPeriod || '2-3 business days'}
                  </div>
                </div>
              </div>

              {/* Return Method */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 mt-0.5 flex-shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                    Return Method
                  </div>
                  <div className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                    {settings.returnMethod || 'Courier / In-Store'}
                  </div>
                </div>
              </div>

              {/* Refund Method */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 mt-0.5 flex-shrink-0">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                    Refund Method
                  </div>
                  <div className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                    {settings.refundMethod || 'Original payment method'}
                  </div>
                </div>
              </div>

              {/* Return Eligibility */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 mt-0.5 flex-shrink-0">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F1D1A] text-[13px] leading-tight">
                    Return Eligibility
                  </div>
                  <div className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                    {settings.returnEligibility || 'Only unused & undamaged items'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Policy & Information Panel */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FAF3E8] border border-[#E8DFC8] flex items-center justify-center text-[#B0833E]">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-[16px] text-[#1F1D1A]">
                Policy &amp; Information
              </h3>
            </div>

            <div className="space-y-1 pt-1">
              {/* Return Policy link */}
              <div
                onClick={() => setActivePolicyModal('policy')}
                className="flex items-center justify-between p-2.5 hover:bg-[#FAF8F5] rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 group-hover:text-[#B0833E]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1F1D1A] leading-tight">
                      Return Policy
                    </div>
                    <div className="text-[11.5px] text-[#6B7280] leading-tight">
                      View customer return policy
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
              </div>

              {/* Terms & Conditions link */}
              <div
                onClick={() => setActivePolicyModal('terms')}
                className="flex items-center justify-between p-2.5 hover:bg-[#FAF8F5] rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 group-hover:text-[#B0833E]">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1F1D1A] leading-tight">
                      Terms &amp; Conditions
                    </div>
                    <div className="text-[11.5px] text-[#6B7280] leading-tight">
                      View terms and conditions
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
              </div>

              {/* Help & Support link */}
              <div
                onClick={() => setActivePolicyModal('support')}
                className="flex items-center justify-between p-2.5 hover:bg-[#FAF8F5] rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-gray-500 group-hover:text-[#B0833E]">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1F1D1A] leading-tight">
                      Help &amp; Support
                    </div>
                    <div className="text-[11.5px] text-[#6B7280] leading-tight">
                      Customer support details
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Goldsmith Bench Inspection Drawer / Modal */}
      {/* ========================================================= */}
      {inspectingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="text-[12px] font-mono text-[#A87B3B] font-bold">
                  {inspectingCase.id} • {inspectingCase.orderId}
                </span>
                <h3 className="font-semibold text-[18px] text-[#1F1D1A]">
                  Item Return Inspection
                </h3>
              </div>
              <button
                onClick={() => setInspectingCase(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item Summary Card */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DFC8] flex items-center gap-3">
              <img
                src={inspectingCase.productImage || '/images/col_gold.jpg'}
                alt={inspectingCase.productName}
                className="w-12 h-12 rounded-lg object-cover border border-[#E5E7EB] flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[#1F1D1A] text-[13.5px] truncate">
                  {inspectingCase.productName}
                </div>
                <div className="text-[12px] text-[#6B7280]">
                  Customer: {inspectingCase.customerName} ({inspectingCase.phone})
                </div>
                <div className="text-[12px] text-[#A87B3B] font-medium mt-0.5">
                  Reason: {inspectingCase.returnReason}
                </div>
              </div>
            </div>

            <form onSubmit={handleInspectionSubmit} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Inspection Outcome &amp; Restock Decision
                </label>
                <select
                  value={inspectionDecision}
                  onChange={(e) => setInspectionDecision(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                >
                  <option value="return_to_inventory">Approve &amp; Return to Available Inventory</option>
                  <option value="mark_damaged">Reject / Metal Damaged - Send to Melting Safe</option>
                  <option value="escalate_owner">Escalate to Managing Director for Purity Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Bench Assayer Verification Notes
                </label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Detail weight check, hallmark seal status, and surface condition..."
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl p-3 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setInspectingCase(null)}
                  className="px-4 py-2 border border-[#D1D5DB] bg-white hover:bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5C1D27] hover:bg-[#48161E] text-white rounded-xl text-[13px] font-medium shadow-xs"
                >
                  Submit Inspection Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: Edit Return Settings Modal */}
      {/* ========================================================= */}
      {isEditSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-semibold text-[18px] text-[#1F1D1A]">
                  Edit Return Settings
                </h3>
                <p className="text-[12px] text-gray-500">
                  Update showroom policy parameters and inspection rules
                </p>
              </div>
              <button
                onClick={() => setIsEditSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Return Window
                </label>
                <input
                  type="text"
                  value={settingsFormData.returnWindow}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, returnWindow: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Inspection Period
                </label>
                <input
                  type="text"
                  value={settingsFormData.inspectionPeriod}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, inspectionPeriod: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Return Method
                </label>
                <input
                  type="text"
                  value={settingsFormData.returnMethod}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, returnMethod: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Refund Method
                </label>
                <input
                  type="text"
                  value={settingsFormData.refundMethod}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, refundMethod: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">
                  Return Eligibility
                </label>
                <input
                  type="text"
                  value={settingsFormData.returnEligibility}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, returnEligibility: e.target.value }))}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2 text-[13px] focus:ring-2 focus:ring-[#A87B3B]/30 focus:border-[#A87B3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setIsEditSettingsOpen(false)}
                  className="px-4 py-2 border border-[#D1D5DB] bg-white hover:bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A87B3B] hover:bg-[#92652A] text-white rounded-xl text-[13px] font-medium shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Policy Documentation Viewers */}
      {/* ========================================================= */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="font-semibold text-[18px] text-[#1F1D1A]">
                {activePolicyModal === 'policy' && 'Customer Return & Exchange Policy'}
                {activePolicyModal === 'terms' && 'Showroom Terms & Conditions'}
                {activePolicyModal === 'support' && 'VIP Customer Help & Support'}
              </h3>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[13px] text-[#374151] space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-1">
              {activePolicyModal === 'policy' && (
                <>
                  <p><strong>1. Window of Return:</strong> Customers may initiate a return or exchange within 7 days of package delivery or counter purchase.</p>
                  <p><strong>2. Seal &amp; Hallmark Integrity:</strong> Items must have original tamper-proof hallmark seals and barcode tags intact. Silver articles are subject to touchstone purity assay.</p>
                  <p><strong>3. Reverse Pickup:</strong> Secured insured armoured pickup is arranged via Blue Dart Apex or Sequel Secured Logistics.</p>
                </>
              )}
              {activePolicyModal === 'terms' && (
                <>
                  <p><strong>1. Valuation on Return:</strong> Gold value is credited according to standard BIS 916 purity benchmarks verified at the showroom bench.</p>
                  <p><strong>2. Custom &amp; Bespoke Orders:</strong> 1-of-1 bridal bespoke pieces modified to customer measurements require owner managerial review.</p>
                  <p><strong>3. Refund Dispatch:</strong> Bank RTGS / UPI refunds are processed within 2-3 working days following metal assay clearance.</p>
                </>
              )}
              {activePolicyModal === 'support' && (
                <>
                  <p><strong>Showroom Concierge Desk:</strong> Direct phone: +91 70108 94104</p>
                  <p><strong>WhatsApp Support:</strong> Available 10:00 AM - 08:30 PM for instant live video inspection and hold consultations.</p>
                  <p><strong>Email:</strong> support@vedaradha.com</p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5E7EB]">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2 bg-[#5C1D27] text-white rounded-xl text-[13px] font-medium"
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

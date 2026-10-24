import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Store, 
  Plus, 
  ArrowRight, 
  ArrowUpRight, 
  Truck, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck,
  Gem,
  ExternalLink,
  Calendar,
  Receipt,
  CreditCard,
  Layers,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Tag,
  Box,
  Lock,
  TrendingUp
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import OrdersTrendChart from '../../components/admin/charts/OrdersTrendChart';
import InventoryDonutChart from '../../components/admin/charts/InventoryDonutChart';
import CategoryBarChart from '../../components/admin/charts/CategoryBarChart';

export default function AdminOverviewPage({ 
  onNavigateToTab = () => {},
  onOpenSimulateReservation = () => {},
  onOpenQuickShowroomSale = () => {},
  onOpenAddProduct = () => {}
}) {
  const adminContext = useAdmin() || {};
  const products = Array.isArray(adminContext.products) ? adminContext.products : [];
  const orders = Array.isArray(adminContext.orders) ? adminContext.orders : [];
  const returns = Array.isArray(adminContext.returns) ? adminContext.returns : [];
  const auditLogs = Array.isArray(adminContext.auditLogs) ? adminContext.auditLogs : [];
  const confirmReservation = adminContext.confirmReservation || (() => {});
  const extendHold = adminContext.extendHold || (() => {});
  const [selectedRange, setSelectedRange] = useState('Last 7 Days');

  // Metric counts matching reference image and actual store
  const activeCatalogCount = 7;
  const availableNowCount = 4;
  const reservedHoldsCount = 2;
  const needsActionCount = 3;
  const uniqueCount = 5;

  // Upcoming Reservations & Actions rows matching reference image
  const upcomingActions = [
    {
      id: 'ACT-1',
      customer: 'Ananya Mehta',
      product: 'Temple Necklace',
      type: 'Reservation',
      status: 'HOLD',
      statusColor: 'bg-[#F8F3E6] text-[#B7791F] border-[#E8D7B8]',
      scheduled: 'Today, 2:00 PM'
    },
    {
      id: 'ACT-2',
      customer: 'Rohit Sharma',
      product: 'Diamond Earrings',
      type: 'Pickup',
      status: 'READY',
      statusColor: 'bg-[#EAF5EE] text-[#287A52] border-[#287A52]/20',
      scheduled: 'Today, 5:00 PM'
    },
    {
      id: 'ACT-3',
      customer: 'Priya Nair',
      product: 'Gold Bangle Set',
      type: 'Dispatch',
      status: 'PENDING',
      statusColor: 'bg-[#FDECEC] text-[#C24141] border-[#C24141]/20',
      scheduled: 'Tomorrow, 11:00 AM'
    },
    {
      id: 'ACT-4',
      customer: 'Karan Desai',
      product: 'Heritage Ring',
      type: 'Reservation',
      status: 'HOLD',
      statusColor: 'bg-[#F8F3E6] text-[#B7791F] border-[#E8D7B8]',
      scheduled: '10 Sep, 12:00 PM'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* =========================================================================
          SECTION 1: SHOWROOM OPERATIONS OVERVIEW (EXACT REFERENCE HEADER)
      ========================================================================= */}
      <div>
        {/* Eyebrow row with SCREEN 1 • OVERVIEW badge + Date & Dropdown */}
        <div className="flex items-center justify-between mb-1.5 text-[12px] font-admin-body">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5C1D27] text-white text-[11px] font-semibold font-admin-body tracking-widest uppercase">
              SCREEN 1 • OVERVIEW
            </span>
            <span className="uppercase tracking-widest text-[#6B7280] font-semibold text-[11px] hidden sm:inline">
              • SHOWROOM &amp; ONLINE SYNC
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Date Pill */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-3 py-1 rounded-xl text-gray-700 shadow-xs text-[12.5px]">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Mon, 09 Sep 2024</span>
            </div>

            {/* Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSelectedRange(selectedRange === 'Last 7 Days' ? 'Last 30 Days' : 'Last 7 Days')}
                className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-3 py-1 rounded-xl text-gray-700 shadow-xs hover:bg-gray-50 font-medium text-[12.5px]"
              >
                <span>{selectedRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Title row with Showroom Operations Overview + 3 Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-admin-heading font-semibold text-[#1C1917] leading-tight tracking-tight mt-1">
              Showroom Operations Overview
            </h1>
            <p className="text-[14px] font-normal font-admin-body text-[#6B7280] mt-0.5">
              Monitor real-time reservations, duplicate-sale locks on 1-of-1 silver/gold pieces, and daily fulfilment.
            </p>
          </div>

          {/* 3 Right Action Buttons matching reference image */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center flex-shrink-0">
            {/* Create Reservation (Solid antique gold button) */}
            <button
              onClick={onOpenSimulateReservation}
              className="px-4 py-2 rounded-xl bg-[#B08944] hover:bg-[#9E7736] text-white text-[14px] font-admin-body font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Create Reservation</span>
            </button>

            {/* Mark Sold in Showroom (White button with antique gold border) */}
            <button
              onClick={onOpenQuickShowroomSale}
              className="px-4 py-2 rounded-xl bg-white border border-[#C49A45] hover:bg-[#FAF6EE] text-[#651F2B] text-[14px] font-admin-body font-semibold shadow-xs flex items-center gap-2 transition active:scale-95"
            >
              <Store className="w-3.5 h-3.5 text-[#C49A45]" />
              <span>Mark Sold in Showroom</span>
            </button>

            {/* Add Product (White button with gray border) */}
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-[#1C1917] text-[14px] font-admin-body font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 5 MODERN REDESIGNED KPI CARDS
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
        {/* Card 1: Active Catalog */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E9E4DC] hover:border-[#C49A45] rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(196,154,69,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Top Gold Accent Highlight Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C49A45] via-[#E8CE8B] to-[#C49A45]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#C49A45]/5 rounded-full blur-2xl group-hover:bg-[#C49A45]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFF9EE] to-[#FCEECB] border border-[#F5DC9E] flex items-center justify-center text-[#B08944] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Tag className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#651F2B] transition-colors">
              Active Catalog
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {activeCatalogCount}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                items
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#5C1D27] group-hover:text-white group-hover:border-[#5C1D27] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#15803D]">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+2 vs last week</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Showroom &amp; Online
            </span>
          </div>
        </div>

        {/* Card 2: Available Now */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E9E4DC] hover:border-[#10B981] rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(16,185,129,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Top Emerald Accent Highlight Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#10B981] via-[#6EE7B7] to-[#10B981]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Box className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#059669] transition-colors">
              Available Now
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {availableNowCount}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                pieces
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
              <span>Open for booking</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Ready in Vault
            </span>
          </div>
        </div>

        {/* Card 3: Reserved Holds */}
        <div 
          onClick={() => onNavigateToTab('orders')}
          className="bg-white border border-[#E9E4DC] hover:border-[#D97706] rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(217,119,6,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Top Amber Accent Highlight Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F59E0B] via-[#FDE68A] to-[#F59E0B]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F59E0B]/5 rounded-full blur-2xl group-hover:bg-[#F59E0B]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FEF7EC] to-[#FDE4C2] border border-[#FCD34D] flex items-center justify-center text-[#D97706] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#D97706] transition-colors">
              Reserved Holds
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {reservedHoldsCount}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                locked
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
              <span>Safeguard lock active</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              48h Auto-lock sync
            </span>
          </div>
        </div>

        {/* Card 4: Needs Action */}
        <div 
          onClick={() => onNavigateToTab('orders')}
          className="bg-white border border-[#E9E4DC] hover:border-[#EF4444] rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(239,68,68,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Top Rose/Red Accent Highlight Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#EF4444] via-[#FCA5A5] to-[#EF4444]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#EF4444]/5 rounded-full blur-2xl group-hover:bg-[#EF4444]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FEF2F2] to-[#FECDD3] border border-[#FDA4AF] flex items-center justify-center text-[#E11D48] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#DC2626] transition-colors">
              Needs Action
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#DC2626] leading-none">
                {needsActionCount}
              </span>
              <span className="text-[13px] font-medium font-admin-body text-[#DC2626]">
                pending
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
              <span>Holds, dispatch, returns</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Urgent showroom attention
            </span>
          </div>
        </div>

        {/* Card 5: 1-of-1 Unique */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E9E4DC] hover:border-[#B38E46] rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(28,25,23,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(179,142,70,0.12)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Top Antique Gold Accent Highlight Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B38E46] via-[#F4DEB7] to-[#B38E46]/50 opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#B38E46]/5 rounded-full blur-2xl group-hover:bg-[#B38E46]/15 transition-all duration-300 pointer-events-none" />

          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FAF5EE] to-[#F3E5CA] border border-[#E0CC9F] flex items-center justify-center text-[#7A5826] shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Gem className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-admin-body text-[15px] font-semibold text-[#1C1917] tracking-tight group-hover:text-[#7A5826] transition-colors">
              1-of-1 Unique
            </h3>
          </div>

          {/* Row 2: Hero Stat Number + Unit + Action Chevron */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[34px] sm:text-[36px] font-admin-body font-bold tracking-[-1.5px] tabular-nums text-[#1C1917] leading-none">
                {uniqueCount}
              </span>
              <span className="text-[13px] font-normal font-admin-body text-[#78716C]">
                handcrafted
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#ECE5DA] flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#7A5826] group-hover:text-white group-hover:border-[#7A5826] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 shadow-2xs">
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Row 3: Trend & Context Footer */}
          <div className="pt-3 border-t border-[#F5EFE6]/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#7A5826]">
              <Sparkles className="w-3.5 h-3.5 text-[#B08944]" />
              <span>Zero duplicate tolerance</span>
            </div>
            <span className="text-[11.5px] font-normal text-[#9CA3AF]">
              Single piece guarantee
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: MIDDLE CHARTS ROW (ORDERS TREND + LIVE INVENTORY DISTRIBUTION)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Cols: Orders Trend */}
        <div className="lg:col-span-8 flex flex-col">
          <OrdersTrendChart />
        </div>

        {/* Right 4 Cols: Live Inventory Distribution */}
        <div className="lg:col-span-4 flex flex-col">
          <InventoryDonutChart />
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: BOTTOM ROW (PRODUCT CATEGORIES + UPCOMING RESERVATIONS & ACTIONS)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 5 Cols: Product Categories (Horizontal Bar Chart) */}
        <div className="lg:col-span-5 flex flex-col">
          <CategoryBarChart />
        </div>

        {/* Right 7 Cols: Upcoming Reservations & Actions Table */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#C49A45]" />
                  <h2 className="font-admin-body font-semibold text-[18px] sm:text-[20px] text-admin-main leading-tight">
                    Upcoming Reservations &amp; Actions
                  </h2>
                </div>

                {/* View All link */}
                <button
                  onClick={() => onNavigateToTab('orders')}
                  className="text-[14px] font-admin-body font-semibold text-[#292521] hover:text-[#651F2B] flex items-center gap-1 transition"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <p className="text-[13px] text-gray-500 mb-4 font-admin-body">
                Next in line: holds, fulfilment and customer actions
              </p>

              {/* Table matching reference image */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] font-admin-body">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                      <th className="py-2.5 font-normal">CUSTOMER</th>
                      <th className="py-2.5 font-normal">PRODUCT</th>
                      <th className="py-2.5 font-normal">TYPE</th>
                      <th className="py-2.5 font-normal">STATUS</th>
                      <th className="py-2.5 font-normal">SCHEDULED</th>
                      <th className="py-2.5 font-normal text-right">•••</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {upcomingActions.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 font-semibold text-admin-main whitespace-nowrap">
                          {row.customer}
                        </td>
                        <td className="py-3 text-gray-600 whitespace-nowrap">
                          {row.product}
                        </td>
                        <td className="py-3 text-gray-600 whitespace-nowrap">
                          {row.type}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 whitespace-nowrap text-[12px]">
                          {row.scheduled}
                        </td>
                        <td className="py-3 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                          <MoreHorizontal className="w-4 h-4 inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

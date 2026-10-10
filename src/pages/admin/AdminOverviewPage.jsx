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
  Lock
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
        {/* Eyebrow row with SHOWROOM & ONLINE SYNC + Date & Dropdown */}
        <div className="flex items-center justify-between mb-1.5 text-[12px] font-admin-body">
          <span className="uppercase tracking-widest text-gray-500 font-semibold text-[11px]">
            SHOWROOM & ONLINE SYNC
          </span>

          <div className="flex items-center gap-2">
            {/* Date Pill */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-3 py-1 rounded-xl text-gray-700 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Mon, 09 Sep 2024</span>
            </div>

            {/* Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSelectedRange(selectedRange === 'Last 7 Days' ? 'Last 30 Days' : 'Last 7 Days')}
                className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-3 py-1 rounded-xl text-gray-700 shadow-xs hover:bg-gray-50 font-medium"
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
            <h2 className="text-[32px] font-admin-heading font-semibold text-admin-main leading-tight">
              Showroom Operations Overview
            </h2>
            <p className="text-[14px] font-admin-body text-gray-500 mt-0.5">
              Monitor real-time reservations, duplicate-sale locks on 1-of-1 silver/gold pieces, and daily fulfilment.
            </p>
          </div>

          {/* 3 Right Action Buttons matching reference image */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center flex-shrink-0">
            {/* Create Reservation (Solid antique gold button) */}
            <button
              onClick={onOpenSimulateReservation}
              className="px-4 py-2 rounded-xl bg-[#B08944] hover:bg-[#9E7736] text-white text-[13px] font-admin-body font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Create Reservation</span>
            </button>

            {/* Mark Sold in Showroom (White button with antique gold border) */}
            <button
              onClick={onOpenQuickShowroomSale}
              className="px-4 py-2 rounded-xl bg-white border border-[#C49A45] hover:bg-[#FAF6EE] text-[#651F2B] text-[13px] font-admin-body font-semibold shadow-xs flex items-center gap-2 transition active:scale-95"
            >
              <Store className="w-3.5 h-3.5 text-[#C49A45]" />
              <span>Mark Sold in Showroom</span>
            </button>

            {/* Add Product (White button with gray border) */}
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-admin-main text-[13px] font-admin-body font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 5 KPI CARDS (EXACT REFERENCE IMAGE MATCH)
      ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 items-stretch">
        {/* Card 1: Active Catalog */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs hover:border-[#C49A45] hover:shadow-sm cursor-pointer transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] flex items-center justify-center text-[#C49A45]">
              <Tag className="w-4 h-4" />
            </div>
            <div className="flex-1 ml-2.5 font-admin-body text-[13px] font-semibold text-gray-800 truncate">
              Active Catalog
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="text-[30px] font-admin-heading font-bold text-admin-main leading-none">
              {activeCatalogCount} <span className="text-[13px] font-admin-body font-normal text-gray-500">items</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-admin-main group-hover:translate-x-0.5 transition" />
          </div>

          <div className="mt-2 text-[12px] font-admin-body">
            <div className="text-[#16A34A] font-medium flex items-center gap-1">
              <span>↗ +2 vs last week</span>
            </div>
            <div className="text-gray-400 text-[11px] mt-0.5">
              Showroom & Online
            </div>
          </div>
        </div>

        {/* Card 2: Available Now */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs hover:border-[#16A34A] hover:shadow-sm cursor-pointer transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] flex items-center justify-center text-[#16A34A]">
              <Box className="w-4 h-4" />
            </div>
            <div className="flex-1 ml-2.5 font-admin-body text-[13px] font-semibold text-gray-800 truncate">
              Available Now
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="text-[30px] font-admin-heading font-bold text-admin-main leading-none">
              {availableNowCount} <span className="text-[13px] font-admin-body font-normal text-gray-500">pieces</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-admin-main group-hover:translate-x-0.5 transition" />
          </div>

          <div className="mt-2 text-[12px] font-admin-body">
            <div className="text-[#16A34A] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Open for booking</span>
            </div>
          </div>
        </div>

        {/* Card 3: Reserved Holds */}
        <div 
          onClick={() => onNavigateToTab('orders')}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs hover:border-[#C49A45] hover:shadow-sm cursor-pointer transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] flex items-center justify-center text-[#C49A45]">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1 ml-2.5 font-admin-body text-[13px] font-semibold text-gray-800 truncate">
              Reserved Holds
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="text-[30px] font-admin-heading font-bold text-admin-main leading-none">
              {reservedHoldsCount} <span className="text-[13px] font-admin-body font-normal text-gray-500">locked</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-admin-main group-hover:translate-x-0.5 transition" />
          </div>

          <div className="mt-2 text-[12px] font-admin-body">
            <div className="text-[#C49A45] font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C49A45]" />
              <span>Safeguard lock active</span>
            </div>
          </div>
        </div>

        {/* Card 4: Needs Action */}
        <div 
          onClick={() => onNavigateToTab('orders')}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs hover:border-[#C24141] hover:shadow-sm cursor-pointer transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDECEC] flex items-center justify-center text-[#C24141]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 ml-2.5 font-admin-body text-[13px] font-semibold text-gray-800 truncate">
              Needs Action
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="text-[30px] font-admin-heading font-bold text-[#C24141] leading-none">
              {needsActionCount} <span className="text-[13px] font-admin-body font-normal text-gray-500">pending</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-admin-main group-hover:translate-x-0.5 transition" />
          </div>

          <div className="mt-2 text-[12px] font-admin-body">
            <div className="text-[#C24141] font-medium">
              Holds, dispatch, returns
            </div>
          </div>
        </div>

        {/* Card 5: 1-of-1 Unique */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs hover:border-[#651F2B] hover:shadow-sm cursor-pointer transition flex flex-col justify-between group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] flex items-center justify-center text-[#C49A45]">
              <Gem className="w-4 h-4" />
            </div>
            <div className="flex-1 ml-2.5 font-admin-body text-[13px] font-semibold text-gray-800 truncate">
              1-of-1 Unique
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="text-[30px] font-admin-heading font-bold text-admin-main leading-none">
              {uniqueCount} <span className="text-[13px] font-admin-body font-normal text-gray-500">handcrafted</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-admin-main group-hover:translate-x-0.5 transition" />
          </div>

          <div className="mt-2 text-[12px] font-admin-body text-gray-400">
            Zero duplicate tolerance
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
                  <h3 className="font-admin-heading font-semibold text-[22px] text-admin-main leading-tight">
                    Upcoming Reservations & Actions
                  </h3>
                </div>

                {/* View All link */}
                <button
                  onClick={() => onNavigateToTab('orders')}
                  className="text-[13px] font-admin-body font-semibold text-[#292521] hover:text-[#651F2B] flex items-center gap-1 transition"
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

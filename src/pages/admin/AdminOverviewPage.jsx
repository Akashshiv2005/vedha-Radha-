import React from 'react';
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
  Gem,
  ExternalLink
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
  const { products, orders, returns, auditLogs, confirmReservation, extendHold } = useAdmin();

  // Metric computations
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'available').length;
  const reservedProducts = products.filter(p => p.status === 'reserved').length;
  const uniqueItemsCount = products.filter(p => p.isUnique).length;
  const awaitingOrders = orders.filter(o => o.status === 'awaiting_confirmation');
  const expiringHolds = orders.filter(o => o.status === 'reserved' && o.holdExpiresAt);
  const openReturns = returns.filter(r => r.currentStep !== 'resolved');
  const needsActionCount = awaitingOrders.length + expiringHolds.length + openReturns.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E3D9CC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-[#5C1D27] text-white rounded">
              Screen 1 • Executive Summary
            </span>
            <span className="text-xs text-gray-500 font-medium">Showroom & Online Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1614] mt-1">
            Showroom Operations Overview
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Monitor real-time reservations, duplicate-sale locks on 1-of-1 silver/gold pieces, and daily fulfillment.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenSimulateReservation}
            className="px-3.5 py-2 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white text-xs font-semibold shadow flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Create Reservation</span>
          </button>

          <button
            onClick={onOpenQuickShowroomSale}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#C5A059] text-[#7A5B20] hover:bg-[#FAF5EE] text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
          >
            <Store className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Mark Sold in Showroom</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B3] text-gray-800 hover:bg-[#EFE8DD] text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5 text-gray-600" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Active Products */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm hover:border-[#C5A059] cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Catalog</span>
            <Package className="w-4 h-4 text-gray-400 group-hover:text-[#5C1D27] transition" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C1614]">
            {totalProducts} <span className="text-xs font-sans font-normal text-gray-500">items</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-between">
            <span>Showroom & Online</span>
            <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: Available Stock */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm hover:border-emerald-500 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Available Now</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-900">
            {availableProducts} <span className="text-xs font-sans font-normal text-gray-500">pieces</span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-1 font-medium">
            Open for booking
          </div>
        </div>

        {/* Card 3: Reserved / Customer Holds */}
        <div 
          onClick={() => onNavigateToTab('orders')}
          className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm hover:border-amber-500 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Reserved Holds</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-900">
            {reservedProducts} <span className="text-xs font-sans font-normal text-gray-500">locked</span>
          </div>
          <div className="text-[10px] text-amber-800 mt-1 font-medium">
            Safeguard lock active
          </div>
        </div>

        {/* Card 4: Orders Needing Action */}
        <div 
          onClick={() => onNavigateToTab('orders')}
          className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm hover:border-rose-500 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Needs Action</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-rose-900">
            {needsActionCount} <span className="text-xs font-sans font-normal text-gray-500">pending</span>
          </div>
          <div className="text-[10px] text-rose-700 mt-1 font-medium">
            Holds, dispatch, returns
          </div>
        </div>

        {/* Card 5: Unique 1-of-1 Pieces */}
        <div 
          onClick={() => onNavigateToTab('products')}
          className="bg-white border border-[#E3D9CC] rounded-2xl p-4 shadow-sm hover:border-[#7A5826] cursor-pointer transition group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">1-of-1 Unique</span>
            <Gem className="w-4 h-4 text-[#9B7A38]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#5C1D27]">
            {uniqueItemsCount} <span className="text-xs font-sans font-normal text-gray-500">handcrafted</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Zero duplicate tolerance
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Time-series Orders & Reservations Trend */}
        <div className="lg:col-span-2">
          <OrdersTrendChart />
        </div>

        {/* Right Col: Live Inventory Status Donut Chart */}
        <div className="lg:col-span-1">
          <InventoryDonutChart />
        </div>
      </div>

      {/* Category Volume & Needs Attention Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart (1 Col) */}
        <div className="lg:col-span-1">
          <CategoryBarChart />
        </div>

        {/* Needs Attention Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#E8DFD3] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <h3 className="font-serif font-bold text-sm text-[#1C1614]">
                  “Needs Attention” Operational Queue
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('orders')}
                className="text-xs font-semibold text-[#5C1D27] hover:underline flex items-center gap-1"
              >
                <span>View All Queues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* 1. New Reservations Awaiting Staff Confirmation */}
              {awaitingOrders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white border border-amber-300 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={order.productImage} 
                      alt={order.productName}
                      className="w-12 h-12 object-cover rounded-lg border flex-shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          New Hold Awaiting Call
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">{order.orderNumber}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 mt-0.5">
                        {order.customerName} ({order.phone})
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Item: <strong>{order.productName}</strong> ({order.productPrice})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => confirmReservation(order.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-medium shadow-sm transition"
                    >
                      Confirm Hold
                    </button>
                    <button
                      onClick={() => onNavigateToTab('orders')}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-[11px] font-medium transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}

              {/* 2. Expiring Holds */}
              {expiringHolds.slice(0, 2).map(order => (
                <div 
                  key={order.id} 
                  className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={order.productImage} 
                      alt={order.productName}
                      className="w-12 h-12 object-cover rounded-lg border flex-shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Expiring Hold Window
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">{order.orderNumber}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 mt-0.5">
                        {order.customerName} — {order.productName}
                      </h4>
                      <p className="text-[11px] text-rose-800 font-medium">
                        Expires: {new Date(order.holdExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({order.nextAction})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => extendHold(order.id, 24)}
                      className="px-3 py-1.5 rounded-lg bg-[#5C1D27] hover:bg-[#44131B] text-white text-[11px] font-medium shadow-sm transition"
                    >
                      Extend +24h
                    </button>
                    <button
                      onClick={() => onNavigateToTab('orders')}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-[11px] font-medium transition"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}

              {/* 3. Open Return Inspection */}
              {openReturns.map(ret => (
                <div 
                  key={ret.id} 
                  className="bg-white border border-sky-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={ret.productImage} 
                      alt={ret.productName}
                      className="w-12 h-12 object-cover rounded-lg border flex-shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                          Return Inspection Needed
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">{ret.id}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 mt-0.5">
                        {ret.customerName} — {ret.productName}
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        {ret.inspectionStatus} ({ret.weightVerification})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onNavigateToTab('returns_settings')}
                      className="px-3 py-1.5 rounded-lg bg-sky-800 hover:bg-sky-900 text-white text-[11px] font-medium shadow-sm transition flex items-center gap-1"
                    >
                      <span>Inspect Piece</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {needsActionCount === 0 && (
                <div className="py-8 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                  <p className="text-xs font-semibold text-gray-700">No urgent operational alerts</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">All customer holds and dispatches are up to date.</p>
                </div>
              )}
            </div>
          </div>

          {/* Audit trail snippet at bottom */}
          <div className="mt-4 pt-3 border-t border-[#E8DFD3] flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Latest Action: {auditLogs[0]?.description || 'System synchronized'}
            </span>
            <span className="font-mono text-[10px] text-gray-400 flex-shrink-0 ml-2">
              {auditLogs[0]?.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

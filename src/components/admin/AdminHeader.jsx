import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Store, 
  ExternalLink, 
  Menu, 
  X, 
  RotateCcw,
  CheckCircle2,
  Clock,
  LogOut
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ 
  onToggleSidebar = () => {}, 
  onOpenSimulateReservation = () => {},
  onOpenQuickShowroomSale = () => {},
  globalSearchQuery = '',
  setGlobalSearchQuery = () => {}
}) {
  const { orders, returns, auditLogs, resetToDemoDefaults } = useAdmin();
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const navigate = useNavigate();

  // Compute items needing attention
  const awaitingOrders = orders.filter(o => o.status === 'awaiting_confirmation');
  const expiringHolds = orders.filter(o => o.status === 'reserved' && o.holdExpiresAt);
  const openReturns = returns.filter(r => r.currentStep !== 'resolved');
  const attentionCount = awaitingOrders.length + expiringHolds.length + openReturns.length;

  return (
    <header className="bg-[#FAF7F2] border-b border-[#E3D9CC] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Mobile Sidebar Toggle + Live Showroom Status Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-700 hover:text-black rounded-lg hover:bg-[#EFE8DD] transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-[#F4EFE6] border border-[#E3D9CC] px-3 py-1.5 rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-[#2C2420]">
            Main Showroom Live
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-emerald-800 font-semibold font-mono">
            Safeguard Active
          </span>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by SKU, item name, customer, phone or pincode..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          className="w-full bg-white border border-[#D5C7B3] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2C2420] focus:ring-2 focus:ring-[#C5A059] focus:outline-none placeholder:text-gray-400 transition"
        />
        {globalSearchQuery && (
          <button 
            onClick={() => setGlobalSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right: Quick Action CTAs + Notifications + Storefront Switch + Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Demo Reservation CTA */}
        <button
          onClick={onOpenSimulateReservation}
          className="px-3.5 py-1.5 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white text-xs font-medium shadow flex items-center gap-1.5 transition transform active:scale-95"
          title="Simulate customer reservation to test inventory lock"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="hidden sm:inline">Simulate</span>
          <span>Reservation</span>
        </button>

        {/* Quick Showroom Sale CTA */}
        <button
          onClick={onOpenQuickShowroomSale}
          className="px-3 py-1.5 rounded-xl bg-white border border-[#C5A059] text-[#7A5B20] hover:bg-[#FAF5EE] text-xs font-medium shadow-sm flex items-center gap-1.5 transition"
          title="Mark item sold to walk-in customer at counter"
        >
          <Store className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="hidden lg:inline">Counter</span>
          <span>Sold POS</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-gray-700 hover:text-[#5C1D27] hover:bg-[#EFE8DD] rounded-xl relative transition"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {attentionCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center font-mono animate-bounce">
                {attentionCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E3D9CC] rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#5C1D27]" />
                  <span className="font-serif font-bold text-sm text-[#1C1614]">
                    Needs Attention Queue
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                  {attentionCount} Pending
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                {awaitingOrders.map(order => (
                  <div key={order.id} className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 font-mono text-[11px]">{order.orderNumber}</span>
                      <span className="text-[10px] text-amber-700 font-semibold">New Hold</span>
                    </div>
                    <p className="text-gray-800 text-[11px] mt-0.5">{order.customerName} reserved <strong>{order.productSku}</strong></p>
                    <p className="text-[10px] text-gray-500 mt-1">{order.nextAction}</p>
                  </div>
                ))}

                {expiringHolds.map(order => (
                  <div key={order.id} className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-950 font-mono text-[11px]">{order.orderNumber}</span>
                      <span className="text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expiring Hold
                      </span>
                    </div>
                    <p className="text-gray-800 text-[11px] mt-0.5">{order.customerName} ({order.phone})</p>
                    <p className="text-[10px] text-rose-800 font-medium mt-0.5">
                      Expires at: {new Date(order.holdExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}

                {openReturns.map(ret => (
                  <div key={ret.id} className="p-2.5 bg-sky-50/70 border border-sky-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-950 font-mono text-[11px]">{ret.id}</span>
                      <span className="text-[10px] text-sky-800 font-semibold">Return Inspection</span>
                    </div>
                    <p className="text-gray-800 text-[11px] mt-0.5">{ret.productName} ({ret.productSku})</p>
                    <p className="text-[10px] text-sky-700 mt-0.5">{ret.inspectionStatus}</p>
                  </div>
                ))}

                {attentionCount === 0 && (
                  <div className="py-6 text-center text-gray-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                    <p className="text-xs font-medium">All queues up to date!</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-gray-500 hover:text-gray-800 font-medium"
                >
                  Close
                </button>
                <span className="text-[10px] text-gray-400 italic">Auto-refreshing demo state</span>
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo State Button */}
        <button
          onClick={() => setResetConfirmOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-[#EFE8DD] rounded-xl transition"
          title="Reset demo data to initial state"
          aria-label="Reset demo data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Switch to Customer Storefront Website */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5C1D27] bg-[#5C1D27]/10 hover:bg-[#5C1D27]/20 rounded-xl transition"
        >
          <span>Showroom Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Staff User Profile & Sign Out */}
        <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-[#E3D9CC]">
          <div className="hidden xl:flex flex-col text-right leading-tight">
            <span className="text-[11px] font-bold text-[#1C1614] truncate max-w-[140px]">
              {user?.name || 'Staff User'}
            </span>
            <span className="text-[9.5px] text-gray-500 font-mono truncate max-w-[140px]">
              {user?.role ? user.role.split('&')[0].trim() : 'Showroom Staff'}
            </span>
          </div>

          <button
            onClick={async () => {
              await logout();
              navigate('/admin/login', { replace: true });
            }}
            className="p-2 text-gray-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition flex items-center gap-1.5"
            title="Sign out of staff session"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Sign out</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
            <h4 className="font-serif font-bold text-base text-gray-900 mb-2">Reset Demo State?</h4>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              This will restore the pristine sample catalogue, active reservation queues, and settings. Useful during a pitch presentation!
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDemoDefaults();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#5C1D27] text-white font-medium"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

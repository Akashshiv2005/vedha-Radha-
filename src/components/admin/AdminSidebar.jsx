import React from 'react';
import { 
  LayoutDashboard, 
  Gem, 
  CalendarClock, 
  Truck, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  X,
  LogOut
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ 
  currentTab = 'overview', 
  setCurrentTab = () => {}, 
  isOpen = false, 
  onClose = () => {} 
}) {
  const { products, orders, returns } = useAdmin();
  const { user, logout } = useAuth();

  // Badge calculations
  const totalProducts = products.length;
  const pendingReservations = orders.filter(o => ['awaiting_confirmation', 'reserved', 'new'].includes(o.status)).length;
  const pendingDispatch = orders.filter(o => ['processing', 'confirmed'].includes(o.status)).length;
  const pendingReturns = returns.filter(r => r.currentStep !== 'resolved').length;

  const navItems = [
    {
      id: 'overview',
      label: '1. Overview Dashboard',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Summary, trend charts & attention queue'
    },
    {
      id: 'products',
      label: '2. Product Inventory',
      shortLabel: 'Inventory',
      icon: Gem,
      badge: totalProducts,
      badgeType: 'neutral',
      desc: 'Catalog, unique 1-of-1 tags & stock'
    },
    {
      id: 'orders',
      label: '3. Reservations & Orders',
      shortLabel: 'Orders Queue',
      icon: CalendarClock,
      badge: pendingReservations > 0 ? pendingReservations : null,
      badgeType: 'warning',
      desc: 'Holds, showroom lockouts & timeline'
    },
    {
      id: 'delivery',
      label: '4. Delivery & Logistics',
      shortLabel: 'Delivery',
      icon: Truck,
      badge: pendingDispatch > 0 ? pendingDispatch : null,
      badgeType: 'info',
      desc: 'Pincode serviceability & tracking'
    },
    {
      id: 'returns_settings',
      label: '5. Returns & Settings',
      shortLabel: 'Returns & Config',
      icon: SlidersHorizontal,
      badge: pendingReturns > 0 ? pendingReturns : null,
      badgeType: 'danger',
      desc: 'Inspection cases & demo policies'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in" 
        />
      )}

      {/* Sidebar Aside */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1C1614] text-[#FAF7F2] flex flex-col border-r border-[#332A26] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#332A26] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#7A5826] p-0.5 shadow-md flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#1C1614] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
              </div>
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-wide text-white leading-tight">
                VEDA RADHA
              </h1>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A059] font-medium block">
                Showroom Admin Hub
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Showroom Context Banner */}
        <div className="px-5 py-3 bg-[#261E1A] border-b border-[#332A26] text-xs">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>Showroom Mode:</span>
            <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online
            </span>
          </div>
          <p className="text-[10px] text-gray-400 leading-snug">
            Prototype demo for duplicate sale prevention & multi-channel inventory.
          </p>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold">
            Admin Screens
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between group transition-all ${
                  isActive
                    ? 'bg-[#5C1D27] text-white shadow-lg font-medium border border-[#C5A059]/40'
                    : 'text-gray-300 hover:bg-[#2A221E] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 transition ${
                    isActive ? 'bg-[#FAF7F2]/15 text-[#C5A059]' : 'bg-white/5 text-gray-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate leading-tight">
                      {item.label}
                    </span>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>

                {/* Badge Indicator */}
                {item.badge !== null && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-1.5 ${
                    item.badgeType === 'warning'
                      ? 'bg-amber-500 text-black'
                      : item.badgeType === 'danger'
                      ? 'bg-rose-500 text-white'
                      : item.badgeType === 'info'
                      ? 'bg-sky-500 text-white'
                      : 'bg-[#332A26] text-gray-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Staff Profile & Logout */}
        <div className="p-3 border-t border-[#332A26] bg-[#171210] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#261E1A] border border-[#3A2F2A]">
            <div className="min-w-0 pr-2">
              <span className="text-[11px] font-bold text-white block truncate">
                {user?.name || 'Staff User'}
              </span>
              <span className="text-[9.5px] text-[#C5A059] block truncate font-mono">
                {user?.role || 'Staff Account'}
              </span>
            </div>
            <button
              onClick={async () => {
                await logout();
                window.location.href = '/admin/login';
              }}
              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
              title="Sign out of staff session"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[#C5A059] text-[10px] font-medium px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
            <span>Showroom Guardrail Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

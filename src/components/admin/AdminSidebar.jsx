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
      desc: 'Summary, trend charts & attention queues'
    },
    {
      id: 'products',
      label: '2. Product Inventory',
      shortLabel: 'Inventory',
      icon: Gem,
      badge: totalProducts > 0 ? totalProducts : 7,
      badgeType: 'neutral',
      desc: 'Catalog, unique 1-of-1 tags & stock control'
    },
    {
      id: 'orders',
      label: '3. Reservations & Orders',
      shortLabel: 'Orders Queue',
      icon: CalendarClock,
      badge: pendingReservations > 0 ? pendingReservations : 2,
      badgeType: 'warning',
      desc: 'Holds, showroom lockouts & timelines'
    },
    {
      id: 'delivery',
      label: '4. Delivery & Logistics',
      shortLabel: 'Delivery',
      icon: Truck,
      badge: 1,
      badgeType: 'warning',
      desc: 'Pincode serviceability & tracking'
    },
    {
      id: 'returns_settings',
      label: '5. Returns & Settings',
      shortLabel: 'Returns & Config',
      icon: SlidersHorizontal,
      badge: pendingReturns > 0 ? pendingReturns : 1,
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
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#2D0D15] text-[#FFFFFF] flex flex-col border-r border-[#421B23] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#421B23] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[#C49A45]/50 bg-[#35151B] p-0.5 shadow-md flex-shrink-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#C49A45]" />
            </div>
            <div>
              <h1 className="font-serif tracking-wider font-semibold text-[17px] text-[#F3EAD3] uppercase leading-tight">
                VEDA RADHA
              </h1>
              <span className="text-[11px] tracking-widest uppercase font-serif text-[#C49A45] font-semibold block">
                JEWELLERY
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#E5D9D5] hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Showroom Context Banner */}
        <div className="px-5 py-3 bg-[#3A141E] border-b border-[#421B23]">
          <div className="flex items-center justify-between text-[12px] font-admin-body text-[#E5D9D5] mb-1">
            <span className="font-medium text-[#E5D9D5]/90">Showroom Mode:</span>
            <span className="text-[#22C55E] font-medium font-admin-mono flex items-center gap-1.5 text-[12px]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block shadow-[0_0_6px_#22C55E]" /> Online
            </span>
          </div>
          <p className="text-[11.5px] font-admin-body text-[#E5D9D5]/70 leading-snug">
            Prototype demo for duplicate sale prevention &amp; multi-channel inventory.
          </p>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-admin-body uppercase tracking-wider text-[#E5D9D5]/60 font-semibold">
            ADMIN SCREENS
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
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between group transition-all relative ${
                  isActive
                    ? 'bg-[#651F2B] text-white shadow-md font-semibold border border-[#D8C39A]/40'
                    : 'text-[#E5D9D5] hover:bg-[#421B23] hover:text-white font-medium'
                }`}
              >
                {/* Active Gold Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#C49A45] rounded-r" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 transition ${
                    isActive ? 'bg-[#FFFFFF]/15 text-[#C49A45]' : 'bg-white/5 text-[#E5D9D5]/70 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[14px] font-admin-body block truncate leading-snug">
                      {item.label}
                    </span>
                    <span className={`text-[12px] font-admin-body block truncate ${isActive ? 'text-[#F2E7D5]' : 'text-[#E5D9D5]/70'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>

                {/* Badge Indicator */}
                {item.badge !== null && (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-admin-mono font-bold flex-shrink-0 ml-1.5 shadow-xs ${
                    item.badgeType === 'warning'
                      ? 'bg-[#B0833E] text-white'
                      : item.badgeType === 'danger'
                      ? 'bg-[#C24141] text-white'
                      : 'bg-white/15 text-white border border-white/10'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Staff Profile & Logout */}
        <div className="p-3 border-t border-[#421B23] bg-[#35151B] space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#421B23] border border-[#651F2B]/50">
            <div className="min-w-0 pr-2">
              <span className="text-[14px] font-admin-body font-semibold text-white block truncate">
                Admin
              </span>
              <span className="text-[12px] font-admin-body text-[#C49A45] block truncate font-medium">
                Administrator
              </span>
            </div>
            <button
              onClick={async () => {
                await logout();
                window.location.href = '/admin/login';
              }}
              className="p-1.5 text-[#E5D9D5] hover:text-[#C24141] hover:bg-[#FDECEC]/10 rounded-lg transition"
              title="Sign out of staff session"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[#C49A45] text-[12px] font-admin-body font-medium px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C49A45] flex-shrink-0" />
            <span>Showroom Guardrail Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

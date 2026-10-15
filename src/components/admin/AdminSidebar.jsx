import React from 'react';
import { 
  ShieldCheck, 
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LotusBrandMark({ className = "w-5 h-5 text-[#D6A84B]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Center Petal */}
      <path d="M20 4C16.8 8.2 16.8 13.2 20 19" />
      <path d="M20 4C23.2 8.2 23.2 13.2 20 19" />

      {/* Left Inner Petal */}
      <path d="M20 19C16.5 14 11.8 11.5 10.5 13.8C9.3 16.2 13.5 19 20 19Z" />

      {/* Right Inner Petal */}
      <path d="M20 19C23.5 14 28.2 11.5 29.5 13.8C30.7 16.2 26.5 19 20 19Z" />

      {/* Left Outer Petal */}
      <path d="M19 19.5C14.5 17.2 8.2 17.5 6.5 20C5.3 22 11.8 22.8 19.5 20.5" />

      {/* Right Outer Petal */}
      <path d="M21 19.5C25.5 17.2 31.8 17.5 33.5 20C34.7 22 28.2 22.8 20.5 20.5" />

      {/* Bottom Lotus Curve */}
      <path d="M10 21C13.5 23.5 16.8 24.5 20 24.5C23.2 24.5 26.5 23.5 30 21" />
    </svg>
  );
}

export default function AdminSidebar({ 
  currentTab = 'overview', 
  setCurrentTab = () => {}, 
  isOpen = false, 
  onClose = () => {} 
}) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'products', label: 'Product Inventory' },
    { id: 'orders', label: 'Reservations & Orders' },
    { id: 'delivery', label: 'Delivery & Logistics' },
    { id: 'returns_settings', label: 'Returns & Settings' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in" 
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside 
        aria-label="Admin Navigation Sidebar"
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#073F3B] text-[#F5F3EA] flex flex-col border-r border-[#0D5953] transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-[#0D5953] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Reference Logo Emblem */}
            <img 
              src="/images/vedha_radha_logo.png" 
              alt="Vedha Radha Brand Logo" 
              className="h-11 w-auto max-w-[85px] object-contain flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/vedha_radha_brand_logo.png';
              }}
            />

            {/* Subtle Vertical Divider Line matching reference */}
            <div className="w-[1px] h-8 bg-[#2F665F]/80 flex-shrink-0" />

            {/* Brand Title & Subtitle matching reference */}
            <div className="min-w-0">
              <h1 className="font-serif tracking-wide font-bold text-[17px] text-[#F5F3EA] uppercase leading-tight truncate">
                VEDA RADHA
              </h1>
              <span className="text-[11px] tracking-[0.2em] uppercase font-serif text-[#D6A84B] font-semibold block mt-0.5">
                JEWELLERY
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#91AAA4] hover:text-[#F5F3EA] rounded-lg hover:bg-[#0D5953] transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Showroom Mode Section (Matches Reference Screenshot exactly) */}
        <div className="px-5 py-3.5 bg-[#0D5953]/35 border-b border-[#0D5953] flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13.5px] font-admin-body font-medium text-[#F5F3EA]">
              Showroom Mode
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#034D47] border border-[#066159]/40 text-[#2DD4BF] text-[12px] font-medium font-admin-mono">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block shadow-[0_0_6px_#34D399]" />
              <span>Online</span>
            </span>
          </div>
          <p className="text-[12px] font-admin-body text-[#91AAA4] leading-snug">
            Primary device for display and processing of jewellery inventory.
          </p>
        </div>

        {/* Navigation List */}
        <nav 
          aria-label="Admin Navigation"
          className="flex-1 min-h-0 px-3.5 py-3 space-y-1.5 overflow-y-auto"
        >
          <div className="px-3.5 pt-1 pb-2 text-[11px] font-admin-body uppercase tracking-wider text-[#91AAA4] font-semibold select-none">
            ADMIN SCREENS
          </div>

          {navItems.map(item => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl relative flex items-center transition-colors duration-150 cursor-pointer text-[13.5px] font-admin-body focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A84B] focus-visible:ring-inset ${
                  isActive
                    ? 'bg-[#0D5953] text-[#D6A84B] font-semibold shadow-xs'
                    : 'text-[#F5F3EA] hover:text-[#D6A84B] hover:bg-[#0D5953]/60 font-medium'
                }`}
              >
                {/* Active Gold Left-Edge Indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-1 bg-[#D6A84B] rounded-r"
                    aria-hidden="true"
                  />
                )}

                <span className="block truncate tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Staff Profile & Logout */}
        <div className="px-3.5 pt-3.5 pb-4 border-t border-[#0D5953] bg-[#073F3B] space-y-3 flex-shrink-0 mt-auto">
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0D5953] border border-[#0D5953] shadow-xs">
            <div className="min-w-0 pr-2 flex flex-col justify-center">
              <span className="text-[13.5px] font-admin-body font-semibold text-[#F5F3EA] block truncate leading-tight">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[11.5px] font-admin-body text-[#D6A84B] block truncate font-medium mt-1 leading-tight">
                {user?.role || 'Administrator'}
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                window.location.href = '/admin/login';
              }}
              className="w-8 h-8 flex items-center justify-center text-[#91AAA4] hover:text-[#F5F3EA] hover:bg-[#073F3B]/60 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              title="Sign out of staff session"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#D6A84B] text-[12px] font-admin-body font-medium px-2">
            <ShieldCheck className="w-4 h-4 text-[#D6A84B] flex-shrink-0" />
            <span className="leading-none tracking-wide">Showroom Guard Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

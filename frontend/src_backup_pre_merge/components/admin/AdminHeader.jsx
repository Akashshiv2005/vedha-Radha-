import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ExternalLink, 
  Menu, 
  X, 
  RefreshCw,
  Clock,
  LogOut
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ 
  onToggleSidebar = () => {}, 
  globalSearchQuery = '',
  setGlobalSearchQuery = () => {},
  currentTab = 'overview'
}) {
  const adminContext = useAdmin() || {};
  const orders = Array.isArray(adminContext.orders) ? adminContext.orders : [];
  const returns = Array.isArray(adminContext.returns) ? adminContext.returns : [];
  const { logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Compute items needing attention
  const awaitingOrders = orders.filter(o => o.status === 'awaiting_confirmation');
  const expiringHolds = orders.filter(o => o.status === 'reserved' && o.holdExpiresAt);
  const openReturns = returns.filter(r => r.currentStep !== 'resolved');
  const attentionCount = awaitingOrders.length + expiringHolds.length + openReturns.length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-40 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 transition-colors duration-150">
      {/* ================= LEFT SECTION: MOBILE TOGGLE + MAIN SHOWROOM LIVE ================= */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#292521] hover:text-black rounded-lg hover:bg-black/5 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Main Showroom Live Badge (with live green indicator; "Safeguard Active" removed) */}
        <div className="flex items-center gap-2 bg-[#F0FAF4] border border-[#287A52]/20 px-3 py-1.5 rounded-full shadow-2xs">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
          </span>
          <span className="text-[12px] font-admin-body font-semibold text-[#15803D] whitespace-nowrap">
            Main Showroom Live
          </span>
        </div>
      </div>

      {/* ================= CENTER SECTION: BALANCED SEARCH BOX ================= */}
      <div className="flex-1 max-w-lg md:max-w-xl lg:max-w-2xl mx-3 sm:mx-6 lg:mx-8 relative hidden sm:block">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Search products, orders, tracking or SKU..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl pl-9 pr-8 py-1.5 text-[13px] font-admin-body text-[#292521] focus:ring-2 focus:ring-[#C49A45]/30 focus:border-[#C49A45] focus:outline-none placeholder:text-[#9CA3AF] shadow-2xs transition"
        />
        {globalSearchQuery && (
          <button 
            onClick={() => setGlobalSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#292521] transition"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ================= RIGHT SECTION: ACTIONS, LINKS, ADMIN PROFILE & SIGN OUT ================= */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-[#6B7280] hover:text-[#651F2B] hover:bg-[#F8F4EC] rounded-xl relative transition"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {attentionCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-[#C24141] text-white text-[10px] font-bold flex items-center justify-center font-admin-mono px-1">
                {attentionCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#651F2B]" />
                  <span className="font-admin-heading font-semibold text-[18px] text-[#292521]">
                    Attention Required
                  </span>
                </div>
                <span className="text-[11px] font-admin-mono font-medium px-2 py-0.5 bg-[#FDECEC] text-[#C24141] rounded-full">
                  {attentionCount} Pending
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-[13px] font-admin-body">
                {awaitingOrders.map(order => (
                  <div key={order.id} className="p-2.5 bg-[#FFF5DF] border border-[#D8C39A]/60 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#B7791F] font-admin-mono text-[12px]">{order.orderNumber}</span>
                      <span className="text-[12px] text-[#B7791F] font-semibold">New Hold</span>
                    </div>
                    <p className="text-[#292521] text-[13px] mt-0.5">{order.customerName} reserved <strong className="font-admin-mono text-[12px]">{order.productSku}</strong></p>
                    <p className="text-[12px] text-[#6B7280] mt-1">{order.nextAction}</p>
                  </div>
                ))}

                {expiringHolds.map(order => (
                  <div key={order.id} className="p-2.5 bg-[#FDECEC] border border-[#C24141]/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C24141] font-admin-mono text-[12px]">{order.orderNumber}</span>
                      <span className="text-[12px] text-[#C24141] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expiring Hold
                      </span>
                    </div>
                    <p className="text-[#292521] text-[13px] mt-0.5">{order.customerName} ({order.phone})</p>
                    <p className="text-[12px] text-[#C24141] font-medium mt-0.5">
                      Expires: {new Date(order.holdExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}

                {attentionCount === 0 && (
                  <p className="text-center text-gray-400 py-4">No items need attention right now.</p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] mt-3 flex items-center justify-between">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[12px] text-[#6B7280] hover:text-[#292521] font-medium transition"
                >
                  Close
                </button>
                <span className="text-[11px] text-[#9CA3AF] italic">Auto-refreshing live state</span>
              </div>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-2 text-[#6B7280] hover:text-[#651F2B] hover:bg-[#F8F4EC] rounded-xl transition"
          aria-label="Refresh data"
          title="Refresh dashboard data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Showroom Website Link */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F2EC] hover:bg-[#EAE4D8] text-[#5C5042] text-[14px] font-medium font-admin-body transition shadow-2xs"
          title="View customer showroom website"
        >
          <span>Showroom Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-6 bg-[#E5E7EB] mx-1"></div>

        {/* Simple Admin Profile: "Admin" only with matching "A" avatar */}
        <div className="flex items-center gap-2">
          {/* Profile Avatar Icon */}
          <div className="w-8 h-8 rounded-full bg-[#35151B] text-[#F3D794] font-admin-body font-bold text-[12.5px] flex items-center justify-center flex-shrink-0 shadow-xs ring-1 ring-[#C49A45]/30 select-none">
            A
          </div>
          
          {/* Profile Name: "Admin" only (subtitle removed) */}
          <span className="text-[14px] font-admin-body font-medium text-[#292521] hidden sm:inline">
            Admin
          </span>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-gray-500 hover:text-[#C24141] rounded-xl hover:bg-[#FDECEC] transition flex items-center gap-1.5 text-[14px] font-admin-body font-medium"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

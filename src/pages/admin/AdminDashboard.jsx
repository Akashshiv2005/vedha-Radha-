import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminOverviewPage from './AdminOverviewPage';
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminDeliveryPage from './AdminDeliveryPage';
import AdminReturnsSettingsPage from './AdminReturnsSettingsPage';
import SimulateReservationModal from '../../components/admin/SimulateReservationModal';
import QuickShowroomSaleModal from '../../components/admin/QuickShowroomSaleModal';
import DuplicateConflictModal from '../../components/admin/DuplicateConflictModal';
import ToastContainer from '../../components/admin/ToastContainer';

function AdminDashboardInner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Modals
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Sync tab with URL query parameter
  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
    setSearchParams({ tab: newTab });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== currentTab) {
      setCurrentTab(tabFromUrl);
    }
  }, [searchParams]);

  // Keyboard shortcut support: Ctrl+K or / to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen ${currentTab === 'products' ? 'bg-[#FAF7F2]' : 'bg-[#F5F6F8]'} text-[#292521] flex flex-col lg:pl-72 font-admin-body text-[14px] leading-relaxed selection:bg-[#651F2B] selection:text-white antialiased transition-colors duration-150`}>
      {/* 1. Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${currentTab === 'products' ? 'bg-[#FAF7F2]' : ''}`}>
        {/* Top Header */}
        <AdminHeader
          currentTab={currentTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          onOpenSimulateReservation={() => setIsSimulateOpen(true)}
          onOpenQuickSale={() => setIsQuickSaleOpen(true)}
        />

        {/* Dynamic Admin View */}
        <main className={`flex-1 p-4 sm:p-6 lg:py-6 lg:px-8 max-w-7xl w-full mx-auto ${currentTab === 'products' ? 'bg-[#FAF7F2]' : ''}`}>
          {currentTab === 'overview' && (
            <AdminOverviewPage
              onNavigateToTab={handleTabChange}
              onOpenAddProduct={() => {
                handleTabChange('products');
                setIsAddProductOpen(true);
              }}
            />
          )}

          {currentTab === 'products' && (
            <AdminProductsPage
              isAddModalOpen={isAddProductOpen}
              setIsAddModalOpen={setIsAddProductOpen}
              searchQuery={globalSearchQuery}
              setSearchQuery={setGlobalSearchQuery}
            />
          )}

          {currentTab === 'orders' && (
            <AdminOrdersPage
              onOpenSimulateReservation={() => setIsSimulateOpen(true)}
            />
          )}

          {currentTab === 'delivery' && (
            <AdminDeliveryPage />
          )}

          {currentTab === 'returns_settings' && (
            <AdminReturnsSettingsPage />
          )}
        </main>

        {/* Admin Footer Disclaimer */}
        <footer className="bg-[#FFFFFF] border-t border-[#E5E7EB] py-3.5 px-6 text-center text-[12px] font-admin-body text-[#6B7280]">
          <p>
            <strong className="font-admin-heading font-semibold text-[14px] text-[#292521]">Vedha Radha Thangamaaligai</strong> — Luxury Showroom & Inventory Management Dashboard
          </p>
        </footer>
      </div>

      {/* Shared Modals & Notifications */}
      <SimulateReservationModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
      />

      <QuickShowroomSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
      />

      <DuplicateConflictModal />

      <ToastContainer />
    </div>
  );
}

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Dashboard caught a render error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('VEDA_RADHA_ADMIN_STATE_V1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-6 font-admin-body">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 max-w-lg w-full shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#C24141] flex items-center justify-center mx-auto mb-4 text-xl font-bold font-admin-mono">
              !
            </div>
            <h2 className="text-[22px] font-admin-heading font-semibold text-[#292521] mb-2">
              Admin Interface Error
            </h2>
            <p className="text-[14px] font-admin-body text-[#6B7280] mb-4">
              A temporary issue occurred while rendering the dashboard. You can reload the view or reset local demo data.
            </p>
            {this.state.error?.message && (
              <div className="bg-[#FAF7F2] border border-[#E5E7EB] rounded-lg p-3 text-[12px] text-[#651F2B] font-admin-mono text-left mb-6 break-words">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center text-[13px] font-admin-body">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 text-[#292521] shadow-xs"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-[#651F2B] text-white rounded-xl font-semibold hover:bg-[#4E1721] shadow-xs"
              >
                Reset Demo State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminDashboard() {
  return (
    <AdminErrorBoundary>
      <AdminProvider>
        <AdminDashboardInner />
      </AdminProvider>
    </AdminErrorBoundary>
  );
}

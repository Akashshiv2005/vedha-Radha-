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
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] flex font-sans selection:bg-[#5C1D27] selection:text-white">
      {/* 1. Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSimulateReservation={() => setIsSimulateOpen(true)}
          onOpenQuickShowroomSale={() => setIsQuickSaleOpen(true)}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
        />

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <AdminOverviewPage
              onNavigateToTab={handleTabChange}
              onOpenSimulateReservation={() => setIsSimulateOpen(true)}
              onOpenQuickShowroomSale={() => setIsQuickSaleOpen(true)}
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
        <footer className="bg-[#FAF7F2] border-t border-[#E3D9CC] py-3.5 px-6 text-center text-xs text-gray-500">
          <p>
            <strong>Veda Radha Thangamaaligai</strong> — Showroom & E-Commerce Admin Prototype • Built for Client Operational Review
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

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminDashboardInner />
    </AdminProvider>
  );
}

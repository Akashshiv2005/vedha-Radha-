import React, { useState } from 'react';
import { 
  CalendarClock, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Store, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  MessageSquare, 
  X, 
  RotateCw, 
  Check, 
  FileText,
  UserCheck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminOrdersPage({
  onOpenSimulateReservation = () => {}
}) {
  const { 
    orders, 
    products, 
    settings,
    confirmReservation, 
    rejectReservation, 
    extendHold, 
    convertReservationToOrder, 
    updateOrderStatus, 
    updateTracking, 
    markProductSoldInShowroom 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'reservations' | 'processing' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Quick Action Dialogs State
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Customer unable to visit showroom within hold window');
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    carrier: 'BlueDart Apex Gold Secure',
    trackingId: `BD-EXP-${Math.floor(1000000 + Math.random() * 8999999)}`,
    notes: 'Valuable cargo tamper-evident security bag'
  });

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'reservations') {
      return ['awaiting_confirmation', 'reserved', 'new', 'hold_expired'].includes(order.status);
    }
    if (activeTab === 'processing') {
      return ['confirmed', 'processing', 'dispatched'].includes(order.status);
    }
    if (activeTab === 'completed') {
      return ['delivered'].includes(order.status);
    }
    if (activeTab === 'cancelled') {
      return ['cancelled', 'return_requested'].includes(order.status);
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
      case 'awaiting_confirmation':
        return { label: 'Awaiting Staff Call', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'reserved':
        return { label: 'Reserved (Locked)', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      case 'confirmed':
        return { label: 'Confirmed Order', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'processing':
        return { label: 'Packing & Vault Desk', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'dispatched':
        return { label: 'In Transit Courier', bg: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'delivered':
        return { label: 'Fulfilled / Delivered', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'cancelled':
        return { label: 'Cancelled / Released', bg: 'bg-gray-100 text-gray-700 border-gray-300' };
      case 'hold_expired':
        return { label: 'Hold Expired', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'return_requested':
        return { label: 'Return Under Inspection', bg: 'bg-orange-100 text-orange-900 border-orange-300' };
      default:
        return { label: status, bg: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenTrackingModal = (order) => {
    setTrackingModalOrder(order);
    setTrackingForm({
      carrier: order.tracking?.carrier && order.tracking.carrier !== 'N/A (In-Store Pickup)' ? order.tracking.carrier : 'BlueDart Apex Gold Secure',
      trackingId: order.tracking?.trackingId && !order.tracking.trackingId.includes('N/A') ? order.tracking.trackingId : `BD-EXP-${Math.floor(1000000 + Math.random() * 8999999)}`,
      notes: 'Insured transit manifest registered with central hub'
    });
  };

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    updateTracking(trackingModalOrder.id, trackingForm);
    setTrackingModalOrder(null);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectModalOrder) return;
    rejectReservation(rejectModalOrder.id, rejectReason);
    setRejectModalOrder(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E3D9CC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-[#5C1D27] text-white rounded">
              Screen 3 • Queue & Safeguard
            </span>
            <span className="text-xs text-gray-500 font-medium">Showroom Concierge & Order Routing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1614] mt-1">
            Online Reservations & Order Queue
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage customer holds, coordinate showroom visits, dispatch insured orders, and execute duplicate-sale protections.
          </p>
        </div>

        <button
          onClick={onOpenSimulateReservation}
          className="px-4 py-2.5 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white text-xs font-semibold shadow flex items-center gap-2 transition self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Simulate Online Hold Request</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3D9CC] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DFD3]">
            {[
              { id: 'all', label: 'All Requests' },
              { id: 'reservations', label: 'Active Holds & Calls' },
              { id: 'processing', label: 'Packing & In Transit' },
              { id: 'completed', label: 'Fulfilled' },
              { id: 'cancelled', label: 'Cancelled / Released' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-[#5C1D27] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer, order #, SKU or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C7B3] rounded-xl pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            />
          </div>
        </div>

        {/* Demo policy disclaimer pill */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            Default Reservation Hold: <strong>{settings.reservationHoldHours} Hours</strong> (Demo rule — Pending client confirmation)
          </span>
          <span className="font-mono text-gray-400">
            {filteredOrders.length} records in queue
          </span>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-[#E3D9CC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5EFEB] text-[#4A3F39] border-b border-[#E3D9CC] font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order / Hold ID</th>
                <th className="py-3 px-3">Customer Contact</th>
                <th className="py-3 px-3">Jewellery Piece</th>
                <th className="py-3 px-3">Fulfilment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Hold Expiry / Time</th>
                <th className="py-3 px-3">Next Required Action</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredOrders.map(order => {
                const badge = getStatusBadge(order.status);
                const isExpiring = order.holdExpiresAt && new Date(order.holdExpiresAt) < new Date(Date.now() + 12 * 60 * 60 * 1000) && ['awaiting_confirmation', 'reserved'].includes(order.status);

                return (
                  <tr key={order.id} className="hover:bg-[#FAF7F2] transition">
                    {/* Order ID & Type */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-gray-900">{order.orderNumber}</div>
                      <span className="text-[10px] text-gray-400 uppercase font-medium">
                        {order.orderType === 'reservation' ? 'Storefront Hold' : 'Online Purchase'}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{order.phone}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">{order.city} ({order.pincode})</span>
                    </td>

                    {/* Item */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={order.productImage} 
                          alt={order.productName} 
                          className="w-10 h-10 object-cover rounded-lg border flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-[180px]">
                          <span className="text-[9px] font-mono uppercase bg-[#5C1D27]/10 text-[#5C1D27] px-1.5 py-0.2 rounded font-semibold">
                            {order.productSku}
                          </span>
                          <p className="font-semibold text-gray-800 truncate text-[11px] mt-0.5">
                            {order.productName}
                          </p>
                          <span className="text-gray-500 font-serif font-bold text-[10px]">
                            {order.productPrice}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Fulfilment Type */}
                    <td className="py-3 px-3">
                      {order.fulfilmentType === 'showroom_pickup' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                          <Store className="w-3 h-3 text-amber-700" /> Showroom Counter
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md">
                          <Truck className="w-3 h-3 text-blue-700" /> Insured Courier
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Expiry / Time */}
                    <td className="py-3 px-3">
                      {order.holdExpiresAt ? (
                        <div>
                          <span className={`text-[11px] font-mono font-semibold ${isExpiring ? 'text-rose-700 animate-pulse' : 'text-gray-700'}`}>
                            {new Date(order.holdExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="block text-[10px] text-gray-400">
                            {new Date(order.holdExpiresAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">N/A (Billed)</span>
                      )}
                    </td>

                    {/* Next Action */}
                    <td className="py-3 px-3 max-w-[200px]">
                      <p className="text-[11px] text-gray-700 line-clamp-2 leading-tight">
                        {order.nextAction}
                      </p>
                    </td>

                    {/* Contextual Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. If Awaiting Confirmation */}
                        {order.status === 'awaiting_confirmation' && (
                          <>
                            <button
                              onClick={() => confirmReservation(order.id)}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-[10px] font-bold shadow-sm"
                              title="Confirm phone verification"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setRejectModalOrder(order)}
                              className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 text-[10px] font-bold"
                              title="Reject & release hold"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* 2. If Reserved */}
                        {order.status === 'reserved' && (
                          <>
                            <button
                              onClick={() => convertReservationToOrder(order.id)}
                              className="px-2.5 py-1 bg-[#5C1D27] text-white rounded-lg hover:bg-[#44131B] text-[10px] font-bold shadow-sm"
                              title="Convert to confirmed purchase"
                            >
                              To Order
                            </button>
                            <button
                              onClick={() => extendHold(order.id, 24)}
                              className="px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-[10px] font-medium"
                              title="Extend +24h hold"
                            >
                              +24h
                            </button>
                          </>
                        )}

                        {/* 3. If Processing / Ready to Dispatch */}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleOpenTrackingModal(order)}
                            className="px-2.5 py-1 bg-sky-800 text-white rounded-lg hover:bg-sky-900 text-[10px] font-bold shadow-sm flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}

                        {/* 4. If Dispatched -> Mark Delivered */}
                        {order.status === 'dispatched' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered', {
                              logMessage: 'Delivery confirmed with recipient OTP verification',
                              nextAction: 'Fulfilled successfully'
                            })}
                            className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 text-[10px] font-bold shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                        {/* View Full Timeline Drawer */}
                        <button
                          onClick={() => handleOpenDetail(order)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-[#EFE8DD] rounded-lg"
                          title="View order history & details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white border border-dashed border-[#D5C7B3] rounded-2xl p-12 text-center">
          <CalendarClock className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <h4 className="font-serif font-bold text-base text-gray-800">No Orders in this Queue</h4>
          <p className="text-xs text-gray-500 mt-1">Try switching tabs or creating a test reservation.</p>
        </div>
      )}

      {/* Order Detail & Audit Timeline Drawer */}
      {isDetailDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] w-full max-w-lg h-full shadow-2xl border-l border-[#C5A059]/40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-[#5C1D27] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#E3D9CC]">
                  Order & Hold Record
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button 
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#2C2420]">
              {/* Product Snapshot */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9CC] flex items-center gap-3.5">
                <img 
                  src={selectedOrder.productImage} 
                  alt={selectedOrder.productName} 
                  className="w-16 h-16 object-cover rounded-xl border flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-[#5C1D27] text-white px-1.5 py-0.2 rounded">
                      {selectedOrder.productSku}
                    </span>
                    {selectedOrder.isUniqueItem && (
                      <span className="text-[9px] font-bold text-[#7A5B20] bg-[#FAF5EE] border border-[#C5A059] px-1.5 py-0.2 rounded">
                        1-of-1 Piece
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs truncate mt-1">
                    {selectedOrder.productName}
                  </h4>
                  <p className="text-xs font-serif font-bold text-[#5C1D27] mt-0.5">
                    {selectedOrder.productPrice}
                  </p>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="bg-white p-4 rounded-xl border border-[#E3D9CC] space-y-2">
                <h4 className="font-bold text-gray-900 text-xs border-b border-gray-100 pb-1.5">
                  Customer & Fulfilment Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Customer Name</span>
                    <span className="font-bold text-gray-800">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Contact Number</span>
                    <span className="font-semibold text-gray-800">{selectedOrder.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Email</span>
                    <span className="text-gray-700">{selectedOrder.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Fulfilment Mode</span>
                    <span className="font-bold text-[#5C1D27] capitalize">
                      {selectedOrder.fulfilmentType.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Delivery Location</span>
                  <p className="text-gray-700 text-[11px] mt-0.5">{selectedOrder.deliveryAddress}</p>
                </div>

                {selectedOrder.notes && (
                  <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8DFD3] text-[11px] text-gray-700">
                    <strong>Customer Notes:</strong> {selectedOrder.notes}
                  </div>
                )}
              </div>

              {/* Courier & Tracking Details (if any) */}
              <div className="bg-white p-4 rounded-xl border border-[#E3D9CC] space-y-2">
                <h4 className="font-bold text-gray-900 text-xs border-b border-gray-100 pb-1.5 flex items-center justify-between">
                  <span>Logistics & Showroom Hold Status</span>
                  <span className="text-[10px] font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                    {selectedOrder.tracking?.deliveryStatus || 'Pending'}
                  </span>
                </h4>
                <div className="text-xs space-y-1">
                  <p><strong>Carrier:</strong> {selectedOrder.tracking?.carrier || 'Showroom Custody'}</p>
                  <p><strong>Tracking / Consignment ID:</strong> <span className="font-mono">{selectedOrder.tracking?.trackingId || 'N/A'}</span></p>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="bg-white p-4 rounded-xl border border-[#E3D9CC] space-y-3">
                <h4 className="font-bold text-gray-900 text-xs border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5C1D27]" />
                  <span>State Change Audit Timeline</span>
                </h4>

                <div className="relative pl-4 space-y-3 border-l-2 border-[#E3D9CC] ml-2 text-[11px]">
                  {selectedOrder.timeline?.map((evt, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#5C1D27] ring-2 ring-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{evt.event}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{evt.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 italic block mt-0.5">By: {evt.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-4 bg-[#F5EFEB] border-t border-[#E3D9CC] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] text-gray-500">Safeguard lock active</span>
              <div className="flex gap-2">
                {selectedOrder.status === 'awaiting_confirmation' && (
                  <button
                    onClick={() => {
                      confirmReservation(selectedOrder.id);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-bold text-xs shadow"
                  >
                    Confirm Hold
                  </button>
                )}
                {selectedOrder.status === 'reserved' && (
                  <button
                    onClick={() => {
                      convertReservationToOrder(selectedOrder.id);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="px-4 py-2 bg-[#5C1D27] text-white rounded-xl font-bold text-xs shadow"
                  >
                    Convert to Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reservation Reason Modal */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
            <h4 className="font-serif font-bold text-base text-gray-900 mb-1">
              Cancel / Reject Reservation Hold?
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Item <strong>{rejectModalOrder.productSku}</strong> will immediately return to <strong>Available</strong> status for showroom counter sales and online orders.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gray-300 rounded-xl p-2 text-xs"
                >
                  <option value="Customer unable to visit showroom within hold window">Customer unable to visit within hold window</option>
                  <option value="Phone unreachable after 3 attempts">Phone unreachable after 3 verification attempts</option>
                  <option value="Customer requested cancellation">Customer requested cancellation / altered choice</option>
                  <option value="Showroom manager clearance">Manager manual release to floor inventory</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOrder(null)}
                  className="px-4 py-2 rounded-xl border text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-800 text-white font-bold"
                >
                  Confirm & Release Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#C5A059]/40">
            <h4 className="font-serif font-bold text-base text-[#1C1614] mb-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#5C1D27]" />
              <span>Book Insured Dispatch & Tracking</span>
            </h4>
            <p className="text-xs text-gray-600 mb-4">
              Dispatching order <strong>{trackingModalOrder.orderNumber}</strong> for {trackingModalOrder.customerName}.
            </p>

            <form onSubmit={handleTrackingSubmit} className="space-y-3 text-xs text-[#2C2420]">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Secured Carrier / Courier Agency
                </label>
                <select
                  value={trackingForm.carrier}
                  onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                >
                  <option value="BlueDart Apex Gold Secure">BlueDart Apex Gold Secure (Insured)</option>
                  <option value="Sequel Logistics (High Value Armoured Cargo)">Sequel Logistics (High Value Armoured Cargo)</option>
                  <option value="India Post Speed Post Gold Insured">India Post Speed Post Gold Insured</option>
                  <option value="Showroom Express Messenger (Local)">Showroom Express Messenger (Local)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  AWB / Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingForm.trackingId}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                  Vault / Security Manifest Notes
                </label>
                <input
                  type="text"
                  value={trackingForm.notes}
                  onChange={(e) => setTrackingForm({ ...trackingForm, notes: e.target.value })}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 rounded-xl border text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5C1D27] text-white font-bold shadow"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

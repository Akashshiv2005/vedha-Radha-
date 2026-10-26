import React, { useState } from 'react';
import { 
  Store, 
  X, 
  Receipt, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function QuickShowroomSaleModal({ isOpen, onClose }) {
  const { products, orders, markProductSoldInShowroom } = useAdmin();

  const [selectedSku, setSelectedSku] = useState('');
  const [billNumber, setBillNumber] = useState(`VR-POS-${Math.floor(9000 + Math.random() * 999)}`);
  const [salesman, setSalesman] = useState('Staff (Muthu - Counter 2)');
  const [paymentMode, setPaymentMode] = useState('Card / UPI Split');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);
  const activeReservation = currentProduct 
    ? orders.find(o => o.productSku === currentProduct.sku && ['awaiting_confirmation', 'reserved', 'new'].includes(o.status))
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSku) return;

    markProductSoldInShowroom(selectedSku, `Counter Billing #${billNumber} via ${paymentMode} by ${salesman}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9980] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-admin-sidebar text-white px-6 py-4 flex items-center justify-between border-b border-admin-gold/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-admin-gold/20 rounded-xl text-admin-gold border border-admin-gold/40">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[12px] text-admin-gold font-admin-body font-medium">
                Showroom Counter POS Action
              </span>
              <h3 className="text-[22px] font-admin-heading font-semibold text-white leading-tight">
                Mark Sold in Showroom
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[13px] font-admin-body text-admin-main">
          <div className="bg-admin-pending-bg border border-admin-pending/30 p-3.5 rounded-xl text-admin-main text-[13px] font-admin-body leading-relaxed">
            <span className="font-semibold text-admin-pending block mb-0.5">Showroom Priority Rule:</span>
            When a physical customer purchases an item at the counter, this action immediately shifts product availability to <strong>Sold in Showroom</strong>. Online e-commerce customers cannot reserve it.
          </div>

          <div>
            <label className="block text-[12px] font-medium text-admin-main mb-1.5 font-admin-body">
              Select Item Billed at Showroom Counter *
            </label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              required
              className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
            >
              <option value="">-- Choose item currently sold in-store --</option>
              {products
                .filter(p => p.status !== 'sold_showroom')
                .map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name} — {p.price} ({p.isUnique ? 'Unique 1-of-1' : 'Stock'}) • Status: {p.status}
                  </option>
                ))}
            </select>
          </div>

          {currentProduct && (
            <div className="p-3.5 bg-[#F5F6F8] border border-gray-200 rounded-xl flex items-center gap-3">
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-admin-main truncate text-[14px] font-admin-body">{currentProduct.name}</p>
                <p className="text-gray-500 text-[12px] font-admin-body">{currentProduct.purity} • <span className="font-admin-heading font-semibold text-admin-primary">{currentProduct.price}</span></p>
              </div>
            </div>
          )}

          {activeReservation && (
            <div className="bg-admin-error-bg border border-admin-error/30 p-3.5 rounded-xl flex items-start gap-2.5 text-admin-main">
              <ShieldAlert className="w-4 h-4 text-admin-error flex-shrink-0 mt-0.5" />
              <div className="text-[13px] font-admin-body leading-relaxed">
                <strong className="block text-admin-error font-semibold">Warning: Active Online Reservation Detected!</strong>
                Customer <strong>{activeReservation.customerName}</strong> has an active hold on this piece (<span className="font-admin-mono font-medium">{activeReservation.orderNumber}</span>). Marking it sold now will automatically cancel their online request with a walk-in sale notice.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
                Showroom Invoice / Bill #
              </label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                required
                className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[14px] focus:ring-2 focus:ring-admin-gold focus:outline-none font-admin-mono text-admin-main"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
                Sales Staff / Counter
              </label>
              <input
                type="text"
                value={salesman}
                onChange={(e) => setSalesman(e.target.value)}
                required
                className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[12px] text-gray-500 font-admin-body italic">
              Synchronizes catalog across online channels immediately
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-[14px] font-admin-body transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedSku}
                className="px-5 py-2 rounded-xl bg-admin-primary hover:bg-admin-primary-hover text-white font-semibold text-[14px] font-admin-body shadow disabled:opacity-50 flex items-center gap-1.5 transition"
              >
                <span>Confirm Showroom Sale</span>
                <ArrowRight className="w-3.5 h-3.5 text-admin-gold" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

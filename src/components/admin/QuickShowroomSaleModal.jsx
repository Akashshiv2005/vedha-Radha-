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
      <div className="bg-[#FAF7F2] border border-[#C5A059]/40 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1C1614] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C5A059]/20 rounded-xl text-[#C5A059] border border-[#C5A059]/40">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Showroom Counter POS Action
              </span>
              <h3 className="text-lg font-serif font-bold text-white">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#2C2420]">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-[11px] leading-relaxed">
            <span className="font-bold block mb-0.5">Showroom Priority Rule:</span>
            When a physical customer purchases an item at the counter, this action immediately shifts product availability to <strong>Sold in Showroom</strong>. Online e-commerce customers cannot reserve it.
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C1D27] mb-1.5">
              Select Item Billed at Showroom Counter *
            </label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              required
              className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2.5 text-xs text-[#2C2420] focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            >
              <option value="">-- Choose item currently sold in-store --</option>
              {products
                .filter(p => p.status !== 'sold_showroom')
                .map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name} — {p.price} ({p.isUnique ? 'Unique 1-of-1' : 'Stock'}) • Status: {p.status.toUpperCase()}
                  </option>
                ))}
            </select>
          </div>

          {currentProduct && (
            <div className="p-3 bg-[#F4EFE6] border border-[#E3D9CC] rounded-xl flex items-center gap-3">
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{currentProduct.name}</p>
                <p className="text-gray-600 text-[11px]">{currentProduct.purity} • {currentProduct.price}</p>
              </div>
            </div>
          )}

          {activeReservation && (
            <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl flex items-start gap-2.5 text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <strong className="block text-rose-800">Warning: Active Online Reservation Detected!</strong>
                Customer <strong>{activeReservation.customerName}</strong> has an active hold on this piece ({activeReservation.orderNumber}). Marking it sold now will automatically cancel their online request with a walk-in sale notice.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                Showroom Invoice / Bill #
              </label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                required
                className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                Sales Staff / Counter
              </label>
              <input
                type="text"
                value={salesman}
                onChange={(e) => setSalesman(e.target.value)}
                required
                className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3D9CC] flex items-center justify-between">
            <span className="text-[10px] text-gray-500 italic">
              Synchronizes catalog across online channels immediately
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedSku}
                className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-medium shadow disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>Confirm Showroom Sale</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

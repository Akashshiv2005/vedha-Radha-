import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ShoppingBag, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function SimulateReservationModal({ isOpen, onClose }) {
  const { products, createReservation, settings } = useAdmin();

  const [selectedSku, setSelectedSku] = useState('');
  const [customerName, setCustomerName] = useState('Smt. Gayathri Ramesh');
  const [phone, setPhone] = useState('+91 98402 99881');
  const [email, setEmail] = useState('gayathri.ramesh@example.com');
  const [city, setCity] = useState('Madurai');
  const [pincode, setPincode] = useState('625001');
  const [fulfilmentType, setFulfilmentType] = useState('showroom_pickup');
  const [notes, setNotes] = useState('Interested in viewing matching earrings along with this piece.');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSku) return;

    const result = createReservation({
      productSku: selectedSku,
      customerName,
      phone,
      email,
      city,
      pincode,
      deliveryAddress: `${city}, Pincode: ${pincode}`,
      fulfilmentType,
      notes,
      isSimulated: true
    });

    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9980] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#C5A059]/40 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#5C1D27] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FAF7F2]/10 rounded-xl border border-[#C5A059]/40 text-[#C5A059]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#E3D9CC]">
                Interactive Demo Simulation
              </span>
              <h3 className="text-lg font-serif font-bold text-white">
                Simulate Customer Online Reservation
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-[#2C2420] text-xs">
          {/* Instructions Box */}
          <div className="bg-[#F4EFE6] border border-[#E3D9CC] p-3 rounded-xl text-gray-700 text-[11px] leading-relaxed">
            <span className="font-bold text-[#5C1D27] block mb-0.5">Showroom Testing Tool:</span>
            Pick any product to test the instant e-commerce reservation queue. If you select a 1-of-1 unique piece that is already Reserved or Sold, watch the <strong>Duplicate Sale Safeguard</strong> kick in!
          </div>

          {/* Product Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C1D27] mb-1.5">
              1. Select Jewellery Item to Reserve *
            </label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              required
              className="w-full bg-white border border-[#D5C7B3] rounded-xl px-3 py-2.5 text-xs text-[#2C2420] focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            >
              <option value="">-- Choose a showroom product --</option>
              {products.map(p => (
                <option key={p.sku} value={p.sku}>
                  [{p.sku}] {p.name} — {p.price} ({p.isUnique ? '1-of-1 Unique' : 'Repeatable Stock'} • Currently: {p.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Product Preview Card */}
          {currentProduct && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-4 transition-all ${
              currentProduct.status === 'available'
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}>
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-14 h-14 object-cover rounded-lg border flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{currentProduct.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    currentProduct.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentProduct.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 text-[11px] mt-0.5">
                  {currentProduct.purity} • Gross Wt: {currentProduct.grossWeight} • {currentProduct.price}
                </p>
                {currentProduct.isUnique && currentProduct.status !== 'available' && (
                  <p className="text-amber-800 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                    Notice: Selecting this item will trigger the Safeguard alert because it is already {currentProduct.status}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                Customer Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                Contact Number (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                City & Pincode
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={`${city} - ${pincode}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('-');
                    setCity(parts[0]?.trim() || '');
                    if (parts[1]) setPincode(parts[1].trim());
                  }}
                  className="w-full bg-white border border-[#D5C7B3] rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fulfilment Choice */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1.5">
              Customer Fulfilment Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-xl p-3 flex items-start gap-2.5 cursor-pointer transition ${
                fulfilmentType === 'showroom_pickup'
                  ? 'border-[#5C1D27] bg-[#5C1D27]/5 text-[#5C1D27] font-semibold'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}>
                <input
                  type="radio"
                  name="fulfilment"
                  value="showroom_pickup"
                  checked={fulfilmentType === 'showroom_pickup'}
                  onChange={() => setFulfilmentType('showroom_pickup')}
                  className="mt-0.5 text-[#5C1D27] focus:ring-[#5C1D27]"
                />
                <div>
                  <span className="text-xs block font-bold">In-Store Showroom Hold</span>
                  <span className="text-[10px] text-gray-500 font-normal">Customer visits showroom to view & buy</span>
                </div>
              </label>

              <label className={`border rounded-xl p-3 flex items-start gap-2.5 cursor-pointer transition ${
                fulfilmentType === 'home_delivery'
                  ? 'border-[#5C1D27] bg-[#5C1D27]/5 text-[#5C1D27] font-semibold'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}>
                <input
                  type="radio"
                  name="fulfilment"
                  value="home_delivery"
                  checked={fulfilmentType === 'home_delivery'}
                  onChange={() => setFulfilmentType('home_delivery')}
                  className="mt-0.5 text-[#5C1D27] focus:ring-[#5C1D27]"
                />
                <div>
                  <span className="text-xs block font-bold">Doorstep Insured Delivery</span>
                  <span className="text-[10px] text-gray-500 font-normal">Dispatched via BlueDart / Sequel</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
              Customer Special Request / Note
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-white border border-[#D5C7B3] rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            />
          </div>

          {/* Footer inside form */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E3D9CC]">
            <div className="text-[10px] text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Default Hold Window: {settings.reservationHoldHours} Hours</span>
            </div>
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
                className="px-5 py-2 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>Create Reservation & Lock Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

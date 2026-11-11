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
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-admin-sidebar text-white px-6 py-4 flex items-center justify-between border-b border-admin-gold/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-admin-gold/20 rounded-xl border border-admin-gold/40 text-admin-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[12px] text-admin-gold font-admin-body font-medium">
                Interactive Simulation
              </span>
              <h3 className="text-[22px] font-admin-heading font-semibold text-white leading-tight">
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-admin-main text-[13px] font-admin-body">
          {/* Instructions Box */}
          <div className="bg-[#F5F6F8] border border-gray-200 p-3.5 rounded-xl text-gray-700 text-[13px] font-admin-body leading-relaxed">
            <span className="font-semibold text-admin-primary block mb-0.5">Showroom Testing Tool:</span>
            Pick any product to test the instant e-commerce reservation queue. If you select a 1-of-1 unique piece that is already Reserved or Sold, watch the <strong>Duplicate Sale Safeguard</strong> kick in!
          </div>

          {/* Product Selector */}
          <div>
            <label className="block text-[12px] font-medium text-admin-main mb-1.5 font-admin-body">
              1. Select Jewellery Item to Reserve *
            </label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              required
              className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
            >
              <option value="">-- Choose a showroom product --</option>
              {products.map(p => (
                <option key={p.sku} value={p.sku}>
                  [{p.sku}] {p.name} - {p.price} ({p.isUnique ? '1-of-1 Unique' : 'Repeatable Stock'} • Currently: {p.status})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Product Preview Card */}
          {currentProduct && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-4 transition-all ${
              currentProduct.status === 'available'
                ? 'bg-admin-success-bg border-admin-success/30'
                : 'bg-admin-pending-bg border-admin-pending/30'
            }`}>
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-admin-main text-[14px] font-admin-body">{currentProduct.name}</span>
                  <span className={`text-[12px] font-medium px-2 py-0.5 rounded capitalize font-admin-body ${
                    currentProduct.status === 'available'
                      ? 'bg-admin-success-bg text-admin-success'
                      : 'bg-admin-pending-bg text-admin-pending'
                  }`}>
                    {currentProduct.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-500 text-[12px] mt-0.5 font-admin-body">
                  {currentProduct.purity} • Gross Wt: {currentProduct.grossWeight} • <span className="font-admin-heading font-semibold text-admin-primary">{currentProduct.price}</span>
                </p>
                {currentProduct.isUnique && currentProduct.status !== 'available' && (
                  <p className="text-admin-pending text-[12px] font-medium mt-1 flex items-center gap-1 font-admin-body">
                    <AlertTriangle className="w-3.5 h-3.5 text-admin-pending flex-shrink-0" />
                    Notice: Selecting this item will trigger the Safeguard alert because it is already {currentProduct.status}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
                Customer Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
                Contact Number (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
                City & Pincode
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={`${city} - ${pincode}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('-');
                    setCity(parts[0]?.trim() || '');
                    if (parts[1]) setPincode(parts[1].trim());
                  }}
                  className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-[14px] font-admin-body text-admin-main focus:ring-2 focus:ring-admin-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fulfilment Choice */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1.5 font-admin-body">
              Customer Fulfilment Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-xl p-3.5 flex items-start gap-2.5 cursor-pointer transition ${
                fulfilmentType === 'showroom_pickup'
                  ? 'border-admin-primary bg-admin-reserved-bg text-admin-primary font-semibold'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}>
                <input
                  type="radio"
                  name="fulfilment"
                  value="showroom_pickup"
                  checked={fulfilmentType === 'showroom_pickup'}
                  onChange={() => setFulfilmentType('showroom_pickup')}
                  className="mt-0.5 text-admin-primary focus:ring-admin-gold"
                />
                <div>
                  <span className="text-[13px] block font-semibold text-admin-main font-admin-body">In-Store Showroom Hold</span>
                  <span className="text-[12px] text-gray-500 font-normal font-admin-body">Customer visits showroom to view & buy</span>
                </div>
              </label>

              <label className={`border rounded-xl p-3.5 flex items-start gap-2.5 cursor-pointer transition ${
                fulfilmentType === 'home_delivery'
                  ? 'border-admin-primary bg-admin-reserved-bg text-admin-primary font-semibold'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}>
                <input
                  type="radio"
                  name="fulfilment"
                  value="home_delivery"
                  checked={fulfilmentType === 'home_delivery'}
                  onChange={() => setFulfilmentType('home_delivery')}
                  className="mt-0.5 text-admin-primary focus:ring-admin-gold"
                />
                <div>
                  <span className="text-[13px] block font-semibold text-admin-main font-admin-body">Doorstep Insured Delivery</span>
                  <span className="text-[12px] text-gray-500 font-normal font-admin-body">Dispatched via BlueDart / Sequel</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1 font-admin-body">
              Customer Special Request / Note
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#F5F6F8] border border-gray-200 rounded-xl p-2.5 text-[14px] font-admin-body focus:ring-2 focus:ring-admin-gold focus:outline-none"
            />
          </div>

          {/* Footer inside form */}
          <div className="pt-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-[12px] text-gray-500 flex items-center gap-1.5 font-medium font-admin-body">
              <ShieldCheck className="w-4 h-4 text-admin-success" />
              <span>Default Hold Window: <strong className="font-admin-mono">{settings.reservationHoldHours}</strong> Hours</span>
            </div>
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
                className="px-5 py-2.5 rounded-xl bg-admin-primary hover:bg-admin-primary-hover text-white font-semibold text-[14px] font-admin-body shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
              >
                <span>Create Reservation & Lock Stock</span>
                <ArrowRight className="w-3.5 h-3.5 text-admin-gold" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

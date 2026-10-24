import React, { useState } from 'react';
import { X, Video, Calendar, Clock, MapPin, CheckCircle, Sparkles, Phone, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoConsultationModal({ isOpen, onClose, product }) {
  const [step, setStep] = useState(1); // 1: form, 2: confirmed
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('04:30 PM - 05:00 PM');
  const [showroom, setShowroom] = useState('T. Nagar Flagship Showroom, Chennai');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: 'I would like to view ' + (product?.name || 'this jewellery piece') + ' on live HD video.'
  });

  if (!isOpen) return null;

  const dateOptions = [
    { label: 'Today', sub: 'Instant slot available' },
    { label: 'Tomorrow', sub: 'Flexible times' },
    { label: 'Day after', sub: 'Weekend slot' }
  ];

  const slotOptions = [
    '11:30 AM - 12:00 PM',
    '02:30 PM - 03:00 PM',
    '04:30 PM - 05:00 PM',
    '06:30 PM - 07:00 PM',
    '08:00 PM - 08:30 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setStep(2);
  };

  const handleWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `Hello Veda Radha Jewellery, I have booked a Live Video Consultation for "${product?.name}".\n\nDate: ${selectedDate}\nTime: ${selectedSlot}\nShowroom: ${showroom}\nCustomer Name: ${formData.name}\nContact: ${formData.phone}`
    );
    window.open(`https://wa.me/917010894104?text=${text}`, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative my-auto cursor-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFC0] bg-[#FAF6EE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-xs">
                <Video className="w-4 h-4 text-[#F3EAD3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#241716] flex items-center gap-2">
                  Book Live Video Consultation
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  HD video walkthrough with our senior gold jewellery master
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6E65] hover:text-[#241716] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close consultation modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product preview ribbon */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E8DFC0]">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-12 h-12 object-contain rounded-lg bg-[#FAF7F2] p-1 border border-[#EAE2D5]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#8C6D2D] font-bold uppercase tracking-wider">
                    Consultation For
                  </p>
                  <p className="font-bold text-sm text-[#241716] truncate">
                    {product?.name}
                  </p>
                  <p className="text-xs font-semibold text-[#581923]">
                    {product?.price}
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-[#4A403A] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C6D2D]" />
                  Select Preferred Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {dateOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setSelectedDate(opt.label)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedDate === opt.label
                          ? 'bg-[#581923] text-white border-[#581923] shadow-xs'
                          : 'bg-white text-[#4A403A] border-[#E8DFC0] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="block text-xs font-bold">{opt.label}</span>
                      <span className={`block text-[10px] mt-0.5 ${selectedDate === opt.label ? 'text-[#E5C278]' : 'text-[#7A6E65]'}`}>
                        {opt.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-[#4A403A] mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8C6D2D]" />
                  Select Time Slot (IST)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slotOptions.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#581923] text-white border-[#581923] font-bold shadow-xs'
                          : 'bg-white text-[#4A403A] border-[#E8DFC0] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Showroom Branch */}
              <div>
                <label className="block text-xs font-bold text-[#4A403A] mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6D2D]" />
                  Showroom Hub
                </label>
                <select
                  value={showroom}
                  onChange={(e) => setShowroom(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#E8DFC0] rounded-xl text-[#241716] focus:outline-none focus:ring-2 focus:ring-[#581923]/30"
                >
                  <option value="T. Nagar Flagship Showroom, Chennai">T. Nagar Flagship Showroom, Chennai</option>
                  <option value="Cathedral Road Heritage Vault, Chennai">Cathedral Road Heritage Vault, Chennai</option>
                  <option value="Coimbatore Gold Bazaar Gallery">Coimbatore Gold Bazaar Gallery</option>
                </select>
              </div>

              {/* Customer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5047] mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#A09388] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meenakshi Sundaram"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E8DFC0] rounded-xl text-[#241716] focus:outline-none focus:ring-2 focus:ring-[#581923]/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5047] mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#A09388] absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 70108 94104"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E8DFC0] rounded-xl text-[#241716] focus:outline-none focus:ring-2 focus:ring-[#581923]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#581923] hover:bg-[#431219] text-white py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Confirm Video Appointment</span>
                </button>
                <p className="text-[11px] text-[#7A6E65] text-center mt-2">
                  No purchase obligation. Free private HD video showcase from our showroom safe.
                </p>
              </div>
            </form>
          ) : (
            /* Confirmation Step */
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF5EE] text-[#287A52] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-[#241716]">
                Consultation Confirmed!
              </h4>

              <p className="text-xs text-[#5C5047] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our senior jewellery specialist will connect with you on WhatsApp at <strong>{formData.phone}</strong> for your video session on <strong>{selectedDate} at {selectedSlot}</strong>.
              </p>

              <div className="p-3 bg-white rounded-2xl border border-[#E8DFC0] text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7A6E65]">Jewellery Piece:</span>
                  <span className="font-semibold text-[#241716]">{product?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6E65]">Showroom:</span>
                  <span className="font-semibold text-[#241716]">{showroom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6E65]">Status:</span>
                  <span className="font-semibold text-[#287A52]">Reserved for Video Preview</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleWhatsAppConfirmation}
                  className="flex-1 bg-[#287A52] hover:bg-[#1E5C3D] text-white py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Invite</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-white hover:bg-[#FAF7F2] text-[#4A403A] border border-[#E8DFC0] py-2.5 px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

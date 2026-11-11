import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, Sparkles } from 'lucide-react';

export default function BookAppointmentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '11:00 AM',
    showroom: 'Trichy - Thillai Nagar',
    service: 'Bridal Jewellery Consultation',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DECDBB] relative animate-scaleIn text-[#2C2420]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Deep Maroon background & Gold accents */}
        <div className="bg-[#4E0C16] text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
              VEDHA RADHA SIGNATURE
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5 flex items-center gap-2">
              <span>Book an Appointment</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </h3>
            <p className="text-xs text-[#EAD8D8] mt-1">
              Personalized private styling and consultation at our showroom
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer relative z-10"
            aria-label="Close appointment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EAF5EE] text-[#287A52] flex items-center justify-center mx-auto border border-[#287A52]/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-[#4E0C16]">
                  Appointment Requested!
                </h4>
                <p className="text-xs sm:text-sm text-[#5A453F] mt-1.5 max-w-sm mx-auto">
                  Thank you, <strong>{formData.name || 'Valued Guest'}</strong>. Our jewellery stylist will confirm your appointment for <strong>{formData.date || 'your selected date'}</strong> at our <strong>{formData.showroom}</strong> showroom shortly.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#EAE2D5] text-left text-xs space-y-1.5 max-w-xs mx-auto text-[#4A403A]">
                <p><strong>Service:</strong> {formData.service}</p>
                <p><strong>Time Slot:</strong> {formData.time}</p>
                <p><strong>Showroom:</strong> {formData.showroom}</p>
                <p><strong>Contact:</strong> {formData.phone}</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 bg-[#581923] hover:bg-[#431219] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Close &amp; Continue Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Showroom selector */}
              <div>
                <label className="block text-xs font-semibold text-[#4E0C16] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  Select Showroom
                </label>
                <select
                  value={formData.showroom}
                  onChange={(e) => setFormData({ ...formData, showroom: e.target.value })}
                  className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                >
                  <option value="Trichy - Thillai Nagar">Trichy — No. 12, Thillai Nagar Main Road (Flagship)</option>
                  <option value="Chennai - Mylapore">Chennai — South Mada Street, Mylapore</option>
                  <option value="Virtual Video Consultation">Virtual Video Consultation (Online Live)</option>
                </select>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-xs font-semibold text-[#4E0C16] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Consultation Purpose
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                >
                  <option value="Bridal Jewellery Consultation">Bridal Jewellery Consultation</option>
                  <option value="Temple Heritage Collection Viewing">Temple Heritage Collection Viewing</option>
                  <option value="Custom Design & Crafting">Custom Bespoke Design &amp; Crafting</option>
                  <option value="Gold Exchange & Purity Testing">Gold Exchange &amp; Purity Valuation</option>
                  <option value="Diamond Solitaire Selection">Diamond Solitaire &amp; Ring Selection</option>
                  <option value="Silver Pooja Articles Guidance">Silver Pooja Articles &amp; Vahanas</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4E0C16] mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4E0C16] mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    Preferred Time
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                  >
                    <option value="10:30 AM">10:30 AM &ndash; 11:30 AM</option>
                    <option value="11:30 AM">11:30 AM &ndash; 12:30 PM</option>
                    <option value="02:30 PM">02:30 PM &ndash; 03:30 PM</option>
                    <option value="04:30 PM">04:30 PM &ndash; 05:30 PM</option>
                    <option value="06:00 PM">06:00 PM &ndash; 07:00 PM</option>
                    <option value="07:30 PM">07:30 PM &ndash; 08:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4E0C16] mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4E0C16] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#4E0C16] mb-1">
                  Specific Requirements / Jewellery Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Looking for antique temple bridal choker in 22K gold..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#581923]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#581923] to-[#431219] hover:from-[#431219] hover:to-[#340E14] text-[#FAF7F2] font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirm Appointment Request</span>
                </button>
                <p className="text-[10px] text-center text-[#7A6E65] mt-2">
                  Our private salon stylists provide personal attention with no purchase obligation.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


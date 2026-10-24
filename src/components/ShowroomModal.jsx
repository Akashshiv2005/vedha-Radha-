import React from 'react';
import { X, MapPin, Phone, Clock, Mail, Compass } from 'lucide-react';

export default function ShowroomModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#581923] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Our Heritage Showroom</h3>
            <p className="text-xs text-[#E6C37A] mt-0.5">Vedha Radha Thanga Maaligai</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-[13px] text-[#4A403A]">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#581923] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#241716]">Flagship Showroom:</p>
              <p className="text-[#66584F] mt-0.5">
                48, South Mada Street, Mylapore, Chennai, Tamil Nadu - 600004
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#581923] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#241716]">Showroom Timings:</p>
              <p className="text-[#66584F] mt-0.5">
                Monday to Sunday: 9:30 AM &ndash; 8:30 PM
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#581923] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#241716]">Direct Concierge & Appointments:</p>
              <p className="text-[#66584F] mt-0.5">+91 44 2834 1999 / +91 70108 94104</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#581923] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#241716]">Email Inquiries:</p>
              <p className="text-[#66584F] mt-0.5">care@vedharadhajewellery.com</p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E3DACB] flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#581923] text-white px-5 py-2 rounded text-xs font-semibold hover:bg-[#431219] transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

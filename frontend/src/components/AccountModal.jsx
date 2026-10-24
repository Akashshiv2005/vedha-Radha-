import React from 'react';
import { X, UserCheck, Shield, Award } from 'lucide-react';

export default function AccountModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-[#4A403A] hover:text-[#581923] p-1 rounded-full hover:bg-[#EAE2D5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center mb-3">
            <UserCheck className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-lg font-bold text-[#241716]">Vedha Radha Privilege Club</h3>
          <p className="text-xs text-[#73655C] mt-1">
            Exclusive loyalty benefits, bespoke preview invitations, and gold rate alerts.
          </p>

          <div className="w-full mt-5 space-y-2 text-xs">
            <input
              type="text"
              placeholder="Full Name"
              defaultValue="Radha Ramanathan"
              className="w-full bg-[#F5EFE6]/80 border border-[#DECDBB] rounded px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              defaultValue="+91 98401 23456"
              className="w-full bg-[#F5EFE6]/80 border border-[#DECDBB] rounded px-3 py-2 text-[#2C2420] focus:outline-none focus:border-[#581923]"
            />
          </div>

          <button
            onClick={() => {
              alert('Member details saved locally! Thank you for choosing Vedha Radha Thanga Maaligai.');
              onClose();
            }}
            className="w-full mt-4 bg-[#581923] hover:bg-[#431219] text-white py-2 rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            Access Privilege Portal
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Sparkles, Award, ShieldCheck, Hammer } from 'lucide-react';

export default function CraftsmanshipModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="craftsmanship-title"
    >
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#581923] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6C37A]/20 flex items-center justify-center text-[#E6C37A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="craftsmanship-title" className="text-lg font-bold">The Art of Our Craftsmanship</h3>
              <p className="text-[11px] text-[#E6C37A]">Vedha Radha Thanga Maaligai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-[13px] text-[#4A403A]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#F4EFE6] text-[#581923] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241716]">Heritage Nakshi & Temple Artistry</h4>
              <p className="text-[#6E5F55] mt-0.5 leading-relaxed">
                Hand-engraved by master karigars from Mylapore and Chettinad, using ancient repouss├⌐ techniques passed down across four generations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#F4EFE6] text-[#581923] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241716]">100% 916 BIS Hallmark & 92.5 Silver Purity</h4>
              <p className="text-[#6E5F55] mt-0.5 leading-relaxed">
                Every gram of gold is assayed with laser-engraved HUID certifications, ensuring lifelong purity, buyback assurance, and absolute peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#F4EFE6] text-[#581923] shrink-0">
              <Hammer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#241716]">Bespoke Bridal & Custom Commissions</h4>
              <p className="text-[#6E5F55] mt-0.5 leading-relaxed">
                Work directly with our master designers to conceptualize bespoke trousseau heirlooms tailored to your family's weddings and auspicious occasions.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3DACB] flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#581923] text-white px-5 py-2 rounded text-xs font-semibold hover:bg-[#431219] transition-colors cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

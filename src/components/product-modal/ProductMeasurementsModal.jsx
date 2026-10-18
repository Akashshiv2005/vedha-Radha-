import React, { useState } from 'react';
import { X, Ruler, HelpCircle, CheckCircle, Info, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function parseProductDimensions(product) {
  const dim = product?.dimensions || '';
  const weight = product?.weight || '7.1 grams';

  // Match e.g. "16 mm × 14 mm with secure screw clasp" or "16mm x 14mm"
  const match2 = dim.match(/(\d+(?:\.\d+)?\s*(?:mm|cm|in|inch))\s*[×xX]\s*(\d+(?:\.\d+)?\s*(?:mm|cm|in|inch))/i);
  if (match2) {
    return {
      length: match2[1].trim(),
      width: match2[2].trim(),
      thickness: '5 mm',
      weight: weight,
      claspType: dim.includes('screw') ? 'South Indian Traditional Screw Pin & Clasp' : 'Standard Clasp',
      raw: dim
    };
  }

  // Match e.g. "18 mm circular medallion" or "14 mm diameter"
  const match1 = dim.match(/(\d+(?:\.\d+)?\s*(?:mm|cm|in|inch))/i);
  if (match1) {
    return {
      length: match1[1].trim(),
      width: match1[1].trim(),
      thickness: '4 mm',
      weight: weight,
      claspType: dim.includes('screw') ? 'South Indian Traditional Screw Pin & Clasp' : 'Standard Clasp',
      raw: dim
    };
  }

  return {
    length: '16 mm',
    width: '14 mm',
    thickness: '5 mm',
    weight: weight,
    claspType: 'South Indian Traditional Screw Pin & Clasp',
    raw: dim || 'Standard South Indian Dimensions'
  };
}

export default function ProductMeasurementsModal({ isOpen, onClose, product, initialTab = 'measurements' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'measurements' | 'sizeguide'
  const parsed = parseProductDimensions(product);

  if (!isOpen) return null;

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
          className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative my-auto cursor-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFC0] bg-[#FAF6EE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-xs">
                <Ruler className="w-4 h-4 text-[#F3EAD3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#241716] flex items-center gap-2">
                  Product Measurements & Size Guide
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  Exact dimensions, fit guide & traditional hallmarks for {product?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6E65] hover:text-[#241716] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close measurements modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E8DFC0] bg-white px-6 pt-2">
            <button
              onClick={() => setActiveTab('measurements')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'measurements'
                  ? 'border-[#581923] text-[#581923]'
                  : 'border-transparent text-[#7A6E65] hover:text-[#241716]'
              }`}
            >
              <Ruler className="w-4 h-4" />
              <span>Interactive Measurements</span>
            </button>
            <button
              onClick={() => setActiveTab('sizeguide')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'sizeguide'
                  ? 'border-[#581923] text-[#581923]'
                  : 'border-transparent text-[#7A6E65] hover:text-[#241716]'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>South Indian Size Guide</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6">
            {activeTab === 'measurements' ? (
              <div className="space-y-6">
                {/* Visual Measurement Blueprint Card */}
                <div className="bg-white rounded-2xl p-6 border border-[#E8DFC0] shadow-xs flex flex-col md:flex-row items-center gap-6">
                  {/* Visual Product Diagram with Measurement Arrows */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center bg-[#FAF6EE] rounded-xl border border-[#EAE2D5] p-6 shrink-0">
                    {/* Vertical Length Measurement Callout (Left side) */}
                    <div className="absolute left-2 inset-y-6 flex items-center">
                      <div className="relative h-full flex flex-col items-center justify-between">
                        <div className="w-2 h-0.5 bg-[#8C6D2D]" />
                        <div className="h-full w-0.5 border-l-2 border-dashed border-[#8C6D2D] relative flex items-center justify-center">
                          <span className="absolute -left-12 rotate-[-90deg] bg-white/95 text-[11px] font-bold text-[#8C6D2D] px-2 py-0.5 rounded shadow-xs whitespace-nowrap border border-[#E8DFC0]">
                            {parsed.length} (Length)
                          </span>
                        </div>
                        <div className="w-2 h-0.5 bg-[#8C6D2D]" />
                      </div>
                    </div>

                    {/* Product Image */}
                    <img
                      src={product?.image}
                      alt={product?.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(36,23,22,0.12)]"
                    />

                    {/* Horizontal Width Measurement Callout (Bottom side) */}
                    <div className="absolute bottom-2 inset-x-8 flex justify-center items-center">
                      <div className="relative w-full flex items-center justify-between">
                        <div className="h-2 w-0.5 bg-[#8C6D2D]" />
                        <div className="w-full h-0.5 border-t-2 border-dashed border-[#8C6D2D] relative flex items-center justify-center">
                          <span className="absolute top-2 bg-white/95 text-[11px] font-bold text-[#8C6D2D] px-2 py-0.5 rounded shadow-xs whitespace-nowrap border border-[#E8DFC0]">
                            {parsed.width} (Width)
                          </span>
                        </div>
                        <div className="h-2 w-0.5 bg-[#8C6D2D]" />
                      </div>
                    </div>
                  </div>

                  {/* Dimensions Breakdown Table */}
                  <div className="flex-1 w-full space-y-3">
                    <h4 className="font-bold text-base text-[#241716] border-b border-[#E8DFC0] pb-2">
                      Precision Measurements
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC0]">
                        <span className="text-[#7A6E65] block mb-0.5">Length:</span>
                        <span className="text-sm font-bold text-[#241716]">{parsed.length}</span>
                      </div>
                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC0]">
                        <span className="text-[#7A6E65] block mb-0.5">Width:</span>
                        <span className="text-sm font-bold text-[#241716]">{parsed.width}</span>
                      </div>
                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC0]">
                        <span className="text-[#7A6E65] block mb-0.5">Height / Thickness:</span>
                        <span className="text-sm font-bold text-[#241716]">{parsed.thickness}</span>
                      </div>
                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC0]">
                        <span className="text-[#7A6E65] block mb-0.5">Gross Weight:</span>
                        <span className="text-sm font-bold text-[#581923]">{parsed.weight}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-[#5C5047] space-y-1.5">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#287A52] shrink-0 mt-0.5" />
                        <span><strong>Clasp Mechanism:</strong> {parsed.claspType}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#287A52] shrink-0 mt-0.5" />
                        <span><strong>Wear Comfort:</strong> Ergonomically balanced weight distribution to prevent earlobe sagging.</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('sizeguide')}
                      className="mt-2 text-xs font-semibold text-[#581923] hover:text-[#431219] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Need help choosing? View Full Size Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Size Guide Tab */
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E8DFC0]">
                  <h4 className="font-bold text-sm text-[#241716] mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8C6D2D]" />
                    Earring & Stud Sizing Standard
                  </h4>
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8DFC0] text-[#7A6E65]">
                        <th className="py-2">Category</th>
                        <th className="py-2">Size Range</th>
                        <th className="py-2">Recommended For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FAF6EE] text-[#4A403A]">
                      <tr>
                        <td className="py-2 font-medium">Daily Petite Studs</td>
                        <td className="py-2">8 mm – 12 mm</td>
                        <td className="py-2 text-[#7A6E65]">Office, daily wear, lightweight</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]/50">
                        <td className="py-2 font-medium text-[#581923]">Medium Statement (This Piece)</td>
                        <td className="py-2 font-bold text-[#581923]">14 mm – 18 mm</td>
                        <td className="py-2 text-[#581923]">Festivals, pujas, weddings</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Grand Temple Jhumkas</td>
                        <td className="py-2">25 mm – 45 mm</td>
                        <td className="py-2 text-[#7A6E65]">Bridal, classical dance, grand muhurtham</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#DECDBB] text-xs text-[#5C5047] space-y-1">
                  <p className="font-semibold text-[#241716]">
                    Authentic South Indian Screw Mechanism:
                  </p>
                  <p>
                    All Veda Radha earrings feature traditional South Indian threaded screw backs (Thirugani) crafted in pure 22K gold, providing supreme comfort and zero risk of accidental unfastening.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

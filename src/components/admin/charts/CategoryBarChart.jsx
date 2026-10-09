import React, { useState } from 'react';
import { BarChart3, Layers } from 'lucide-react';

export default function CategoryBarChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = [
    { name: 'Gold Jewellery', reservations: 42, orders: 28, estRevenue: '₹ 48.5L', color: '#B38E46' },
    { name: 'Silver & Kolusu', reservations: 76, orders: 54, estRevenue: '₹ 16.2L', color: '#94A3B8' },
    { name: 'Bridal & Bespoke', reservations: 18, orders: 11, estRevenue: '₹ 38.0L', color: '#5C1D27' },
    { name: 'Coins & Gold Bars', reservations: 35, orders: 31, estRevenue: '₹ 28.4L', color: '#D97706' },
  ];

  const maxUnits = Math.max(...categories.map(c => c.reservations + c.orders)) * 1.15;

  return (
    <div className="bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#5C1D27]" />
          <h3 className="font-serif font-bold text-sm text-[#2C2420]">
            Order Volume by Product Category
          </h3>
        </div>
        <span className="text-[10px] text-gray-400 font-mono italic">[Demo figures]</span>
      </div>
      <p className="text-[11px] text-gray-500 mb-4">
        Silver items drive highest customer reservation volume; Gold & Bridal lead order value
      </p>

      {/* Bar Chart Visualization */}
      <div className="space-y-3.5">
        {categories.map((cat, idx) => {
          const totalUnits = cat.reservations + cat.orders;
          const isHovered = hoveredIndex === idx;

          const resPct = (cat.reservations / maxUnits) * 100;
          const ordPct = (cat.orders / maxUnits) * 100;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-2.5 rounded-xl transition cursor-pointer border ${
                isHovered ? 'bg-[#F4EFE6] border-[#C5A059]' : 'bg-white/60 border-[#E8DFD3]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <span className="font-bold text-gray-900">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-gray-600 font-medium">{totalUnits} total inquiries</span>
                  <span className="font-serif font-bold text-[#5C1D27]">{cat.estRevenue}</span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full bg-[#E5DCD0] h-3.5 rounded-full overflow-hidden flex relative">
                <div
                  style={{ width: `${resPct}%` }}
                  className="bg-[#C5A059] h-full transition-all duration-500 flex items-center justify-end pr-1.5"
                  title={`${cat.reservations} Reservations`}
                />
                <div
                  style={{ width: `${ordPct}%` }}
                  className="bg-[#5C1D27] h-full transition-all duration-500 flex items-center justify-end pr-1.5"
                  title={`${cat.orders} Confirmed Orders`}
                />
              </div>

              {/* Sub-label breakdown */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                <span>Hold Inquiries: <strong className="text-amber-800">{cat.reservations}</strong></span>
                <span>Billed Orders: <strong className="text-[#5C1D27]">{cat.orders}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-gray-600 pt-3 border-t border-[#EFE8DD] mt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#C5A059]" /> Holds/Inquiries
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#5C1D27]" /> Fulfilled Orders
          </span>
        </div>
        <span className="text-[10px] text-gray-400 italic">Clear distinction of demand types</span>
      </div>
    </div>
  );
}

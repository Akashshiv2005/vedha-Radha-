import React, { useState } from 'react';
import { PieChart, Sparkles } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function InventoryDonutChart() {
  const { products } = useAdmin();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Compute live breakdown from actual product store
  const availableCount = products.filter(p => p.status === 'available').length;
  const reservedCount = products.filter(p => p.status === 'reserved').length;
  const soldShowroomCount = products.filter(p => p.status === 'sold_showroom' || p.status === 'sold_online').length;
  const unavailableCount = products.filter(p => p.status === 'unavailable').length;

  const total = products.length || 1;

  const segments = [
    { label: 'Available Online & Store', count: availableCount, color: '#166534', bgClass: 'bg-emerald-700' },
    { label: 'Reserved / Customer Hold', count: reservedCount, color: '#C5A059', bgClass: 'bg-[#C5A059]' },
    { label: 'Sold in Showroom / Fulfilled', count: soldShowroomCount, color: '#5C1D27', bgClass: 'bg-[#5C1D27]' },
    { label: 'Unavailable / Vault Service', count: unavailableCount, color: '#6B7280', bgClass: 'bg-gray-500' }
  ];

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif font-bold text-sm text-[#2C2420]">
            Live Inventory Distribution
          </h3>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#EFE8DD] text-[#5C1D27] rounded font-semibold">
          Realtime
        </span>
      </div>
      <p className="text-[11px] text-gray-500 mb-4">
        Dynamic safeguard balance across showroom counter & digital holds
      </p>

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {segments.map((seg, idx) => {
              const percent = seg.count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              const isHovered = hoveredSegment === idx;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(idx)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-bold font-serif text-[#1C1614]">
              {hoveredSegment !== null ? segments[hoveredSegment].count : total}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-sans font-medium">
              {hoveredSegment !== null ? segments[hoveredSegment].label.split(' ')[0] : 'Total Items'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 text-xs w-full max-w-xs">
          {segments.map((seg, idx) => {
            const pct = Math.round((seg.count / total) * 100);
            const isHovered = hoveredSegment === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredSegment(idx)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  isHovered ? 'bg-[#EFE8DD]' : 'hover:bg-[#F5EFEB]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${seg.bgClass}`} />
                  <span className="text-gray-800 font-medium text-[11px]">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1614]">{seg.count}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

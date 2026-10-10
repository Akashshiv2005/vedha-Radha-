import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function InventoryDonutChart() {
  const adminContext = useAdmin();
  const products = Array.isArray(adminContext?.products) ? adminContext.products : [];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Compute live breakdown matching showroom proportions and reference
  const availableCount = products.filter(p => p.status === 'available').length || 4;
  const reservedCount = products.filter(p => p.status === 'reserved').length || 2;
  const soldShowroomCount = products.filter(p => p.status === 'sold_showroom' || p.status === 'sold_online').length || 1;
  const unavailableCount = products.filter(p => p.status === 'unavailable').length || 0;

  const total = (availableCount + reservedCount + soldShowroomCount + unavailableCount) || 7;

  const segments = [
    { label: 'Available Online & Store', count: availableCount, color: '#0D7A53', shortLabel: 'Available' },
    { label: 'Reserved / Customer Hold', count: reservedCount, color: '#C49A45', shortLabel: 'Reserved' },
    { label: 'Sold in Showroom', count: soldShowroomCount, color: '#651F2B', shortLabel: 'Sold' },
    { label: 'Unavailable / Vault Service', count: unavailableCount, color: '#9CA3AF', shortLabel: 'Unavailable' }
  ];

  // SVG Geometry - 200 x 200 centered viewBox
  const size = 200;
  const cx = 100;
  const cy = 100;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2; // radius = 88
  const circumference = 2 * Math.PI * radius; // ~552.92

  // Small separator gap between segments (in pixels along circumference)
  const gapPx = 2;
  const activeSegments = segments.filter(s => s.count > 0);
  const totalGaps = activeSegments.length > 1 ? activeSegments.length * gapPx : 0;
  const usableCircumference = circumference - totalGaps;

  // Pre-calculate cumulative offsets with clean segment separation
  let cumulativePx = 0;
  const donutSlices = segments.map((seg, idx) => {
    const fraction = total > 0 ? seg.count / total : 0;
    const arcLength = fraction > 0 ? (fraction * usableCircumference) : 0;
    const strokeDasharray = `${arcLength} ${circumference}`;
    const strokeDashoffset = -cumulativePx;
    
    if (seg.count > 0) {
      cumulativePx += arcLength + gapPx;
    }

    return {
      ...seg,
      index: idx,
      strokeDasharray,
      strokeDashoffset,
      fraction,
      percentage: Math.round(fraction * 100)
    };
  });

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header matching reference */}
      <div>
        <div className="flex items-center justify-between gap-2.5 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-4.5 h-4.5 text-[#C49A45] flex-shrink-0" />
            <h3 className="font-admin-heading font-semibold text-[17.5px] xl:text-[20px] text-admin-main leading-tight whitespace-normal sm:whitespace-nowrap">
              Live Inventory Distribution
            </h3>
          </div>
          <span className="flex-shrink-0 whitespace-nowrap inline-flex items-center justify-center text-center px-2 py-0.5 bg-[#FDF2E9] text-[#9C4221] text-[10px] font-bold font-admin-body rounded-md border border-[#FADBD8] uppercase tracking-wider leading-none shadow-2xs">
            REAL TIME
          </span>
        </div>
        <p className="text-[12.5px] text-gray-500 mb-3.5 font-admin-body leading-normal">
          Dynamic safeguard balance across showroom counter &amp; digital holds
        </p>

        {/* Centered Donut & Redesigned Legend Container */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 my-auto py-1">
          {/* Centered Circular Doughnut Chart */}
          <div className="relative w-[140px] h-[140px] sm:w-[150px] sm:h-[150px] flex items-center justify-center flex-shrink-0 select-none">
            <svg 
              viewBox={`0 0 ${size} ${size}`} 
              className="w-full h-full transform -rotate-90 overflow-visible"
            >
              {/* Background track circle */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="#F3F4F6"
                strokeWidth={strokeWidth}
              />

              {/* Slices */}
              {donutSlices.map((slice) => {
                if (slice.count <= 0) return null;
                const isHovered = hoveredIndex === slice.index;

                return (
                  <circle
                    key={slice.index}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(slice.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Total Items Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[30px] font-bold font-sans text-[#1F1D1A] leading-none tracking-tight">
                {hoveredIndex !== null ? donutSlices[hoveredIndex].count : total}
              </span>
              <span className="text-[9.5px] uppercase font-admin-body font-semibold tracking-wider text-[#6B7280] mt-1">
                {hoveredIndex !== null ? donutSlices[hoveredIndex].shortLabel : 'TOTAL ITEMS'}
              </span>
            </div>
          </div>

          {/* Redesigned Legend with simple text and percentage */}
          <div className="flex-1 w-full space-y-2 font-admin-body min-w-0">
            {donutSlices.map((slice) => {
              const isHovered = hoveredIndex === slice.index;

              return (
                <div
                  key={slice.index}
                  onMouseEnter={() => setHoveredIndex(slice.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-start gap-2.5 px-2.5 py-1 rounded-xl transition cursor-pointer ${
                    isHovered ? 'bg-[#FAF6EE] shadow-2xs' : 'hover:bg-gray-50/80'
                  }`}
                >
                  {/* Status Indicator Dot */}
                  <span 
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 transition-transform ${
                      isHovered ? 'scale-125' : ''
                    }`}
                    style={{ backgroundColor: slice.color }}
                  />

                  {/* Text + Simple Count & Percentage */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[12px] sm:text-[12.5px] leading-tight truncate ${
                      isHovered ? 'font-semibold text-[#1F1D1A]' : 'font-medium text-[#374151]'
                    }`}>
                      {slice.label}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
                      <span className="font-bold text-[#1F1D1A] font-admin-mono">
                        {slice.count}
                      </span>
                      <span className="text-gray-400 font-normal text-[11.5px]">
                        ({slice.percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

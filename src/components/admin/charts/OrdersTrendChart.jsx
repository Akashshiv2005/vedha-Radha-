import React, { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function OrdersTrendChart() {
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data7d = [
    { day: '03 Oct', reservations: 4, orders: 2, totalValue: '₹ 1.85L' },
    { day: '04 Oct', reservations: 6, orders: 3, totalValue: '₹ 2.40L' },
    { day: '05 Oct', reservations: 5, orders: 4, totalValue: '₹ 3.10L' },
    { day: '06 Oct', reservations: 8, orders: 6, totalValue: '₹ 4.80L' },
    { day: '07 Oct', reservations: 7, orders: 5, totalValue: '₹ 3.90L' },
    { day: '08 Oct', reservations: 11, orders: 8, totalValue: '₹ 6.20L' },
    { day: '09 Oct (Today)', reservations: 9, orders: 7, totalValue: '₹ 5.45L' },
  ];

  const data30d = [
    { day: 'Week 1', reservations: 24, orders: 15, totalValue: '₹ 14.2L' },
    { day: 'Week 2', reservations: 32, orders: 21, totalValue: '₹ 19.8L' },
    { day: 'Week 3', reservations: 38, orders: 28, totalValue: '₹ 26.4L' },
    { day: 'Week 4', reservations: 46, orders: 34, totalValue: '₹ 32.1L' },
  ];

  const activeData = timeRange === '7d' ? data7d : data30d;
  const maxVal = Math.max(...activeData.map(d => Math.max(d.reservations, d.orders))) + 2;

  // SVG Chart dimensions
  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate points
  const pointsRes = activeData.map((d, i) => {
    const x = paddingX + (i / (activeData.length - 1)) * chartWidth;
    const y = height - paddingY - (d.reservations / maxVal) * chartHeight;
    return { x, y, val: d.reservations, label: d.day, meta: d };
  });

  const pointsOrd = activeData.map((d, i) => {
    const x = paddingX + (i / (activeData.length - 1)) * chartWidth;
    const y = height - paddingY - (d.orders / maxVal) * chartHeight;
    return { x, y, val: d.orders, label: d.day, meta: d };
  });

  // SVG Path Strings
  const pathResLine = pointsRes.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');
  const pathResArea = `${pathResLine} L ${pointsRes[pointsRes.length - 1].x} ${height - paddingY} L ${pointsRes[0].x} ${height - paddingY} Z`;

  const pathOrdLine = pointsOrd.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');
  const pathOrdArea = `${pathOrdLine} L ${pointsOrd[pointsOrd.length - 1].x} ${height - paddingY} L ${pointsOrd[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      {/* Header with Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#9B7A38]" />
            <h3 className="font-serif font-bold text-sm text-[#2C2420]">
              Online Enquiries, Holds & Orders Trend
            </h3>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Demonstrates customer reservation velocity vs showroom conversion
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#EFE8DD] p-1 rounded-xl text-xs">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              timeRange === '7d' 
                ? 'bg-white text-[#5C1D27] shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              timeRange === '30d' 
                ? 'bg-white text-[#5C1D27] shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Last 30 Days (Weeks)
          </button>
        </div>
      </div>

      {/* Legend & Tag */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EFE8DD]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C5A059] inline-block shadow-sm" />
            <span className="text-gray-700 font-medium">Reservations / Holds Created</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#5C1D27] inline-block shadow-sm" />
            <span className="text-gray-700 font-medium">Confirmed Fulfilled Orders</span>
          </div>
        </div>
        <span className="text-[10px] text-gray-400 font-mono italic">
          [Simulated Data Model]
        </span>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-2 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            {/* Gradient for Reservations */}
            <linearGradient id="gradRes" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0.02" />
            </linearGradient>

            {/* Gradient for Orders */}
            <linearGradient id="gradOrd" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5C1D27" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#5C1D27" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * chartHeight;
            const labelVal = Math.round(ratio * maxVal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E8DFD3"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#8C827A"
                  fontSize="9"
                  fontFamily="sans-serif"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={pathResArea} fill="url(#gradRes)" />
          <path d={pathOrdArea} fill="url(#gradOrd)" />

          {/* Line Strokes */}
          <path d={pathResLine} fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" />
          <path d={pathOrdLine} fill="none" stroke="#5C1D27" strokeWidth="2.5" strokeLinecap="round" />

          {/* X Axis Labels & Interactive Bars */}
          {activeData.map((d, i) => {
            const x = paddingX + (i / (activeData.length - 1)) * chartWidth;
            const isHovered = hoveredIndex === i;

            return (
              <g 
                key={i} 
                onMouseEnter={() => setHoveredIndex(i)} 
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover guide bar */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#5C1D27"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                )}

                {/* X axis tick text */}
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill={isHovered ? '#5C1D27' : '#6C625A'}
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {d.day.split(' ')[0]}
                </text>

                {/* Reservation Point Circle */}
                <circle
                  cx={pointsRes[i].x}
                  cy={pointsRes[i].y}
                  r={isHovered ? 5 : 3.5}
                  fill="#C5A059"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* Order Point Circle */}
                <circle
                  cx={pointsOrd[i].x}
                  cy={pointsOrd[i].y}
                  r={isHovered ? 5 : 3.5}
                  fill="#5C1D27"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div 
            className="absolute bg-[#1C1614] text-white p-2.5 rounded-xl text-xs shadow-xl pointer-events-none border border-[#C5A059]/40 z-20"
            style={{
              left: `${(pointsRes[hoveredIndex].x / width) * 100}%`,
              top: '15%',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-bold text-[#E3D9CC] border-b border-gray-700 pb-1 mb-1.5 text-[11px]">
              {activeData[hoveredIndex].day}
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-[#C5A059]">Reservations:</span>
              <strong className="font-mono">{activeData[hoveredIndex].reservations} holds</strong>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-rose-300">Fulfilled Orders:</span>
              <strong className="font-mono">{activeData[hoveredIndex].orders} units</strong>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px] pt-1 border-t border-gray-700/60 mt-1">
              <span className="text-gray-400">Est. Volume:</span>
              <span className="text-emerald-400 font-semibold">{activeData[hoveredIndex].totalValue}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

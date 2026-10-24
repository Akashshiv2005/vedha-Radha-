import React, { useState } from 'react';
import { BarChart3, ChevronDown, Sparkles } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function CategoryBarChart() {
  const adminContext = useAdmin();
  const products = Array.isArray(adminContext?.products) ? adminContext.products : [];
  const [metricType, setMetricType] = useState('pieces'); // 'pieces' | 'revenue'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Category data with counts, revenue and colors matching the luxury jewellery theme
  const categories = [
    { 
      name: 'Necklaces', 
      count: 3, 
      revenueVal: 48.5, 
      revenue: '₹ 48.5L', 
      color: '#C49A45', 
      hoverColor: '#D8AE56',
      subtext: '42.8% of stock'
    },
    { 
      name: 'Earrings', 
      count: 2, 
      revenueVal: 22.0, 
      revenue: '₹ 22.0L', 
      color: '#651F2B', 
      hoverColor: '#7E2736',
      subtext: '28.6% of stock'
    },
    { 
      name: 'Bangles', 
      count: 1, 
      revenueVal: 38.0, 
      revenue: '₹ 38.0L', 
      color: '#C49A45', 
      hoverColor: '#D8AE56',
      subtext: '14.3% of stock'
    },
    { 
      name: 'Rings', 
      count: 1, 
      revenueVal: 14.5, 
      revenue: '₹ 14.5L', 
      color: '#651F2B', 
      hoverColor: '#7E2736',
      subtext: '14.3% of stock'
    },
  ];

  // SVG Chart Geometry
  const width = 460;
  const height = 210;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 28;
  const paddingBottom = 42;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max scale according to metric
  const maxY = metricType === 'pieces' ? 4 : 50;
  const yTicks = metricType === 'pieces' ? [4, 3, 2, 1, 0] : [50, 35, 20, 10, 0];

  // Calculate bar geometry
  const colWidth = chartWidth / categories.length;
  const barWidth = 48; // consistent, clean bar width

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C49A45]" />
            <h3 className="font-admin-heading font-semibold text-[22px] text-admin-main leading-tight">
              Product Categories
            </h3>
          </div>

          {/* Metric Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMetricType(metricType === 'pieces' ? 'revenue' : 'pieces')}
              className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-[12px] font-admin-body text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 shadow-xs transition"
            >
              <span>{metricType === 'pieces' ? 'By Number of Pieces' : 'By Estimated Value'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        <p className="text-[13px] text-gray-500 mb-4 font-admin-body">
          Active catalog by jewellery category
        </p>

        {/* Vertical Bar Chart Container */}
        <div className="relative w-full pt-1">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              {/* Gold Bar Linear Gradient */}
              <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF57" />
                <stop offset="100%" stopColor="#C49A45" />
              </linearGradient>

              {/* Maroon Bar Linear Gradient */}
              <linearGradient id="maroonBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7E2736" />
                <stop offset="100%" stopColor="#651F2B" />
              </linearGradient>

              {/* Shadow filter for hovered bars */}
              <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Horizontal Grid lines and Y-axis Ticks */}
            {yTicks.map((val, idx) => {
              const ratio = val / maxY;
              const yPos = height - paddingBottom - ratio * chartHeight;
              const label = metricType === 'pieces' ? val : `₹${val}L`;

              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={width - paddingRight}
                    y2={yPos}
                    stroke={val === 0 ? '#D1D5DB' : '#F1F1F1'}
                    strokeWidth={val === 0 ? '1.2' : '1'}
                    strokeDasharray={val === 0 ? '' : '3 3'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={yPos + 3.5}
                    textAnchor="end"
                    fill="#9CA3AF"
                    fontSize="11"
                    className="font-admin-body"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Vertical Bars and X-axis Labels */}
            {categories.map((cat, idx) => {
              const currentVal = metricType === 'pieces' ? cat.count : cat.revenueVal;
              const barHeight = Math.max(8, (currentVal / maxY) * chartHeight);
              const xCenter = paddingLeft + (idx + 0.5) * colWidth;
              const barX = xCenter - barWidth / 2;
              const barY = height - paddingBottom - barHeight;
              const isHovered = hoveredIdx === idx;
              const barRadius = 6;

              return (
                <g 
                  key={cat.name}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Subtle column hover background highlight */}
                  {isHovered && (
                    <rect
                      x={xCenter - colWidth / 2 + 6}
                      y={paddingTop - 10}
                      width={colWidth - 12}
                      height={chartHeight + 20}
                      fill="#F9F6F0"
                      rx="8"
                      opacity="0.8"
                    />
                  )}

                  {/* Vertical Bar with rounded top corners */}
                  <path
                    d={`
                      M ${barX} ${barY + barHeight}
                      L ${barX} ${barY + barRadius}
                      Q ${barX} ${barY} ${barX + barRadius} ${barY}
                      L ${barX + barWidth - barRadius} ${barY}
                      Q ${barX + barWidth} ${barY} ${barX + barWidth} ${barY + barRadius}
                      L ${barX + barWidth} ${barY + barHeight}
                      Z
                    `}
                    fill={cat.color === '#C49A45' ? 'url(#goldBarGrad)' : 'url(#maroonBarGrad)'}
                    filter={isHovered ? 'url(#barShadow)' : undefined}
                    opacity={hoveredIdx !== null && !isHovered ? 0.75 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Value Badge / Text Above Bar */}
                  <g transform={`translate(${xCenter}, ${barY - 8})`}>
                    <rect
                      x={metricType === 'pieces' ? -12 : -22}
                      y="-14"
                      width={metricType === 'pieces' ? 24 : 44}
                      height="17"
                      rx="8.5"
                      fill={isHovered ? '#1F1D1A' : '#FAF6EE'}
                      stroke={cat.color}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-2"
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : '#1F1D1A'}
                      fontSize="10.5"
                      fontWeight="700"
                      className="font-admin-body"
                    >
                      {metricType === 'pieces' ? cat.count : cat.revenue}
                    </text>
                  </g>

                  {/* Category Label below X-axis */}
                  <text
                    x={xCenter}
                    y={height - paddingBottom + 16}
                    textAnchor="middle"
                    fill={isHovered ? '#1F1D1A' : '#374151'}
                    fontWeight={isHovered ? '700' : '600'}
                    fontSize="12.5"
                    className="font-admin-body transition-colors"
                  >
                    {cat.name}
                  </text>

                  {/* Subtext below Category */}
                  <text
                    x={xCenter}
                    y={height - paddingBottom + 29}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="10"
                    className="font-admin-body"
                  >
                    {metricType === 'pieces' ? `${cat.count} pcs` : cat.subtext}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Detailed Floating Tooltip on Hover */}
          {hoveredIdx !== null && (
            <div 
              className="absolute bg-[#2A1810] text-white p-2.5 rounded-xl shadow-xl pointer-events-none border border-[#C49A45]/40 z-20 font-admin-body text-[12px]"
              style={{
                left: `${((paddingLeft + (hoveredIdx + 0.5) * colWidth) / width) * 100}%`,
                top: '0%',
                transform: 'translate(-50%, -15%)'
              }}
            >
              <div className="font-semibold text-[#F3D794] border-b border-white/20 pb-1 mb-1">
                {categories[hoveredIdx].name}
              </div>
              <div className="flex items-center justify-between gap-3 text-gray-200 py-0.5">
                <span>Pieces:</span>
                <strong className="font-admin-mono text-white">{categories[hoveredIdx].count} units</strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-gray-200 py-0.5">
                <span>Value:</span>
                <strong className="font-admin-mono text-[#F3D794]">{categories[hoveredIdx].revenue}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Summary Strip */}
      <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-admin-body text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C49A45]" />
          <span>Gold Categories: Necklaces, Bangles</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#651F2B]" />
          <span>Maroon Categories: Earrings, Rings</span>
        </div>
      </div>
    </div>
  );
}

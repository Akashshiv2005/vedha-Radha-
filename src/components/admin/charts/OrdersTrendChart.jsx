import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * Generates a smooth natural cubic Bézier curve SVG path string through an array of {x, y} points
 */
function getSmoothCurvePath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    // Smooth cardinal spline tension factor = 6
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export default function OrdersTrendChart() {
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | '90d'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 7-day data matching reference image exactly
  const data7d = [
    { day: '03 Sep', enquiries: 6, reservations: 3, orders: 1 },
    { day: '04 Sep', enquiries: 9, reservations: 5, orders: 2 },
    { day: '05 Sep', enquiries: 8, reservations: 5, orders: 2 },
    { day: '06 Sep', enquiries: 13, reservations: 8, orders: 4 },
    { day: '07 Sep', enquiries: 11, reservations: 7, orders: 3.5 },
    { day: '08 Sep', enquiries: 15, reservations: 11, orders: 6 },
    { day: '09 Sep', enquiries: 13, reservations: 10, orders: 6 },
  ];

  const data30d = [
    { day: 'Week 1', enquiries: 38, reservations: 24, orders: 15 },
    { day: 'Week 2', enquiries: 52, reservations: 32, orders: 21 },
    { day: 'Week 3', enquiries: 64, reservations: 38, orders: 28 },
    { day: 'Week 4', enquiries: 75, reservations: 46, orders: 34 },
  ];

  const data90d = [
    { day: 'Jul', enquiries: 140, reservations: 85, orders: 58 },
    { day: 'Aug', enquiries: 190, reservations: 115, orders: 82 },
    { day: 'Sep', enquiries: 220, reservations: 140, orders: 105 },
  ];

  const activeData = timeRange === '7d' ? data7d : (timeRange === '30d' ? data30d : data90d);
  const maxVal = timeRange === '7d' ? 20 : (timeRange === '30d' ? 80 : 250);
  const yTicks = timeRange === '7d' 
    ? [20, 15, 10, 5, 0] 
    : (timeRange === '30d' ? [80, 60, 40, 20, 0] : [250, 200, 150, 100, 50, 0]);

  // SVG Chart dimensions with balanced padding matching reference image
  const width = 640;
  const height = 230;
  const paddingLeft = 45; // generous left padding so Y ticks are clean and never clipped
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 32;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const baselineY = height - paddingBottom;

  // Calculate points for Enquiries (Gold), Reservations (Maroon), Fulfilled Orders (Green)
  const pointsEnq = activeData.map((d, i) => {
    const x = paddingLeft + (i / (activeData.length - 1)) * chartWidth;
    const y = baselineY - (d.enquiries / maxVal) * chartHeight;
    return { x, y, val: d.enquiries, label: d.day, meta: d };
  });

  const pointsRes = activeData.map((d, i) => {
    const x = paddingLeft + (i / (activeData.length - 1)) * chartWidth;
    const y = baselineY - (d.reservations / maxVal) * chartHeight;
    return { x, y, val: d.reservations, label: d.day, meta: d };
  });

  const pointsOrd = activeData.map((d, i) => {
    const x = paddingLeft + (i / (activeData.length - 1)) * chartWidth;
    const y = baselineY - (d.orders / maxVal) * chartHeight;
    return { x, y, val: d.orders, label: d.day, meta: d };
  });

  // Smooth Bézier curve line and area paths
  const pathEnqLine = getSmoothCurvePath(pointsEnq);
  const pathEnqArea = `${pathEnqLine} L ${pointsEnq[pointsEnq.length - 1].x} ${baselineY} L ${pointsEnq[0].x} ${baselineY} Z`;

  const pathResLine = getSmoothCurvePath(pointsRes);
  const pathResArea = `${pathResLine} L ${pointsRes[pointsRes.length - 1].x} ${baselineY} L ${pointsRes[0].x} ${baselineY} Z`;

  const pathOrdLine = getSmoothCurvePath(pointsOrd);
  const pathOrdArea = `${pathOrdLine} L ${pointsOrd[pointsOrd.length - 1].x} ${baselineY} L ${pointsOrd[0].x} ${baselineY} Z`;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header with Title & Range Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#C49A45]" />
              <h3 className="font-admin-heading font-semibold text-[22px] text-admin-main leading-tight">
                Orders Trend
              </h3>
            </div>
            <p className="text-[13px] text-gray-500 mt-0.5 font-admin-body">
              Enquiries, reservations and fulfilled orders over time
            </p>
          </div>

          {/* Range tabs matching reference image: Last 7 Days, Last 30 Days, Last 90 Days */}
          <div className="flex items-center bg-[#F5F6F8] p-1 rounded-xl text-[12px] font-admin-body border border-gray-200">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '7d' 
                  ? 'bg-white text-admin-main font-semibold shadow-xs border border-gray-200/80' 
                  : 'text-gray-500 hover:text-admin-main'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '30d' 
                  ? 'bg-white text-admin-main font-semibold shadow-xs border border-gray-200/80' 
                  : 'text-gray-500 hover:text-admin-main'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '90d' 
                  ? 'bg-white text-admin-main font-semibold shadow-xs border border-gray-200/80' 
                  : 'text-gray-500 hover:text-admin-main'
              }`}
            >
              Last 90 Days
            </button>
          </div>
        </div>

        {/* Legend matching reference image: Enquiries (Gold), Reservations (Maroon), Fulfilled Orders (Green) */}
        <div className="flex items-center gap-6 my-2 text-[12.5px] font-admin-body text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C49A45]" />
            <span className="font-medium text-gray-700">Enquiries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#651F2B]" />
            <span className="font-medium text-gray-700">Reservations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D7A53]" />
            <span className="font-medium text-gray-700">Fulfilled Orders</span>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="relative mt-2 w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              {/* Gradient for Enquiries (Gold) */}
              <linearGradient id="gradEnqSmooth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C49A45" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#C49A45" stopOpacity="0.01" />
              </linearGradient>

              {/* Gradient for Reservations (Maroon) */}
              <linearGradient id="gradResSmooth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#651F2B" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#651F2B" stopOpacity="0.01" />
              </linearGradient>

              {/* Gradient for Fulfilled Orders (Emerald Green) */}
              <linearGradient id="gradOrdSmooth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0D7A53" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#0D7A53" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines and Y-axis Labels (20, 15, 10, 5, 0) */}
            {yTicks.map((val, idx) => {
              const y = baselineY - (val / maxVal) * chartHeight;
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke={val === 0 ? '#E5E7EB' : '#F2F2F2'}
                    strokeWidth={val === 0 ? '1.2' : '1'}
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#9CA3AF"
                    fontSize="11"
                    className="font-admin-body"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area Fills under smooth curves */}
            <path d={pathEnqArea} fill="url(#gradEnqSmooth)" />
            <path d={pathResArea} fill="url(#gradResSmooth)" />
            <path d={pathOrdArea} fill="url(#gradOrdSmooth)" />

            {/* Smooth Line Strokes */}
            <path 
              d={pathEnqLine} 
              fill="none" 
              stroke="#C49A45" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d={pathResLine} 
              fill="none" 
              stroke="#651F2B" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d={pathOrdLine} 
              fill="none" 
              stroke="#0D7A53" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Points & Interactive Hover Columns */}
            {activeData.map((d, i) => {
              const isHovered = hoveredIndex === i;

              return (
                <g 
                  key={i} 
                  onMouseEnter={() => setHoveredIndex(i)} 
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible broad hover catch column */}
                  <rect
                    x={pointsEnq[i].x - (chartWidth / activeData.length) / 2}
                    y={paddingTop}
                    width={chartWidth / activeData.length}
                    height={chartHeight + paddingBottom}
                    fill="transparent"
                  />

                  {/* Vertical hover dashed guide bar */}
                  {isHovered && (
                    <line
                      x1={pointsEnq[i].x}
                      y1={paddingTop}
                      x2={pointsEnq[i].x}
                      y2={baselineY}
                      stroke="#9CA3AF"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* X Axis Label below baseline */}
                  <text
                    x={pointsEnq[i].x}
                    y={height - 8}
                    textAnchor="middle"
                    fill={isHovered ? '#1F1D1A' : '#6B7280'}
                    fontWeight={isHovered ? '700' : '400'}
                    fontSize="11.5"
                    className="font-admin-body transition-colors"
                  >
                    {d.day}
                  </text>

                  {/* Enquiries point (Gold) */}
                  <circle
                    cx={pointsEnq[i].x}
                    cy={pointsEnq[i].y}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#C49A45"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />

                  {/* Reservations point (Maroon) */}
                  <circle
                    cx={pointsRes[i].x}
                    cy={pointsRes[i].y}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#651F2B"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />

                  {/* Fulfilled Orders point (Green) */}
                  <circle
                    cx={pointsOrd[i].x}
                    cy={pointsOrd[i].y}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#0D7A53"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIndex !== null && (
            <div 
              className="absolute bg-[#28181B] text-white p-3 rounded-xl shadow-xl pointer-events-none border border-[#C49A45]/40 z-20 font-admin-body text-[12px] min-w-[150px]"
              style={{
                left: `${(pointsEnq[hoveredIndex].x / width) * 100}%`,
                top: '5%',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-semibold text-[#F3D794] border-b border-white/20 pb-1 mb-1.5 flex items-center justify-between">
                <span>{activeData[hoveredIndex].day}</span>
                <span className="text-[10px] text-gray-300 font-normal">Summary</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-0.5">
                <span className="flex items-center gap-1.5 text-[#F3D794]">
                  <span className="w-2 h-2 rounded-full bg-[#C49A45]" />
                  Enquiries:
                </span>
                <strong className="font-admin-mono">{activeData[hoveredIndex].enquiries}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 py-0.5">
                <span className="flex items-center gap-1.5 text-rose-200">
                  <span className="w-2 h-2 rounded-full bg-[#651F2B]" />
                  Reservations:
                </span>
                <strong className="font-admin-mono">{activeData[hoveredIndex].reservations}</strong>
              </div>
              <div className="flex items-center justify-between gap-4 py-0.5">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-[#0D7A53]" />
                  Fulfilled:
                </span>
                <strong className="font-admin-mono">{activeData[hoveredIndex].orders}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

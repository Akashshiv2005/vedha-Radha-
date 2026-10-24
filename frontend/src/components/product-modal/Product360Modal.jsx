import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Play, Pause, ZoomIn, ZoomOut, Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Product360Modal({ isOpen, onClose, product }) {
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 359 degrees
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);

  const containerRef = useRef(null);

  // Available image angles or fallbacks
  const images = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : []);

  // Determine current active view based on angle
  // 0 - 89: Front (images[0])
  // 90 - 179: Angle / Side (images[1] || images[0])
  // 180 - 269: Back (images[2] || images[0])
  // 270 - 359: Detail / Other angle (images[3] || images[1] || images[0])
  const getActiveImage = () => {
    if (images.length === 1) return images[0];
    const normalized = ((rotationAngle % 360) + 360) % 360;
    if (normalized < 90) return images[0];
    if (normalized < 180) return images[1] || images[0];
    if (normalized < 270) return images[2] || images[1] || images[0];
    return images[3] || images[0];
  };

  // Auto rotation timer
  useEffect(() => {
    let interval = null;
    if (isOpen && isAutoRotating && !isDragging) {
      interval = setInterval(() => {
        setRotationAngle((prev) => (prev + 1) % 360);
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isOpen, isAutoRotating, isDragging]);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setStartX(clientX);
    setStartAngle(rotationAngle);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    // Map pixels dragged to degree rotation
    const newAngle = Math.round(startAngle + deltaX * 0.8) % 360;
    setRotationAngle((newAngle + 360) % 360);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

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
                <RotateCcw className="w-4 h-4 text-[#F3EAD3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#241716] flex items-center gap-2">
                  360° Interactive Product View
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  Drag horizontally or swipe to examine every curve & hallmark
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6E65] hover:text-[#241716] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close 360 viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive 360 Stage */}
          <div className="p-6 flex flex-col items-center select-none">
            <div
              ref={containerRef}
              className="relative w-full aspect-square max-h-[400px] rounded-2xl bg-white overflow-hidden flex items-center justify-center border border-[#E8DFC0] shadow-sm cursor-grab active:cursor-grabbing group"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              {/* Product Visual with Perspective 3D Tilt */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75 p-8"
                style={{
                  transform: `scale(${zoomLevel}) perspective(1000px) rotateY(${Math.sin((rotationAngle * Math.PI) / 180) * 15}deg)`,
                }}
              >
                <img
                  src={getActiveImage()}
                  alt={`${product?.name} at ${rotationAngle} degrees`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(36,23,22,0.18)] pointer-events-none"
                />
              </div>

              {/* Angle Readout Badge */}
              <div className="absolute top-3 left-3 bg-[#241716]/80 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Compass className="w-3.5 h-3.5 text-[#E5C278]" />
                <span>{rotationAngle}° / 360°</span>
              </div>

              {/* Drag Prompt Tooltip */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="bg-[#FAF7F2]/90 backdrop-blur-xs text-[#581923] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#DECDBB] shadow-xs flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Drag left or right to rotate</span>
                </div>
              </div>
            </div>

            {/* Quick Angle Presets */}
            <div className="w-full mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-[#7A6E65] mr-2">Preset Angles:</span>
              {[
                { label: 'Front (0°)', angle: 0 },
                { label: 'Side (90°)', angle: 90 },
                { label: 'Back (180°)', angle: 180 },
                { label: 'Detail (270°)', angle: 270 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setRotationAngle(preset.angle);
                    setIsAutoRotating(false);
                  }}
                  className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    Math.abs(rotationAngle - preset.angle) < 25
                      ? 'bg-[#581923] text-white border-[#581923] font-semibold'
                      : 'bg-white text-[#5C5047] border-[#E8DFC0] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Controls Bar */}
            <div className="w-full mt-3 flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#E8DFC0]">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  isAutoRotating
                    ? 'bg-[#581923] text-white hover:bg-[#431219]'
                    : 'bg-[#FAF7F2] text-[#241716] border border-[#E8DFC0] hover:bg-[#EAE0D0]'
                }`}
              >
                {isAutoRotating ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Auto-Rotate</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Auto-Rotate</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-[#5C5047]">
                <span className="font-semibold text-[#241716]">Zoom:</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#241716] border border-[#E8DFC0] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono w-10 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#241716] border border-[#E8DFC0] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="text-[11px] text-[#7A6E65] underline hover:text-[#581923] ml-1 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

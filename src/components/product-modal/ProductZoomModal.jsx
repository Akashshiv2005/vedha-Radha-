import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductZoomModal({ isOpen, onClose, images, activeIndex, onSelectIndex, productName }) {
  const [zoom, setZoom] = useState(1.5);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    onSelectIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
    setPan({ x: 0, y: 0 });
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onSelectIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
    setPan({ x: 0, y: 0 });
  };

  const handleReset = () => {
    setZoom(1.5);
    setPan({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-70 flex items-center justify-center bg-black/90 backdrop-blur-md select-none overflow-hidden"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div 
          className="absolute top-4 inset-x-6 flex items-center justify-between z-20 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-[#F3EAD3] hidden sm:inline">
              {productName}
            </span>
            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-white/80 font-mono">
              View {activeIndex + 1} of {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.3))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono w-12 text-center text-white/90">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3.5, z + 0.3))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-[#581923] text-white transition-colors cursor-pointer ml-3"
              title="Close Fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage with Pan & Zoom */}
        <div 
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-6"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <motion.img
            key={currentImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: zoom }}
            transition={{ duration: 0.2 }}
            src={currentImage}
            alt={productName}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="max-h-[82vh] max-w-[85vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none select-none"
          />
        </div>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all cursor-pointer"
              aria-label="Previous view"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all cursor-pointer"
              aria-label="Next view"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div 
            className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((imgSrc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectIndex(idx);
                  setPan({ x: 0, y: 0 });
                }}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 bg-white transition-all cursor-pointer ${
                  activeIndex === idx
                    ? 'border-[#E5C278] scale-110 shadow-lg ring-2 ring-[#E5C278]/40'
                    : 'border-white/40 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgSrc} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

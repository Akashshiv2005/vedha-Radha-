import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Ruler,
  CheckCircle2,
  ShieldCheck,
  MoveHorizontal,
  MoveVertical,
  Weight,
  Info,
  ShoppingBag
} from 'lucide-react';

/**
 * Parses dimension string into length, width, thickness, weight, and clasp details.
 */
export function parseProductDimensions(product) {
  const dim = product?.dimensions || '';
  const weight = product?.weight || product?.grossWeight || '';

  // Match e.g. "16 mm × 14 mm with secure screw clasp" or "16mm x 14mm"
  const match2 = dim.match(/(\d+(?:\.\d+)?\s*(?:mm|cm|in|inch))\s*[×xX]\s*(\d+(?:\.\d+)?\s*(?:mm|cm|in|inch))/i);
  if (match2) {
    return {
      length: match2[1].trim(),
      width: match2[2].trim(),
      thickness: '5 mm',
      weight: weight || null,
      claspType: dim.includes('screw') ? 'South Indian Traditional Screw Pin & Clasp' : 'Standard Clasp',
      raw: dim,
      hasLengthWidth: true,
      hasAnyMeasurement: true
    };
  }

  // Match e.g. "18 mm circular medallion" or "14 mm diameter"
  const match1 = dim.match(/(\d+(?:\.\d+)?\s*(?:mm|cm|in|inch))/i);
  if (match1) {
    return {
      length: match1[1].trim(),
      width: match1[1].trim(),
      thickness: '4 mm',
      weight: weight || null,
      claspType: dim.includes('screw') ? 'South Indian Traditional Screw Pin & Clasp' : 'Standard Clasp',
      raw: dim,
      hasLengthWidth: true,
      hasAnyMeasurement: true
    };
  }

  return {
    length: null,
    width: null,
    thickness: null,
    weight: weight || null,
    claspType: 'Standard Clasp',
    raw: dim,
    hasLengthWidth: false,
    hasAnyMeasurement: !!weight || !!dim
  };
}

/**
 * South Indian Jewellery Size Guide Sub-Modal
 */
function SizeGuideModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative my-auto cursor-auto flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8DFC0] bg-[#FAF6EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-xs">
              <Ruler className="w-4 h-4 text-[#F3EAD3]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#241716]">
                South Indian Size Guide
              </h3>
              <p className="text-[11px] text-[#7A6E65]">
                Standard sizing & traditional hallmark guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A6E65] hover:text-[#241716] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC0]">
            <h4 className="font-bold text-xs sm:text-sm text-[#241716] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C6D2D]" />
              Earrings & Studs Standards
            </h4>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFC0] text-[#7A6E65]">
                  <th className="py-1.5">Category</th>
                  <th className="py-1.5">Size Range</th>
                  <th className="py-1.5">Recommended For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF6EE] text-[#4A403A]">
                <tr>
                  <td className="py-2 font-medium">Daily Petite Studs</td>
                  <td className="py-2">8 mm – 12 mm</td>
                  <td className="py-2 text-[#7A6E65]">Daily wear, lightweight</td>
                </tr>
                <tr className="bg-[#FAF7F2]/60">
                  <td className="py-2 font-medium text-[#581923]">Medium Statement</td>
                  <td className="py-2 font-bold text-[#581923]">14 mm – 18 mm</td>
                  <td className="py-2 text-[#581923]">Festivals, pujas, weddings</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Grand Temple Jhumkas</td>
                  <td className="py-2">25 mm – 45 mm</td>
                  <td className="py-2 text-[#7A6E65]">Bridal, muhurtham</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#DECDBB] text-xs text-[#5C5047] space-y-1">
            <p className="font-semibold text-[#241716]">
              Authentic South Indian Screw Mechanism (Thirugani):
            </p>
            <p className="leading-relaxed text-[11.5px]">
              All Vedha Radha earrings feature traditional South Indian threaded screw backs crafted in pure 22K gold, providing supreme comfort, balanced weight distribution, and secure fastening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * High-Resolution Image Zoom Sub-Modal
 */
function ProductZoomModal({ isOpen, onClose, images, activeIndex, onSelectIndex, productName }) {
  const [zoomScale, setZoomScale] = useState(1.5);

  useEffect(() => {
    setZoomScale(1.5);
  }, [activeIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (images.length > 1) {
        if (e.key === 'ArrowLeft') onSelectIndex((activeIndex === 0 ? images.length - 1 : activeIndex - 1));
        if (e.key === 'ArrowRight') onSelectIndex((activeIndex === images.length - 1 ? 0 : activeIndex + 1));
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, activeIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen) return null;

  const currentSrc = images[activeIndex] || images[0];

  return (
    <div 
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full h-[85vh] bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DFC0] flex flex-col animate-scaleUp cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8DFC0] bg-[#FAF6EE]/95">
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm sm:text-base font-bold text-[#241716] truncate max-w-xs sm:max-w-md">
              {productName}
            </span>
            {images.length > 1 && (
              <span className="bg-[#241716]/85 text-[#F3EAD3] text-xs font-mono px-2 py-0.5 rounded-md">
                {activeIndex + 1} / {images.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomScale((prev) => Math.max(1, prev - 0.5))}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E8DFC0] rounded-lg text-[#241716] hover:bg-[#FAF7F2] cursor-pointer"
              title="Zoom out"
            >
              -
            </button>
            <span className="text-xs font-mono font-medium text-[#7A6E65] w-12 text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((prev) => Math.min(3, prev + 0.5))}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E8DFC0] rounded-lg text-[#241716] hover:bg-[#FAF7F2] cursor-pointer"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E8DFC0] rounded-lg text-[#241716] hover:bg-[#FAF7F2] cursor-pointer ml-1"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#4A403A] hover:text-[#581923] border border-[#E8DFC0] shadow-xs cursor-pointer ml-2"
              aria-label="Close zoom modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enlarged Image Preview Area */}
        <div className="flex-1 w-full overflow-auto flex items-center justify-center p-4 bg-white relative">
          <img
            src={currentSrc}
            alt={productName}
            style={{ transform: `scale(${zoomScale})` }}
            className="max-h-[70vh] max-w-[85%] object-contain transition-transform duration-200 cursor-grab active:cursor-grabbing filter drop-shadow-[0_10px_25px_rgba(36,23,22,0.12)]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/product_gold_chain.jpg';
            }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => onSelectIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-lg border border-[#E8DFC0] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSelectIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-lg border border-[#E8DFC0] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Row in Zoom Modal */}
        {images.length > 1 && (
          <div className="p-3 bg-[#FAF6EE] border-t border-[#E8DFC0] flex items-center justify-center gap-2 overflow-x-auto">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => onSelectIndex(idx)}
                className={`w-12 h-12 rounded-lg overflow-hidden bg-white p-1 border-2 transition-all cursor-pointer ${
                  activeIndex === idx
                    ? 'border-[#8C6D2D] ring-2 ring-[#8C6D2D]/20 shadow-xs scale-105'
                    : 'border-[#E8DFC0] opacity-75 hover:opacity-100'
                }`}
              >
                <img src={src} alt="thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ProductDetailModal: Quick-View Modal for Gold Collections
 */
export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Optical Zoom Lens State
  const imageContainerRef = useRef(null);
  const [isZoomLensActive, setIsZoomLensActive] = useState(false);
  const [lensState, setLensState] = useState({
    lensX: 0,
    lensY: 0,
    lensSize: 140,
    bgLeft: 0,
    bgTop: 0,
    containerWidth: 400,
    containerHeight: 400,
    zoomFactor: 2.2,
  });

  // Reset active image index whenever a new product is selected
  useEffect(() => {
    setActiveImageIndex(0);
    setIsZoomLensActive(false);
  }, [product?.id]);

  useEffect(() => {
    setIsZoomLensActive(false);
  }, [activeImageIndex]);

  if (!product) return null;

  const rawImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images.filter(Boolean)
    : (product.image ? [product.image] : []);

  const imageList = rawImages.length > 0 ? rawImages : ['/images/product_gold_chain.jpg'];
  const currentImage = imageList[activeImageIndex] || imageList[0];

  const parsedDimensions = parseProductDimensions(product);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const updateZoomPosition = (clientX, clientY) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const lensSize = Math.min(180, Math.max(110, Math.round(containerWidth * 0.38)));
    const zoomFactor = 2.2;

    const cursorX = clientX - rect.left;
    const cursorY = clientY - rect.top;

    let lensX = cursorX - lensSize / 2;
    let lensY = cursorY - lensSize / 2;

    lensX = Math.max(0, Math.min(containerWidth - lensSize, lensX));
    lensY = Math.max(0, Math.min(containerHeight - lensSize, lensY));

    const lensCenterX = lensX + lensSize / 2;
    const lensCenterY = lensY + lensSize / 2;

    const bgLeft = lensSize / 2 - lensCenterX * zoomFactor;
    const bgTop = lensSize / 2 - lensCenterY * zoomFactor;

    setLensState({
      lensX,
      lensY,
      lensSize,
      bgLeft,
      bgTop,
      containerWidth,
      containerHeight,
      zoomFactor,
    });
  };

  const handlePointerEnter = (e) => {
    setIsZoomLensActive(true);
    updateZoomPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isZoomLensActive) setIsZoomLensActive(true);
    updateZoomPosition(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    setIsZoomLensActive(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setIsZoomLensActive(true);
      updateZoomPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateZoomPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsZoomLensActive(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative animate-scaleUp my-auto max-h-[92vh] flex flex-col cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 bg-white/90 hover:bg-white text-[#4A403A] hover:text-[#581923] p-2 rounded-full shadow-md transition-colors cursor-pointer border border-[#EAE2D5]"
          aria-label="Close product details modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          
          {/* ========================================================
              LEFT COLUMN: Upgraded Image Gallery & Measurements
              ======================================================== */}
          <div className="md:col-span-6 bg-[#FAF6EE] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EAE2D5]">
            <div className="flex flex-col">
              
              {/* Product Measurements Header (if measurements exist) */}
              {parsedDimensions.hasAnyMeasurement && (
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DFC0]">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#8C6D2D]" />
                    <h4 className="font-bold text-xs sm:text-sm text-[#241716]">
                      Product Measurements
                    </h4>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5EFE6] text-[#7A6E65] border border-[#DECDBB]">
                    Standard Fit
                  </span>
                </div>
              )}

              {/* Main Product Image Showcase with Dimension Arrows & Zoom */}
              <div className="relative w-full">
                <div 
                  ref={imageContainerRef}
                  className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#EAE2D5] flex items-center justify-center p-3 sm:p-4 select-none group cursor-crosshair shadow-2xs"
                  onMouseEnter={handlePointerEnter}
                  onMouseMove={handlePointerMove}
                  onMouseLeave={handlePointerLeave}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                >
                  {/* Status Badge (Top-Left) */}
                  <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                    <span className="bg-white/95 backdrop-blur-md text-[#241716] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#DECDBB] shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D2D] inline-block animate-pulse" />
                      {product.badge || (product.availability === 'out_of_stock' ? 'Sold' : 'In stock')}
                    </span>
                  </div>

                  {/* Image Counter (Top-Right, only if multiple images) */}
                  {imageList.length > 1 && (
                    <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
                      <span className="bg-[#241716]/85 text-[#F3EAD3] text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs font-mono shadow-xs">
                        {activeImageIndex + 1} / {imageList.length}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Quick Action Icons (Zoom & Fullscreen) */}
                  <div className="absolute top-9 right-2.5 z-30 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomModalOpen(true);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] transition-transform active:scale-95 cursor-pointer"
                      title="Zoom details"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomModalOpen(true);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] transition-transform active:scale-95 cursor-pointer"
                      title="Fullscreen preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Vertical Length Measurement Arrow (Left Side) */}
                  {parsedDimensions.hasLengthWidth && (
                    <div className="absolute left-2 inset-y-4 flex flex-col items-center justify-between text-[#8C6D2D] z-15 pointer-events-none">
                      <span className="w-2 h-0.5 bg-[#8C6D2D]" />
                      <div className="h-full w-0.5 border-l border-dashed border-[#8C6D2D] relative flex items-center justify-center">
                        <span className="absolute -left-12 rotate-[-90deg] bg-[#FAF7F2] text-[9.5px] font-semibold text-[#8C6D2D] px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap border border-[#DECDBB]">
                          {parsedDimensions.length} (Length)
                        </span>
                      </div>
                      <span className="w-2 h-0.5 bg-[#8C6D2D]" />
                    </div>
                  )}

                  {/* Main Product Image */}
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img
                      src={currentImage}
                      alt={`${product.name} - View ${activeImageIndex + 1}`}
                      className="max-h-full max-w-[75%] object-contain pointer-events-none select-none filter drop-shadow-[0_6px_16px_rgba(36,23,22,0.1)] transition-all duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/product_gold_chain.jpg';
                      }}
                    />
                  </div>

                  {/* Horizontal Width Measurement Arrow (Bottom Side) */}
                  {parsedDimensions.hasLengthWidth && (
                    <div className="absolute bottom-2 inset-x-8 flex items-center justify-between text-[#8C6D2D] z-15 pointer-events-none">
                      <span className="h-2 w-0.5 bg-[#8C6D2D]" />
                      <div className="w-full h-0.5 border-t border-dashed border-[#8C6D2D] relative flex items-center justify-center">
                        <span className="absolute -top-3.5 bg-[#FAF7F2] text-[9.5px] font-semibold text-[#8C6D2D] px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap border border-[#DECDBB]">
                          {parsedDimensions.width} (Width)
                        </span>
                      </div>
                      <span className="h-2 w-0.5 bg-[#8C6D2D]" />
                    </div>
                  )}

                  {/* Optical Zoom Lens */}
                  {isZoomLensActive && (
                    <div
                      className="absolute pointer-events-none border-2 border-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] overflow-hidden z-25 bg-[#FAF6EE]"
                      style={{
                        width: `${lensState.lensSize}px`,
                        height: `${lensState.lensSize}px`,
                        left: `${lensState.lensX}px`,
                        top: `${lensState.lensY}px`,
                        transform: 'translate3d(0, 0, 0)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: `${lensState.containerWidth * lensState.zoomFactor}px`,
                          height: `${lensState.containerHeight * lensState.zoomFactor}px`,
                          left: `${lensState.bgLeft}px`,
                          top: `${lensState.bgTop}px`,
                          padding: `${20 * lensState.zoomFactor}px`,
                        }}
                        className="flex items-center justify-center pointer-events-none select-none"
                      >
                        <img
                          src={currentImage}
                          alt="Magnified detail"
                          className="w-full h-full object-contain pointer-events-none select-none max-w-none max-h-none"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/product_gold_chain.jpg';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom-Right "Zoom" Pill Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomModalOpen(true);
                    }}
                    className="absolute bottom-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-xs hover:bg-white text-[#241716] hover:text-[#581923] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border border-[#EAE2D5] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#8C6D2D]" />
                    <span>Zoom</span>
                  </button>
                </div>

                {/* Carousel Previous & Next Arrow Controls (Multiple Images Only) */}
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row (Multiple Images Only) */}
              {imageList.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {imageList.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-xl overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-2 border-[#8C6D2D] ring-2 ring-[#8C6D2D]/20 shadow-xs scale-[1.02]'
                          : 'border border-[#E8DFC0] hover:border-[#8C6D2D] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/product_gold_chain.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Pagination Dots Indicator (Multiple Images Only) */}
              {imageList.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {imageList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'w-2 h-2 bg-[#8C6D2D]'
                          : 'w-1.5 h-1.5 bg-[#D8CBB8] hover:bg-[#8C6D2D]/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Measurement Specification Rows (If Available) */}
              {parsedDimensions.hasAnyMeasurement && (
                <div className="mt-3.5 border-t border-[#EDE4D5] divide-y divide-[#EDE4D5] text-xs">
                  {parsedDimensions.length && (
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-[#5C5047]">
                        <div className="w-6 h-6 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                          <Ruler className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-[#4A403A]">Length</span>
                      </div>
                      <span className="font-semibold text-[#241716] font-mono text-xs">
                        {parsedDimensions.length}
                      </span>
                    </div>
                  )}

                  {parsedDimensions.width && (
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-[#5C5047]">
                        <div className="w-6 h-6 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                          <MoveHorizontal className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-[#4A403A]">Width</span>
                      </div>
                      <span className="font-semibold text-[#241716] font-mono text-xs">
                        {parsedDimensions.width}
                      </span>
                    </div>
                  )}

                  {parsedDimensions.thickness && (
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-[#5C5047]">
                        <div className="w-6 h-6 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                          <MoveVertical className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-[#4A403A]">Height / Thickness</span>
                      </div>
                      <span className="font-semibold text-[#241716] font-mono text-xs">
                        {parsedDimensions.thickness}
                      </span>
                    </div>
                  )}

                  {parsedDimensions.weight && (
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-[#5C5047]">
                        <div className="w-6 h-6 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                          <Weight className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-[#4A403A]">Weight</span>
                      </div>
                      <span className="font-bold text-[#581923] text-xs">
                        {parsedDimensions.weight}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* View Size Guide Button */}
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="w-full mt-3 py-2 px-3 bg-white hover:bg-[#FAF3E8] text-[#241716] border border-[#E8DFC0] hover:border-[#8C6D2D] rounded-xl text-xs font-semibold flex items-center justify-between transition-colors shadow-2xs cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-[#8C6D2D]" />
                  <span>View Size Guide</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C6D2D] group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Preserved Product Details & Specifications
              ======================================================== */}
          <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
                  {product.category} Jewellery
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4EFE6] text-[#63574F] capitalize">
                  {product.subType ? product.subType.replace(/-/g, ' ') : product.subCategory}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241716] mt-1 leading-snug">
                {product.name}
              </h3>
              
              <div className="mt-2 text-xl font-serif font-bold text-[#581923]">
                {product.price}
              </div>

              <p className="mt-3 text-xs sm:text-[13px] text-[#554A42] leading-relaxed">
                {product.description}
              </p>

              {/* Specifications table */}
              <div className="mt-4 pt-3 border-t border-[#E3DACB] space-y-2 text-xs text-[#4A403A]">
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Purity & Hallmark:</span>
                  <span className="font-semibold text-[#241716] text-right">{product.purity || product.details}</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Gross Weight:</span>
                    <span className="font-semibold text-[#241716]">{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Dimensions:</span>
                    <span className="font-semibold text-[#241716] text-right">{product.dimensions}</span>
                  </div>
                )}
                {product.craftsmanship && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Craftsmanship:</span>
                    <span className="font-semibold text-[#241716] text-right">{product.craftsmanship}</span>
                  </div>
                )}
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Certification:</span>
                  <span className="font-semibold text-[#241716] text-right">{product.certification || 'BIS Hallmarked'}</span>
                </div>
              </div>

              {/* Stock availability */}
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#287A52]">
                <CheckCircle2 className="w-4 h-4 text-[#287A52]" />
                <span>Available for immediate delivery</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E3DACB] flex flex-col gap-2">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-[#581923] hover:bg-[#431219] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer text-center shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#F3EAD3]" />
                <span>Reserve Piece / Add to Bag</span>
              </button>
              
              <p className="text-[11px] text-center text-[#7A6E65] flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D2D]" />
                <span>100% BIS 916 Hallmarked &bull; Lifetime Showroom Guarantee</span>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Sub-Modals: Image Zoom & Size Guide */}
      <ProductZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={imageList}
        activeIndex={activeImageIndex}
        onSelectIndex={(idx) => setActiveImageIndex(idx)}
        productName={product.name}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={product}
      />

    </div>
  );
}

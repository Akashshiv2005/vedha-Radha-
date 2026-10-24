import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ArrowLeft,
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Maximize2, 
  Sparkles, 
  RotateCcw, 
  Ruler, 
  CheckCircle2, 
  Video, 
  MessageCircle, 
  Heart, 
  Share2, 
  ShoppingBag, 
  ShieldCheck, 
  Award, 
  Truck, 
  BadgeCheck, 
  Check,
  Star,
  Info,
  MoveHorizontal,
  MoveVertical,
  Weight,
  Mic,
  Square,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';

import VirtualTryOnModal from './product-modal/VirtualTryOnModal';
import Product360Modal from './product-modal/Product360Modal';
import ProductMeasurementsModal, { parseProductDimensions } from './product-modal/ProductMeasurementsModal';
import VideoConsultationModal from './product-modal/VideoConsultationModal';
import ProductZoomModal from './product-modal/ProductZoomModal';
import { formatCurrency } from '../utils/currency';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onAddToWishlist, 
  isWishlisted: externalIsWishlisted,
  onSelectRelatedProduct,
  onBackToProducts
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [is360Open, setIs360Open] = useState(false);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const [measurementsTab, setMeasurementsTab] = useState('measurements');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Image container ref and square zoom lens state
  const imageContainerRef = useRef(null);
  const [isZoomLensActive, setIsZoomLensActive] = useState(false);
  const [lensState, setLensState] = useState({
    lensX: 0,
    lensY: 0,
    lensSize: 180,
    bgLeft: 0,
    bgTop: 0,
    containerWidth: 500,
    containerHeight: 500,
    zoomFactor: 2.4,
  });

  // Internal state for wishlist & share feedback
  const [internalWishlisted, setInternalWishlisted] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // 5-Second Voice Recording State
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'recorded'
  const [recordCountdown, setRecordCountdown] = useState(5);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Price Breakup collapsible state
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Reset product-specific image state without moving the page behind the modal
  useEffect(() => {
    setActiveImageIndex(0);
    setIsZoomLensActive(false);
  }, [product?.id]);

  useEffect(() => {
    setIsZoomLensActive(false);
  }, [activeImageIndex]);

  useEffect(() => {
    if (externalIsWishlisted !== undefined) {
      setInternalWishlisted(externalIsWishlisted);
    }
  }, [externalIsWishlisted]);

  // Support browser Back button to close the full page view smoothly
  useEffect(() => {
    if (product) {
      const prevPath = window.location.pathname + window.location.search;
      const targetPath = `/product/${product.id}`;
      
      // Update browser URL without full reload if not already on the product URL
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ isProductView: true, productId: product.id }, '', targetPath);
      }

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (window.location.pathname.startsWith('/product/')) {
          window.history.replaceState(null, '', prevPath);
        }
      };
    }
  }, [product?.id]);

  if (!product) return null;

  // Prepare up to 3 thumbnails from product.images
  const rawImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images.filter(img => typeof img === 'string' && img.trim().length > 0).slice(0, 3)
    : (product.image ? [product.image] : ['/images/neutral_product_placeholder.svg']);

  const defaultLabels = ['Front / Cover', 'Side / Angle', 'Detail / Hallmark'];
  const thumbnailViews = rawImages.map((src, idx) => ({
    label: defaultLabels[idx] || `View ${idx + 1}`,
    src: src
  }));

  const currentImage = thumbnailViews[activeImageIndex]?.src || thumbnailViews[0]?.src || product.image;

  // Measurement details
  const parsedDimensions = parseProductDimensions(product);

  // Product Code
  const productCode = product.productCode || product.code || product.sku || (
    product.id 
      ? `VRJ-${product.id.toUpperCase()}`
      : 'VRJ-GLD-002'
  );

  // Price formatting
  let numPrice = product.numericPrice;
  if (!numPrice && product.price) {
    const cleaned = String(product.price).replace(/[^0-9]/g, '');
    numPrice = cleaned ? parseInt(cleaned, 10) : 28200;
  }
  if (!numPrice) numPrice = 28200;
  const originalPriceFormatted = formatCurrency(Math.round((numPrice * 1.117) / 100) * 100);
  const displayPrice = (typeof product.price === 'string' && product.price.trim().startsWith('₹') && !product.price.includes('Γ'))
    ? product.price.trim()
    : formatCurrency(numPrice);

  // Calculate Dynamic Price Breakup matching the reference table
  const priceBreakupData = (() => {
    const grandTotalFinal = numPrice;
    
    // Parse numeric weight
    const rawWeightStr = product.weight || parsedDimensions?.weight || '1.889 g';
    const parsedWeight = parseFloat(String(rawWeightStr).replace(/[^0-9.]/g, '')) || 1.889;
    const formattedWeight = parsedWeight.toFixed(3);

    // GST is 3%
    const totalFinal = Math.round(grandTotalFinal / 1.03);
    const gstFinal = grandTotalFinal - totalFinal;

    // Gold value: ~86.45% of pre-tax value
    const goldValue = Math.round(totalFinal * 0.86454);
    const rate = Math.round(goldValue / parsedWeight);

    // Making charges
    const makingFinal = totalFinal - goldValue;
    const makingDiscount = Math.round(makingFinal * 0.25);
    const makingValue = makingFinal + makingDiscount;

    // Totals
    const totalValue = goldValue + makingValue;
    const gstValue = Math.round(totalValue * 0.03);
    const grandTotalValue = totalValue + gstValue;

    // Gold Purity Label (e.g. 91.6 Gold)
    const purityLabel = product.purity?.includes('22') || product.purity?.includes('916') 
      ? '91.6 Gold' 
      : (product.category === 'silver' ? '92.5 Silver' : '91.6 Gold');

    return {
      purityLabel,
      rate,
      weight: formattedWeight,
      goldValue,
      makingValue,
      makingDiscount,
      makingFinal,
      totalValue,
      totalFinal,
      gstValue,
      gstFinal,
      grandTotalValue,
      grandTotalFinal,
    };
  })();

  // Find related pieces from same category or collection
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
    .slice(0, 4);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? thumbnailViews.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === thumbnailViews.length - 1 ? 0 : prev + 1));
  };

  const updateZoomPosition = (clientX, clientY) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Responsive square lens size (~40% of container width, bounded between 130px and 220px)
    const lensSize = Math.min(220, Math.max(130, Math.round(containerWidth * 0.4)));
    const zoomFactor = 2.4;

    // Mouse or touch position relative to the image container
    const cursorX = clientX - rect.left;
    const cursorY = clientY - rect.top;

    // Center lens on cursor and clamp strictly within container boundaries
    let lensX = cursorX - lensSize / 2;
    let lensY = cursorY - lensSize / 2;

    lensX = Math.max(0, Math.min(containerWidth - lensSize, lensX));
    lensY = Math.max(0, Math.min(containerHeight - lensSize, lensY));

    // Optical center of the lens
    const lensCenterX = lensX + lensSize / 2;
    const lensCenterY = lensY + lensSize / 2;

    // Align magnified image so lens center reflects the exact point beneath it
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

  const handleToggleWishlist = () => {
    setInternalWishlisted(!internalWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleShareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} - 22K Hallmarked Gold Jewellery at Veda Radha Thangamaaligai`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Vanakkam Veda Radha Jewellery, I am interested in exploring "${product.name}" (${displayPrice}). Could you please share more details or live showroom availability?`
    );
    window.open(`https://wa.me/917010894104?text=${text}`, '_blank');
  };

  // 5-Second Voice Recording Handlers
  const startVoiceRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordCountdown(5);
      setRecordingState('recording');
      setIsPlayingAudio(false);

      let stream = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          recorder.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              setAudioUrl(url);
            }
            setRecordingState('recorded');
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
          };

          recorder.start();
        } catch (micErr) {
          console.warn('Microphone access unavailable or denied, simulating 5-second voice recording', micErr);
        }
      }

      // 5-second countdown timer
      let timeLeft = 5;
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        setRecordCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(recordingTimerRef.current);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
              mediaRecorderRef.current.stop();
            } catch (err) {}
          } else {
            setRecordingState('recorded');
          }
        }
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setRecordingState('idle');
    }
  };

  const stopVoiceRecordingEarly = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {}
    } else {
      setRecordingState('recorded');
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioPlayerRef.current) {
      setIsPlayingAudio((prev) => !prev);
      return;
    }

    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          setIsPlayingAudio(true);
          setTimeout(() => {
            setIsPlayingAudio(false);
          }, 5000);
        });
    }
  };

  const resetVoiceRecording = (e) => {
    if (e) e.stopPropagation();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {}
    }
    setRecordingState('idle');
    setRecordCountdown(5);
    setAudioUrl(null);
    setIsPlayingAudio(false);
  };

  const handleSelectRelated = (item) => {
    if (onSelectRelatedProduct) {
      onSelectRelatedProduct(item);
    } else {
      // Re-trigger view for this product
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveImageIndex(0);
      product.id = item.id;
      product.name = item.name;
      product.price = item.price;
      product.image = item.image;
      product.images = item.images;
      product.description = item.description;
      product.weight = item.weight;
      product.purity = item.purity;
      product.dimensions = item.dimensions;
      product.craftsmanship = item.craftsmanship;
      product.certification = item.certification;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] overflow-y-auto min-h-screen w-full flex flex-col selection:bg-[#581923] selection:text-white">
      
      {/* ========================================================
          STICKY TOP NAVIGATION HEADER
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC0] px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={onBackToProducts || onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#581923] hover:text-[#431219] bg-white border border-[#E8DFC0] hover:border-[#8C6D2D] px-3.5 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Products</span>
          </button>

          {/* Breadcrumb Path */}
          <nav className="hidden md:flex items-center gap-2 text-xs text-[#7A6E65]">
            <Link to="/" className="hover:text-[#581923] cursor-pointer">Home</Link>
            <span>/</span>
            <Link
              to={`/${product.category?.toLowerCase().includes('silver') ? 'silver' : 'gold'}`}
              className="capitalize hover:text-[#581923] cursor-pointer"
            >
              {product.category} Jewellery
            </Link>
            <span>/</span>
            <Link
              to={`/${product.category?.toLowerCase().includes('silver') ? 'silver' : 'gold'}/${product.subCategorySlug || product.subCategory || ''}`}
              className="capitalize hover:text-[#581923] cursor-pointer"
            >
              {(product.subCategory || product.subType || 'Catalog').replace(/[-_]/g, ' ')}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#241716] truncate max-w-xs">{product.name}</span>
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              internalWishlisted
                ? 'bg-[#581923]/10 border-[#581923] text-[#581923]'
                : 'bg-white border-[#E8DFC0] text-[#4A403A] hover:bg-[#FAF7F2]'
            }`}
            title="Save for Later"
          >
            <Heart className={`w-4 h-4 ${internalWishlisted ? 'fill-[#581923] text-[#581923]' : 'text-[#7A6E65]'}`} />
          </button>

          <button
            onClick={handleShareProduct}
            className="p-2 rounded-full bg-white border border-[#E8DFC0] text-[#4A403A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            title="Share Product"
          >
            {shareFeedback ? <Check className="w-4 h-4 text-[#287A52]" /> : <Share2 className="w-4 h-4 text-[#7A6E65]" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-[#FAF7F2] text-[#4A403A] hover:text-[#581923] border border-[#E8DFC0] shadow-2xs transition-all cursor-pointer ml-1"
            aria-label="Close full page"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ========================================================
          FULL PAGE BODY CONTAINER
          ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Main 2-Column Product Showcase */}
        <div className="bg-white rounded-3xl border border-[#E8DFC0] shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ========================================================
                LEFT COLUMN: Interconnected Product Showcase & Measurements
                ======================================================== */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Unified Product Showcase & Measurements Card */}
              <div className="bg-[#FAF7F2] border border-[#E8DFC0] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col">
                
                {/* 1. Header: Product Measurements Title & Standard Fit Badge */}
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#E8DFC0]">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#8C6D2D]" />
                    <h3 className="font-bold text-sm sm:text-base text-[#241716]">
                      Product Measurements
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-[#F5EFE6] text-[#7A6E65] border border-[#DECDBB]">
                    Standard Fit
                  </span>
                </div>

                {/* 2. Main Product Image Showcase with Overlay Dimension Arrows */}
                <div className="relative w-full">
                  <div 
                    ref={imageContainerRef}
                    className="relative aspect-square sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white border border-[#EAE2D5] flex items-center justify-center p-4 sm:p-6 select-none group cursor-crosshair shadow-2xs"
                    onMouseEnter={handlePointerEnter}
                    onMouseMove={handlePointerMove}
                    onMouseLeave={handlePointerLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                  >
                    {/* Badge (Top-Left) */}
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                      <span className="bg-white/95 backdrop-blur-md text-[#241716] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#DECDBB] shadow-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D2D] inline-block animate-pulse"></span>
                        {product.badge || 'Auspicious'}
                      </span>
                    </div>

                    {/* Image Counter (Top-Right) */}
                    <div className="absolute top-3 right-3 z-20 pointer-events-none">
                      <span className="bg-[#241716]/85 text-[#F3EAD3] text-[11px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs font-mono shadow-xs">
                        {activeImageIndex + 1} / {thumbnailViews.length}
                      </span>
                    </div>

                    {/* Top-Right Quick Action Icons (Zoom & Fullscreen) */}
                    <div className="absolute top-10 right-3 z-30 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
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
                    <div className="absolute left-2.5 sm:left-3.5 inset-y-5 flex flex-col items-center justify-between text-[#8C6D2D] z-15 pointer-events-none">
                      <span className="w-2 h-0.5 bg-[#8C6D2D]" />
                      <div className="h-full w-0.5 border-l border-dashed border-[#8C6D2D] relative flex items-center justify-center">
                        <span className="absolute -left-12 rotate-[-90deg] bg-[#FAF7F2] text-[10px] sm:text-[11px] font-semibold text-[#8C6D2D] px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap border border-[#DECDBB]">
                          {parsedDimensions.length} (Length)
                        </span>
                      </div>
                      <span className="w-2 h-0.5 bg-[#8C6D2D]" />
                    </div>

                    {/* Main Product Image */}
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <img
                        src={currentImage}
                        alt={`${product.name} - ${thumbnailViews[activeImageIndex]?.label} view`}
                        className="max-h-full max-w-[70%] object-contain pointer-events-none select-none filter drop-shadow-[0_8px_20px_rgba(36,23,22,0.1)]"
                      />
                    </div>

                    {/* Horizontal Width Measurement Arrow (Bottom Side) */}
                    <div className="absolute bottom-2.5 sm:bottom-3 inset-x-8 sm:inset-x-12 flex items-center justify-between text-[#8C6D2D] z-15 pointer-events-none">
                      <span className="h-2 w-0.5 bg-[#8C6D2D]" />
                      <div className="w-full h-0.5 border-t border-dashed border-[#8C6D2D] relative flex items-center justify-center">
                        <span className="absolute -top-3.5 bg-[#FAF7F2] text-[10px] sm:text-[11px] font-semibold text-[#8C6D2D] px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap border border-[#DECDBB]">
                          {parsedDimensions.width} (Width)
                        </span>
                      </div>
                      <span className="h-2 w-0.5 bg-[#8C6D2D]" />
                    </div>

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
                            padding: `${24 * lensState.zoomFactor}px`,
                          }}
                          className="flex items-center justify-center pointer-events-none select-none"
                        >
                          <img
                            src={currentImage}
                            alt="Magnified detail"
                            className="w-full h-full object-contain pointer-events-none select-none max-w-none max-h-none"
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

                  {/* Carousel Previous & Next Arrow Controls (Only when > 1 image) */}
                  {thumbnailViews.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(e);
                        }}
                        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(e);
                        }}
                        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* 3. Thumbnails Row (Up to 3 Perspectives) */}
                <div className={`grid gap-2.5 sm:gap-3 mt-3.5 ${
                  thumbnailViews.length === 1 ? 'grid-cols-1 max-w-[100px]' :
                  thumbnailViews.length === 2 ? 'grid-cols-2 max-w-[210px]' :
                  'grid-cols-3 max-w-[320px]'
                }`}>
                  {thumbnailViews.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-xl overflow-hidden bg-white p-1.5 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-2 border-[#8C6D2D] ring-2 ring-[#8C6D2D]/20 shadow-xs scale-[1.02]'
                          : 'border border-[#E8DFC0] hover:border-[#8C6D2D] opacity-80 hover:opacity-100'
                      }`}
                      title={`${product.name} - ${item.label}`}
                    >
                      <img
                        src={item.src}
                        alt={`${product.name} ${item.label}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/neutral_product_placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* 4. Pagination Dots Indicator (Only when > 1 image) */}
                {thumbnailViews.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-1">
                    {thumbnailViews.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`rounded-full transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'w-2 h-2 bg-[#8C6D2D]'
                            : 'w-2 h-2 bg-[#D8CBB8] hover:bg-[#8C6D2D]/60'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* 5. Measurement Spec Rows with Circular Icon Badges */}
                <div className="mt-3.5 border-t border-[#EDE4D5] divide-y divide-[#EDE4D5] text-xs sm:text-sm">
                  {/* Length */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-[#5C5047]">
                      <div className="w-7 h-7 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                        <Ruler className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-[#4A403A]">Length</span>
                    </div>
                    <span className="font-semibold text-[#241716] font-mono text-xs sm:text-sm">
                      {parsedDimensions.length}
                    </span>
                  </div>

                  {/* Width */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-[#5C5047]">
                      <div className="w-7 h-7 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                        <MoveHorizontal className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-[#4A403A]">Width</span>
                    </div>
                    <span className="font-semibold text-[#241716] font-mono text-xs sm:text-sm">
                      {parsedDimensions.width}
                    </span>
                  </div>

                  {/* Height / Thickness */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-[#5C5047]">
                      <div className="w-7 h-7 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                        <MoveVertical className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-[#4A403A]">Height / Thickness</span>
                    </div>
                    <span className="font-semibold text-[#241716] font-mono text-xs sm:text-sm">
                      {parsedDimensions.thickness}
                    </span>
                  </div>

                  {/* Weight */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-[#5C5047]">
                      <div className="w-7 h-7 rounded-full bg-[#FAF3E8] border border-[#E8DFC0] flex items-center justify-center text-[#8C6D2D] shrink-0">
                        <Weight className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-[#4A403A]">Weight</span>
                    </div>
                    <span className="font-bold text-[#581923] text-xs sm:text-sm">
                      {parsedDimensions.weight}
                    </span>
                  </div>
                </div>

                {/* 6. View Size Guide Button */}
                <button
                  onClick={() => {
                    setMeasurementsTab('sizeguide');
                    setIsMeasurementsOpen(true);
                  }}
                  className="w-full mt-4 py-2.5 px-4 bg-white hover:bg-[#FAF3E8] text-[#241716] border border-[#E8DFC0] hover:border-[#8C6D2D] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors shadow-2xs cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#8C6D2D]" />
                    <span>View Size Guide</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C6D2D] group-hover:translate-x-0.5 transition-transform" />
                </button>

              </div>

              {/* Interactive Tool Cards Row (Try It On & 360° View) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Try It On */}
                <button
                  onClick={() => setIsTryOnOpen(true)}
                  className="p-3 bg-[#FAF7F2] hover:bg-[#FAF3E8] border border-[#E8DFC0] hover:border-[#8C6D2D] rounded-2xl flex items-center justify-between text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white border border-[#DECDBB] text-[#8C6D2D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4 text-[#8C6D2D]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#241716] truncate">
                          Try It On
                        </span>
                        <span className="bg-[#581923] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          New
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#7A6E65] truncate">
                        See how it looks on you
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C6D2D] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                </button>

                {/* Card 2: 360° View */}
                <button
                  onClick={() => setIs360Open(true)}
                  className="p-3 bg-[#FAF7F2] hover:bg-[#FAF3E8] border border-[#E8DFC0] hover:border-[#8C6D2D] rounded-2xl flex items-center justify-between text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white border border-[#DECDBB] text-[#8C6D2D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <RotateCcw className="w-4 h-4 text-[#8C6D2D]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-[#241716] block truncate">
                        360° View
                      </span>
                      <p className="text-[10px] sm:text-[11px] text-[#7A6E65] truncate">
                        Explore from every angle
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C6D2D] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                </button>
              </div>

            </div>

            {/* ========================================================
                RIGHT COLUMN: Product Info, Specs, Measurements & Actions
                ======================================================== */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* Top Section: Product Details & Specs */}
              <div className="flex flex-col">
                {/* 1. Product Code at the top */}
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
                    Product Code:
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#241716] bg-[#FAF5EB] px-2.5 py-0.5 rounded border border-[#E8DFC0] shadow-2xs">
                    {productCode}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3EAD8] text-[#63574F] capitalize border border-[#E8DFC0]">
                    {product.collection === 'wedding' ? 'Traditional Collection' : (product.collection ? `${product.collection} Collection` : `${product.category || 'Gold'} Jewellery`)}
                  </span>
                </div>

                {/* 2. Product Name below Product Code */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241716] leading-snug">
                  {product.name}
                </h1>

                {/* 3. Price & Discount below Product Name */}
                <div className="flex items-baseline gap-3 mt-2.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#581923]">
                    {displayPrice}
                  </span>
                  <span className="text-sm sm:text-base line-through text-[#8C7E75]">
                    {originalPriceFormatted}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#287A52] bg-[#EAF5EE] px-2.5 py-0.5 rounded-md">
                    (10% OFF)
                  </span>
                </div>

                {/* Two-Column Specifications Table */}
                <div className="mt-5 pt-3.5 border-t border-[#E8DFC0] space-y-2 text-xs text-[#4A403A]">
                  <div className="flex justify-between py-1 border-b border-[#FAF0DE]">
                    <span className="text-[#7A6E65]">Purity & Hallmark</span>
                    <span className="font-semibold text-[#241716] text-right">
                      {product.purity || product.details || '916 BIS Hallmarked 22 Karat Gold'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#FAF0DE]">
                    <span className="text-[#7A6E65]">Gross Weight</span>
                    <span className="font-semibold text-[#241716]">
                      {product.weight || parsedDimensions.weight}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#FAF0DE]">
                    <span className="text-[#7A6E65]">Dimensions</span>
                    <span className="font-semibold text-[#241716] text-right">
                      {product.dimensions || `${parsedDimensions.length} ├ù ${parsedDimensions.width} with secure screw clasp`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#FAF0DE]">
                    <span className="text-[#7A6E65]">Craftsmanship</span>
                    <span className="font-semibold text-[#241716] text-right">
                      {product.craftsmanship || 'Chettinad Peacock Repouss├⌐ Art'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#7A6E65]">Certification</span>
                    <span className="font-semibold text-[#241716] text-right">
                      {product.certification || 'BIS Hallmark & Certified Laser Inscription'}
                    </span>
                  </div>
                </div>

                {/* Stock & Delivery Status */}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#287A52]">
                  <CheckCircle2 className="w-4 h-4 text-[#287A52]" />
                  <span>Available for immediate delivery</span>
                </div>
              </div>

              {/* Virtual Shopping Experience Section */}
              <div className="pt-4 border-t border-[#E8DFC0]">
                <div className="mb-3.5">
                  <h3 className="text-base sm:text-lg font-bold text-[#241716]">
                    Experience Jewellery Shopping
                  </h3>
                </div>

                {/* Two Experience Cards Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: Live Video Consultation */}
                  <div className="bg-[#FAF1ED] border border-[#F2D7D0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs hover:shadow-xs transition-shadow">
                    <div>
                      <div className="w-9 h-9 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-xs mb-2.5">
                        <Video className="w-4 h-4 text-[#F3EAD3]" />
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#241716]">
                        Live Video Consultation
                      </h4>
                      <p className="text-xs text-[#6B5A4E] mt-1 mb-3.5 leading-relaxed">
                        Connect with our jewellery experts for a personalized shopping experience.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="bg-[#581923] hover:bg-[#431219] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit group"
                    >
                      <span>Book Video Call</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Card 2: WhatsApp Assistance */}
                  <div className="bg-[#EBF5EE] border border-[#D5EADB] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs hover:shadow-xs transition-shadow">
                    <div>
                      <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs mb-2.5">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#241716]">
                        WhatsApp Assistance
                      </h4>
                      <p className="text-xs text-[#6B5A4E] mt-1 mb-3.5 leading-relaxed">
                        Chat with our jewellery experts about the selected product.
                      </p>
                    </div>
                    <button
                      onClick={handleWhatsAppChat}
                      className="bg-[#287A52] hover:bg-[#1E5C3D] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit group"
                    >
                      <span>Chat on WhatsApp</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </div>
              </div>

              {/* 5-Second Voice Recording Component (Matches Reference Design) */}
              <div className="pt-3 pb-1">
                <div className="relative flex items-center justify-between py-2 sm:py-2.5 px-3.5 sm:px-6 rounded-full bg-gradient-to-r from-[#FFF5F3] via-[#FDF0ED] to-[#FFF6F4] border border-[#F5D7D1] shadow-xs overflow-hidden">
                  
                  {/* Left: Audio Waveform Animation Bars */}
                  <div className="flex items-center gap-[3px] shrink-0 pr-1 sm:pr-2">
                    {[10, 16, 24, 18, 30, 22, 14, 20, 26, 16, 12, 18, 22, 14, 8].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          height: `${h}px`,
                          animationDelay: `${(i % 5) * 0.12}s`,
                        }}
                        className={`w-[2.5px] sm:w-[3px] rounded-full transition-all duration-200 ${
                          recordingState === 'recording' || isPlayingAudio
                            ? 'bg-[#581923] animate-audio-wave'
                            : 'bg-[#F0C2B8]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Center-Left: Microphone / Play Action Button with Soft Halo */}
                  <div className="relative flex items-center justify-center shrink-0">
                    {recordingState === 'recording' && (
                      <span className="absolute inset-0 rounded-full bg-[#581923]/25 animate-ping" />
                    )}
                    
                    {recordingState === 'idle' && (
                      <div className="p-1 rounded-full bg-[#581923]/10 ring-4 ring-[#581923]/5">
                        <button
                          onClick={startVoiceRecording}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-md hover:bg-[#431219] transition-transform active:scale-95 cursor-pointer"
                          title="Tap to Record Voice"
                          aria-label="Tap to Record Voice"
                        >
                          <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                      </div>
                    )}

                    {recordingState === 'recording' && (
                      <div className="p-1 rounded-full bg-[#581923]/20 ring-4 ring-[#581923]/10">
                        <button
                          onClick={stopVoiceRecordingEarly}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-md hover:bg-[#431219] transition-transform active:scale-95 cursor-pointer animate-pulse"
                          title="Recording... Tap to stop"
                          aria-label="Recording... Tap to stop"
                        >
                          <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                        </button>
                      </div>
                    )}

                    {recordingState === 'recorded' && (
                      <div className="p-1 rounded-full bg-[#581923]/10 ring-4 ring-[#581923]/5">
                        <button
                          onClick={toggleAudioPlayback}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#581923] text-white flex items-center justify-center shadow-md hover:bg-[#431219] transition-transform active:scale-95 cursor-pointer"
                          title={isPlayingAudio ? 'Pause Voice Note' : 'Listen to Voice Note'}
                          aria-label={isPlayingAudio ? 'Pause Voice Note' : 'Listen to Voice Note'}
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-4 h-4 text-white fill-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Middle Text: Title & Subtitle / Countdown Info */}
                  <div className="flex-1 min-w-0 px-2 sm:px-3">
                    {recordingState === 'idle' && (
                      <>
                        <span className="font-bold text-xs sm:text-[13px] text-[#241716] leading-tight block truncate">
                          Tap to Record Voice
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#7A6E65] leading-tight block truncate mt-0.5">
                          Speak in 5 seconds
                        </span>
                      </>
                    )}

                    {recordingState === 'recording' && (
                      <>
                        <span className="font-bold text-xs sm:text-[13px] text-[#581923] leading-tight flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-[#581923] animate-ping" />
                          <span>Recording Voice...</span>
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#7A6E65] leading-tight block truncate mt-0.5">
                          Auto-stops in {recordCountdown}s
                        </span>
                      </>
                    )}

                    {recordingState === 'recorded' && (
                      <>
                        <span className="font-bold text-xs sm:text-[13px] text-[#241716] leading-tight flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-[#287A52]" />
                          <span>Voice Note Recorded</span>
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] sm:text-[11px] text-[#581923] font-medium">
                            {isPlayingAudio ? 'Playing back...' : 'Tap to listen'}
                          </span>
                          <button
                            onClick={resetVoiceRecording}
                            className="text-[10px] text-[#7A6E65] hover:text-[#581923] underline cursor-pointer"
                          >
                            Re-record
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right: Stopwatch Icon & 5s Timer Display */}
                  <div className="flex items-center gap-1.5 shrink-0 text-[#581923]">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#581923] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="13" r="8" />
                      <path d="M12 9v4l2.5 2" />
                      <path d="M10 2h4" />
                      <path d="M12 2v3" />
                    </svg>
                    <span className="font-bold text-xs sm:text-sm font-mono tracking-tight">
                      {recordingState === 'recording' ? `${recordCountdown}s` : '5s'}
                    </span>
                  </div>

                  {/* Hidden Audio Player for Actual Playback */}
                  {audioUrl && (
                    <audio
                      ref={audioPlayerRef}
                      src={audioUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden"
                    />
                  )}

                </div>
              </div>

              {/* Purchase Actions Bar */}
              <div className="pt-2">
                {/* Primary CTA: Reserve Piece / Add to Bag */}
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full bg-[#581923] hover:bg-[#431219] text-white py-3.5 sm:py-4 px-6 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#F3EAD3]" />
                  <span>Reserve Piece / Add to Bag</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================
            PRICE BREAKUP SECTION (Reference Design)
            ======================================================== */}
        <div className="mt-8 bg-white rounded-3xl border border-[#E8DFC0] p-6 sm:p-8 shadow-xs">
          <div className="flex items-baseline gap-3 mb-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#581923]">
              Price Breakup
            </h3>
            <button
              type="button"
              onClick={() => setIsPriceBreakupOpen((prev) => !prev)}
              className="text-xs sm:text-sm font-semibold text-[#581923] hover:text-[#3d1118] underline cursor-pointer transition-colors"
            >
              {isPriceBreakupOpen ? 'View Less' : 'View Details'}
            </button>
          </div>

          {isPriceBreakupOpen && (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[580px] text-xs sm:text-sm text-[#241716] border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFC0] text-[#581923] font-semibold text-xs sm:text-sm">
                    <th className="py-2.5 px-3 text-left font-semibold w-[28%]">Component</th>
                    <th className="py-2.5 px-3 text-left font-semibold w-[14%]">Rate</th>
                    <th className="py-2.5 px-3 text-left font-semibold w-[14%]">Weight</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-[14%]">Value</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-[14%]">Discount</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-[16%]">Final Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Category Subhead: Gold */}
                  <tr>
                    <td colSpan={6} className="pt-3.5 pb-1 px-3 font-bold text-[#241716] text-xs sm:text-sm">
                      Gold
                    </td>
                  </tr>

                  {/* 91.6 Gold Row */}
                  <tr className="text-[#4A3B32]">
                    <td className="py-2 px-3 text-[#554B45]">{priceBreakupData.purityLabel}</td>
                    <td className="py-2 px-3">{priceBreakupData.rate}</td>
                    <td className="py-2 px-3">{priceBreakupData.weight}</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(priceBreakupData.goldValue)}</td>
                    <td className="py-2 px-3 text-right text-[#7A6E65]">-</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(priceBreakupData.goldValue)}</td>
                  </tr>

                  {/* Making Charges Row */}
                  <tr className="text-[#4A3B32]">
                    <td className="py-2 px-3 font-semibold text-[#241716]">Making Charges</td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(priceBreakupData.makingValue)}</td>
                    <td className="py-2 px-3 text-right text-[#581923] font-medium">{formatCurrency(priceBreakupData.makingDiscount)}</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(priceBreakupData.makingFinal)}</td>
                  </tr>

                  {/* Divider & Total Row */}
                  <tr className="border-t border-[#E8DFC0]/80 font-bold text-[#241716]">
                    <td className="py-2.5 px-3">Total</td>
                    <td className="py-2.5 px-3"></td>
                    <td className="py-2.5 px-3"></td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(priceBreakupData.totalValue)}</td>
                    <td className="py-2.5 px-3 text-right text-[#581923]">{formatCurrency(priceBreakupData.makingDiscount)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(priceBreakupData.totalFinal)}</td>
                  </tr>

                  {/* GST(3%) Row */}
                  <tr className="font-semibold text-[#241716]">
                    <td className="py-2 px-3">GST(3%)</td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3 text-right">{formatCurrency(priceBreakupData.gstValue)}</td>
                    <td className="py-2 px-3 text-right"></td>
                    <td className="py-2 px-3 text-right">{formatCurrency(priceBreakupData.gstFinal)}</td>
                  </tr>

                  {/* Divider & Grand Total Row */}
                  <tr className="border-t border-[#E8DFC0] font-bold text-[#241716]">
                    <td className="py-3 px-3 text-sm sm:text-base">Grand Total</td>
                    <td className="py-3 px-3"></td>
                    <td className="py-3 px-3"></td>
                    <td className="py-3 px-3 text-right text-sm sm:text-base">{formatCurrency(priceBreakupData.grandTotalValue)}</td>
                    <td className="py-3 px-3 text-right"></td>
                    <td className="py-3 px-3 text-right text-sm sm:text-base text-[#581923]">{formatCurrency(priceBreakupData.grandTotalFinal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================================
            TRUST & BENEFITS CARD SECTION (4 Pillars)
            ======================================================== */}
        <div className="mt-8 p-3 sm:p-4 bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EA] to-[#FFFDF9] border border-[#E8DFC0] rounded-2xl shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 md:divide-x md:divide-[#E2D2B8] items-center">
            
            {/* 1. 100% BIS 916 Hallmarked */}
            <div className="flex items-center gap-3 md:px-4 lg:px-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(180,140,75,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 text-[#8C6D2D]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3.5 L7 7.5 V15.5 C7 21.5 10.8 26.5 16 28.5 C21.2 26.5 25 21.5 25 15.5 V7.5 Z" />
                  <path d="M11.5 12.5 L14.5 15.5 L20.5 9.5" strokeWidth="2" />
                  <text x="16" y="22.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif" letterSpacing="0.5">BIS</text>
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#241716] text-xs sm:text-sm leading-tight block truncate">
                  100% BIS 916
                </span>
                <span className="text-[#581923] font-semibold text-[11px] sm:text-xs leading-tight block truncate">
                  Hallmarked
                </span>
              </div>
            </div>

            {/* 2. Lifetime Guarantee */}
            <div className="flex items-center gap-3 md:px-4 lg:px-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(180,140,75,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 text-[#8C6D2D]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20 L8.5 28 L13 25.5 L17.5 28 L15 20" fill="currentColor" fillOpacity="0.15" />
                  <path d="M21 20 L23.5 28 L19 25.5 L14.5 28 L17 20" fill="currentColor" fillOpacity="0.15" />
                  <circle cx="16" cy="13" r="8.5" fill="#FAF4E8" strokeWidth="1.8" />
                  <circle cx="16" cy="13" r="6" strokeDasharray="2 2" strokeWidth="1.2" />
                  <path d="M13 13 L15 15 L19 11" strokeWidth="2" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#241716] text-xs sm:text-sm leading-tight block truncate">
                  Lifetime
                </span>
                <span className="text-[#581923] font-semibold text-[11px] sm:text-xs leading-tight block truncate">
                  Guarantee
                </span>
              </div>
            </div>

            {/* 3. Authentic & Certified */}
            <div className="flex items-center gap-3 md:px-4 lg:px-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(180,140,75,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 text-[#8C6D2D]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 5.5 C8 4.7 8.7 4 9.5 4 H18.5 L24 9.5 V24.5 C24 25.3 23.3 26 22.5 26 H9.5 C8.7 26 8 25.3 8 24.5 Z" fill="#FAF4E8" />
                  <path d="M18 4 V10 H24" />
                  <line x1="11" y1="11" x2="15" y2="11" strokeWidth="1.6" />
                  <line x1="11" y1="15" x2="16" y2="15" strokeWidth="1.6" />
                  <line x1="11" y1="19" x2="14" y2="19" strokeWidth="1.6" />
                  <circle cx="21" cy="22" r="4.5" fill="#FFFFFF" strokeWidth="1.6" />
                  <path d="M19.5 22 L20.5 23 L22.5 21" strokeWidth="1.8" />
                  <path d="M19 26 L18 29 L20 28" strokeWidth="1.4" />
                  <path d="M23 26 L24 29 L22 28" strokeWidth="1.4" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#241716] text-xs sm:text-sm leading-tight block truncate">
                  Authentic &
                </span>
                <span className="text-[#581923] font-semibold text-[11px] sm:text-xs leading-tight block truncate">
                  Certified
                </span>
              </div>
            </div>

            {/* 4. Free Insured Shipping */}
            <div className="flex items-center gap-3 md:px-4 lg:px-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(180,140,75,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 text-[#8C6D2D]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="6" y2="12" strokeWidth="1.5" />
                  <line x1="2" y1="16" x2="5" y2="16" strokeWidth="1.5" />
                  <line x1="4" y1="20" x2="7" y2="20" strokeWidth="1.5" />
                  <path d="M7 10 H19 V22 H7 Z" fill="#FAF4E8" />
                  <path d="M19 13 H24 L27 17 V22 H19 Z" fill="#FAF4E8" />
                  <circle cx="11" cy="23" r="2.5" fill="#FFFFFF" strokeWidth="1.8" />
                  <circle cx="23" cy="23" r="2.5" fill="#FFFFFF" strokeWidth="1.8" />
                  <path d="M13 12.5 L10.5 14 V17 C10.5 19 12 20.2 13 20.8 C14 20.2 15.5 19 15.5 17 V14 Z" fill="#FFFFFF" strokeWidth="1.3" />
                  <path d="M11.8 16.5 L12.8 17.5 L14.5 15.5" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#241716] text-xs sm:text-sm leading-tight block truncate">
                  Free Insured
                </span>
                <span className="text-[#581923] font-semibold text-[11px] sm:text-xs leading-tight block truncate">
                  Shipping
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            SIMILAR DESIGNS SECTION
            ======================================================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#241716]">
                  Similar Designs
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="text-xs font-semibold text-[#581923] hover:underline cursor-pointer"
              >
                View Full Collection &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRelated(item)}
                  className="bg-white rounded-2xl border border-[#E8DFC0] hover:border-[#8C6D2D] p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative aspect-square rounded-xl bg-[#FAF6EE] overflow-hidden p-2 mb-2 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.badge && (
                      <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#581923] border border-[#DECDBB]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8C6D2D] font-bold uppercase tracking-wider">
                      {item.category}
                    </p>
                    <h5 className="font-bold text-xs sm:text-sm text-[#241716] line-clamp-1 group-hover:text-[#581923] transition-colors">
                      {item.name}
                    </h5>
                    <p className="text-xs font-bold text-[#581923] mt-1">
                      {formatCurrency(item.numericPrice || item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          SUB-MODALS (Try-On, 360°, Measurements, Video Call, Zoom)
          ======================================================== */}
      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        product={product}
      />

      <Product360Modal
        isOpen={is360Open}
        onClose={() => setIs360Open(false)}
        product={product}
      />

      <ProductMeasurementsModal
        isOpen={isMeasurementsOpen}
        onClose={() => setIsMeasurementsOpen(false)}
        product={product}
        initialTab={measurementsTab}
      />

      <VideoConsultationModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        product={product}
      />

      <ProductZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={thumbnailViews.map((t) => t.src)}
        activeIndex={activeImageIndex}
        onSelectIndex={(idx) => setActiveImageIndex(idx)}
        productName={product.name}
      />

    </div>
  );
}

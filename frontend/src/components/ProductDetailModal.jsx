import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ArrowLeft,
  ChevronLeft, 
  ChevronRight, 
  ChevronUp,
  ChevronDown,
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
  Pause,
  Minus,
  Plus,
  Scale,
  Package,
  Calendar,
  Headphones,
  Tag,
  Shield,
  Gem
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { diamondProducts } from '../data/diamondProducts';
import { templeProducts } from '../data/templeProducts';
import { poojaProducts } from '../data/poojaProducts';
import { newArrivalsHighlightProducts } from '../data/newArrivalsHighlightProducts';

import VirtualTryOnModal from './product-modal/VirtualTryOnModal';
import Product360Modal from './product-modal/Product360Modal';
import ProductMeasurementsModal, { parseProductDimensions } from './product-modal/ProductMeasurementsModal';
import VideoConsultationModal from './product-modal/VideoConsultationModal';
import ProductZoomModal from './product-modal/ProductZoomModal';
import { formatCurrency } from '../utils/currency';
import { getProductUrl, getProductIdentifier } from '../utils/productSlug';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onAddToWishlist, 
  isWishlisted: externalIsWishlisted,
  onSelectRelatedProduct,
  onBackToProducts,
  isDedicatedPage = false
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

  // Quantity stepper & added toast state
  const [quantity, setQuantity] = useState(1);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

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

  // Support browser Back button to close the modal overlay smoothly when opened from a catalog page
  useEffect(() => {
    if (isDedicatedPage) {
      // Real React Router dedicated page (/product/:productId) handles its own navigation natively
      return;
    }

    if (product) {
      const prevPath = window.location.pathname + window.location.search;
      const targetPath = getProductUrl(product);
      
      // Update browser URL without full reload if not already on the product URL
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ isProductView: true, productId: getProductIdentifier(product) }, '', targetPath);
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
  }, [product?.id, isDedicatedPage]);

  if (!product) return null;

  // Prepare 4 luxury gallery perspectives matching reference design
  const rawImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images.filter(img => typeof img === 'string' && img.trim().length > 0)
    : (product.image ? [product.image] : ['/images/product_gold_chain.jpg']);

  const defaultPerspectiveLabels = [
    'Front / Overview',
    'Center Medallion Detail',
    'Artisan Border & Rubies',
    'Hallmark & Clasp View',
    'Side Filigree & Angle'
  ];

  const thumbnailViews = Array.from({ length: 5 }).map((_, idx) => {
    const src = rawImages[idx] || rawImages[0] || product.image || '/images/product_gold_chain.jpg';
    return {
      id: idx,
      label: defaultPerspectiveLabels[idx] || `View ${idx + 1}`,
      src: src,
      isMacro: !rawImages[idx] && idx === 1,
      isBorder: !rawImages[idx] && idx === 2,
      isClasp: !rawImages[idx] && idx === 3,
    };
  });

  const currentImage = thumbnailViews[activeImageIndex]?.src || thumbnailViews[0]?.src || product.image;
  const isDarkShowcase = true; // Royal burgundy velvet presentation across signature showcase

  // Heritage collection tagline
  const collectionTagline = (() => {
    const coll = String(product.collection || '').trim();
    const cat = String(product.category || '').trim();
    const sub = String(product.subCategory || product.subType || '').trim();
    const all = `${coll} ${cat} ${sub}`.toLowerCase();
    
    if (all.includes('wedding') || all.includes('bridal') || product.isBridal) {
      return 'WEDDING COLLECTION';
    }
    if (all.includes('temple')) {
      return 'TEMPLE HERITAGE COLLECTION';
    }
    if (all.includes('antique') || all.includes('nakshi')) {
      return 'ANTIQUE NAKSHI COLLECTION';
    }
    if (all.includes('silver')) {
      return 'TEMPLE SILVER HERITAGE';
    }
    if (all.includes('coin') || all.includes('bar')) {
      return '24K BULLION & COINS';
    }
    if (all.includes('diamond')) {
      return 'ROYAL DIAMOND ATELIER';
    }
    if (sub && !sub.toLowerCase().includes('collection')) {
      return `${sub.toUpperCase()} COLLECTION`;
    }
    if (coll && coll.toLowerCase() !== 'collections') {
      return coll.toLowerCase().endsWith('collection') ? coll.toUpperCase() : `${coll.toUpperCase()} COLLECTION`;
    }
    if (cat && cat.toLowerCase() !== 'collections') {
      return `${cat.toUpperCase()} COLLECTION`;
    }
    return 'ROYAL HERITAGE COLLECTION';
  })();

  // Diamond detection
  const isDiamondItem = Boolean(
    product.isDiamond ||
    product.category?.toLowerCase() === 'diamond' ||
    product.category?.toLowerCase() === 'diamonds' ||
    product.department?.toLowerCase() === 'diamond' ||
    product.department?.toLowerCase() === 'diamonds' ||
    product.collection?.toLowerCase() === 'diamonds' ||
    (typeof product.sku === 'string' && product.sku.toLowerCase().includes('dia')) ||
    (typeof product.id === 'string' && (product.id.toLowerCase().startsWith('dia-') || product.id.toLowerCase().includes('diamond')))
  );

  // Silver detection
  const isSilverItem = Boolean(
    product.isSilver ||
    product.category?.toLowerCase().includes('silver') ||
    product.department?.toLowerCase().includes('silver') ||
    product.collection?.toLowerCase().includes('silver') ||
    product.subCategory?.toLowerCase().includes('silver') ||
    product.name?.toLowerCase().includes('silver') ||
    (typeof product.sku === 'string' && product.sku.toLowerCase().includes('slv')) ||
    (typeof product.id === 'string' && (product.id.toLowerCase().includes('slv') || product.id.toLowerCase().includes('silver') || product.id.toLowerCase().startsWith('pooja-')))
  );

  // Cool platinum / sterling silver theme for Diamond and Silver items; Rich gold theme for Gold, Temple & Bridal items
  const isSilverOrDiamond = isDiamondItem || isSilverItem;

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
  const displayPrice = (typeof product.price === 'string' && product.price.trim().startsWith('₹'))
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

    // Metal / Stone value: ~86.45% of pre-tax value
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

    // Metal / Diamond Purity Label
    const purityLabel = isDiamondItem
      ? (product.purity || '18K White Gold / Platinum & Natural Diamonds')
      : isSilverItem
        ? '92.5 Sterling Silver'
        : (product.purity?.includes('22') || product.purity?.includes('916') 
            ? '91.6 Gold' 
            : (product.category === 'silver' ? '92.5 Silver' : '91.6 Gold'));

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
  const allCatalogProducts = [
    ...(diamondProducts || []),
    ...(templeProducts || []),
    ...(poojaProducts || []),
    ...(newArrivalsHighlightProducts || []),
    ...products
  ];
  const relatedProducts = allCatalogProducts
    .filter(p => p.id !== product.id && (
      (isDiamondItem && (p.category?.toLowerCase() === 'diamond' || p.category?.toLowerCase() === 'diamonds' || p.isDiamond)) ||
      (isSilverItem && (p.category?.toLowerCase() === 'silver' || p.isSilver)) ||
      p.category === product.category ||
      p.subCategory === product.subCategory
    ))
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

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        quantity: quantity || 1
      });
    }
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
    if (!isDedicatedPage && onClose) {
      onClose();
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
    <div className="fixed inset-0 z-50 bg-[#FAF6EF] overflow-y-auto min-h-screen w-full flex flex-col selection:bg-[#4A1019] selection:text-white relative">
      
      {/* Subtle ornamental temple heritage background watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.14] select-none">
        {/* Right Architectural Carved Temple Pillar Motif */}
        <div className={`absolute right-0 top-0 bottom-0 w-36 sm:w-56 bg-gradient-to-l ${
          isSilverOrDiamond ? 'from-[#94A3B8]/25' : 'from-[#C99A38]/30'
        } to-transparent flex flex-col justify-between items-end pr-1 sm:pr-3`}>
          <svg className={`w-full h-full ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#8C6D2D]'}`} viewBox="0 0 140 700" fill="currentColor">
            <path d="M70,10 C90,10 110,25 110,45 L110,75 L30,75 L30,45 C30,25 50,10 70,10 Z" fill={isSilverOrDiamond ? '#94A3B8' : '#B38728'} opacity="0.8" />
            <rect x="25" y="75" width="90" height="20" rx="3" fill={isSilverOrDiamond ? '#CBD5E1' : '#D4AF37'} />
            <polygon points="15,95 125,95 105,125 35,125" fill={isSilverOrDiamond ? '#64748B' : '#8C6D2D'} />
            <rect x="40" y="125" width="60" height="480" fill={isSilverOrDiamond ? '#94A3B8' : '#B38728'} opacity="0.6" />
            <line x1="55" y1="125" x2="55" y2="605" stroke="#FFF" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="85" y1="125" x2="85" y2="605" stroke="#FFF" strokeWidth="2" strokeDasharray="6 6" />
            <polygon points="35,605 105,605 125,635 15,635" fill={isSilverOrDiamond ? '#64748B' : '#8C6D2D'} />
            <rect x="20" y="635" width="100" height="25" rx="3" fill={isSilverOrDiamond ? '#CBD5E1' : '#D4AF37'} />
          </svg>
        </div>

        {/* Left Architectural Carved Temple Pillar Motif */}
        <div className={`absolute left-0 top-0 bottom-0 w-36 sm:w-56 bg-gradient-to-r ${
          isSilverOrDiamond ? 'from-[#94A3B8]/25' : 'from-[#C99A38]/30'
        } to-transparent flex flex-col justify-between items-start pl-1 sm:pl-3`}>
          <svg className={`w-full h-full ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#8C6D2D]'}`} viewBox="0 0 140 700" fill="currentColor">
            <path d="M70,10 C90,10 110,25 110,45 L110,75 L30,75 L30,45 C30,25 50,10 70,10 Z" fill={isSilverOrDiamond ? '#94A3B8' : '#B38728'} opacity="0.8" />
            <rect x="25" y="75" width="90" height="20" rx="3" fill={isSilverOrDiamond ? '#CBD5E1' : '#D4AF37'} />
            <polygon points="15,95 125,95 105,125 35,125" fill={isSilverOrDiamond ? '#64748B' : '#8C6D2D'} />
            <rect x="40" y="125" width="60" height="480" fill={isSilverOrDiamond ? '#94A3B8' : '#B38728'} opacity="0.6" />
            <line x1="55" y1="125" x2="55" y2="605" stroke="#FFF" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="85" y1="125" x2="85" y2="605" stroke="#FFF" strokeWidth="2" strokeDasharray="6 6" />
            <polygon points="35,605 105,605 125,635 15,635" fill={isSilverOrDiamond ? '#64748B' : '#8C6D2D'} />
            <rect x="20" y="635" width="100" height="25" rx="3" fill={isSilverOrDiamond ? '#CBD5E1' : '#D4AF37'} />
          </svg>
        </div>

        {/* Bottom Corner Subtle Watermarks */}
        <svg className={`absolute -left-6 bottom-0 w-44 h-44 ${isSilverOrDiamond ? 'text-[#94A3B8]' : 'text-[#C99A38]'}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M50,20 C45,35 35,45 20,50 C35,55 45,65 50,80 C55,65 65,55 80,50 C65,45 55,35 50,20 Z" />
          <path d="M50,30 C47,40 40,47 30,50 C40,53 47,60 50,70 C53,60 60,53 70,50 C60,47 53,40 50,30 Z" />
        </svg>
        <svg className={`absolute -right-6 bottom-0 w-44 h-44 ${isSilverOrDiamond ? 'text-[#94A3B8]' : 'text-[#C99A38]'}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M50,20 C45,35 35,45 20,50 C35,55 45,65 50,80 C55,65 65,55 80,50 C65,45 55,35 50,20 Z" />
          <path d="M50,30 C47,40 40,47 30,50 C40,53 47,60 50,70 C53,60 60,53 70,50 C60,47 53,40 50,30 Z" />
        </svg>
      </div>

      {/* ========================================================
          STICKY TOP NAVIGATION HEADER
          ======================================================== */}
      <header className={`sticky top-0 z-40 bg-[#31050D]/95 backdrop-blur-md border-b ${
        isSilverOrDiamond ? 'border-[#94A3B8]/40' : 'border-[#C99A38]/40'
      } px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between shadow-2xs`}>
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={onBackToProducts || onClose}
            className={`flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-white bg-[#4A1019] hover:bg-[#5C1521] border ${
              isSilverOrDiamond ? 'border-[#94A3B8]/80 hover:border-[#E2E8F0]' : 'border-[#C99A38]/80 hover:border-[#E8C77D]'
            } px-4 py-2 rounded-full shadow-2xs transition-all cursor-pointer group`}
          >
            <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-0.5 transition-transform ${isSilverOrDiamond ? 'text-[#CBD5E1]' : 'text-[#E8C77D]'}`} />
            <span>Back to Products</span>
          </button>

          {/* Breadcrumb Path */}
          <nav className="hidden md:flex items-center gap-2.5 text-xs sm:text-[13px] text-[#E8DFC0]">
            <Link to="/" className="hover:text-white cursor-pointer transition-colors">Home</Link>
            <span className={isSilverOrDiamond ? 'text-[#94A3B8]/60' : 'text-[#C99A38]/60'}>/</span>
            {(() => {
              const catLower = (product.category || '').toLowerCase();
              let mainPath = '/gold';
              let mainLabel = `${product.category || 'Gold'} Jewellery`;
              if (catLower.includes('diamond') || product.isDiamond) {
                mainPath = '/diamonds';
                mainLabel = 'Diamonds';
              } else if (catLower.includes('silver-pooja') || catLower.includes('pooja') || product.isSilverPooja) {
                mainPath = '/silver-pooja';
                mainLabel = 'Silver Pooja';
              } else if (catLower.includes('silver')) {
                mainPath = '/silver';
                mainLabel = 'Silver';
              } else if (catLower.includes('coin') || catLower.includes('bar')) {
                mainPath = '/coins-bars';
                mainLabel = 'Coins & Bars';
              } else if (catLower.includes('new') || product.isNewArrival) {
                mainPath = '/new-arrivals';
                mainLabel = 'New Arrivals';
              } else if (catLower.includes('collection')) {
                mainPath = '/collections';
                mainLabel = 'Collections';
              } else if (catLower.includes('temple') || product.isTemple) {
                mainPath = '/temple-heritage';
                mainLabel = 'Temple Heritage';
              } else if (catLower.includes('bridal') || product.isBridal) {
                mainPath = '/bridal';
                mainLabel = 'Bridal Collection';
              }
              const subSlug = product.subCategorySlug || product.subCategory || '';
              const subLabel = (String(product.subCategory || product.subType || 'Catalogue')).replace(/[-_]/g, ' ');
              return (
                <>
                  <Link to={mainPath} className="capitalize hover:text-white text-[#E8DFC0] transition-colors cursor-pointer">
                    {mainLabel}
                  </Link>
                  {subSlug && (
                    <>
                      <span className="text-[#C4B5A5]">/</span>
                      <Link to={`${mainPath}/${encodeURIComponent(subSlug.toLowerCase().trim())}`} className="capitalize hover:text-white text-[#E8DFC0] transition-colors cursor-pointer">
                        {subLabel}
                      </Link>
                    </>
                  )}
                </>
              );
            })()}
            <span className="text-[#C4B5A5]">/</span>
            <span className="font-bold text-white truncate max-w-sm">{product.name}</span>
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full border transition-all cursor-pointer shadow-2xs flex items-center justify-center ${
              internalWishlisted
                ? 'bg-[#E53935]/20 border-[#E53935] text-[#E53935]'
                : (isSilverOrDiamond
                    ? 'bg-[#4A1019] hover:bg-[#5C1521] border-[#94A3B8]/70 text-[#FAF6EF]'
                    : 'bg-[#4A1019] hover:bg-[#5C1521] border-[#C99A38]/70 text-[#FAF6EF]')
            }`}
            title="Save for Later"
          >
            <Heart className={`w-4 h-4 ${internalWishlisted ? 'fill-[#E53935] text-[#E53935]' : 'text-white'}`} />
          </button>

          <button
            onClick={handleShareProduct}
            className={`w-10 h-10 rounded-full bg-[#4A1019] hover:bg-[#5C1521] border ${
              isSilverOrDiamond ? 'border-[#94A3B8]/70' : 'border-[#C99A38]/70'
            } text-white shadow-2xs flex items-center justify-center transition-colors cursor-pointer`}
            title="Share Product"
          >
            {shareFeedback ? <Check className="w-4 h-4 text-[#4ADE80]" /> : <Share2 className="w-4 h-4 text-white" />}
          </button>

          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-full bg-[#4A1019] hover:bg-[#5C1521] text-white border ${
              isSilverOrDiamond ? 'border-[#94A3B8]/70' : 'border-[#C99A38]/70'
            } shadow-2xs flex items-center justify-center transition-all cursor-pointer ml-1`}
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
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-7 relative z-10">
        
        {/* Main 2-Column Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-start w-full max-w-full">
          
          {/* ========================================================
              LEFT COLUMN: Vertical 5-Thumbnails Strip, Royal Arch Frame & Measurements
              ======================================================== */}
          <div className="w-full min-w-0 max-w-full flex flex-col">
            
            {/* Gallery Section: Vertical Thumbnails Strip + Royal Arch Showcase with Gold Pedestal */}
            <div className="flex gap-3 sm:gap-4 items-start w-full min-w-0 max-w-full">
              
              {/* Left Vertical Thumbnails Strip (5 items matching mockup) */}
              <div className="flex flex-col items-center gap-2 shrink-0 pt-2 w-14 sm:w-16">
                {/* Up Chevron Button */}
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? thumbnailViews.length - 1 : prev - 1))}
                  className={`w-7 h-7 flex items-center justify-center ${
                    isSilverOrDiamond ? 'text-[#64748B] hover:text-[#0F172A]' : 'text-[#8C6D2D] hover:text-[#4A1019]'
                  } transition-colors cursor-pointer`}
                  aria-label="Previous view"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                {/* 5 Perspective Thumbnails */}
                <div className="flex flex-col gap-2">
                  {thumbnailViews.map((thumb, idx) => {
                    const isActive = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        style={{ width: '56px', height: '56px' }}
                        className={`w-14 h-14 rounded-[14px] overflow-hidden ${
                          isSilverItem ? 'bg-[#F8FAFC]' : isDiamondItem ? 'bg-[#060D1A]' : 'bg-[#240408]'
                        } relative transition-all duration-200 cursor-pointer shrink-0 ${
                          isActive
                            ? (isSilverItem
                                ? 'border-2 border-[#64748B] ring-2 ring-[#94A3B8]/50 shadow-md scale-105'
                                : isDiamondItem
                                  ? 'border-2 border-[#94A3B8] ring-2 ring-[#38BDF8]/50 shadow-md scale-105'
                                  : 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md scale-105')
                            : (isSilverItem
                                ? 'border border-[#CBD5E1] hover:border-[#64748B] opacity-85 hover:opacity-100 shadow-2xs'
                                : isDiamondItem
                                  ? 'border border-[#334155] hover:border-[#94A3B8] opacity-85 hover:opacity-100 shadow-2xs'
                                  : 'border border-[#D4AF37]/40 hover:border-[#D4AF37] opacity-85 hover:opacity-100 shadow-2xs')
                        }`}
                        title={thumb.label}
                      >
                        <img
                          src={thumb.src}
                          alt={thumb.label}
                          className={`w-full h-full object-cover select-none ${
                            thumb.isMacro ? 'scale-150 origin-center' :
                            thumb.isBorder ? 'scale-175 origin-top' :
                            thumb.isClasp ? 'scale-175 origin-bottom' :
                            thumb.isProfile ? 'scale-160 origin-right' : ''
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Down Chevron Button */}
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(prev => (prev === thumbnailViews.length - 1 ? 0 : prev + 1))}
                  className={`w-7 h-7 flex items-center justify-center ${
                    isSilverOrDiamond ? 'text-[#64748B] hover:text-[#0F172A]' : 'text-[#8C6D2D] hover:text-[#4A1019]'
                  } transition-colors cursor-pointer`}
                  aria-label="Next view"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Large Main Showcase Container on Royal Velvet with Ornate Arch & Pedestal */}
              <div className="flex-1 min-w-0 max-w-full flex flex-col items-center w-full">
                
                {/* Royal Arch Outer Wrapper with Crown Finial */}
                <div className="relative w-full pt-4">
                  
                  {/* Ornate Crown Finial sitting atop the central arch apex */}
                  <div className="absolute top-0 inset-x-0 flex justify-center z-25 pointer-events-none">
                    <svg viewBox="0 0 160 36" className={`w-36 sm:w-44 h-auto ${isSilverOrDiamond ? 'text-[#94A3B8]' : 'text-[#D4AF37]'} filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]`} fill="currentColor">
                      {/* Central Royal Finial Motif */}
                      <path d="M80,2 C76,10 70,14 62,15 C69,18 72,24 74,32 C77,26 83,26 86,32 C88,24 91,18 98,15 C90,14 84,10 80,2 Z" fill={isSilverOrDiamond ? '#F1F5F9' : '#FEEA98'} />
                      <path d="M80,0 L83,9 L92,9 L85,14 L88,23 L80,18 L72,23 L75,14 L68,9 L77,9 Z" fill={isSilverOrDiamond ? '#94A3B8' : '#C99A38'} opacity="0.9" />
                      {/* Left & Right Decorative Foliage Filigree */}
                      <path d="M62,15 C52,14 42,18 32,24 C40,23 48,22 55,24 C50,26 42,30 38,34 C48,31 58,28 66,28 C64,24 63,19 62,15 Z" fill={isSilverOrDiamond ? '#CBD5E1' : '#D4AF37'} />
                      <path d="M98,15 C108,14 118,18 128,24 C120,23 112,22 105,24 C110,26 118,30 122,34 C112,31 102,28 94,28 C96,24 97,19 98,15 Z" fill={isSilverOrDiamond ? '#CBD5E1' : '#D4AF37'} />
                    </svg>
                  </div>

                  {/* Main Image Showcase Frame - Category-Blended Luxury Velvet & Studio Display */}
                  <div
                    ref={imageContainerRef}
                    className={`relative w-full rounded-[28px] overflow-hidden border-[3.5px] ${
                      isDiamondItem
                        ? 'border-[#94A3B8] shadow-[0_18px_45px_rgba(6,13,26,0.5)] bg-gradient-to-br from-[#060D1A] via-[#0E1A33] to-[#040812]'
                        : isSilverItem
                          ? 'border-[#94A3B8] shadow-[0_18px_45px_rgba(148,163,184,0.22)] bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7]'
                          : 'border-[#D4AF37] shadow-[0_18px_45px_rgba(40,4,8,0.4)] bg-gradient-to-br from-[#28040A] via-[#3A0610] to-[#1E0206]'
                    } select-none cursor-crosshair z-10`}
                    style={{ aspectRatio: '4 / 3', minHeight: '440px', maxHeight: '540px', width: '100%', maxWidth: '100%' }}
                    onMouseEnter={handlePointerEnter}
                    onMouseMove={handlePointerMove}
                    onMouseLeave={handlePointerLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onClick={() => setIsZoomModalOpen(true)}
                  >
                    {/* Category-Specific Velvet Vignette (Navy for Diamond, White for Silver, Crimson for Gold) */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: isDiamondItem
                          ? 'radial-gradient(ellipse at 50% 50%, rgba(20, 42, 82, 0.45) 0%, rgba(4, 8, 18, 0.95) 100%)'
                          : isSilverItem
                            ? 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(226, 232, 240, 0.5) 100%)'
                            : 'radial-gradient(ellipse at 50% 50%, rgba(140, 20, 38, 0.45) 0%, rgba(24, 2, 6, 0.95) 100%)'
                      }}
                    />

                    {/* Top-Left: Hallmark/Certification Pill */}
                    <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 pointer-events-none">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-md ${
                        isSilverItem
                          ? 'bg-white/95 text-[#1E293B] border border-[#CBD5E1]'
                          : isDiamondItem
                            ? 'bg-[#060D1A]/90 text-[#F1F5F9] border border-[#94A3B8]/70'
                            : 'bg-[#FFFDF9] text-[#3B0710] border border-[#DECDBB]'
                      }`}>
                        <span className={`${isSilverItem ? 'text-[#0284C7]' : isDiamondItem ? 'text-[#38BDF8]' : 'text-[#C99A38]'} text-[9px] font-bold`}>
                          {isSilverOrDiamond ? '✦' : '▲'}
                        </span>
                        <span>
                          {isDiamondItem
                            ? (product.certification || product.badge || 'IGI & GIA Certified Natural')
                            : isSilverItem
                              ? (product.certification || product.badge || '92.5 Certified Silver')
                              : (product.certification || product.badge || 'BIS 916 Laser Inscribed')}
                        </span>
                      </span>
                    </div>

                    {/* Top-Right: Circular Magnifying Glass Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomModalOpen(true);
                      }}
                      className={`absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full ${
                        isSilverItem
                          ? 'bg-white/85 hover:bg-white text-[#334155] border border-[#CBD5E1]'
                          : isDiamondItem
                            ? 'bg-black/50 hover:bg-black/75 text-white border border-white/25'
                            : 'bg-black/45 hover:bg-black/65 text-[#FFF2B0] border border-[#D4AF37]/80'
                      } backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95`}
                      title="Zoom details"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Left & Right Interactive Carousel Navigation Arrows */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(e);
                      }}
                      className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full ${
                        isSilverItem
                          ? 'bg-white/85 hover:bg-white text-[#334155] border border-[#CBD5E1]'
                          : isDiamondItem
                            ? 'bg-black/50 hover:bg-black/75 text-white border border-white/25'
                            : 'bg-black/45 hover:bg-black/75 text-white border border-white/20'
                      } backdrop-blur-md flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md opacity-85 hover:opacity-100`}
                      aria-label="Previous image"
                      title="Previous view"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(e);
                      }}
                      className={`absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full ${
                        isSilverItem
                          ? 'bg-white/85 hover:bg-white text-[#334155] border border-[#CBD5E1]'
                          : isDiamondItem
                            ? 'bg-black/50 hover:bg-black/75 text-white border border-white/25'
                            : 'bg-black/45 hover:bg-black/75 text-white border border-white/20'
                      } backdrop-blur-md flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md opacity-85 hover:opacity-100`}
                      aria-label="Next image"
                      title="Next view"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Main Jewelry Image - FULL FRAME Edge-to-Edge with Zero Gaps */}
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                      <img
                        src={currentImage}
                        alt={`${product.name} - ${thumbnailViews[activeImageIndex]?.label}`}
                        className={`w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105 ${
                          thumbnailViews[activeImageIndex]?.isMacro ? 'scale-125' :
                          thumbnailViews[activeImageIndex]?.isBorder ? 'scale-130 origin-top' :
                          thumbnailViews[activeImageIndex]?.isClasp ? 'scale-130 origin-bottom' :
                          thumbnailViews[activeImageIndex]?.isProfile ? 'scale-125 origin-right' : ''
                        }`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = isSilverItem ? '/images/product_silver_bowl.jpg' : '/images/product_gold_chain.jpg';
                        }}
                      />
                    </div>

                    {/* Interactive Optical Magnification Lens */}
                    {isZoomLensActive && (
                      <div
                        className={`absolute pointer-events-none border-2 ${
                          isSilverOrDiamond ? 'border-[#94A3B8] bg-[#0B1220]' : 'border-[#E8C77D] bg-[#28040A]'
                        } shadow-[0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden z-30 rounded-2xl`}
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
                          }}
                          className="flex items-center justify-center pointer-events-none select-none"
                        >
                          <img
                            src={currentImage}
                            alt="Magnified jewellery detail"
                            className="w-full h-full object-cover pointer-events-none select-none max-w-none max-h-none"
                          />
                        </div>
                        {/* Lens crosshair reticle badge */}
                        <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] ${
                          isSilverOrDiamond ? 'text-[#94A3B8] border-[#94A3B8]/40' : 'text-[#E8C77D] border-[#E8C77D]/40'
                        } font-mono font-bold border pointer-events-none`}>
                          2.4× ZOOM
                        </div>
                      </div>
                    )}

                    {/* Bottom Carousel Indicator Dots */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-2 z-20 pointer-events-auto">
                      {thumbnailViews.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(idx);
                          }}
                          className={`rounded-full transition-all cursor-pointer ${
                            activeImageIndex === idx
                              ? (isSilverOrDiamond ? 'w-2.5 h-2.5 bg-[#475569] ring-2 ring-[#94A3B8]/60 shadow-xs' : 'w-2.5 h-2.5 bg-[#C99A38] ring-2 ring-[#E8C77D]/60 shadow-xs')
                              : (isSilverOrDiamond ? 'w-2 h-2 bg-[#94A3B8]/50 hover:bg-[#64748B]' : 'w-2 h-2 bg-[#DECDBB] hover:bg-[#C99A38]')
                          }`}
                          aria-label={`View perspective ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 3D Tiered Carved Pedestal Stage sitting beneath the frame */}
                  <div className="relative -mt-2.5 mx-auto w-[92%] sm:w-[88%] z-15 pointer-events-none">
                    {/* Top Tier with bevel and shine */}
                    <div className={`h-3 w-full rounded-t-lg shadow-xs ${
                      isSilverOrDiamond
                        ? 'bg-gradient-to-r from-[#475569] via-[#E2E8F0] to-[#475569] border-t border-[#F8FAFC]'
                        : 'bg-gradient-to-r from-[#A57822] via-[#FCEB9C] to-[#A57822] border-t border-[#FFF2B0]'
                    }`} />
                    {/* Main Pedestal Block with engraved relief pattern */}
                    <div className={`h-5 sm:h-6 w-full border-x flex items-center justify-center relative overflow-hidden shadow-md ${
                      isSilverOrDiamond
                        ? 'bg-gradient-to-r from-[#334155] via-[#94A3B8] to-[#334155] border-[#64748B]'
                        : 'bg-gradient-to-r from-[#8B6418] via-[#DDB856] to-[#8B6418] border-[#B88E32]'
                    }`}>
                      {/* Ornate repousse relief pattern repeat */}
                      <div 
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: isSilverOrDiamond
                            ? 'radial-gradient(circle at 8px 8px, #F8FAFC 2px, transparent 2.5px)'
                            : 'radial-gradient(circle at 8px 8px, #FFFDF0 2px, transparent 2.5px)',
                          backgroundSize: '16px 16px'
                        }}
                      />
                      <div className={`w-full h-[1px] absolute top-0.5 inset-x-0 ${isSilverOrDiamond ? 'bg-[#F1F5F9]/80' : 'bg-[#FFEFA0]/70'}`} />
                      <div className={`w-full h-[1px] absolute bottom-0.5 inset-x-0 ${isSilverOrDiamond ? 'bg-[#1E293B]/70' : 'bg-[#61450C]/60'}`} />
                    </div>
                    {/* Bottom Stepped Base Tier */}
                    <div className={`h-2.5 w-[104%] -ml-[2%] rounded-b-xl shadow-[0_12px_24px_rgba(0,0,0,0.35)] ${
                      isSilverOrDiamond
                        ? 'bg-gradient-to-r from-[#1E293B] via-[#64748B] to-[#1E293B] border-b border-[#0F172A]'
                        : 'bg-gradient-to-r from-[#6E4F14] via-[#BF9B42] to-[#6E4F14] border-b border-[#523A0B]'
                    }`} />
                  </div>

                </div>

              </div>

            </div>

            {/* Product Measurements Box (Directly below showcase) */}
            <div className="mt-6 bg-[#FFFDF9] border border-[#DECDBB] rounded-[20px] shadow-xs overflow-hidden w-full max-w-full">
              {/* Header: Burgundy velvet ribbon tab + gold or silver flourish */}
              <div className="flex items-center justify-between border-b border-[#EDE4D5] pr-4">
                <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] text-white rounded-br-[18px] border-r border-b ${
                  isSilverOrDiamond ? 'border-[#94A3B8]' : 'border-[#C99A38]'
                } shadow-xs`}>
                  <Tag className={`w-3.5 h-3.5 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'}`} />
                  <span className="font-serif font-bold text-xs sm:text-[13px] tracking-wide">
                    Product Measurements
                  </span>
                </div>

                {/* Center flourish ornament */}
                <div className={`hidden sm:flex items-center gap-2 ${isSilverOrDiamond ? 'text-[#94A3B8]/70' : 'text-[#C99A38]/70'}`}>
                  <span className={`w-10 h-[1px] bg-gradient-to-r from-transparent ${isSilverOrDiamond ? 'to-[#94A3B8]/60' : 'to-[#C99A38]/60'}`} />
                  <span className="text-[10px]">❖</span>
                  <span className={`w-10 h-[1px] bg-gradient-to-l from-transparent ${isSilverOrDiamond ? 'to-[#94A3B8]/60' : 'to-[#C99A38]/60'}`} />
                </div>
              </div>

              {/* Body: 4 circular metric badges + View Size Guide button */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
                  {/* 1. Length */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                      isSilverOrDiamond
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                        : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#8C6D2D]'
                    }`}>
                      <MoveHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10.5px] text-[#7A6E65] font-medium leading-none">Length</span>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#241716] font-mono mt-1">
                        {parsedDimensions.length}
                      </span>
                    </div>
                  </div>

                  {/* 2. Width */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                      isSilverOrDiamond
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                        : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#8C6D2D]'
                    }`}>
                      <MoveHorizontal className="w-4 h-4 rotate-90" />
                    </div>
                    <div>
                      <span className="block text-[10.5px] text-[#7A6E65] font-medium leading-none">Width</span>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#241716] font-mono mt-1">
                        {parsedDimensions.width}
                      </span>
                    </div>
                  </div>

                  {/* 3. Height / Thickness */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                      isSilverOrDiamond
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                        : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#8C6D2D]'
                    }`}>
                      <MoveVertical className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10.5px] text-[#7A6E65] font-medium leading-none">Height / Thickness</span>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#241716] font-mono mt-1">
                        {parsedDimensions.thickness}
                      </span>
                    </div>
                  </div>

                  {/* 4. Weight */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                      isSilverOrDiamond
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                        : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#8C6D2D]'
                    }`}>
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10.5px] text-[#7A6E65] font-medium leading-none">Weight</span>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#241716] font-mono mt-1">
                        {parsedDimensions.weight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Size Guide Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMeasurementsTab('sizeguide');
                    setIsMeasurementsOpen(true);
                  }}
                  className={`bg-[#FFFDF9] hover:bg-[#FAF3E8] border border-[#DECDBB] ${
                    isSilverOrDiamond ? 'hover:border-[#64748B]' : 'hover:border-[#8C6D2D]'
                  } text-[#3B0710] font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer shrink-0`}
                >
                  <Ruler className={`w-3.5 h-3.5 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#8C6D2D]'}`} />
                  <span>View Size Guide</span>
                </button>
              </div>
            </div>

            {/* Showroom Concierge & Personal Assistance Card - Perfectly Proportioned to Match Column Height */}
            <div className="mt-3.5 sm:mt-4 bg-[#FFFDF9] border border-[#DECDBB] rounded-[20px] shadow-xs overflow-hidden w-full max-w-full">
              {/* Header: Burgundy velvet ribbon tab + Live Status */}
              <div className="flex items-center justify-between border-b border-[#EDE4D5] pr-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] text-white rounded-br-[16px] border-r border-b ${
                  isSilverOrDiamond ? 'border-[#94A3B8]' : 'border-[#C99A38]'
                } shadow-xs`}>
                  <Video className={`w-3.5 h-3.5 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'}`} />
                  <span className="font-serif font-bold text-xs tracking-wide">
                    Live Showroom Concierge
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available Now</span>
                </div>
              </div>

              {/* Body: Direct Jeweller Connection Options */}
              <div className="p-3 sm:p-3.5 space-y-2.5">
                {/* 2 Quick CTA Buttons: Book Video Consultation & WhatsApp */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {/* 1. Live Video Consultation */}
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] hover:from-[#5C1521] hover:to-[#38060F] text-white font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:shadow transition-all cursor-pointer group"
                  >
                    <Video className="w-3.5 h-3.5 text-[#F3EAD3]" />
                    <span className="truncate">1-on-1 Video Call</span>
                  </button>

                  {/* 2. WhatsApp Assistance */}
                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:shadow transition-all cursor-pointer group"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                    <span className="truncate">Instant WhatsApp</span>
                  </button>
                </div>

                {/* 5-Second Voice Recording Component */}
                <div className="relative flex items-center justify-between py-1.5 px-2.5 sm:px-3.5 rounded-xl bg-[#FAF5EB] border border-[#DECDBB] shadow-2xs overflow-hidden">
                  {/* Left: Audio Waveform Animation Bars */}
                  <div className="flex items-center gap-[2.5px] shrink-0 pr-1">
                    {[10, 16, 22, 16, 26, 18, 12, 20, 24, 14].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          height: `${h * 0.65}px`,
                          animationDelay: `${(i % 5) * 0.12}s`,
                        }}
                        className={`w-[2px] rounded-full transition-all duration-200 ${
                          recordingState === 'recording' || isPlayingAudio
                            ? 'bg-[#4A1019] animate-audio-wave'
                            : 'bg-[#DECDBB]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Center-Left: Microphone / Play Action Button */}
                  <div className="relative flex items-center justify-center shrink-0">
                    {recordingState === 'recording' && (
                      <span className="absolute inset-0 rounded-full bg-[#4A1019]/25 animate-ping" />
                    )}
                    
                    {recordingState === 'idle' && (
                      <div className="p-0.5 rounded-full bg-[#4A1019]/10 ring-2 ring-[#4A1019]/5">
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="w-7 h-7 rounded-full bg-[#4A1019] text-white flex items-center justify-center shadow-xs hover:bg-[#350911] transition-transform active:scale-95 cursor-pointer"
                          title="Tap to Record Voice"
                          aria-label="Tap to Record Voice"
                        >
                          <Mic className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    )}

                    {recordingState === 'recording' && (
                      <div className="p-0.5 rounded-full bg-[#4A1019]/20 ring-2 ring-[#4A1019]/10">
                        <button
                          type="button"
                          onClick={stopVoiceRecordingEarly}
                          className="w-7 h-7 rounded-full bg-[#4A1019] text-white flex items-center justify-center shadow-xs hover:bg-[#350911] transition-transform active:scale-95 cursor-pointer animate-pulse"
                          title="Recording... Tap to stop"
                          aria-label="Recording... Tap to stop"
                        >
                          <Square className="w-3 h-3 fill-white text-white" />
                        </button>
                      </div>
                    )}

                    {recordingState === 'recorded' && (
                      <div className="p-0.5 rounded-full bg-[#4A1019]/10 ring-2 ring-[#4A1019]/5">
                        <button
                          type="button"
                          onClick={toggleAudioPlayback}
                          className="w-7 h-7 rounded-full bg-[#4A1019] text-white flex items-center justify-center shadow-xs hover:bg-[#350911] transition-transform active:scale-95 cursor-pointer"
                          title={isPlayingAudio ? 'Pause Voice Note' : 'Listen to Voice Note'}
                          aria-label={isPlayingAudio ? 'Pause Voice Note' : 'Listen to Voice Note'}
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-3 h-3 text-white fill-white" />
                          ) : (
                            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Middle Text: Title & Subtitle */}
                  <div className="flex-1 min-w-0 px-2 sm:px-2.5">
                    {recordingState === 'idle' && (
                      <span className="font-bold text-[11px] sm:text-[11.5px] text-[#241716] leading-tight block truncate">
                        Quick Voice Inquiry <span className="text-[10px] font-normal text-[#7A6E65]">(Tap mic to record 5s)</span>
                      </span>
                    )}

                    {recordingState === 'recording' && (
                      <span className="font-bold text-[11px] sm:text-[11.5px] text-[#4A1019] leading-tight flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A1019] animate-ping" />
                        <span>Recording Voice...</span>
                      </span>
                    )}

                    {recordingState === 'recorded' && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[11px] sm:text-[11.5px] text-[#241716] leading-tight flex items-center gap-1 truncate">
                          <Check className="w-3 h-3 text-[#287A52]" />
                          <span>Voice Recorded</span>
                        </span>
                        <button
                          type="button"
                          onClick={resetVoiceRecording}
                          className="text-[10px] text-[#7A6E65] hover:text-[#4A1019] underline cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: 5s indicator */}
                  <div className="flex items-center gap-1 shrink-0 text-[#4A1019]">
                    <span className="font-bold text-[10.5px] sm:text-[11px] font-mono">
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
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: Heritage Tagline, Title, Description, Pricing,
              3 Highlight Cards, Enclosed Specifications Box, Actions,
              AR / 3D Pills, and Solid Royal Burgundy Velvet Trust Bar
              ======================================================== */}
          <div className="w-full min-w-0 max-w-full flex flex-col justify-start">
            
            {/* 1. Ornate Lotus Emblem & Category Tagline */}
            <div className="flex flex-col items-center sm:items-start mb-3 sm:mb-3.5">
              <div className={`flex items-center gap-3 mb-1.5 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`}>
                <span className={`w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent ${isSilverOrDiamond ? 'to-[#94A3B8]/70' : 'to-[#C99A38]/70'}`} />
                <span className="text-[10px]">✦</span>
                <svg className={`w-5 h-5 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-1.5 2.5-3 5-3 7 0 1.66 1.34 3 3 3s3-1.34 3-3c0-2-1.5-4.5-3-7zm-4.5 5c-1.5 2-2.5 4.2-2.5 5.8 0 2.32 1.88 4.2 4.2 4.2.8 0 1.55-.22 2.2-.6-1.1-1.3-1.7-2.9-1.7-4.6 0-1.8.6-3.4 1.7-4.8H7.5zm9 0c1.1 1.4 1.7 3 1.7 4.8 0 1.7-.6 3.3-1.7 4.6.65.38 1.4.6 2.2.6 2.32 0 4.2-1.88 4.2-4.2 0-1.6-1-3.8-2.5-5.8h-3.9zM12 15c-1.1 0-2.1-.4-2.8-1.1-.7.7-1.7 1.1-2.8 1.1-2.2 0-4 1.8-4 4 0 1.1.9 2 2 2h15.6c1.1 0 2-.9 2-2 0-2.2-1.8-4-4-4-1.1 0-2.1-.4-2.8-1.1-.7.7-1.7 1.1-2.8 1.1z"/>
                </svg>
                <span className="text-[10px]">✦</span>
                <span className={`w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent ${isSilverOrDiamond ? 'to-[#94A3B8]/70' : 'to-[#C99A38]/70'}`} />
              </div>
              <span className={`text-[11px] sm:text-xs font-bold tracking-[0.28em] uppercase ${isSilverOrDiamond ? 'text-[#475569]' : 'text-[#A3702C]'} font-serif`}>
                {collectionTagline}
              </span>
            </div>

            {/* 2. Majestic Product Title - With generous line-height and letter-spacing to prevent text collisions */}
            <h1
              className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold text-[#241716] leading-[1.38] sm:leading-[1.42] tracking-normal mb-3.5 sm:mb-4.5 font-serif"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            {/* 3. Short Heritage Description */}
            <p className="text-xs sm:text-sm text-[#5C4F4A] leading-[1.65] mb-4 sm:mb-5 max-w-2xl">
              {product.description || 'Masterpiece 22K gold bridal waistband embossed with Ashtalakshmi central icon, surrounded by dancing peacocks and uncut cabochon rubies.'}
            </p>

            {/* 4. Luxury Pricing Row */}
            <div className="flex items-baseline gap-3.5 mb-5 flex-wrap">
              <span
                className="text-3xl sm:text-4xl font-bold font-serif text-[#241716] tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {displayPrice}
              </span>
              <span className="text-base sm:text-lg line-through text-[#8C7E75] font-serif">
                {originalPriceFormatted}
              </span>
              <span className={`font-bold text-xs sm:text-[13px] px-3.5 py-1 rounded-full shadow-2xs ${
                isSilverOrDiamond
                  ? 'bg-[#E2E8F0] text-[#1E293B] border border-[#CBD5E1]'
                  : 'bg-[#FEECA8] text-[#8C6500] border border-[#F4D068]'
              }`}>
                10% OFF
              </span>
            </div>

            {/* 5. 3 Feature Highlight Badges in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5">
              {/* Card 1: Hallmark / Certification */}
              <div className="p-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] border border-[#DECDBB] shadow-2xs flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  isDiamondItem 
                    ? 'bg-[#E0F2FE] border border-[#7DD3FC] text-[#0284C7]' 
                    : isSilverItem
                      ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                      : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#C99A38]'
                }`}>
                  {isDiamondItem ? (
                    <Gem className="w-5 h-5 text-[#0284C7]" />
                  ) : isSilverItem ? (
                    <Award className="w-5 h-5 text-[#475569]" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-[#241716] truncate">
                    {isDiamondItem 
                      ? 'IGI / GIA' 
                      : (isSilverItem ? '925 Silver' : 'BIS 916')}
                  </span>
                  <span className="block text-[10.5px] text-[#7A6E65] truncate">
                    {isDiamondItem 
                      ? 'Certified Natural' 
                      : (isSilverItem ? 'Assay Certified' : 'Laser Inscribed')}
                  </span>
                </div>
              </div>

              {/* Card 2: Purity / Carat */}
              <div className="p-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] border border-[#DECDBB] shadow-2xs flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  isDiamondItem 
                    ? 'bg-[#E0F2FE] border border-[#7DD3FC] text-[#0284C7]' 
                    : isSilverItem
                      ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                      : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#C99A38]'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-[#241716] truncate">
                    {isDiamondItem 
                      ? (product.carat || '1.25 Carat') 
                      : isSilverItem
                        ? '92.5% Purity'
                        : (product.purity ? (product.purity.includes('24') ? '24K' : product.purity.includes('18') ? '18K' : '22K') : '22K')}
                  </span>
                  <span className="block text-[10.5px] text-[#7A6E65] truncate">
                    {isDiamondItem 
                      ? (product.colorClarity ? product.colorClarity.split(',')[0] : 'Pure Colorless') 
                      : isSilverItem
                        ? 'Fine Sterling Silver'
                        : 'Gold Purity'}
                  </span>
                </div>
              </div>

              {/* Card 3: Craftsmanship / Diamond Quality */}
              <div className="p-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] border border-[#DECDBB] shadow-2xs flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  isDiamondItem 
                    ? 'bg-[#E0F2FE] border border-[#7DD3FC] text-[#0284C7]' 
                    : isSilverItem
                      ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]'
                      : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#C99A38]'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-[#241716] truncate">
                    {isDiamondItem 
                      ? 'Hearts & Arrows' 
                      : isSilverItem
                        ? 'Silversmithing'
                        : (product.craftsmanship?.split(' ')[0] || 'Chettinad')}
                  </span>
                  <span className="block text-[10.5px] text-[#7A6E65] truncate">
                    {isDiamondItem 
                      ? 'Optical Symmetry' 
                      : isSilverItem
                        ? 'Handcrafted Finish'
                        : (product.craftsmanship?.split(' ').slice(1).join(' ') || 'Peacock Repousse Art')}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Enclosed Product Specifications Box with Star Flourish Header */}
            <div className="bg-[#FFFDF9] border border-[#DECDBB] rounded-[20px] p-4 sm:p-5 shadow-2xs mb-5">
              {/* Header with star flourishes */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EDE4D5]">
                <div className={`flex items-center gap-2 font-serif font-bold text-xs sm:text-sm ${
                  isSilverOrDiamond ? 'text-[#334155]' : 'text-[#8C6D2D]'
                }`}>
                  <span className={`text-xs ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`}>✦</span>
                  <span className="tracking-wide">Product Specifications</span>
                  <span className={`text-xs ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`}>✦</span>
                </div>
                <div className={`flex items-center gap-2 ${isSilverOrDiamond ? 'text-[#94A3B8]/70' : 'text-[#C99A38]/70'}`}>
                  <span className={`w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent ${isSilverOrDiamond ? 'to-[#94A3B8]/60' : 'to-[#C99A38]/60'}`} />
                  <span className="text-xs">❖</span>
                  <span className={`w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent ${isSilverOrDiamond ? 'to-[#94A3B8]/60' : 'to-[#C99A38]/60'}`} />
                </div>
              </div>

              {/* Specifications Rows */}
              <div className="space-y-3 text-xs sm:text-[13px]">
                <div className={`flex items-center justify-between py-1 border-b ${
                  isSilverOrDiamond ? 'border-[#F1F5F9]' : 'border-[#FAF0DE]'
                }`}>
                  <span className="text-[#6B5A4E] flex items-center gap-2">
                    <Scale className={`w-4 h-4 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`} />
                    <span className="font-medium">Gross Weight</span>
                  </span>
                  <span className="font-bold text-[#241716] font-mono text-sm">
                    {product.weight || parsedDimensions.weight}
                  </span>
                </div>

                {isDiamondItem && (product.carat || product.colorClarity) && (
                  <div className={`flex items-center justify-between py-1 border-b ${
                    isSilverOrDiamond ? 'border-[#F1F5F9]' : 'border-[#FAF0DE]'
                  }`}>
                    <span className="text-[#6B5A4E] flex items-center gap-2">
                      <Gem className="w-4 h-4 text-[#0284C7]" />
                      <span className="font-medium">Diamond Grade</span>
                    </span>
                    <span className="font-semibold text-[#0F172A] text-right font-mono text-xs">
                      {[product.carat, product.colorClarity].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                )}

                <div className={`flex items-center justify-between py-1 border-b ${
                  isSilverOrDiamond ? 'border-[#F1F5F9]' : 'border-[#FAF0DE]'
                }`}>
                  <span className="text-[#6B5A4E] flex items-center gap-2">
                    <Package className={`w-4 h-4 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`} />
                    <span className="font-medium">Dimensions</span>
                  </span>
                  <span className="font-semibold text-[#241716] text-right font-mono">
                    {product.dimensions || `${parsedDimensions.length} × ${parsedDimensions.width} with secure screw clasp`}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#6B5A4E] flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'}`} />
                    <span className="font-medium">Craftsmanship</span>
                  </span>
                  <span className="font-semibold text-[#241716] text-right">
                    {product.craftsmanship || (
                      isDiamondItem 
                        ? 'Four-Prong Archival Crown • Platinum Mirror Polish' 
                        : isSilverItem 
                          ? 'Authentic South Indian Silversmithing' 
                          : 'Chettinad Peacock Repousse Art'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Action Controls: Quantity Stepper, Wishlist, Add to Cart */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-4">
              {/* Quantity Stepper Pill */}
              <div className="h-12 px-3.5 rounded-full border border-[#DECDBB] bg-[#FFFDF9] flex items-center gap-3.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full hover:bg-[#FAF3E8] flex items-center justify-center text-[#4A1019] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-[#241716] min-w-[16px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-7 h-7 rounded-full hover:bg-[#FAF3E8] flex items-center justify-center text-[#4A1019] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`h-12 px-6 rounded-full border transition-all cursor-pointer shadow-2xs flex items-center gap-2 text-xs sm:text-sm font-semibold ${
                  internalWishlisted
                    ? 'bg-[#4A1019]/10 border-[#4A1019] text-[#4A1019]'
                    : 'bg-[#FFFDF9] hover:bg-[#FAF3E8] border-[#DECDBB] text-[#4A1019]'
                }`}
              >
                <Heart className={`w-4 h-4 ${internalWishlisted ? 'fill-[#4A1019] text-[#4A1019]' : 'text-[#4A1019]'}`} />
                <span>{internalWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`h-12 flex-1 sm:flex-initial px-8 rounded-full bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] hover:from-[#5C1521] hover:to-[#38060F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border ${
                  isSilverOrDiamond ? 'border-[#94A3B8]' : 'border-[#C99A38]'
                } shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer`}
              >
                <ShoppingBag className={`w-4 h-4 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'}`} />
                <span>{addedToCartToast ? 'Added to Cart ✓' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* 8. Interactive 3D / AR Links Row (Directly below Add to Cart row) */}
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <button
                type="button"
                onClick={() => setIsTryOnOpen(true)}
                className={`h-11 rounded-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] hover:bg-[#FAF3E5] border border-[#DECDBB] ${
                  isSilverOrDiamond ? 'hover:border-[#64748B]' : 'hover:border-[#8C6D2D]'
                } text-[#3B0710] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer group`}
              >
                <Sparkles className={`w-4 h-4 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#8C6D2D]'} group-hover:scale-110 transition-transform`} />
                <span>Virtual Try-On</span>
              </button>
              <button
                type="button"
                onClick={() => setIs360Open(true)}
                className={`h-11 rounded-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] hover:bg-[#FAF3E5] border border-[#DECDBB] ${
                  isSilverOrDiamond ? 'hover:border-[#64748B]' : 'hover:border-[#8C6D2D]'
                } text-[#3B0710] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer group`}
              >
                <RotateCcw className={`w-4 h-4 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#8C6D2D]'} group-hover:rotate-45 transition-transform`} />
                <span>360° Interactive View</span>
              </button>
            </div>

            {/* 9. 4 Delivery Trust Pillars inside Solid Royal Burgundy Velvet Bar */}
            <div className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#4A1019] via-[#35070E] to-[#250308] border ${
              isSilverOrDiamond ? 'border-[#94A3B8]/60' : 'border-[#C99A38]/50'
            } shadow-md`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center">
                {/* 1. Free Insured Shipping */}
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-5 h-5 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'} shrink-0`} />
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-white leading-tight">Free</span>
                    <span className={`block text-[10.5px] sm:text-[11px] ${isSilverOrDiamond ? 'text-[#CBD5E1]' : 'text-[#E8DFC0]'} leading-tight`}>Insured Shipping</span>
                  </div>
                </div>

                {/* 2. Secure Packaging */}
                <div className="flex items-center gap-2.5">
                  <Package className={`w-5 h-5 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'} shrink-0`} />
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-white leading-tight">Secure</span>
                    <span className={`block text-[10.5px] sm:text-[11px] ${isSilverOrDiamond ? 'text-[#CBD5E1]' : 'text-[#E8DFC0]'} leading-tight`}>Packaging</span>
                  </div>
                </div>

                {/* 3. Easy Returns */}
                <div className="flex items-center gap-2.5">
                  <Calendar className={`w-5 h-5 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'} shrink-0`} />
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-white leading-tight">Easy</span>
                    <span className={`block text-[10.5px] sm:text-[11px] ${isSilverOrDiamond ? 'text-[#CBD5E1]' : 'text-[#E8DFC0]'} leading-tight`}>Returns (7 Days)</span>
                  </div>
                </div>

                {/* 4. Expert Assistance */}
                <div className="flex items-center gap-2.5">
                  <Headphones className={`w-5 h-5 ${isSilverOrDiamond ? 'text-[#E2E8F0]' : 'text-[#E8C77D]'} shrink-0`} />
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-white leading-tight">Expert</span>
                    <span className={`block text-[10.5px] sm:text-[11px] ${isSilverOrDiamond ? 'text-[#CBD5E1]' : 'text-[#E8DFC0]'} leading-tight`}>Assistance</span>
                  </div>
                </div>
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
                  {/* Category Subhead: Gold or Diamond or Silver */}
                  <tr>
                    <td colSpan={6} className="pt-3.5 pb-1 px-3 font-bold text-[#241716] text-xs sm:text-sm">
                      {isDiamondItem ? 'Natural Diamond & Metal Setting' : isSilverItem ? 'Pure Silver (925 Fine)' : 'Gold'}
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
        <div className={`mt-8 p-3 sm:p-4 bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EA] to-[#FFFDF9] border ${
          isSilverOrDiamond ? 'border-[#CBD5E1]' : 'border-[#E8DFC0]'
        } rounded-2xl shadow-xs`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 md:divide-x md:divide-[#E2D2B8] items-center">
            
            {/* 1. 100% BIS 916 Hallmarked or IGI/GIA Certified */}
            <div className="flex items-center gap-3 md:px-4 lg:px-6">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                isDiamondItem
                  ? 'bg-gradient-to-b from-[#FFFFFF] via-[#F0F9FF] to-[#E0F2FE] border-2 border-[#7DD3FC] text-[#0284C7]'
                  : isSilverItem
                    ? 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] border-2 border-[#94A3B8] text-[#475569]'
                    : 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] text-[#8C6D2D]'
              }`}>
                {isDiamondItem ? (
                  <Gem className="w-5 h-5 text-[#0284C7]" />
                ) : isSilverItem ? (
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#475569]" />
                ) : (
                  <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 text-[#8C6D2D]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 3.5 L7 7.5 V15.5 C7 21.5 10.8 26.5 16 28.5 C21.2 26.5 25 21.5 25 15.5 V7.5 Z" />
                    <path d="M11.5 12.5 L14.5 15.5 L20.5 9.5" strokeWidth="2" />
                    <text x="16" y="22.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif" letterSpacing="0.5">BIS</text>
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[#241716] text-xs sm:text-sm leading-tight block truncate">
                  {isDiamondItem ? 'IGI & GIA' : isSilverItem ? '925 Silver' : '100% BIS 916'}
                </span>
                <span className="text-[#581923] font-semibold text-[11px] sm:text-xs leading-tight block truncate">
                  {isDiamondItem ? 'Certified Natural' : isSilverItem ? 'Assay Certified' : 'Hallmarked'}
                </span>
              </div>
            </div>

            {/* 2. Lifetime Guarantee */}
            <div className="flex items-center gap-3 md:px-4 lg:px-6">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                isSilverOrDiamond
                  ? 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] border-2 border-[#94A3B8] text-[#475569]'
                  : 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] text-[#8C6D2D]'
              }`}>
                <svg viewBox="0 0 32 32" className={`w-5 h-5 sm:w-6 sm:h-6 ${isSilverOrDiamond ? 'text-[#475569]' : 'text-[#8C6D2D]'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20 L8.5 28 L13 25.5 L17.5 28 L15 20" fill="currentColor" fillOpacity="0.15" />
                  <path d="M21 20 L23.5 28 L19 25.5 L14.5 28 L17 20" fill="currentColor" fillOpacity="0.15" />
                  <circle cx="16" cy="13" r="8.5" fill={isSilverOrDiamond ? '#F1F5F9' : '#FAF4E8'} strokeWidth="1.8" />
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
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                isSilverOrDiamond
                  ? 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] border-2 border-[#94A3B8] text-[#475569]'
                  : 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] text-[#8C6D2D]'
              }`}>
                <svg viewBox="0 0 32 32" className={`w-5 h-5 sm:w-6 sm:h-6 ${isSilverOrDiamond ? 'text-[#475569]' : 'text-[#8C6D2D]'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 5.5 C8 4.7 8.7 4 9.5 4 H18.5 L24 9.5 V24.5 C24 25.3 23.3 26 22.5 26 H9.5 C8.7 26 8 25.3 8 24.5 Z" fill={isSilverOrDiamond ? '#F1F5F9' : '#FAF4E8'} />
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
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                isSilverOrDiamond
                  ? 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] border-2 border-[#94A3B8] text-[#475569]'
                  : 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF6EE] to-[#F2E5D0] border-2 border-[#D8BE8A] text-[#8C6D2D]'
              }`}>
                <svg viewBox="0 0 32 32" className={`w-5 h-5 sm:w-6 sm:h-6 ${isSilverOrDiamond ? 'text-[#475569]' : 'text-[#8C6D2D]'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="6" y2="12" strokeWidth="1.5" />
                  <line x1="2" y1="16" x2="5" y2="16" strokeWidth="1.5" />
                  <line x1="4" y1="20" x2="7" y2="20" strokeWidth="1.5" />
                  <path d="M7 10 H19 V22 H7 Z" fill={isSilverOrDiamond ? '#F1F5F9' : '#FAF4E8'} />
                  <path d="M19 13 H24 L27 17 V22 H19 Z" fill={isSilverOrDiamond ? '#F1F5F9' : '#FAF4E8'} />
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
                  className={`bg-white rounded-2xl border ${
                    isSilverOrDiamond ? 'border-[#CBD5E1] hover:border-[#64748B]' : 'border-[#E8DFC0] hover:border-[#8C6D2D]'
                  } p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
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
                    <p className={`text-[10px] ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#8C6D2D]'} font-bold uppercase tracking-wider`}>
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

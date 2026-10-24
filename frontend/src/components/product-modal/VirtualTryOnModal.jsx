import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Sparkles, RefreshCw, ZoomIn, ZoomOut, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualTryOnModal({ isOpen, onClose, product }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [jewelleryScale, setJewelleryScale] = useState(1);
  const [jewelleryPos, setJewelleryPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize or stop camera stream
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, capturedPhoto]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreamActive(true);
      } else {
        setCameraError('Camera access is not supported by your browser.');
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access was denied. Please allow camera permissions in your browser or switch to "Upload Your Photo".');
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(photoUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - jewelleryPos.x, y: e.clientY - jewelleryPos.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setJewelleryPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
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
                <Sparkles className="w-4 h-4 text-[#F3EAD3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#241716] flex items-center gap-2">
                  Virtual Try-On
                  <span className="text-[10px] font-semibold bg-[#581923] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AR Preview
                  </span>
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  Experience {product?.name} in real-time
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6E65] hover:text-[#241716] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close Try-On"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-[#E8DFC0] bg-white px-6 pt-2">
            <button
              onClick={() => {
                setActiveTab('camera');
                setCapturedPhoto(null);
              }}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'border-[#581923] text-[#581923]'
                  : 'border-transparent text-[#7A6E65] hover:text-[#241716]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera Try-On</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-[#581923] text-[#581923]'
                  : 'border-transparent text-[#7A6E65] hover:text-[#241716]'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your Photo</span>
            </button>
          </div>

          {/* Main Stage */}
          <div className="p-6 flex flex-col items-center">
            <div 
              className="relative w-full aspect-[4/3] max-h-[380px] rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-[#E8DFC0] shadow-inner select-none"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {activeTab === 'camera' ? (
                <>
                  {capturedPhoto ? (
                    <img 
                      src={capturedPhoto} 
                      alt="Captured preview" 
                      className="w-full h-full object-cover transform scale-x-[-1]" 
                    />
                  ) : streamActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                  ) : cameraError ? (
                    <div className="p-6 text-center text-white max-w-sm">
                      <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                      <p className="text-xs text-amber-200 leading-relaxed mb-4">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-[#581923] text-white rounded-full text-xs font-semibold hover:bg-[#431219] transition-colors"
                      >
                        Retry Camera Access
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-white/80">
                      <RefreshCw className="w-8 h-8 animate-spin mb-2 text-[#E5C278]" />
                      <span className="text-xs">Connecting camera feed...</span>
                    </div>
                  )}

                  {/* Face / Jewellery Alignment Guide Overlay */}
                  {!cameraError && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-64 border-2 border-dashed border-[#E5C278]/60 rounded-[50%] flex flex-col items-center justify-between py-3">
                        <span className="text-[10px] text-[#E5C278] bg-black/50 px-2 py-0.5 rounded-full font-medium">
                          Align Face Here
                        </span>
                        <div className="w-full flex justify-between px-3">
                          <span className="w-4 h-4 border-b-2 border-l-2 border-[#E5C278]/70"></span>
                          <span className="w-4 h-4 border-b-2 border-r-2 border-[#E5C278]/70"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Upload Photo Tab */
                <div className="w-full h-full flex items-center justify-center">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded face"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-6 text-[#A09388]">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-[#B38738]/60" />
                      <p className="text-xs sm:text-sm text-[#5C5047] font-medium mb-1">
                        Upload a front-facing portrait photo
                      </p>
                      <p className="text-[11px] text-[#7A6E65] mb-4">
                        For best results, keep ears and neckline visible
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#581923] text-white rounded-full text-xs font-semibold hover:bg-[#431219] transition-colors cursor-pointer"
                      >
                        Choose Photo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Draggable & Scalable Jewellery Overlay */}
              {product?.image && (
                <div
                  className="absolute cursor-move transition-transform duration-75 select-none"
                  style={{
                    transform: `translate(${jewelleryPos.x}px, ${jewelleryPos.y}px) scale(${jewelleryScale})`,
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="relative group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 sm:w-28 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] pointer-events-none"
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                      Drag to position
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Adjustment Controls Bar */}
            <div className="w-full mt-4 flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#E8DFC0]">
              <div className="flex items-center gap-2 text-xs text-[#5C5047]">
                <span className="font-semibold text-[#241716]">Scale Size:</span>
                <button
                  onClick={() => setJewelleryScale((s) => Math.max(0.5, s - 0.1))}
                  className="p-1 rounded bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#241716] border border-[#E8DFC0]"
                  title="Smaller"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono w-10 text-center">
                  {Math.round(jewelleryScale * 100)}%
                </span>
                <button
                  onClick={() => setJewelleryScale((s) => Math.min(2.0, s + 0.1))}
                  className="p-1 rounded bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#241716] border border-[#E8DFC0]"
                  title="Larger"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setJewelleryScale(1);
                    setJewelleryPos({ x: 0, y: 0 });
                  }}
                  className="text-[11px] underline ml-2 text-[#7A6E65] hover:text-[#581923]"
                >
                  Reset
                </button>
              </div>

              {activeTab === 'camera' && streamActive && !capturedPhoto && (
                <button
                  onClick={handleCapture}
                  className="bg-[#581923] hover:bg-[#431219] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Snapshot</span>
                </button>
              )}

              {activeTab === 'camera' && capturedPhoto && (
                <button
                  onClick={handleRetake}
                  className="bg-[#241716] hover:bg-[#3D2E24] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
              )}

              {activeTab === 'upload' && uploadedImage && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#241716] border border-[#E8DFC0] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-[#7A6E65] text-center mt-3">
              Tip: Drag the jewellery piece to align with your ears or neckline. Built for seamless future MediaPipe AR tracking integration.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

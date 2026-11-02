import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ScanQrCode, 
  Camera, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Keyboard, 
  CameraOff, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Gem, 
  Tag, 
  Check, 
  Activity,
  ChevronDown,
  ChevronUp,
  Loader2,
  PackagePlus,
  Edit3,
  Layers,
  FileText,
  BadgeAlert,
  Upload,
  Image as ImageIcon,
  Trash2,
  UploadCloud
} from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { parseJewelleryTagQR } from '../../services/qrTagParserService';
import { 
  decodeQRFromImage, 
  validateImageFile, 
  formatFileSize 
} from '../../services/qrImageDecoderService';
import { productsClient } from '../../api/productsClient';
import { formatCurrency } from '../../utils/currency';

// Configure ZXing Hints for high accuracy QR decoding
const zxingHints = new Map();
zxingHints.set(DecodeHintType.TRY_HARDER, true);

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload' | 'manual'
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');

  // Upload QR Image states
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDecodingImage, setIsDecodingImage] = useState(false);
  const [decodingProgressMsg, setDecodingProgressMsg] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const imageFileInputRef = useRef(null);
  
  /**
   * Unified Scanner Lifecycle State:
   * 'idle' -> 'requesting_permission' -> 'starting_camera' -> 'scanning' -> 
   * 'detected' -> 'looking_up' -> 'product_found' | 'product_not_found' | 'error'
   */
  const [scannerStatus, setScannerStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Real-time hardware diagnostics telemetry
  const [streamTelemetry, setStreamTelemetry] = useState({
    streamActive: false,
    trackLabel: '',
    trackReadyState: 'idle',
    videoReadyState: 0,
    videoWidth: 0,
    videoHeight: 0,
  });
  const [framesScanned, setFramesScanned] = useState(0);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticsLog, setDiagnosticsLog] = useState([]);
  
  // Result payload & product lookup states
  const [scannedRaw, setScannedRaw] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  // Native DOM & Hardware References (Single Stream, Single Loop, Single Lifecycle)
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const controlsRef = useRef(null);
  const codeReaderRef = useRef(null);
  const framesCountRef = useRef(0);
  const isProcessingRef = useRef(false);
  const sessionTokenRef = useRef(0);

  // Append timestamped log entry to diagnostics
  const logDiag = useCallback((msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    console.log(`[QRScanner ${timestamp}] [${type.toUpperCase()}] ${msg}`);
    setDiagnosticsLog(prev => [{ time: timestamp, msg, type }, ...prev.slice(0, 24)]);
  }, []);

  // Safe teardown of active stream and @zxing/browser scanner controls
  const stopScanning = useCallback(() => {
    logDiag('Stopping camera stream and scanner loop...');
    
    // Stop @zxing/browser scanner controls (stops tracks + clears canvas)
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (e) {
        console.warn('Controls stop error:', e);
      }
      controlsRef.current = null;
    }

    // Direct fallback track termination
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(t => {
          t.stop();
          logDiag(`Stopped track: ${t.label}`);
        });
      } catch (e) {}
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (e) {}
    }

    setStreamTelemetry(prev => ({
      ...prev,
      streamActive: false,
      trackReadyState: 'ended',
      videoReadyState: 0,
    }));
  }, [logDiag]);

  /**
   * CENTRAL RESULT EVENT HANDLER:
   * 1. Rejects empty payloads.
   * 2. Prevents duplicate callbacks via atomic ref guard.
   * 3. Uses structured parser to extract exact product_code and metadata.
   * 4. Searches PostgreSQL inventory using product_code ONLY (never the entire raw string).
   * 5. Displays separated sections for Product ID, Jewellery Specs, and Provenance.
   */
  const handleQrDetected = useCallback(async (rawString, source = 'Webcam QR Scanner') => {
    if (!rawString || typeof rawString !== 'string') return;
    const cleanString = rawString.trim();
    if (!cleanString) return;

    if (isProcessingRef.current) {
      logDiag(`Ignored duplicate QR trigger: "${cleanString.substring(0, 30)}..."`, 'warn');
      return;
    }
    isProcessingRef.current = true;

    logDiag(`REAL QR PAYLOAD DETECTED via [${source}]: "${cleanString.substring(0, 45)}..."`, 'success');
    
    // 1. Immediately transition to 'detected' and halt camera stream
    setScannerStatus('detected');
    setScannedRaw(cleanString);
    stopScanning();

    // 2. Parse jewellery tag structure with dedicated service
    const parseRes = parseJewelleryTagQR(cleanString);
    const tagData = parseRes.data;
    setParsedData(tagData);
    
    const targetCode = (tagData.product_code || tagData.sku || '').trim();
    logDiag(`Parsed Tag: Format=${tagData.format}, Code="${targetCode}", Desc="${tagData.description || '—'}", Weight=${tagData.gross_weight || '—'}, Rate=${tagData.rate || '—'}, AC=${tagData.additional_charge || '—'}`);

    if (!targetCode) {
      logDiag('Could not extract valid product code from tag.', 'error');
      setErrorMessage('Could not extract a valid product code from the scanned tag.');
      setScannerStatus('error');
      isProcessingRef.current = false;
      return;
    }

    // 3. Transition to 'looking_up' and query PostgreSQL by extracted product code
    setScannerStatus('looking_up');
    logDiag(`Searching PostgreSQL via productsClient for product code: "${targetCode}"...`);

    let existing = null;
    try {
      existing = await productsClient.getProduct(targetCode);
    } catch (apiErr) {
      console.warn('API lookup error:', apiErr);
      logDiag(`API lookup warning: ${apiErr.message}`, 'warn');
    }

    if (existing) {
      logDiag(`MATCH FOUND IN POSTGRESQL: "${existing.name}" (${existing.sku})`, 'success');
      setMatchedProduct(existing);
      setScannerStatus('product_found');
    } else {
      logDiag(`NO MATCH IN DATABASE: Product code "${targetCode}" is ready for new registration.`, 'info');
      setMatchedProduct(null);
      setScannerStatus('product_not_found');
    }

    // 4. Pass result to parent callback
    if (typeof onScanSuccess === 'function') {
      try {
        onScanSuccess(tagData, cleanString, existing);
      } catch (parentErr) {
        console.error('Error invoking onScanSuccess in parent:', parentErr);
      }
    }
  }, [stopScanning, logDiag, onScanSuccess]);

  // Enumerate connected video input devices
  const enumerateCameras = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      logDiag(`EnumerateDevices: found ${videoDevices.length} camera(s).`);
      setCameras(videoDevices);

      // Select USB / external webcam if available, else first device
      if (videoDevices.length > 0 && !selectedCameraId) {
        const usbWebcam = videoDevices.find(d => /usb|uvc|external|webcam/i.test(d.label));
        const backCamera = videoDevices.find(d => /back|rear|environment/i.test(d.label));
        const defaultChoice = usbWebcam ? usbWebcam.deviceId : (backCamera ? backCamera.deviceId : videoDevices[0].deviceId);
        setSelectedCameraId(defaultChoice);
        return defaultChoice;
      }
      return selectedCameraId;
    } catch (e) {
      logDiag(`Failed to enumerate cameras: ${e.message}`, 'error');
      return null;
    }
  }, [selectedCameraId, logDiag]);

  /**
   * START CAMERA STREAM & @zxing/browser SCANNING PIPELINE:
   * State sequence: idle -> requesting_permission -> starting_camera -> scanning
   */
  const startCamera = useCallback(async (targetDeviceId = null) => {
    const currentSession = ++sessionTokenRef.current;
    stopScanning();

    setErrorMessage(null);
    setScannerStatus('requesting_permission');
    framesCountRef.current = 0;
    setFramesScanned(0);
    isProcessingRef.current = false;

    logDiag(`Requesting camera permission (Target Device: ${targetDeviceId || 'Default'})...`);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = 'Camera API (navigator.mediaDevices.getUserMedia) not supported in this browser.';
      logDiag(err, 'error');
      setErrorMessage(err);
      setScannerStatus('error');
      return;
    }

    try {
      // 1. Resilient getUserMedia constraints (exact -> relaxed -> basic fallback)
      let stream = null;
      let usedConstraints = null;

      try {
        usedConstraints = targetDeviceId 
          ? { audio: false, video: { deviceId: { exact: targetDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } }
          : { audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } };
        logDiag(`getUserMedia Attempt 1: ${JSON.stringify(usedConstraints.video)}`);
        stream = await navigator.mediaDevices.getUserMedia(usedConstraints);
      } catch (err1) {
        logDiag(`Attempt 1 failed (${err1.name}: ${err1.message}). Retrying with relaxed constraints...`, 'warn');
        try {
          usedConstraints = { audio: false, video: targetDeviceId ? { deviceId: targetDeviceId } : true };
          stream = await navigator.mediaDevices.getUserMedia(usedConstraints);
        } catch (err2) {
          logDiag(`Attempt 2 failed (${err2.name}). Final fallback to { video: true }...`, 'warn');
          stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        }
      }

      // Check if another session was requested during async call
      if (sessionTokenRef.current !== currentSession) {
        logDiag('Camera session cancelled by newer request. Terminating stream.');
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      if (!stream || stream.getVideoTracks().length === 0) {
        throw new Error('MediaStream was returned without any active video tracks.');
      }

      streamRef.current = stream;
      const activeTrack = stream.getVideoTracks()[0];
      const settings = activeTrack.getSettings ? activeTrack.getSettings() : {};

      logDiag(`MediaStream acquired: "${activeTrack.label}" (${settings.width || 'auto'}x${settings.height || 'auto'}), track readyState: "${activeTrack.readyState}"`, 'success');

      // 2. Attach to native video element
      setScannerStatus('starting_camera');
      const video = videoRef.current;
      if (!video) {
        logDiag('Video DOM ref is not mounted.', 'error');
        return;
      }

      // Prepare video element for Chromium autoplay
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      // 3. Initialize single @zxing/browser BrowserQRCodeReader
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserQRCodeReader(zxingHints, {
          delayBetweenScanAttempts: 100, // 10 scans/second for fast detection
          delayBetweenScanSuccess: 500,
          tryPlayVideoTimeout: 8000
        });
      }

      logDiag('Initializing @zxing/browser decodeFromStream pipeline...');

      // Single scanning loop + single callback
      const controls = await codeReaderRef.current.decodeFromStream(
        stream,
        video,
        (result, error, ctrls) => {
          // Increment frame counter on every scan attempt
          framesCountRef.current += 1;
          if (framesCountRef.current % 10 === 0) {
            setFramesScanned(framesCountRef.current);
          }

          // Real QR Detected!
          if (result && result.getText && !isProcessingRef.current) {
            const decoded = result.getText();
            if (decoded && decoded.trim().length > 0) {
              handleQrDetected(decoded, '@zxing/browser Decoder');
            }
          }
        }
      );

      controlsRef.current = controls;

      // Update telemetry
      const updateTelemetry = () => {
        if (!video) return;
        setStreamTelemetry({
          streamActive: !!stream && stream.active,
          trackLabel: activeTrack.label || 'Camera',
          trackReadyState: activeTrack.readyState,
          videoReadyState: video.readyState,
          videoWidth: video.videoWidth || 0,
          videoHeight: video.videoHeight || 0
        });
      };

      updateTelemetry();
      video.addEventListener('loadedmetadata', updateTelemetry, { once: true });
      video.addEventListener('play', updateTelemetry, { once: true });

      // State is now strictly 'scanning'
      setScannerStatus('scanning');
      logDiag('Scanner status: SCANNING (camera preview live, frames being decoded).', 'success');

      // Re-enumerate to get friendly labels once permission is granted
      enumerateCameras();

    } catch (err) {
      logDiag(`Camera initialization error: ${err.name} - ${err.message}`, 'error');
      let friendlyMsg = `Camera Error: ${err.message}`;
      if (err.name === 'NotAllowedError' || String(err).includes('Permission denied')) {
        friendlyMsg = 'Camera access was denied. Please allow camera permissions in your browser address bar.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyMsg = 'No camera found. Please connect your USB webcam or use manual tag input.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        friendlyMsg = 'Camera is already in use by another application. Please close other camera programs.';
      } else if (err.name === 'OverconstrainedError') {
        friendlyMsg = 'The requested camera constraints are not supported. Try another camera.';
      }
      setErrorMessage(friendlyMsg);
      setScannerStatus('error');
    }
  }, [stopScanning, enumerateCameras, handleQrDetected, logDiag]);

  // Clean up uploaded object URLs to prevent memory leaks
  const cleanupImageUrl = useCallback(() => {
    if (imagePreviewUrl) {
      try {
        URL.revokeObjectURL(imagePreviewUrl);
      } catch {}
      setImagePreviewUrl(null);
    }
  }, [imagePreviewUrl]);

  // Modal open / close lifecycle
  useEffect(() => {
    if (!isOpen) {
      stopScanning();
      setScannerStatus('idle');
      setErrorMessage(null);
      setUploadError(null);
      setIsDecodingImage(false);
      setDecodingProgressMsg('');
      setSelectedImageFile(null);
      cleanupImageUrl();
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
      isProcessingRef.current = false;
      return;
    }

    // When modal opens in camera mode, start camera stream
    if (activeTab === 'camera' && scannerStatus === 'idle') {
      enumerateCameras().then((chosenId) => {
        startCamera(chosenId || selectedCameraId || null);
      });
    }

    return () => {
      stopScanning();
      cleanupImageUrl();
    };
  }, [isOpen, activeTab, cleanupImageUrl]);

  // Support USB Hardware Barcode/QR Scanners operating as HID Keyboard Wedge
  useEffect(() => {
    if (!isOpen || scannerStatus === 'product_found' || scannerStatus === 'product_not_found') return;

    let scanBuffer = '';
    let lastCharTime = 0;

    const handleKeyDown = (e) => {
      // Ignore if user is intentionally typing in manual input textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const now = Date.now();
      const diff = now - lastCharTime;
      lastCharTime = now;

      // Barcode scanners type rapidly (< 50ms per key) ending with Enter or Tab
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (scanBuffer.length >= 3) {
          e.preventDefault();
          e.stopPropagation();
          const wedgeInput = scanBuffer.trim();
          scanBuffer = '';
          logDiag(`USB Keyboard Scanner captured payload: "${wedgeInput}"`, 'success');
          handleQrDetected(wedgeInput, 'USB Handheld Scanner (HID Wedge)');
        }
      } else if (e.key.length === 1) {
        if (diff < 65 || scanBuffer.length === 0) {
          scanBuffer += e.key;
        } else {
          scanBuffer = e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, scannerStatus, handleQrDetected, logDiag]);

  // Switch camera selection from dropdown
  const handleCameraChange = (e) => {
    const nextId = e.target.value;
    setSelectedCameraId(nextId);
    logDiag(`User selected camera: ${nextId}`);
    startCamera(nextId);
  };

  // Upload QR Image: File selection and validation
  const handleFileSelected = (file) => {
    setUploadError(null);
    setErrorMessage(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      logDiag(`File validation rejected: ${validation.error}`, 'warn');
      return;
    }

    cleanupImageUrl();
    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    logDiag(`Valid tag image loaded: "${file.name}" (${formatFileSize(file.size)}, ${file.type || 'unknown'})`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleRemoveImage = () => {
    cleanupImageUrl();
    setSelectedImageFile(null);
    setUploadError(null);
    if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    logDiag('User removed uploaded image.');
  };

  // Upload QR Image: Trigger multi-tier QR decoder pipeline
  const handleDecodeImage = async () => {
    if (!selectedImageFile || !imagePreviewUrl) {
      setUploadError('Please select or upload a jewellery tag photograph first.');
      return;
    }

    setIsDecodingImage(true);
    setUploadError(null);
    setErrorMessage(null);
    setDecodingProgressMsg('Analyzing jewellery tag photograph...');
    logDiag(`Initiating browser-side QR decode on "${selectedImageFile.name}"...`);

    try {
      const result = await decodeQRFromImage(imagePreviewUrl, (progress) => {
        setDecodingProgressMsg(progress);
        logDiag(`Image decoder: ${progress}`);
      });

      if (result.success && result.text) {
        logDiag(`QR successfully decoded from image via [${result.method}]: "${result.text}"`, 'success');
        // Unify with Centralized QR Handler
        await handleQrDetected(result.text, `Uploaded Image (${result.method})`);
      } else {
        const errorMsg = result.error || 'No readable QR code found in this image. Try another photo with clearer focus or lighting.';
        logDiag(`Image decoding failed: ${errorMsg}`, 'warn');
        setUploadError(errorMsg);
      }
    } catch (err) {
      console.error('Image decoding exception:', err);
      logDiag(`Image decoding exception: ${err.message}`, 'error');
      setUploadError(err.message || 'Unable to decode QR code from the selected image.');
    } finally {
      setIsDecodingImage(false);
      setDecodingProgressMsg('');
    }
  };

  // Manual Tag Input Submission
  const handleManualSubmit = (e) => {
    e?.preventDefault();
    if (!manualInput.trim()) return;
    handleQrDetected(manualInput.trim(), 'Manual Tag Input');
  };

  // Fresh Scan Session action
  const handleScanAgain = () => {
    logDiag('User clicked "Scan Another". Initializing fresh scanning session...');
    isProcessingRef.current = false;
    setScannedRaw(null);
    setParsedData(null);
    setMatchedProduct(null);
    setErrorMessage(null);
    setUploadError(null);
    setManualInput('');
    setIsRawExpanded(false);
    if (activeTab === 'camera') {
      startCamera(selectedCameraId);
    } else {
      setScannerStatus('idle');
    }
  };

  // Close modal and focus on filled form
  const handleConfirmAndClose = () => {
    stopScanning();
    cleanupImageUrl();
    onClose();
  };

  if (!isOpen) return null;

  const isScanningActive = scannerStatus === 'scanning';
  const isResultReady = scannerStatus === 'product_found' || scannerStatus === 'product_not_found';
  const productCodeDisplay = parsedData?.product_code || parsedData?.sku || 'UNKNOWN';

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-admin-body flex flex-col max-h-[92vh] min-w-0">
        
        {/* Modal Header */}
        <div className="bg-[#35151B] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#C49A45]/20 border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] flex-shrink-0">
              <ScanQrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-admin-heading font-semibold text-[17px] text-white leading-tight truncate">
                Jewellery Tag QR Scanner
              </h3>
              <p className="text-[11.5px] text-[#E8DCBE]/80 truncate">
                Webcam, USB Handheld Scanner &amp; Tag Data Extraction
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (Camera vs Upload vs Manual) */}
        {!isResultReady && (
          <div className="flex items-center border-b border-[#EDE8E1] bg-[#FCFBF9] px-4 pt-2 flex-shrink-0 min-w-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('camera');
                setErrorMessage(null);
                setUploadError(null);
                startCamera(selectedCameraId);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium border-b-2 transition -mb-[1px] cursor-pointer ${
                activeTab === 'camera'
                  ? 'border-[#8D6725] text-[#8D6725] font-semibold'
                  : 'border-transparent text-[#736B63] hover:text-[#292521]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera Scanner</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                stopScanning();
                setScannerStatus('idle');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium border-b-2 transition -mb-[1px] cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-[#8D6725] text-[#8D6725] font-semibold'
                  : 'border-transparent text-[#736B63] hover:text-[#292521]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload QR Image</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('manual');
                stopScanning();
                setScannerStatus('idle');
                setErrorMessage(null);
                setUploadError(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium border-b-2 transition -mb-[1px] cursor-pointer ${
                activeTab === 'manual'
                  ? 'border-[#8D6725] text-[#8D6725] font-semibold'
                  : 'border-transparent text-[#736B63] hover:text-[#292521]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Manual Tag Input</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 min-w-0 max-w-full">
          
          {/* ================= STAGE 1: LOOKING UP SPINNER ================= */}
          {scannerStatus === 'looking_up' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in min-w-0">
              <Loader2 className="w-10 h-10 animate-spin text-[#8D6725]" />
              <h4 className="text-[15px] font-semibold text-[#292521]">
                Querying PostgreSQL Inventory...
              </h4>
              <p className="text-[12px] text-[#736B63] max-w-xs break-words">
                Checking existing database catalogue for product code <span className="font-admin-mono font-bold text-[#8D6725] break-all">{productCodeDisplay}</span>
              </p>
              {scannedRaw && (
                <div className="mt-2 text-[11px] font-admin-mono bg-[#FAF7F2] border border-[#E2DCD2] px-3 py-1.5 rounded-lg text-[#5C1D27] break-all max-w-full overflow-hidden">
                  {scannedRaw.length > 80 ? `${scannedRaw.substring(0, 80)}...` : scannedRaw}
                </div>
              )}
            </div>
          )}

          {/* ================= STAGE 2: PRODUCT FOUND IN POSTGRESQL ================= */}
          {scannerStatus === 'product_found' && matchedProduct && (
            <div className="space-y-4 animate-in fade-in duration-200 min-w-0 max-w-full">
              {/* Match Banner */}
              <div className="bg-[#EBF7EE] border border-[#BCE6C6] rounded-xl p-3 flex items-start gap-2.5 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13.5px] font-semibold text-[#1B5E20]">
                    Existing Product Matched in Database
                  </h4>
                  <p className="text-[12px] text-[#2E7D32] mt-0.5 break-words">
                    Found record for <strong>{matchedProduct.name}</strong> ({matchedProduct.sku}).
                  </p>
                </div>
              </div>

              {/* SECTION 1: PRODUCT IDENTIFICATION */}
              <div className="bg-[#FAF7F2] border border-[#E2DCD2] rounded-xl p-3.5 space-y-3 shadow-2xs min-w-0 max-w-full">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2DCD2] gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Tag className="w-4 h-4 text-[#8D6725] flex-shrink-0" />
                    <span className="text-[11.5px] font-bold text-[#736B63] uppercase tracking-wider truncate">
                      Matched Product Code
                    </span>
                  </div>
                  <span className="font-admin-mono font-bold text-[14px] px-2.5 py-0.5 rounded bg-[#8D6725]/10 text-[#78551B] border border-[#8D6725]/30 break-all max-w-[200px] text-right truncate">
                    {matchedProduct.sku}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] min-w-0">
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium uppercase">Product Name</span>
                    <strong className="text-[#292521] text-[13px] block truncate">{matchedProduct.name || '—'}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium uppercase">Category</span>
                    <strong className="text-[#292521] text-[13px] block truncate">{matchedProduct.category || 'Jewellery'}</strong>
                  </div>
                </div>
              </div>

              {/* SECTION 2: JEWELLERY DETAILS & COMPARISON */}
              <div className="bg-[#FAF7F2] border border-[#E2DCD2] rounded-xl p-3.5 space-y-3 shadow-2xs min-w-0 max-w-full">
                <div className="flex items-center gap-1.5 pb-2 border-b border-[#E2DCD2]">
                  <Layers className="w-4 h-4 text-[#8D6725] flex-shrink-0" />
                  <span className="text-[11.5px] font-bold text-[#736B63] uppercase tracking-wider">
                    Jewellery Specs &amp; Tag Comparison
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[12px] min-w-0">
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">System Price</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      ₹ {Number(matchedProduct.numericPrice || matchedProduct.price || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Tag Gross Weight</span>
                    <strong className="text-[#292521] text-[13px] flex items-center gap-1 truncate">
                      <Scale className="w-3 h-3 text-[#8D6725] flex-shrink-0" />
                      {parsedData?.gross_weight || 'Not available in QR'}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Purity</span>
                    <strong className="text-[#292521] text-[13px] flex items-center gap-1 truncate">
                      <Gem className="w-3 h-3 text-[#8D6725] flex-shrink-0" />
                      {parsedData?.purity || matchedProduct.purity || 'Not available in QR'}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Tag Rate</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.rate ? formatCurrency(parsedData.rate) : 'Not available in QR'}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Additional Charge</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.additional_charge || 'Not available in QR'}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Brand / Marking</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.brand || 'Not available in QR'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SOURCE INFORMATION & RAW PAYLOAD */}
              <div className="bg-white border border-[#E2DCD2] rounded-xl p-3 space-y-2 text-[11.5px] min-w-0 max-w-full">
                <div className="flex items-center justify-between text-[#736B63]">
                  <span className="font-semibold text-[#4A423A] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8D6725]" />
                    <span>Source Information</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E2DCD2] text-[10.5px] font-mono text-[#78551B]">
                    Format: {parsedData?.format || 'QR Tag'}
                  </span>
                </div>
                
                {/* Collapsible Raw Payload Container */}
                <div className="mt-2 pt-2 border-t border-[#EDE8E1] min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[#736B63] text-[11px] font-medium">Raw Scanned Payload:</span>
                    <button
                      type="button"
                      onClick={() => setIsRawExpanded(prev => !prev)}
                      className="text-[11px] text-[#8D6725] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isRawExpanded ? 'Collapse' : 'Expand full string'}</span>
                      {isRawExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  
                  <div className="mt-1 bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE8E1] font-admin-mono text-[11px] text-[#5C1D27] break-all max-w-full overflow-x-auto select-all">
                    {isRawExpanded 
                      ? scannedRaw 
                      : (scannedRaw?.length > 75 ? `${scannedRaw.substring(0, 75)}...` : scannedRaw)}
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-[#F7F0E1] border border-[#E8DCBE] p-3 rounded-xl text-[#78551B] text-[12px] leading-relaxed flex items-start gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-[#8D6725] flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  Click <strong>Apply &amp; Edit Product</strong> to verify and update specs in the Edit Product form.
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: NEW PRODUCT REGISTRATION ================= */}
          {scannerStatus === 'product_not_found' && (
            <div className="space-y-4 animate-in fade-in duration-200 min-w-0 max-w-full">
              {/* New Product Banner */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3 flex items-start gap-2.5 min-w-0">
                <PackagePlus className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13.5px] font-semibold text-[#1D4ED8]">
                    New Jewellery Tag Decoded
                  </h4>
                  <p className="text-[12px] text-[#2563EB] mt-0.5 break-words">
                    Product code <strong className="font-admin-mono">{productCodeDisplay}</strong> is not yet in catalogue.
                  </p>
                </div>
              </div>

              {/* SECTION 1: PRODUCT IDENTIFICATION */}
              <div className="bg-[#FAF7F2] border border-[#E2DCD2] rounded-xl p-3.5 space-y-3 shadow-2xs min-w-0 max-w-full">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2DCD2] gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Tag className="w-4 h-4 text-[#8D6725] flex-shrink-0" />
                    <span className="text-[11.5px] font-bold text-[#736B63] uppercase tracking-wider truncate">
                      Extracted Product Code
                    </span>
                  </div>
                  <span className="font-admin-mono font-bold text-[14px] px-2.5 py-0.5 rounded bg-[#8D6725]/10 text-[#78551B] border border-[#8D6725]/30 break-all max-w-[200px] text-right truncate">
                    {productCodeDisplay}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] min-w-0">
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium uppercase">Description / Name</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.description || 'Not available in QR'}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium uppercase">Catalogue Category</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.category || 'Not available in QR'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECTION 2: JEWELLERY DETAILS */}
              <div className="bg-[#FAF7F2] border border-[#E2DCD2] rounded-xl p-3.5 space-y-3 shadow-2xs min-w-0 max-w-full">
                <div className="flex items-center gap-1.5 pb-2 border-b border-[#E2DCD2]">
                  <Layers className="w-4 h-4 text-[#8D6725] flex-shrink-0" />
                  <span className="text-[11.5px] font-bold text-[#736B63] uppercase tracking-wider">
                    Extracted Jewellery Specs
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[12px] min-w-0">
                  {/* Gross Weight */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Tag Gross Weight</span>
                    <strong className="text-[#292521] text-[13px] flex items-center gap-1 truncate">
                      <Scale className="w-3 h-3 text-[#8D6725] flex-shrink-0" />
                      {parsedData?.gross_weight || 'Not available in QR'}
                    </strong>
                  </div>

                  {/* Net Weight */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Net Weight</span>
                    <strong className="text-[#292521] text-[13px] flex items-center gap-1 truncate">
                      <Scale className="w-3 h-3 text-[#8D6725] flex-shrink-0" />
                      {parsedData?.net_weight || parsedData?.gross_weight || 'Not available in QR'}
                    </strong>
                  </div>

                  {/* Purity */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Purity / Fineness</span>
                    <strong className="text-[#292521] text-[13px] flex items-center gap-1 truncate">
                      <Gem className="w-3 h-3 text-[#8D6725] flex-shrink-0" />
                      {parsedData?.purity || 'Not available in QR'}
                    </strong>
                  </div>

                  {/* Tag Rate */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Tag Rate / Price</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.rate ? formatCurrency(parsedData.rate) : 'Not available in QR'}
                    </strong>
                  </div>

                  {/* Additional Charge */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Additional Charge</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.additional_charge || 'Not available in QR'}
                    </strong>
                  </div>

                  {/* Brand / Marking */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#EDE8E1] min-w-0">
                    <span className="text-[#736B63] block text-[10.5px] font-medium">Brand / Marking</span>
                    <strong className="text-[#292521] text-[13px] block truncate">
                      {parsedData?.brand || 'Not available in QR'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SOURCE INFORMATION & RAW PAYLOAD */}
              <div className="bg-white border border-[#E2DCD2] rounded-xl p-3 space-y-2 text-[11.5px] min-w-0 max-w-full">
                <div className="flex items-center justify-between text-[#736B63]">
                  <span className="font-semibold text-[#4A423A] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8D6725]" />
                    <span>Source Information</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E2DCD2] text-[10.5px] font-mono text-[#78551B]">
                    Format: {parsedData?.format || 'QR Tag'}
                  </span>
                </div>
                
                {/* Collapsible Raw Payload Container */}
                <div className="mt-2 pt-2 border-t border-[#EDE8E1] min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[#736B63] text-[11px] font-medium">Raw Decoded Payload:</span>
                    <button
                      type="button"
                      onClick={() => setIsRawExpanded(prev => !prev)}
                      className="text-[11px] text-[#8D6725] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isRawExpanded ? 'Collapse' : 'Expand full string'}</span>
                      {isRawExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  
                  <div className="mt-1 bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE8E1] font-admin-mono text-[11px] text-[#5C1D27] break-all max-w-full overflow-x-auto select-all">
                    {isRawExpanded 
                      ? scannedRaw 
                      : (scannedRaw?.length > 75 ? `${scannedRaw.substring(0, 75)}...` : scannedRaw)}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[#FAF7F2] border border-[#E2DCD2] p-3 rounded-xl text-[#78551B] text-[12px] leading-relaxed flex items-start gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[#8D6725] flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  Click <strong>Add to Inventory</strong> to open the product registration form populated with these verified values.
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 4: LIVE CAMERA SCANNER VIEW ================= */}
          {!isResultReady && scannerStatus !== 'looking_up' && (
            <>
              {activeTab === 'camera' && (
                <div className="space-y-3 min-w-0">
                  {/* Camera selector if multiple cameras available */}
                  {cameras.length > 1 && (
                    <div className="flex items-center justify-between text-[12.5px] pb-1 min-w-0">
                      <label className="text-[#4A423A] font-medium flex items-center gap-1.5 truncate">
                        <Camera className="w-3.5 h-3.5 text-[#8D6725] flex-shrink-0" />
                        <span>Select Camera:</span>
                      </label>
                      <select
                        value={selectedCameraId}
                        onChange={handleCameraChange}
                        className="bg-[#FFFFFF] border border-[#E2DCD2] rounded-lg px-2.5 py-1 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#8D6725] cursor-pointer max-w-[200px] truncate"
                      >
                        {cameras.map((c) => (
                          <option key={c.deviceId} value={c.deviceId}>
                            {c.label || `Camera ${c.deviceId.substring(0, 6)}...`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Camera Error Message */}
                  {errorMessage && (
                    <div className="bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl p-3 text-[#9B1C1C] text-[12.5px] flex items-start gap-2 min-w-0">
                      <CameraOff className="w-4 h-4 text-[#C24141] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">Camera Access Error</p>
                        <p className="text-[12px] mt-0.5 leading-relaxed break-words">{errorMessage}</p>
                        <div className="mt-2.5 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startCamera(selectedCameraId)}
                            className="text-[12px] font-semibold text-[#8D6725] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Retry Camera
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              stopScanning();
                              setActiveTab('upload');
                              setErrorMessage(null);
                            }}
                            className="text-[12px] font-semibold text-[#8D6725] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" /> Upload tag photo
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              stopScanning();
                              setActiveTab('manual');
                              setErrorMessage(null);
                            }}
                            className="text-[12px] font-semibold text-[#8D6725] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            Manual input <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Viewport Container */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-[#1A1817] aspect-square flex items-center justify-center border border-[#3A3530] shadow-inner">
                    {/* Native Video Element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Viewfinder Gold Reticle Overlay */}
                    {isScanningActive && !errorMessage && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                        <div className="w-[68%] h-[68%] border-2 border-dashed border-[#C49A45] rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                          {/* Corner brackets */}
                          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#C49A45]" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#C49A45]" />
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#C49A45]" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#C49A45]" />
                        </div>
                        <p className="text-white text-[11.5px] font-medium tracking-wide mt-4 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
                          Align Jewellery Tag QR Code inside frame
                        </p>
                      </div>
                    )}

                    {/* Permission Requesting / Starting Camera Overlay */}
                    {(scannerStatus === 'requesting_permission' || scannerStatus === 'starting_camera') && (
                      <div className="absolute inset-0 bg-[#1A1817]/90 flex flex-col items-center justify-center text-white gap-2 z-10">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#C49A45]" />
                        <span className="text-[12.5px] text-[#E8DCBE]">
                          {scannerStatus === 'requesting_permission' ? 'Requesting camera access...' : 'Starting camera stream...'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status & Telemetry Bar */}
                  <div className="flex items-center justify-between text-[11.5px] text-[#736B63] px-1 min-w-0">
                    <span className="flex items-center gap-1.5 truncate">
                      {isScanningActive ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse flex-shrink-0" />
                          <span className="text-[#2E7D32] font-medium truncate">
                            Live {streamTelemetry.videoWidth ? `(${streamTelemetry.videoWidth}x${streamTelemetry.videoHeight})` : ''} • Scanning ({framesScanned} frames)
                          </span>
                        </>
                      ) : (
                        <span className="truncate">
                          {scannerStatus === 'requesting_permission' && 'Requesting camera access...'}
                          {scannerStatus === 'starting_camera' && 'Starting camera stream...'}
                          {scannerStatus === 'idle' && 'Camera idle'}
                          {scannerStatus === 'error' && 'Camera halted due to error'}
                        </span>
                      )}
                    </span>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowDiagnostics(prev => !prev)}
                        className="text-[#736B63] hover:text-[#292521] flex items-center gap-1 font-medium cursor-pointer"
                        title="Toggle live diagnostics telemetry"
                      >
                        <Activity className="w-3 h-3 text-[#8D6725]" />
                        <span>Diagnostics</span>
                        {showDiagnostics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => startCamera(selectedCameraId)}
                        className="text-[#8D6725] hover:underline flex items-center gap-1 font-medium cursor-pointer ml-1"
                        title="Restart camera"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restart</span>
                      </button>
                    </div>
                  </div>

                  {/* USB Scanner Notice */}
                  <div className="bg-[#FAF7F2] border border-[#E2DCD2] rounded-lg px-3 py-1.5 text-[11px] text-[#78551B] flex items-center justify-between min-w-0">
                    <span className="flex items-center gap-1.5 truncate">
                      <Keyboard className="w-3.5 h-3.5 text-[#8D6725] flex-shrink-0" />
                      <span className="truncate">USB Handheld Barcode/QR Scanners supported (point &amp; trigger anytime).</span>
                    </span>
                  </div>

                  {/* Hardware Diagnostics Telemetry Panel */}
                  {showDiagnostics && (
                    <div className="bg-[#1A1817] text-white p-3 rounded-xl text-[11px] font-admin-mono space-y-1.5 border border-[#3A3530] shadow-inner min-w-0 max-w-full">
                      <div className="flex items-center justify-between border-b border-[#3A3530] pb-1 min-w-0">
                        <span className="text-[#C49A45] font-bold truncate">Hardware &amp; Stream Diagnostics</span>
                        <span className="text-gray-400 flex-shrink-0">Lifecycle: {scannerStatus}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-gray-300 min-w-0">
                        <div className="truncate">
                          <span className="text-gray-400">Camera: </span>
                          {streamTelemetry.trackLabel || cameras.find(c => c.deviceId === selectedCameraId)?.label || 'USB / Default'}
                        </div>
                        <div className="truncate">
                          <span className="text-gray-400">Stream: </span>
                          {streamTelemetry.streamActive ? 'Active' : 'Inactive'} (ReadyState: {streamTelemetry.videoReadyState})
                        </div>
                        <div className="truncate">
                          <span className="text-gray-400">Dimensions: </span>
                          {streamTelemetry.videoWidth} x {streamTelemetry.videoHeight}
                        </div>
                        <div className="truncate">
                          <span className="text-gray-400">Frames Scanned: </span>
                          {framesScanned}
                        </div>
                        <div className="col-span-2 truncate">
                          <span className="text-gray-400">Primary Decoder: </span>
                          @zxing/browser (BrowserQRCodeReader)
                        </div>
                      </div>
                      {diagnosticsLog.length > 0 && (
                        <div className="mt-2 pt-1 border-t border-[#3A3530] max-h-24 overflow-y-auto space-y-0.5 text-[10px] break-all">
                          {diagnosticsLog.slice(0, 6).map((log, i) => (
                            <div key={i} className={log.type === 'error' ? 'text-red-400' : (log.type === 'success' ? 'text-green-400' : (log.type === 'warn' ? 'text-amber-400' : 'text-gray-300'))}>
                              [{log.time}] {log.msg}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* ================= UPLOAD QR IMAGE VIEW ================= */}
              {activeTab === 'upload' && (
                <div className="space-y-3 min-w-0">
                  <input
                    type="file"
                    ref={imageFileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                  />

                  {/* Upload Error Banner */}
                  {uploadError && (
                    <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 text-[#991B1B] text-[12.5px] min-w-0 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#DC2626]" />
                      <div className="flex-1 min-w-0">
                        <strong className="block font-semibold">Image Processing Issue</strong>
                        <span className="break-words">{uploadError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadError(null)}
                        className="text-[#991B1B] hover:text-[#7F1D1D] p-0.5 cursor-pointer flex-shrink-0"
                        aria-label="Dismiss error"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {!imagePreviewUrl ? (
                    /* Dropzone when no image is selected */
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => imageFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-150 min-w-0 ${
                        isDragging
                          ? 'border-[#8D6725] bg-[#8D6725]/5 scale-[0.99]'
                          : 'border-[#D1C7B7] hover:border-[#8D6725] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#8D6725]/10 flex items-center justify-center text-[#8D6725]">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#292521] mb-1">
                        Drag and drop jewellery tag photograph here
                      </h4>
                      <p className="text-[12px] text-[#736B63] mb-3">
                        or click Browse Image to select from your device
                      </p>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-white border border-[#E2DCD2] text-[#8D6725] hover:bg-[#FDFBF7] text-[12.5px] font-semibold shadow-2xs inline-flex items-center gap-1.5 cursor-pointer pointer-events-none"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Browse Image</span>
                      </button>
                      <div className="mt-4 pt-3 border-t border-[#E8DCBE] text-[11px] text-[#8C827A] flex items-center justify-center gap-3">
                        <span>Formats: JPG, JPEG, PNG, WEBP</span>
                        <span>•</span>
                        <span>Max Size: 15 MB</span>
                      </div>
                    </div>
                  ) : (
                    /* Image preview & action container when image is selected */
                    <div className="space-y-3 min-w-0 animate-in fade-in">
                      <div className="relative rounded-2xl border border-[#E2DCD2] bg-[#FAF7F2] p-2 overflow-hidden shadow-2xs flex items-center justify-center min-h-[160px]">
                        <img
                          src={imagePreviewUrl}
                          alt="Jewellery tag preview"
                          className="w-full max-h-64 sm:max-h-72 object-contain mx-auto rounded-xl bg-black/5"
                        />
                        {isDecodingImage && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs rounded-2xl flex flex-col items-center justify-center text-white space-y-2 p-4 text-center animate-in fade-in">
                            <Loader2 className="w-8 h-8 animate-spin text-[#E8DCBE]" />
                            <p className="text-[13px] font-semibold">
                              {decodingProgressMsg || 'Decoding QR Code...'}
                            </p>
                            <p className="text-[11px] text-white/80 max-w-xs">
                              Analyzing tag payload and multi-tier orientation in browser...
                            </p>
                          </div>
                        )}
                      </div>

                      {/* File Details Bar */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#EDE8E1] text-[12px] min-w-0 gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <ImageIcon className="w-4 h-4 text-[#8D6725] flex-shrink-0" />
                          <div className="min-w-0 flex-1 truncate">
                            <span className="font-semibold text-[#292521] truncate block">
                              {selectedImageFile?.name}
                            </span>
                            <span className="text-[11px] text-[#736B63] block">
                              {formatFileSize(selectedImageFile?.size)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            disabled={isDecodingImage}
                            onClick={() => imageFileInputRef.current?.click()}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E2DCD2] text-[#4A423A] hover:bg-[#FAF7F2] text-[11.5px] font-medium transition cursor-pointer disabled:opacity-50"
                          >
                            Choose Another
                          </button>
                          <button
                            type="button"
                            disabled={isDecodingImage}
                            onClick={handleRemoveImage}
                            className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] transition cursor-pointer disabled:opacity-50"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Decode Action Button */}
                      <button
                        type="button"
                        disabled={isDecodingImage}
                        onClick={handleDecodeImage}
                        className="w-full py-2.5 rounded-lg bg-[#8D6725] hover:bg-[#78551B] active:bg-[#684914] text-white text-[13.5px] font-semibold shadow-2xs flex items-center justify-center gap-2 transition duration-150 disabled:opacity-50 cursor-pointer"
                      >
                        {isDecodingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Decoding QR Code...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Decode QR Code</span>
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-[#736B63] text-center leading-relaxed">
                        The QR code is decoded directly in your browser. Rotated and skewed jewellery tags are handled automatically.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ================= MANUAL TAG INPUT VIEW ================= */}
              {activeTab === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-3 min-w-0">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#4A423A] mb-1">
                      Paste or Type Jewellery QR Content / Product SKU *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. 26FPB04F11 or $26FPB04F11$FIXED PRICE BRACELET$1$0.000$0.000$0.000$0$0$3100$5.100$$B+250$$GIFT ARTICLES$$4193"
                      className="w-full bg-[#FFFFFF] border border-[#E2DCD2] rounded-xl p-3 text-[13px] font-admin-mono focus:ring-2 focus:ring-[#8D6725]/30 focus:border-[#8D6725] focus:outline-none placeholder:text-[#9CA3AF]"
                    />
                    <p className="text-[11px] text-[#736B63] mt-1 leading-relaxed">
                      Accepts dollar-delimited ($CODE$DESC$...), pipe-delimited, key-value tags, JSON, or raw product code.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!manualInput.trim()}
                    className="w-full py-2.5 rounded-lg bg-[#8D6725] hover:bg-[#78551B] active:bg-[#684914] text-white text-[13.5px] font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition duration-150 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Decode &amp; Search Database</span>
                  </button>
                </form>
              )}
            </>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#FAF7F2] border-t border-[#EDE8E1] px-5 py-3 flex items-center justify-between flex-shrink-0 min-w-0">
          {isResultReady ? (
            <>
              <button
                type="button"
                onClick={handleScanAgain}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2DCD2] bg-white text-[#736B63] hover:text-[#292521] text-[13px] font-medium transition cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAndClose}
                className="px-5 py-2 rounded-lg bg-[#8D6725] hover:bg-[#78551B] active:bg-[#684914] text-white text-[13.5px] font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer flex-shrink-0 ml-2"
              >
                {scannerStatus === 'product_found' ? (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Apply &amp; Edit Product</span>
                  </>
                ) : (
                  <>
                    <PackagePlus className="w-4 h-4" />
                    <span>Add to Inventory</span>
                  </>
                )}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  stopScanning();
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2DCD2] bg-white text-[#736B63] hover:text-[#292521] text-[13px] font-medium transition cursor-pointer flex-shrink-0"
              >
                Cancel
              </button>
              <span className="text-[11.5px] text-[#736B63] truncate ml-2">
                Vedha Radha Jewellery ERP • QR Inventory
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

/**
 * Dedicated QR Code Image Decoder Service
 * Vedha Radha Thangamaaligai Jewellery ERP
 * 
 * Supports decoding jewellery tag QR codes from uploaded images (JPG, PNG, WEBP).
 * Uses a resilient multi-tier decoding pipeline:
 * 1. Native BarcodeDetector (hardware-accelerated, high skew tolerance)
 * 2. @zxing/browser BrowserQRCodeReader with TRY_HARDER hints
 * 3. jsQR with inversion attempts
 * 4. Image normalization & multi-scale downscaling (prevents browser freezing on large phone photos)
 * 5. Grayscale & contrast enhancement (for glossy jewellery tags with lighting glare)
 * 6. Multi-angle rotations (90°, 180°, 270°)
 */

import { BrowserQRCodeReader } from '@zxing/browser';
import * as zxLib from '@zxing/library';
import jsQR from 'jsqr';

const DecodeHintType = zxLib?.DecodeHintType || { TRY_HARDER: 2 };

// Configure ZXing hints with TRY_HARDER
const zxingHints = new Map();
zxingHints.set(DecodeHintType.TRY_HARDER, true);

// Maximum allowed image file size (15 MB)
export const MAX_IMAGE_FILE_SIZE_BYTES = 15 * 1024 * 1024;

// Allowed image MIME types and extensions
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Format bytes to human readable string (KB / MB)
 */
export function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Validates selected file before decoding
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select a QR code image to upload.' };
  }

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext));
  const hasValidMime = ALLOWED_IMAGE_MIME_TYPES.includes(fileType);

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: 'Unsupported image format. Allowed formats: JPG, JPEG, PNG, WEBP.'
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image exceeds the maximum file size of ${formatFileSize(MAX_IMAGE_FILE_SIZE_BYTES)} (Current: ${formatFileSize(file.size)}).`
    };
  }

  return { valid: true };
}

/**
 * Loads an image source (URL or Blob URL) into an HTMLImageElement
 */
function loadImageElement(sourceUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unable to read image data. The file may be corrupt.'));
    img.src = sourceUrl;
  });
}

/**
 * Creates an offscreen canvas containing a scaled version of the image
 */
function createScaledCanvas(img, maxDimension = 1400) {
  let { naturalWidth: width, naturalHeight: height } = img;
  if (!width || !height) {
    width = img.width || 800;
    height = img.height || 600;
  }

  let scale = 1;
  const longestEdge = Math.max(width, height);
  if (longestEdge > maxDimension) {
    scale = maxDimension / longestEdge;
  }

  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return { canvas, ctx, width: targetWidth, height: targetHeight };
}

/**
 * Rotates an offscreen canvas by 90, 180, or 270 degrees
 */
function createRotatedCanvas(sourceCanvas, angleDegrees) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const angleRad = (angleDegrees * Math.PI) / 180;
  if (angleDegrees === 90 || angleDegrees === 270) {
    canvas.width = sourceCanvas.height;
    canvas.height = sourceCanvas.width;
  } else {
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angleRad);
  ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);

  return { canvas, ctx, width: canvas.width, height: canvas.height };
}

/**
 * Applies contrast enhancement and binarization to canvas image data
 */
function applyHighContrast(ctx, width, height) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const d = imgData.data;

  // Compute min and max luminance for contrast stretching
  let minLum = 255;
  let maxLum = 0;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const range = maxLum - minLum || 1;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const stretched = Math.min(255, Math.max(0, ((lum - minLum) / range) * 255));
    d[i] = stretched;
    d[i + 1] = stretched;
    d[i + 2] = stretched;
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Decodes QR code using native browser BarcodeDetector if available
 */
async function tryNativeBarcodeDetector(source) {
  if (typeof window === 'undefined' || !('BarcodeDetector' in window)) return null;
  try {
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    const barcodes = await detector.detect(source);
    if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
      return barcodes[0].rawValue.trim();
    }
  } catch {
    // Continue
  }
  return null;
}

/**
 * Decodes QR code using ZXing BrowserQRCodeReader
 */
async function tryZXing(source) {
  try {
    const reader = new BrowserQRCodeReader(zxingHints);
    let result = null;
    if (source instanceof HTMLCanvasElement) {
      result = await reader.decodeFromCanvas(source);
    } else if (source instanceof HTMLImageElement) {
      result = await reader.decodeFromImageElement(source);
    }
    if (result && result.getText()) {
      return result.getText().trim();
    }
  } catch {
    // Continue
  }
  return null;
}

/**
 * Decodes QR code using jsQR from a canvas context
 */
function tryJsQR(ctx, width, height) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const code = jsQR(imgData.data, width, height, {
      inversionAttempts: 'attemptBoth'
    });
    if (code && code.data) {
      return code.data.trim();
    }
  } catch {
    // Continue
  }
  return null;
}

/**
 * Primary multi-tier QR decoder for uploaded images
 * 
 * @param {string|File|Blob} imageInput - Object URL or File/Blob
 * @param {Function} [onProgress] - Optional status progress callback
 * @returns {Promise<{ success: boolean, text?: string, method?: string, error?: string }>}
 */
export async function decodeQRFromImage(imageInput, onProgress) {
  let objectUrlToRevoke = null;

  try {
    let sourceUrl = '';
    if (typeof imageInput === 'string') {
      sourceUrl = imageInput;
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      sourceUrl = URL.createObjectURL(imageInput);
      objectUrlToRevoke = sourceUrl;
    } else {
      return { success: false, error: 'Invalid image input source.' };
    }

    if (onProgress) onProgress('Loading image into memory...');
    const img = await loadImageElement(sourceUrl);

    // ================= TIER 1: Native BarcodeDetector on original =================
    if (onProgress) onProgress('Analyzing image with BarcodeDetector...');
    const nativeResult = await tryNativeBarcodeDetector(img);
    if (nativeResult) {
      return { success: true, text: nativeResult, method: 'Native BarcodeDetector' };
    }

    // ================= TIER 2: ZXing on original image =================
    if (onProgress) onProgress('Analyzing image with ZXing...');
    const zxingResult = await tryZXing(img);
    if (zxingResult) {
      return { success: true, text: zxingResult, method: 'ZXing Direct' };
    }

    // ================= TIER 3: Scaled Canvas (1400px) + jsQR =================
    if (onProgress) onProgress('Processing image canvas...');
    const scaled = createScaledCanvas(img, 1400);

    const jsqrResult = tryJsQR(scaled.ctx, scaled.width, scaled.height);
    if (jsqrResult) {
      return { success: true, text: jsqrResult, method: 'jsQR Scaled' };
    }

    // Try Native & ZXing on the normalized canvas
    const nativeCanvasResult = await tryNativeBarcodeDetector(scaled.canvas);
    if (nativeCanvasResult) {
      return { success: true, text: nativeCanvasResult, method: 'Native Canvas' };
    }

    const zxingCanvasResult = await tryZXing(scaled.canvas);
    if (zxingCanvasResult) {
      return { success: true, text: zxingCanvasResult, method: 'ZXing Canvas' };
    }

    // ================= TIER 4: High-Contrast / Glare Compensation =================
    if (onProgress) onProgress('Applying contrast enhancement for jewellery tag...');
    const contrastScaled = createScaledCanvas(img, 1200);
    applyHighContrast(contrastScaled.ctx, contrastScaled.width, contrastScaled.height);

    const contrastJsQR = tryJsQR(contrastScaled.ctx, contrastScaled.width, contrastScaled.height);
    if (contrastJsQR) {
      return { success: true, text: contrastJsQR, method: 'jsQR High-Contrast' };
    }

    const contrastZXing = await tryZXing(contrastScaled.canvas);
    if (contrastZXing) {
      return { success: true, text: contrastZXing, method: 'ZXing High-Contrast' };
    }

    // ================= TIER 5: Multi-Angle Rotations (90°, 180°, 270°) =================
    if (onProgress) onProgress('Checking orientation angles...');
    const angles = [90, 180, 270];
    for (const angle of angles) {
      const rotated = createRotatedCanvas(scaled.canvas, angle);

      const rotNative = await tryNativeBarcodeDetector(rotated.canvas);
      if (rotNative) {
        return { success: true, text: rotNative, method: `Native Rotated ${angle}°` };
      }

      const rotJsQR = tryJsQR(rotated.ctx, rotated.width, rotated.height);
      if (rotJsQR) {
        return { success: true, text: rotJsQR, method: `jsQR Rotated ${angle}°` };
      }

      const rotZXing = await tryZXing(rotated.canvas);
      if (rotZXing) {
        return { success: true, text: rotZXing, method: `ZXing Rotated ${angle}°` };
      }
    }

    // ================= TIER 6: Center Region Crop (65% center area) =================
    if (onProgress) onProgress('Scanning tag focal region...');
    const cropCanvas = document.createElement('canvas');
    const cropW = Math.round(scaled.width * 0.7);
    const cropH = Math.round(scaled.height * 0.7);
    const startX = Math.round((scaled.width - cropW) / 2);
    const startY = Math.round((scaled.height - cropH) / 2);

    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
    cropCtx.drawImage(scaled.canvas, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

    const cropJsQR = tryJsQR(cropCtx, cropW, cropH);
    if (cropJsQR) {
      return { success: true, text: cropJsQR, method: 'jsQR Center Crop' };
    }

    const cropZXing = await tryZXing(cropCanvas);
    if (cropZXing) {
      return { success: true, text: cropZXing, method: 'ZXing Center Crop' };
    }

    return {
      success: false,
      error: 'No readable QR code found in this image. Please ensure the QR tag is clearly visible, in focus, and not obscured by strong glare.'
    };
  } catch (err) {
    console.error('QR image decode exception:', err);
    return {
      success: false,
      error: err.message || 'Unable to decode QR code from the selected image.'
    };
  } finally {
    if (objectUrlToRevoke) {
      try {
        URL.revokeObjectURL(objectUrlToRevoke);
      } catch {}
    }
  }
}

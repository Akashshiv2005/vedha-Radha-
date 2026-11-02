import test from 'node:test';
import assert from 'node:assert';
import {
  validateImageFile,
  formatFileSize,
  MAX_IMAGE_FILE_SIZE_BYTES
} from '../src/services/qrImageDecoderService.js';

test('formatFileSize formats byte units accurately', () => {
  assert.strictEqual(formatFileSize(0), '0 B');
  assert.strictEqual(formatFileSize(500), '500 B');
  assert.strictEqual(formatFileSize(1024), '1.0 KB');
  assert.strictEqual(formatFileSize(1024 * 500), '500.0 KB');
  assert.strictEqual(formatFileSize(1024 * 1024 * 2.5), '2.50 MB');
  assert.strictEqual(formatFileSize(MAX_IMAGE_FILE_SIZE_BYTES), '15.00 MB');
});

test('validateImageFile rejects missing or null files', () => {
  const res = validateImageFile(null);
  assert.strictEqual(res.valid, false);
  assert.match(res.error, /please select/i);
});

test('validateImageFile accepts valid JPG, PNG, and WEBP files', () => {
  const jpgFile = { name: 'tag_photo.jpg', type: 'image/jpeg', size: 1024 * 500 };
  const jpegFile = { name: 'jewel_scan.jpeg', type: 'image/jpeg', size: 1024 * 1024 };
  const pngFile = { name: 'qr_screenshot.png', type: 'image/png', size: 1024 * 800 };
  const webpFile = { name: 'camera_capture.webp', type: 'image/webp', size: 1024 * 300 };

  assert.strictEqual(validateImageFile(jpgFile).valid, true);
  assert.strictEqual(validateImageFile(jpegFile).valid, true);
  assert.strictEqual(validateImageFile(pngFile).valid, true);
  assert.strictEqual(validateImageFile(webpFile).valid, true);
});

test('validateImageFile rejects unsupported files like PDF, TXT, DOCX', () => {
  const pdfFile = { name: 'invoice.pdf', type: 'application/pdf', size: 1024 * 200 };
  const txtFile = { name: 'notes.txt', type: 'text/plain', size: 1024 };

  const res1 = validateImageFile(pdfFile);
  assert.strictEqual(res1.valid, false);
  assert.match(res1.error, /unsupported image format/i);

  const res2 = validateImageFile(txtFile);
  assert.strictEqual(res2.valid, false);
  assert.match(res2.error, /unsupported image format/i);
});

test('validateImageFile rejects files exceeding 15MB limit', () => {
  const hugeFile = {
    name: 'huge_raw_photo.png',
    type: 'image/png',
    size: 16 * 1024 * 1024 // 16 MB
  };

  const res = validateImageFile(hugeFile);
  assert.strictEqual(res.valid, false);
  assert.match(res.error, /exceeds the maximum file size/i);
});


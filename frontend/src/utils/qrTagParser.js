/**
 * Jewellery QR Code Tag Parser Facade
 * Vedha Radha Thangamaaligai Jewellery ERP
 * 
 * Re-exports the unified qrTagParserService for all application modules.
 */

export {
  ParsedJewelleryTag,
  parseJewelleryTagQR,
  normalizePurity,
  normalizeWeight
} from '../services/qrTagParserService.js';

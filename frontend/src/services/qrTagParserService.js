/**
 * Dedicated Jewellery Tag QR Payload Parser Service
 * Vedha Radha Thangamaaligai Jewellery ERP
 * 
 * Supports real-world jewellery tag formats:
 * 1. DOLLAR_DELIMITED ($CODE$DESC$QTY$...$RATE$WT$$AC$$CAT$$SERIAL)
 * 2. PIPE_DELIMITED (CODE|BRAND|RATE|WT|AC|PURITY)
 * 3. KEY_VALUE (CODE:xxx;RATE:yyy;WT:zzz)
 * 4. JSON ({ code, name, rate, weight, ... })
 * 5. URL (https://domain/product/CODE?...)
 * 6. RAW_CODE (Single SKU or barcode number)
 */

/**
 * Standardized Jewellery Tag Parsed Result
 */
export class ParsedJewelleryTag {
  constructor({
    raw_payload = '',
    format = 'UNKNOWN',
    product_code = '',
    sku = '',
    description = null,
    quantity = 1,
    rate = null,
    weight = null,
    gross_weight = null,
    net_weight = null,
    additional_charge = null,
    category = null,
    brand = null,
    purity = null,
    product_type = null,
    hallmark_details = null,
    source_fields = {},
    other_fields = {},
    parse_warnings = []
  }) {
    this.raw_payload = raw_payload;
    this.format = format;
    this.product_code = (product_code || sku || '').trim();
    this.sku = this.product_code;
    this.description = description ? description.trim() : null;
    this.quantity = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    this.rate = typeof rate === 'number' && !isNaN(rate) ? rate : null;
    this.weight = typeof weight === 'number' && !isNaN(weight) ? weight : null;
    this.gross_weight = gross_weight || (this.weight ? `${this.weight.toFixed(3)} g` : null);
    this.net_weight = net_weight || null;
    this.additional_charge = additional_charge ? additional_charge.trim() : null;
    this.category = category ? category.trim() : null;
    this.brand = brand ? brand.trim() : null;
    this.purity = purity ? purity.trim() : null;
    this.product_type = product_type ? product_type.trim() : null;
    this.hallmark_details = hallmark_details ? hallmark_details.trim() : null;
    
    // Explicit provenance tracking per field (QR vs DATABASE vs OCR)
    this.source_fields = source_fields;
    this.other_fields = other_fields;
    this.parse_warnings = parse_warnings;

    // Backward-compatible camelCase getters for React components
    this.productCode = this.product_code;
    this.grossWeight = this.gross_weight;
    this.netWeight = this.net_weight;
    this.additionalCharge = this.additional_charge;
    this.productType = this.product_type;
    this.hallmarkDetails = this.hallmark_details;
    this.rawPayload = this.raw_payload;
    this.otherFields = this.other_fields;
    this.parseWarnings = this.parse_warnings;
  }
}

/**
 * Normalizes purity string into standardized catalogue purity and metal type
 */
export function normalizePurity(raw) {
  if (!raw) return { purity: null, productType: null };
  const str = String(raw).trim().toLowerCase();

  if (str === '925' || str.includes('925') || str.includes('sterling')) {
    return { purity: '925 Sterling Silver', productType: 'Silver' };
  }
  if (str === '916' || str.includes('916') || str.includes('22k') || str.includes('22kt')) {
    return { purity: '22K 916 BIS Hallmarked', productType: 'Gold' };
  }
  if (str === '999' || str.includes('999') || str.includes('24k') || str.includes('24kt')) {
    return { purity: '24K 999 Pure Gold', productType: 'Coins & Bars' };
  }
  if (str === '750' || str.includes('750') || str.includes('18k') || str.includes('18kt')) {
    return { purity: '18K 750 Hallmarked', productType: 'Gold' };
  }

  return { purity: String(raw).trim(), productType: null };
}

/**
 * Formats numeric or string weight to standard "X.XXX g" representation
 */
export function normalizeWeight(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const numStr = String(raw).replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);
  if (isNaN(num) || num <= 0) return null;
  return `${num.toFixed(3)} g`;
}

/**
 * Infers catalogue category from description and category tokens
 */
function inferCatalogueCategory(categoryStr, descriptionStr) {
  const combined = `${categoryStr || ''} ${descriptionStr || ''}`.toLowerCase();
  
  if (combined.includes('bracelet')) return 'Bangles & Bracelets';
  if (combined.includes('bangle')) return 'Bangles & Bracelets';
  if (combined.includes('earring') || combined.includes('stud') || combined.includes('jhumka')) return 'Earrings';
  if (combined.includes('ring')) return 'Rings';
  if (combined.includes('necklace') || combined.includes('haram') || combined.includes('chain')) return 'Necklace';
  if (combined.includes('anklet') || combined.includes('kolusu')) return 'Anklets & Kolusu';
  if (combined.includes('coin') || combined.includes('bar')) return 'Coins & Bars';
  if (combined.includes('gift') || combined.includes('article') || combined.includes('pooja')) return 'Silver Jewellery';

  return categoryStr ? categoryStr.trim() : 'Jewellery';
}

/**
 * Infers metal product type (Gold vs Silver) from rate, weight, or description
 */
function inferProductType(purity, category, rate, weight) {
  if (purity) {
    const pNorm = normalizePurity(purity);
    if (pNorm.productType) return pNorm.productType;
  }
  const combined = `${category || ''}`.toLowerCase();
  if (combined.includes('gold')) return 'Gold';
  if (combined.includes('silver') || combined.includes('gift')) return 'Silver';

  // Benchmark heuristic: Rate per gram
  if (typeof rate === 'number' && typeof weight === 'number' && weight > 0) {
    const ratePerGram = rate / weight;
    if (ratePerGram > 3000) return 'Gold';
    if (ratePerGram < 1500) return 'Silver';
  }

  return 'Silver'; // Default showroom collection for tags
}

/**
 * 1. DOLLAR-DELIMITED PARSER ($CODE$DESC$QTY$...$RATE$WT$$AC$$CAT$$SERIAL)
 * 
 * Verified Real-World Format:
 * $26FPB04F11$FIXED PRICE BRACELET$1$0.000$0.000$0.000$0$0$3100$5.100$$B+250$$GIFT ARTICLES$$4193
 */
function parseDollarDelimited(raw) {
  if (!raw.includes('$')) return null;

  const rawParts = raw.split('$');
  // If string begins with '$', rawParts[0] is empty
  const startOffset = raw.startsWith('$') ? 1 : 0;
  const fields = rawParts.slice(startOffset);

  // Must have at least product code and description
  if (fields.length < 2) return null;

  const productCode = (fields[0] || '').trim();
  const description = (fields[1] || '').trim();

  // Reject if first field is empty or clearly not a product code
  if (!productCode || productCode.length > 50) return null;

  const quantityStr = fields[2] ? fields[2].trim() : '1';
  const quantity = /^\d+$/.test(quantityStr) ? parseInt(quantityStr, 10) : 1;

  let rate = null;
  let weight = null;
  let additionalCharge = null;
  let category = null;
  let purity = null;
  let brand = null;
  const otherFields = {};
  const sourceFields = {
    product_code: 'QR',
    description: 'QR',
    quantity: 'QR'
  };

  // 1. Positional mapping according to ERP standard:
  // fields[3]: stone weight (e.g. 0.000)
  // fields[4]: less weight (e.g. 0.000)
  // fields[5]: other weight (e.g. 0.000)
  // fields[6]: stone amount / pcs
  // fields[7]: wastage
  // fields[8]: rate / price (e.g. 3100)
  // fields[9]: gross weight (e.g. 5.100)
  // fields[10]: net weight / purity
  // fields[11]: additional charge (e.g. B+250)
  // fields[12]: brand or empty
  // fields[13]: category (e.g. GIFT ARTICLES)
  if (fields[3]) otherFields.stone_weight = fields[3];
  if (fields[4]) otherFields.less_weight = fields[4];
  if (fields[5]) otherFields.other_weight = fields[5];
  if (fields[6]) otherFields.stone_amount = fields[6];
  if (fields[7]) otherFields.wastage_info = fields[7];

  // Rate / Price (e.g. fields[8] = "3100")
  if (fields[8] && /^\d+(\.\d+)?$/.test(fields[8].trim())) {
    const val = parseFloat(fields[8].trim());
    if (val > 0) {
      rate = val;
      sourceFields.rate = 'QR';
    }
  }

  // Gross Weight (e.g. fields[9] = "5.100")
  if (fields[9] && /^\d+\.\d{2,3}$/.test(fields[9].trim())) {
    const val = parseFloat(fields[9].trim());
    if (val > 0 && val < 5000) {
      weight = val;
      sourceFields.gross_weight = 'QR';
    }
  }

  // Additional Charge (e.g. fields[11] = "B+250")
  if (fields[11] && /^[A-Za-z]?\s*\+\s*\d+$/i.test(fields[11].trim())) {
    additionalCharge = fields[11].trim();
    sourceFields.additional_charge = 'QR';
  }

  // Category (e.g. fields[13] = "GIFT ARTICLES")
  if (fields[13] && fields[13].trim()) {
    category = fields[13].trim();
    sourceFields.category = 'QR';
  }

  // Scan remaining fields for any additional tokens (e.g. B+250 or Category placed at alternate indices)
  for (let i = 2; i < fields.length; i++) {
    const token = (fields[i] || '').trim();
    if (!token) continue;

    // Additional charge pattern (e.g. B+250 or B + 160)
    if (!additionalCharge && /^[A-Za-z]?\s*\+\s*\d+$/i.test(token)) {
      additionalCharge = token;
      sourceFields.additional_charge = 'QR';
      continue;
    }

    // Weight pattern (e.g. 5.100, 15.350)
    if (!weight && /^\d+\.\d{2,3}$/.test(token)) {
      const wVal = parseFloat(token);
      if (wVal > 0 && wVal < 5000) {
        weight = wVal;
        sourceFields.gross_weight = 'QR';
        continue;
      }
    }

    // Rate / Price pattern (e.g. 3100, 6140)
    if (!rate && /^\d{3,6}$/.test(token)) {
      const rVal = parseFloat(token);
      if (rVal >= 100) {
        rate = rVal;
        sourceFields.rate = 'QR';
        continue;
      }
    }

    // Category pattern
    if (!category && /^(GIFT ARTICLES|BRACELETS?|RINGS?|EARRINGS?|CHAINS?|BANGLES?)$/i.test(token)) {
      category = token;
      sourceFields.category = 'QR';
      continue;
    }

    // Purity pattern
    if (!purity && /^(925|916|22K|24K|18K|750|999)$/i.test(token)) {
      purity = normalizePurity(token).purity;
      sourceFields.purity = 'QR';
      continue;
    }

    otherFields[`field_${i}`] = token;
  }

  const finalCategory = inferCatalogueCategory(category, description);
  const finalProductType = inferProductType(purity, finalCategory, rate, weight);
  const grossWeightStr = normalizeWeight(weight);

  return new ParsedJewelleryTag({
    raw_payload: raw,
    format: 'DOLLAR_DELIMITED',
    product_code: productCode,
    description: description,
    quantity: quantity,
    rate: rate,
    weight: weight,
    gross_weight: grossWeightStr,
    net_weight: grossWeightStr, // No deductions found in tag
    additional_charge: additionalCharge,
    category: finalCategory,
    brand: brand,
    purity: purity,
    product_type: finalProductType,
    source_fields: sourceFields,
    other_fields: otherFields,
    parse_warnings: []
  });
}

/**
 * 2. PIPE-DELIMITED PARSER (CODE|BRAND|RATE|WT|AC|PURITY)
 * e.g. 26FPC25G23|VRTM|6140|15.350|B + 160|925
 */
function parsePipeDelimited(raw) {
  if (!raw.includes('|') && !raw.includes(',')) return null;

  const delim = raw.includes('|') ? '|' : ',';
  const tokens = raw.split(delim).map(t => t.trim()).filter(Boolean);
  if (tokens.length < 2) return null;

  let productCode = null;
  let brand = null;
  let rate = null;
  let weight = null;
  let additionalCharge = null;
  let purity = null;
  const sourceFields = {};
  const otherFields = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Additional charge pattern: e.g. "B + 160", "B+250"
    if (!additionalCharge && /^[A-Za-z]?\s*\+\s*\d+$/i.test(token)) {
      additionalCharge = token;
      sourceFields.additional_charge = 'QR';
      continue;
    }

    // Purity pattern: e.g. "925", "916", "22K"
    if (!purity && /^(925|916|999|750|22K|24K|18K)$/i.test(token)) {
      purity = normalizePurity(token).purity;
      sourceFields.purity = 'QR';
      continue;
    }

    // Brand pattern: e.g. "VRTM" (all uppercase, 2-6 chars)
    if (!brand && /^[A-Z]{2,6}$/.test(token) && token !== '925') {
      brand = token;
      sourceFields.brand = 'QR';
      continue;
    }

    // Weight pattern: e.g. "15.350", "5.100"
    if (!weight && /^\d+\.\d{2,3}\s*(g|gms)?$/i.test(token)) {
      const w = parseFloat(token.replace(/[^0-9.]/g, ''));
      if (w > 0 && w < 10000) {
        weight = w;
        sourceFields.gross_weight = 'QR';
        continue;
      }
    }

    // Rate pattern: integer or decimal e.g. "6140", "3100"
    if (!rate && /^\d{3,6}(\.\d{1,2})?$/.test(token)) {
      const r = parseFloat(token);
      if (r >= 100 && r <= 1000000) {
        rate = r;
        sourceFields.rate = 'QR';
        continue;
      }
    }

    // Product Code pattern (alphanumeric 5-35 chars)
    if (!productCode && /^[A-Za-z0-9\-_]{5,35}$/.test(token)) {
      productCode = token;
      sourceFields.product_code = 'QR';
      continue;
    }

    otherFields[`token_${i}`] = token;
  }

  // Fallback product code: first alphanumeric token
  if (!productCode && tokens[0] && /^[A-Za-z0-9\-_]{3,40}$/.test(tokens[0])) {
    productCode = tokens[0];
    sourceFields.product_code = 'QR';
  }

  if (!productCode) return null;

  const grossWeightStr = normalizeWeight(weight);
  const pNorm = normalizePurity(purity);
  const productType = pNorm.productType || inferProductType(purity, null, rate, weight);
  const category = productType === 'Gold' ? 'Gold Jewellery' : 'Silver Jewellery';

  return new ParsedJewelleryTag({
    raw_payload: raw,
    format: 'PIPE_DELIMITED',
    product_code: productCode,
    description: null,
    quantity: 1,
    rate: rate,
    weight: weight,
    gross_weight: grossWeightStr,
    net_weight: grossWeightStr,
    additional_charge: additionalCharge,
    category: category,
    brand: brand,
    purity: pNorm.purity || purity,
    product_type: productType,
    hallmark_details: brand ? `${brand} ${pNorm.purity || 'Hallmarked'}` : null,
    source_fields: sourceFields,
    other_fields: otherFields,
    parse_warnings: []
  });
}

/**
 * 3. KEY-VALUE PARSER (CODE:xxx;RATE:yyy;WT:zzz)
 */
function parseKeyValue(raw) {
  if (!raw.includes(':') && !(raw.includes('=') && (raw.includes('&') || raw.includes(';')))) {
    return null;
  }

  const delim = raw.includes(';') ? ';' : (raw.includes('&') ? '&' : (raw.includes('\n') ? '\n' : ','));
  const pairs = raw.split(delim).map(p => p.trim()).filter(Boolean);
  let productCode = null;
  let description = null;
  let rate = null;
  let weight = null;
  let additionalCharge = null;
  let purity = null;
  let brand = null;
  let category = null;
  const sourceFields = {};
  const otherFields = {};

  for (const pair of pairs) {
    const kvDelim = pair.includes(':') ? ':' : (pair.includes('=') ? '=' : null);
    if (!kvDelim) continue;
    const [kRaw, ...vRest] = pair.split(kvDelim);
    const k = kRaw.trim().toUpperCase();
    const v = vRest.join(kvDelim).trim();

    if (['CODE', 'SKU', 'ITEM', 'TAG', 'ID', 'PRODUCT'].includes(k)) {
      productCode = v;
      sourceFields.product_code = 'QR';
    } else if (['DESC', 'DESCRIPTION', 'NAME', 'ITEM_NAME'].includes(k)) {
      description = v;
      sourceFields.description = 'QR';
    } else if (['BRAND', 'MARK', 'MARKING', 'MFR'].includes(k)) {
      brand = v;
      sourceFields.brand = 'QR';
    } else if (['RATE', 'PRICE', 'R'].includes(k)) {
      rate = parseFloat(v.replace(/[^0-9.]/g, ''));
      sourceFields.rate = 'QR';
    } else if (['WEIGHT', 'WT', 'GWT', 'GROSS'].includes(k)) {
      weight = parseFloat(v.replace(/[^0-9.]/g, ''));
      sourceFields.gross_weight = 'QR';
    } else if (['AC', 'CHARGE', 'ADDITIONAL', 'EXTRA'].includes(k)) {
      additionalCharge = v;
      sourceFields.additional_charge = 'QR';
    } else if (['PURITY', 'PUR', 'KT', 'FINENESS'].includes(k)) {
      purity = normalizePurity(v).purity;
      sourceFields.purity = 'QR';
    } else if (['CAT', 'CATEGORY', 'SECTION'].includes(k)) {
      category = v;
      sourceFields.category = 'QR';
    } else {
      otherFields[k] = v;
    }
  }

  if (!productCode) return null;

  const grossWeightStr = normalizeWeight(weight);
  const pNorm = normalizePurity(purity);
  const finalCategory = inferCatalogueCategory(category, description);
  const productType = pNorm.productType || inferProductType(purity, finalCategory, rate, weight);

  return new ParsedJewelleryTag({
    raw_payload: raw,
    format: 'KEY_VALUE',
    product_code: productCode,
    description: description,
    quantity: 1,
    rate: rate,
    weight: weight,
    gross_weight: grossWeightStr,
    net_weight: grossWeightStr,
    additional_charge: additionalCharge,
    category: finalCategory,
    brand: brand,
    purity: pNorm.purity || purity,
    product_type: productType,
    hallmark_details: brand ? `${brand} ${pNorm.purity || 'Hallmarked'}` : null,
    source_fields: sourceFields,
    other_fields: otherFields,
    parse_warnings: []
  });
}

/**
 * 4. JSON PARSER ({ code, name, rate, weight, ... })
 */
function parseJsonPayload(raw) {
  if (!((raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']')))) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const code = parsed.code || parsed.sku || parsed.productCode || parsed.product_code || parsed.id;
    if (!code) return null;

    const rate = parsed.rate !== undefined ? parseFloat(parsed.rate) : (parsed.price !== undefined ? parseFloat(parsed.price) : null);
    const weight = parsed.weight !== undefined ? parseFloat(parsed.weight) : (parsed.grossWeight !== undefined ? parseFloat(parsed.grossWeight) : null);
    const pNorm = normalizePurity(parsed.purity || parsed.fineness);
    const desc = parsed.name || parsed.description || parsed.item;
    const cat = inferCatalogueCategory(parsed.category, desc);
    const prodType = pNorm.productType || inferProductType(pNorm.purity, cat, rate, weight);
    const grossWeightStr = normalizeWeight(weight);

    return new ParsedJewelleryTag({
      raw_payload: raw,
      format: 'JSON',
      product_code: String(code).trim(),
      description: desc,
      quantity: parsed.quantity || 1,
      rate: rate,
      weight: weight,
      gross_weight: grossWeightStr,
      net_weight: grossWeightStr,
      additional_charge: parsed.additionalCharge || parsed.ac,
      category: cat,
      brand: parsed.brand || parsed.marking,
      purity: pNorm.purity,
      product_type: prodType,
      source_fields: { product_code: 'QR' },
      other_fields: parsed,
      parse_warnings: []
    });
  } catch {
    return null;
  }
}

/**
 * 5. URL PARSER (https://...?sku=26FPB04F11)
 */
function parseUrlPayload(raw) {
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) return null;

  try {
    const url = new URL(raw);
    const sp = url.searchParams;
    let code = sp.get('sku') || sp.get('code') || sp.get('id') || sp.get('tag');

    if (!code) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const last = segments[segments.length - 1];
        if (/^[A-Za-z0-9\-_]{4,40}$/.test(last)) {
          code = last;
        }
      }
    }

    if (!code) return null;

    const rate = sp.get('rate') || sp.get('price') ? parseFloat(sp.get('rate') || sp.get('price')) : null;
    const weight = sp.get('wt') || sp.get('weight') ? parseFloat(sp.get('wt') || sp.get('weight')) : null;
    const pNorm = normalizePurity(sp.get('purity'));
    const grossWeightStr = normalizeWeight(weight);
    const cat = inferCatalogueCategory(sp.get('category'), null);

    return new ParsedJewelleryTag({
      raw_payload: raw,
      format: 'URL',
      product_code: code.trim(),
      description: null,
      quantity: 1,
      rate: rate,
      weight: weight,
      gross_weight: grossWeightStr,
      net_weight: grossWeightStr,
      additional_charge: sp.get('ac'),
      category: cat,
      brand: sp.get('brand'),
      purity: pNorm.purity,
      product_type: pNorm.productType || 'Silver',
      source_fields: { product_code: 'QR' },
      other_fields: Object.fromEntries(sp.entries()),
      parse_warnings: []
    });
  } catch {
    return null;
  }
}

/**
 * 6. RAW CODE / SINGLE SKU FALLBACK
 */
function parseRawCode(raw) {
  const clean = raw.trim();
  if (!clean) return null;

  // Single clean product code token
  return new ParsedJewelleryTag({
    raw_payload: raw,
    format: 'RAW_CODE',
    product_code: clean,
    description: null,
    quantity: 1,
    rate: null,
    weight: null,
    gross_weight: null,
    net_weight: null,
    additional_charge: null,
    category: null,
    brand: null,
    purity: null,
    product_type: null,
    source_fields: { product_code: 'QR' },
    other_fields: {},
    parse_warnings: []
  });
}

/**
 * MASTER PARSER ENTRY POINT
 * Evaluates payloads through specialized format parsers in strict priority order.
 * Guaranteed to extract the exact product code and metadata.
 * 
 * @param {string} rawPayload 
 * @returns {{
 *   success: boolean,
 *   raw: string,
 *   data: ParsedJewelleryTag,
 *   error?: string
 * }}
 */
export function parseJewelleryTagQR(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'string') {
    return {
      success: false,
      raw: '',
      data: new ParsedJewelleryTag({}),
      error: 'Empty or invalid QR code content.'
    };
  }

  const trimmed = rawPayload.trim();
  if (!trimmed) {
    return {
      success: false,
      raw: '',
      data: new ParsedJewelleryTag({}),
      error: 'Empty QR code content.'
    };
  }

  // 1. Check Dollar-Delimited ($CODE$DESC$QTY$...)
  const dollarResult = parseDollarDelimited(trimmed);
  if (dollarResult) {
    return { success: true, raw: trimmed, data: dollarResult };
  }

  // 2. Check JSON
  const jsonResult = parseJsonPayload(trimmed);
  if (jsonResult) {
    return { success: true, raw: trimmed, data: jsonResult };
  }

  // 3. Check Key-Value
  const kvResult = parseKeyValue(trimmed);
  if (kvResult) {
    return { success: true, raw: trimmed, data: kvResult };
  }

  // 4. Check Pipe/Comma-Delimited
  const pipeResult = parsePipeDelimited(trimmed);
  if (pipeResult) {
    return { success: true, raw: trimmed, data: pipeResult };
  }

  // 5. Check URL
  const urlResult = parseUrlPayload(trimmed);
  if (urlResult) {
    return { success: true, raw: trimmed, data: urlResult };
  }

  // 6. Universal Raw Code Fallback
  const rawResult = parseRawCode(trimmed);
  return { success: true, raw: trimmed, data: rawResult };
}


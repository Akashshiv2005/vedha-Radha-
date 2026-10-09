/**
 * Rate Calculation & Parsing Utilities
 * 
 * Standard Units:
 * 1 Troy Ounce (oz t) = 31.1034768 grams (g)
 * 24K Gold = 99.9% Purity (Fine Gold)
 * 22K Gold = 91.67% Purity (22/24, Standard BIS 916 Indian Jewellery Gold)
 * 18K Gold = 75.0% Purity (18/24)
 * 999 Silver = 99.9% Purity (Fine Silver)
 * 925 Silver = 92.5% Purity (Sterling Silver)
 */

export const TROY_OUNCE_IN_GRAMS = 31.1034768;

/**
 * Converts a price per troy ounce into price per gram.
 * @param {number} pricePerOunce 
 * @returns {number}
 */
export function convertTroyOunceToGram(pricePerOunce) {
  if (typeof pricePerOunce !== 'number' || isNaN(pricePerOunce) || pricePerOunce <= 0) {
    throw new Error('Invalid price per ounce provided for conversion');
  }
  return pricePerOunce / TROY_OUNCE_IN_GRAMS;
}

/**
 * Derives 22K jewellery gold rate from 24K gold rate per gram.
 * Standard ratio: 22 / 24 = 0.916666...
 */
export function calculate22kFrom24k(price24kPerGram) {
  if (typeof price24kPerGram !== 'number' || isNaN(price24kPerGram) || price24kPerGram <= 0) {
    throw new Error('Invalid 24K gold rate provided');
  }
  return price24kPerGram * (22 / 24);
}

/**
 * Derives 18K gold rate from 24K gold rate per gram.
 * Standard ratio: 18 / 24 = 0.75
 */
export function calculate18kFrom24k(price24kPerGram) {
  if (typeof price24kPerGram !== 'number' || isNaN(price24kPerGram) || price24kPerGram <= 0) {
    throw new Error('Invalid 24K gold rate provided');
  }
  return price24kPerGram * (18 / 24);
}

/**
 * Derives 92.5% sterling silver rate from 99.9% pure silver rate per gram.
 */
export function calculate925SilverFrom999(price999SilverPerGram) {
  if (typeof price999SilverPerGram !== 'number' || isNaN(price999SilverPerGram) || price999SilverPerGram <= 0) {
    throw new Error('Invalid 999 silver rate provided');
  }
  return price999SilverPerGram * 0.925;
}

/**
 * Formats a number to Indian Rupee currency representation with grouping.
 * @param {number} amount 
 * @param {number} decimals 
 * @returns {string} e.g. "6,742" or "94.50"
 */
export function formatInr(amount, decimals = 0) {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Formats a timestamp into India Standard Time (Asia/Kolkata).
 * @param {Date|string|number} dateInput 
 * @returns {string} e.g. "08 Oct 2026, 02:45 PM IST"
 */
export function formatTimestampIST(dateInput) {
  try {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) {
      return 'Today, Market Hours';
    }

    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${formatter.format(d)} IST`;
  } catch {
    return 'Today, Market Hours';
  }
}

/**
 * Parses response from GoldAPI.io (XAU/INR & XAG/INR)
 * @param {object} goldData 
 * @param {object} silverData 
 * @returns {object} Normalized rate object
 */
export function parseGoldApiResponse(goldData, silverData) {
  if (!goldData || typeof goldData !== 'object') {
    throw new Error('Invalid gold data payload from provider');
  }

  // GoldAPI gives price_gram_24k, price_gram_22k, price_gram_18k directly, or price (per ounce)
  let gold24kGram = goldData.price_gram_24k;
  if (!gold24kGram && goldData.price) {
    gold24kGram = convertTroyOunceToGram(goldData.price);
  }

  if (!gold24kGram || isNaN(gold24kGram) || gold24kGram <= 0) {
    throw new Error('Unable to extract valid 24K gold rate per gram');
  }

  const gold22kGram = goldData.price_gram_22k || calculate22kFrom24k(gold24kGram);
  const gold18kGram = goldData.price_gram_18k || calculate18kFrom24k(gold24kGram);

  // Daily change if available
  let changeGram = null;
  let isUp = true;
  if (typeof goldData.ch_prev === 'number') {
    changeGram = Math.abs(goldData.ch_prev / TROY_OUNCE_IN_GRAMS);
    isUp = goldData.ch_prev >= 0;
  } else if (typeof goldData.ch === 'number') {
    changeGram = Math.abs(goldData.ch / TROY_OUNCE_IN_GRAMS);
    isUp = goldData.ch >= 0;
  }

  // Silver parsing
  let silver999Gram = 94.50; // default benchmark if silver payload missing
  if (silverData && typeof silverData === 'object') {
    if (silverData.price_gram_24k) {
      silver999Gram = silverData.price_gram_24k;
    } else if (silverData.price) {
      silver999Gram = convertTroyOunceToGram(silverData.price);
    }
  }
  const silver925Gram = calculate925SilverFrom999(silver999Gram);

  const timestampMs = (goldData.timestamp ? goldData.timestamp * 1000 : Date.now());

  return {
    raw: {
      gold24kGram,
      gold22kGram,
      gold18kGram,
      silver999Gram,
      silver925Gram,
      changeGram,
      isUp,
      timestamp: timestampMs
    },
    formatted: {
      gold22k: formatInr(Math.round(gold22kGram)),
      gold24k: formatInr(Math.round(gold24kGram)),
      gold18k: formatInr(Math.round(gold18kGram)),
      silver1g: formatInr(silver925Gram, 2),
      silver999: formatInr(silver999Gram, 2),
      change: changeGram ? `${isUp ? '+' : '-'} ₹${Math.round(changeGram)}` : null,
      isUp,
      lastUpdated: formatTimestampIST(timestampMs)
    },
    meta: {
      provider: 'GoldAPI.io',
      currency: 'INR',
      unit: 'gram',
      goldPurity: '22K (91.6% BIS Hallmark Jewellery Standard)',
      goldFinePurity: '24K (99.9% Benchmark Bullion)',
      silverPurity: '92.5% Sterling Silver'
    }
  };
}

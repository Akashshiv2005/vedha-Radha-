import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  TROY_OUNCE_IN_GRAMS,
  convertTroyOunceToGram,
  calculate22kFrom24k,
  calculate18kFrom24k,
  calculate925SilverFrom999,
  formatInr,
  formatTimestampIST,
  parseGoldApiResponse
} from '../server/rateCalculations.js';
import { getPreciousRates, _resetRateCache } from '../server/ratesService.js';

describe('Precious Metal Rate Calculations & Conversions', () => {
  
  it('converts troy ounce correctly to grams (1 oz t = 31.1034768 g)', () => {
    const pricePerOunce = 228800; // e.g. ~₹2,28,800 / oz t
    const pricePerGram = convertTroyOunceToGram(pricePerOunce);
    const expected = pricePerOunce / TROY_OUNCE_IN_GRAMS;
    assert.equal(pricePerGram, expected);
    assert.ok(pricePerGram > 7300 && pricePerGram < 7400);
  });

  it('calculates 22K jewellery gold rate accurately as (22/24) of 24K rate', () => {
    const gold24k = 7355;
    const gold22k = calculate22kFrom24k(gold24k);
    const expected = 7355 * (22 / 24);
    assert.equal(gold22k, expected);
    assert.equal(Math.round(gold22k), 6742);
  });

  it('calculates 18K gold rate accurately as (18/24) of 24K rate', () => {
    const gold24k = 7355;
    const gold18k = calculate18kFrom24k(gold24k);
    assert.equal(gold18k, 7355 * 0.75);
    assert.equal(Math.round(gold18k), 5516);
  });

  it('calculates 92.5% sterling silver from pure 99.9 silver', () => {
    const silver999 = 102.16;
    const silver925 = calculate925SilverFrom999(silver999);
    assert.equal(silver925, 102.16 * 0.925);
    assert.equal(silver925.toFixed(2), '94.50');
  });

  it('formats numbers with Indian currency notation', () => {
    assert.equal(formatInr(6742), '6,742');
    assert.equal(formatInr(128500), '1,28,500');
    assert.equal(formatInr(94.5, 2), '94.50');
  });

  it('formats timestamps into valid IST format', () => {
    const dateStr = '2026-10-08T09:00:00.000Z'; // 14:30 IST
    const formatted = formatTimestampIST(dateStr);
    assert.ok(formatted.includes('IST'));
    assert.ok(formatted.includes('Oct') || formatted.includes('10'));
  });

  it('parses valid GoldAPI.io payload into normalized rate object', () => {
    const sampleGold = {
      price: 228800,
      price_gram_24k: 7356.1,
      price_gram_22k: 6743.1,
      price_gram_18k: 5517.1,
      ch: 995.3,
      ch_prev: 995.3,
      timestamp: 1728378000
    };
    const sampleSilver = {
      price: 3177.5,
      price_gram_24k: 102.16,
      timestamp: 1728378000
    };

    const parsed = parseGoldApiResponse(sampleGold, sampleSilver);
    assert.equal(parsed.formatted.gold22k, '6,743');
    assert.equal(parsed.formatted.gold24k, '7,356');
    assert.equal(parsed.formatted.silver1g, '94.50');
    assert.ok(parsed.formatted.change.includes('+ ₹32'));
    assert.equal(parsed.meta.currency, 'INR');
  });

  it('throws helpful error on invalid or empty gold payload', () => {
    assert.throws(() => {
      parseGoldApiResponse(null, null);
    }, /Invalid gold data payload/);
  });
});

describe('Rate Service & Backend Caching / Fallback Flow', () => {
  beforeEach(() => {
    _resetRateCache();
  });

  it('returns transparent indicative benchmark when API key is unconfigured', async () => {
    const unconfiguredEnv = {
      GOLD_API_KEY: '',
      RATE_CACHE_TTL_MINUTES: '10'
    };

    const result = await getPreciousRates(unconfiguredEnv);
    assert.equal(result.success, true);
    assert.equal(result.status, 'unconfigured_indicative');
    assert.equal(result.isLive, false);
    assert.ok(result.note.includes('GOLD_API_KEY'));
    assert.ok(result.rates.formatted.gold22k);
    assert.ok(result.rates.formatted.silver1g);
  });

  it('returns cached data on consecutive calls within TTL window', async () => {
    const unconfiguredEnv = {
      GOLD_API_KEY: '',
      RATE_CACHE_TTL_MINUTES: '10'
    };

    // First call populates cache
    await getPreciousRates(unconfiguredEnv);

    // Second call serves from cache
    const cachedResult = await getPreciousRates(unconfiguredEnv, false);
    assert.equal(cachedResult.success, true);
    assert.equal(cachedResult.isCached, true);
    assert.ok(cachedResult.cacheAgeSeconds >= 0);
  });
});

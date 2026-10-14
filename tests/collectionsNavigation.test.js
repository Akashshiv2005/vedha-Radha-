import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { collectionsNavItems } from '../src/data/navigationData.js';
import { products } from '../src/data/products.js';

describe('Collections Page - Gift Collection Navigation & Cards', () => {
  it('adds Gift Collection navigation item immediately next to Silver Idol', () => {
    const silverIdolIndex = collectionsNavItems.findIndex(item => item.name === 'Silver Idol');
    assert.ok(silverIdolIndex !== -1, 'Silver Idol navigation item must exist');

    const giftColIndex = collectionsNavItems.findIndex(item => item.name === 'Gift Collection');
    assert.ok(giftColIndex !== -1, 'Gift Collection navigation item must exist');

    assert.equal(
      giftColIndex,
      silverIdolIndex + 1,
      'Gift Collection navigation text must be immediately next to Silver Idol'
    );

    const giftCol = collectionsNavItems[giftColIndex];
    assert.equal(giftCol.slug, 'gift-collection');
    assert.equal(giftCol.path, '/collections/gift-collection');
  });

  it('displays gift collection products when filtering for gift-collection (excluding removed Anniversary Heirloom)', () => {
    const activeSlug = 'gift-collection';
    const giftProducts = products.filter(item => (
      item.collection === activeSlug ||
      item.subCategory === 'Gift Collection' ||
      item.subCategorySlug === activeSlug ||
      item.id.startsWith('collections-gift-')
    ));

    assert.equal(giftProducts.length, 3, 'Should display exactly 3 curated gift collection products');
    
    // Check key products exist
    assert.ok(giftProducts.some(p => p.id === 'collections-gift-exclusive-01'));
    assert.ok(giftProducts.some(p => p.id === 'collections-gift-01'));
    assert.ok(giftProducts.some(p => p.id === 'collections-gift-03'));
    
    // Ensure Anniversary Heirloom card is completely removed
    assert.ok(!giftProducts.some(p => p.id === 'collections-gift-02'), 'Anniversary Heirloom card must not exist');
    assert.ok(!giftProducts.some(p => p.badge === 'Anniversary Heirloom'), 'Anniversary Heirloom badge must not exist');
  });

  it('includes a "Suitable For" label on each gift collection product card', () => {
    const giftProducts = products.filter(item => (
      item.collection === 'gift-collection' ||
      item.subCategory === 'Gift Collection' ||
      item.subCategorySlug === 'gift-collection' ||
      item.id.startsWith('collections-gift-')
    ));

    for (const prod of giftProducts) {
      assert.ok(prod.suitableFor, `Product ${prod.id} (${prod.name}) must have a suitableFor label`);
      assert.ok(
        typeof prod.suitableFor === 'string' && prod.suitableFor.trim().length > 0,
        `Product ${prod.id} suitableFor must be a non-empty string`
      );
    }

    const occasions = giftProducts.map(p => p.suitableFor);
    assert.ok(occasions.includes('Birthday Gifts'), 'Must include Birthday Gifts occasion');
    assert.ok(occasions.includes('Wedding Gifts'), 'Must include Wedding Gifts occasion');
    assert.ok(occasions.includes('Festival Gifts'), 'Must include Festival Gifts occasion');
    assert.ok(!occasions.includes('Anniversary Gifts'), 'Anniversary Gifts occasion should be removed');
  });

  it('keeps existing Silver Idol collection product cards unchanged without Suitable For label', () => {
    const silverIdolProducts = products.filter(item => (
      item.id === 'collections-silver-idol-exclusive-01' ||
      item.collection === 'silver-idols'
    ));

    assert.ok(silverIdolProducts.length > 0, 'Silver Idol product must exist');
    for (const idol of silverIdolProducts) {
      assert.equal(
        idol.suitableFor,
        undefined,
        'Silver Idol collection product must NOT have suitableFor label (unchanged design)'
      );
      assert.ok(
        idol.subCategory === 'Silver Idol' || idol.subCategory === 'silver-idols',
        'Silver Idol subCategory must match Silver Idol'
      );
    }
  });

  it('verifies that all gift collection product images exist in public/images/collections', () => {
    const giftProducts = products.filter(item => (
      item.collection === 'gift-collection' ||
      item.subCategory === 'Gift Collection' ||
      item.subCategorySlug === 'gift-collection' ||
      item.id.startsWith('collections-gift-')
    ));

    for (const prod of giftProducts) {
      const imgPath = path.resolve(prod.image.replace(/^\//, 'public/'));
      assert.ok(fs.existsSync(imgPath), `Main image ${prod.image} must exist at ${imgPath}`);

      if (prod.images && prod.images.length > 0) {
        for (const subImg of prod.images) {
          const subPath = path.resolve(subImg.replace(/^\//, 'public/'));
          assert.ok(fs.existsSync(subPath), `Gallery image ${subImg} must exist at ${subPath}`);
        }
      }
    }
  });
});

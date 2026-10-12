import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { silverCategories } from '../src/data/categoryData.js';
import { products } from '../src/data/products.js';

describe('Silver Category Navigation & Filtering', () => {
  it('includes Anklets and Toe Rings in silverCategories', () => {
    const ankletsCat = silverCategories.find(c => c.slug === 'anklets');
    const toeRingsCat = silverCategories.find(c => c.slug === 'toe-rings');

    assert.ok(ankletsCat, 'Anklets category must exist');
    assert.equal(ankletsCat.name, 'Anklets');
    assert.equal(ankletsCat.path, '/silver/anklets');

    assert.ok(toeRingsCat, 'Toe Rings category must exist');
    assert.equal(toeRingsCat.name, 'Toe Rings');
    assert.equal(toeRingsCat.path, '/silver/toe-rings');
  });

  it('orders Anklets and Toe Rings right after Pendant', () => {
    const pendantIndex = silverCategories.findIndex(c => c.slug === 'pendants');
    const ankletsIndex = silverCategories.findIndex(c => c.slug === 'anklets');
    const toeRingsIndex = silverCategories.findIndex(c => c.slug === 'toe-rings');

    assert.ok(pendantIndex !== -1, 'Pendant category must exist');
    assert.equal(ankletsIndex, pendantIndex + 1, 'Anklets must immediately follow Pendant');
    assert.equal(toeRingsIndex, ankletsIndex + 1, 'Toe Rings must immediately follow Anklets');
  });

  it('filters silver anklets products correctly', () => {
    const silverProducts = products.filter(p => p.category === 'Silver');
    const ankletProducts = silverProducts.filter(item => (
      item.subCategory === 'anklets' ||
      item.subCategorySlug === 'anklets' ||
      item.subType === 'anklets' ||
      item.designType?.includes('anklet') ||
      item.id?.includes('anklet') ||
      item.id?.includes('payal') ||
      item.name?.toLowerCase().includes('payal') ||
      item.name?.toLowerCase().includes('anklet')
    ));

    assert.ok(ankletProducts.length >= 2, 'Should find at least 2 silver anklet / payal products');
    assert.ok(ankletProducts.some(p => p.id === 'silver-anklets-payal-01'));
    assert.ok(ankletProducts.some(p => p.id === 'silver-new-arrival-salem-ghungroo-payal-01'));
  });

  it('filters silver toe rings products correctly', () => {
    const silverProducts = products.filter(p => p.category === 'Silver');
    const toeRingProducts = silverProducts.filter(item => (
      item.subCategory === 'toe-rings' ||
      item.subCategorySlug === 'toe-rings' ||
      item.subType === 'toe-rings' ||
      item.designType?.includes('metti') ||
      item.id?.includes('toe-ring') ||
      item.id?.includes('metti') ||
      item.name?.toLowerCase().includes('toe ring') ||
      item.name?.toLowerCase().includes('metti')
    ));

    assert.ok(toeRingProducts.length >= 2, 'Should find at least 2 silver toe rings / metti products');
    assert.ok(toeRingProducts.some(p => p.id === 'silver-rings-metti-01'));
    assert.ok(toeRingProducts.some(p => p.id === 'silver-new-arrival-floral-metti-rings-01'));
  });

  it('does not leak anklets or toe rings into bangles or finger rings', () => {
    const silverProducts = products.filter(p => p.category === 'Silver');
    const banglesProducts = silverProducts.filter(item => (
      (item.subCategory === 'bangles' || item.subCategorySlug === 'bangles' || item.subCategory === 'handcrafted-silver') &&
      !item.name?.toLowerCase().includes('payal') &&
      !item.id?.includes('payal') &&
      item.subCategory !== 'anklets'
    ));

    const ringsProducts = silverProducts.filter(item => (
      (item.subCategory === 'rings' || item.subCategorySlug === 'rings') &&
      !item.name?.toLowerCase().includes('metti') &&
      !item.id?.includes('metti') &&
      item.subCategory !== 'toe-rings'
    ));

    assert.ok(banglesProducts.every(p => !p.id.includes('payal')), 'Bangles should not include payals');
    assert.ok(ringsProducts.every(p => !p.id.includes('metti')), 'Rings should not include mettis');
  });

  it('configures Bangle & Bracelets subcategories cleanly without duplicates', () => {
    const banglesCat = silverCategories.find(c => c.slug === 'bangles');
    assert.ok(banglesCat, 'Bangles category must exist in silverCategories');
    const subSlugs = banglesCat.subcategories.map(s => s.slug);
    assert.deepEqual(subSlugs, ['bangles', 'cuff-bracelets', 'chain-bracelets']);
  });

  it('separates View All (all bangles & bracelets) from Bangles (only bangles)', () => {
    const silverProducts = products.filter(p => p.category === 'Silver');
    
    // View All logic: all bangles, cuffs, and chain bracelets
    const viewAllProducts = silverProducts.filter(item => (
      (item.subCategory === 'bangles' || item.subCategorySlug === 'bangles' || item.subCategory === 'handcrafted-silver') &&
      !item.name?.toLowerCase().includes('payal') &&
      !item.id?.includes('payal') &&
      item.subCategory !== 'anklets'
    ));

    // Bangles only logic: subType 'bangles' or 'bangle-bracelets'
    const banglesOnlyProducts = silverProducts.filter(item => (
      item.subType === 'bangles' || item.subType === 'bangle-bracelets'
    ));

    assert.ok(viewAllProducts.length > banglesOnlyProducts.length, 'View All must contain more items than Bangles only');
    assert.equal(banglesOnlyProducts.length, 3, 'Bangles only must contain exactly 3 bangle products');
    assert.ok(banglesOnlyProducts.every(p => p.subType === 'bangle-bracelets' || p.subType === 'bangles'));
    assert.ok(viewAllProducts.some(p => p.subType === 'cuff-bracelets'), 'View All must contain cuff bracelets');
    assert.ok(viewAllProducts.some(p => p.subType === 'chain-bracelets'), 'View All must contain chain bracelets');
    assert.ok(!banglesOnlyProducts.some(p => p.subType === 'cuff-bracelets'), 'Bangles only must NOT contain cuffs');
    assert.ok(!banglesOnlyProducts.some(p => p.subType === 'chain-bracelets'), 'Bangles only must NOT contain chain bracelets');
  });
});


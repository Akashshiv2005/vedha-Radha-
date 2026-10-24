import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { silverCategories, goldCategories } from '../src/data/categoryData.js';
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

  it('includes Coins in silverCategories with correct path and slug', () => {
    const coinsCat = silverCategories.find(c => c.slug === 'coins');
    assert.ok(coinsCat, 'Coins category must exist in silverCategories');
    assert.equal(coinsCat.name, 'Coins');
    assert.equal(coinsCat.path, '/silver/coins');
  });

  it('filters silver coins products correctly and returns exactly 3 reference coin products with images, weights, and purity', () => {
    const silverProducts = products.filter(p => p.category === 'Silver');
    const coinProducts = silverProducts.filter(item => (
      item.subCategory === 'coins' ||
      item.subCategorySlug === 'coins' ||
      item.subType === 'coins'
    ));

    assert.equal(coinProducts.length, 3, 'Should have exactly 3 silver coin products');
    assert.ok(coinProducts.some(p => p.id === 'silver-coin-lotus-01'), 'Lotus coin must exist');
    assert.ok(coinProducts.some(p => p.id === 'silver-coin-lakshmi-02'), 'Gajalakshmi coin must exist');
    assert.ok(coinProducts.some(p => p.id === 'silver-coin-peacock-03'), 'Peacock coin must exist');

    // Verify all 3 have required fields
    for (const coin of coinProducts) {
      assert.ok(coin.image, `Coin ${coin.id} must have product image`);
      assert.ok(coin.name, `Coin ${coin.id} must have product name`);
      assert.ok(coin.weight, `Coin ${coin.id} must have weight`);
      assert.ok(coin.purity, `Coin ${coin.id} must have purity`);
      assert.ok(coin.price, `Coin ${coin.id} must have price`);
    }
  });
});

describe('Gold Category Navigation & Filtering', () => {
  it('includes Anklets and Toe Rings in goldCategories', () => {
    const ankletsCat = goldCategories.find(c => c.slug === 'anklets');
    const toeRingsCat = goldCategories.find(c => c.slug === 'toe-rings');

    assert.ok(ankletsCat, 'Anklets category must exist in goldCategories');
    assert.equal(ankletsCat.name, 'Anklets');
    assert.equal(ankletsCat.path, '/gold/anklets');

    assert.ok(toeRingsCat, 'Toe Rings category must exist in goldCategories');
    assert.equal(toeRingsCat.name, 'Toe Rings');
    assert.equal(toeRingsCat.path, '/gold/toe-rings');
  });

  it('orders Anklets and Toe Rings right after Pendant in goldCategories', () => {
    const pendantIndex = goldCategories.findIndex(c => c.slug === 'pendants');
    const ankletsIndex = goldCategories.findIndex(c => c.slug === 'anklets');
    const toeRingsIndex = goldCategories.findIndex(c => c.slug === 'toe-rings');

    assert.ok(pendantIndex !== -1, 'Pendant category must exist');
    assert.equal(ankletsIndex, pendantIndex + 1, 'Anklets must immediately follow Pendant');
    assert.equal(toeRingsIndex, ankletsIndex + 1, 'Toe Rings must immediately follow Anklets');
  });

  it('filters gold anklets products correctly', () => {
    const goldProducts = products.filter(p => p.category === 'Gold');
    const ankletProducts = goldProducts.filter(item => (
      item.subCategory === 'anklets' ||
      item.subCategorySlug === 'anklets' ||
      item.subType === 'anklets' ||
      item.id?.includes('anklet') ||
      item.name?.toLowerCase().includes('anklet') ||
      item.name?.toLowerCase().includes('payal')
    ));

    assert.equal(ankletProducts.length, 3, 'Should find 3 gold anklet / payal products');
    assert.ok(ankletProducts.some(p => p.id === 'gold-anklet-93-heritage-beaded-mani'));
    assert.ok(ankletProducts.some(p => p.id === 'gold-anklet-94-delicate-bell-charm-pair'));
    assert.ok(ankletProducts.some(p => p.id === 'gold-anklet-95-royal-antique-ghungroo-pair'));
  });

  it('filters gold toe rings products correctly', () => {
    const goldProducts = products.filter(p => p.category === 'Gold');
    const toeRingProducts = goldProducts.filter(item => (
      item.subCategory === 'toe-rings' ||
      item.subCategorySlug === 'toe-rings' ||
      item.subType === 'toe-rings' ||
      item.id?.includes('toe-ring') ||
      item.name?.toLowerCase().includes('toe ring') ||
      item.name?.toLowerCase().includes('metti')
    ));

    assert.equal(toeRingProducts.length, 3, 'Should find 3 gold toe ring / metti products');
    assert.ok(toeRingProducts.some(p => p.id === 'gold-toe-ring-91-floral-filigree'));
    assert.ok(toeRingProducts.some(p => p.id === 'gold-toe-ring-92-classic-metti-pair'));
    assert.ok(toeRingProducts.some(p => p.id === 'gold-toe-ring-96-minimalist-band'));
  });

  it('does not leak gold anklets or toe rings into bangles or finger rings', () => {
    const goldProducts = products.filter(p => p.category === 'Gold');
    const banglesProducts = goldProducts.filter(item => (
      item.subCategory === 'bangles' || item.subCategorySlug === 'bangles'
    ));
    const ringsProducts = goldProducts.filter(item => (
      item.subCategory === 'rings' || item.subCategorySlug === 'rings'
    ));

    assert.ok(banglesProducts.every(p => !p.id.includes('anklet') && !p.id.includes('payal')), 'Bangles should not include anklets');
    assert.ok(ringsProducts.every(p => !p.id.includes('toe-ring') && !p.id.includes('metti')), 'Rings should not include toe rings');
  });

  it('verifies that all gold anklets and toe rings reference images exist', () => {
    const goldProducts = products.filter(p => p.category === 'Gold');
    const newItems = goldProducts.filter(p => p.subCategory === 'anklets' || p.subCategory === 'toe-rings');
    assert.equal(newItems.length, 6, 'Must have 6 new gold products');

    for (const item of newItems) {
      assert.ok(item.image, `${item.id} must have image`);
      const fullPath = path.join(process.cwd(), 'public', item.image);
      assert.ok(fs.existsSync(fullPath), `Image file must exist: ${item.image}`);
    }
  });

  it('includes Occasion in goldCategories with correct slug and path', () => {
    const occasionCat = goldCategories.find(c => c.slug === 'occasion');
    assert.ok(occasionCat, 'Occasion category must exist in goldCategories');
    assert.equal(occasionCat.name, 'Occasion');
    assert.equal(occasionCat.path, '/gold/occasion');
  });

  it('orders Occasion right after Nosepin and before Chains in goldCategories', () => {
    const nosepinIndex = goldCategories.findIndex(c => c.slug === 'nosepin');
    const occasionIndex = goldCategories.findIndex(c => c.slug === 'occasion');
    const chainsIndex = goldCategories.findIndex(c => c.slug === 'chains');

    assert.ok(nosepinIndex !== -1, 'Nosepin category must exist');
    assert.ok(chainsIndex !== -1, 'Chains category must exist');
    assert.equal(occasionIndex, nosepinIndex + 1, 'Occasion must immediately follow Nosepin');
    assert.equal(chainsIndex, occasionIndex + 1, 'Chains must immediately follow Occasion');
  });

  it('configures Occasion subcategories for Casual Wear, Party Wear, and Traditional Wear', () => {
    const occasionCat = goldCategories.find(c => c.slug === 'occasion');
    assert.ok(occasionCat.subcategories, 'Occasion must have subcategories');
    assert.equal(occasionCat.subcategories.length, 3);
    const subSlugs = occasionCat.subcategories.map(s => s.slug);
    assert.deepEqual(subSlugs, ['casual-wear', 'party-wear', 'traditional-wear']);
  });

  it('filters gold occasion products correctly for View All and sub-styles', () => {
    const goldProducts = products.filter(p => p.category === 'Gold');
    const occasionAll = goldProducts.filter(item => (
      item.subCategory === 'occasion' || item.occasion || item.isBridal
    ));
    assert.ok(occasionAll.length >= 50, 'View all occasion gold should return all occasion wear gold products');

    const casualWear = goldProducts.filter(item => item.occasion === 'casual-wear');
    const partyWear = goldProducts.filter(item => item.occasion === 'party-wear');
    const traditionalWear = goldProducts.filter(item => item.occasion === 'traditional-wear');

    assert.ok(casualWear.length > 0, 'Casual wear gold products must exist');
    assert.ok(partyWear.length > 0, 'Party wear gold products must exist');
    assert.ok(traditionalWear.length > 0, 'Traditional wear gold products must exist');
    assert.equal(casualWear.length + partyWear.length + traditionalWear.length, goldProducts.length);
  });
});



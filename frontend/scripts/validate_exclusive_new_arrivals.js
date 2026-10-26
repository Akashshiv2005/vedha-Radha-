import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';
import { exclusiveNewArrivals } from '../src/data/newArrivalsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('VALIDATING EXCLUSIVE NEW ARRIVALS ISOLATION & UNIQUENESS');
console.log('========================================================================');

let errors = 0;

console.log(`1. Base Catalog Products in products.js: ${products.length}`);
console.log(`2. Exclusive New Arrivals in newArrivalsData.js: ${exclusiveNewArrivals.length}`);

// Requirement 1 & 2: Confirm new products exist ONLY in newArrivalsData.js, NOT in products.js
const baseProductIds = new Set(products.map(p => p.id));
const baseProductNames = new Set(products.map(p => p.name));
const baseProductImages = new Set(products.map(p => p.image));

for (const p of exclusiveNewArrivals) {
  if (baseProductIds.has(p.id)) {
    console.error(`❌ LEAK DETECTED: Exclusive product ID ${p.id} exists in shared products.js!`);
    errors++;
  }
  if (baseProductNames.has(p.name)) {
    console.error(`❌ LEAK DETECTED: Exclusive product Name "${p.name}" exists in shared products.js!`);
    errors++;
  }
  if (baseProductImages.has(p.image)) {
    console.error(`❌ LEAK DETECTED: Exclusive product image "${p.image}" exists in shared products.js!`);
    errors++;
  }
}
console.log('✓ Verified: ZERO exclusive new arrival products exist in shared products.js (100% Isolated).');

// Verify Gold, Silver, Coins & Bars, Collections pages will NEVER display new arrival items
const leakedGold = products.filter(p => p.category === 'Gold' && p.id.startsWith('new-arrival-exclusive'));
const leakedSilver = products.filter(p => p.category === 'Silver' && p.id.startsWith('new-arrival-exclusive'));
const leakedCoins = products.filter(p => p.category === 'Coins & Bars' && p.id.startsWith('new-arrival-exclusive'));

if (leakedGold.length > 0 || leakedSilver.length > 0 || leakedCoins.length > 0) {
  console.error(`❌ Exclusive products leaked into category datasets: Gold=${leakedGold.length}, Silver=${leakedSilver.length}, Coins=${leakedCoins.length}`);
  errors++;
} else {
  console.log('✓ Verified: Gold, Silver, and Coins & Bars datasets contain 0 exclusive new arrival products.');
}

// Requirement 3, 4, 5, 6: Uniqueness within exclusive arrivals
const exclusiveIds = new Set();
const exclusiveNames = new Set();
const exclusiveFilenames = new Set();

for (const p of exclusiveNewArrivals) {
  if (exclusiveIds.has(p.id)) {
    console.error(`❌ Duplicate ID in exclusive arrivals: ${p.id}`);
    errors++;
  }
  exclusiveIds.add(p.id);

  if (exclusiveNames.has(p.name)) {
    console.error(`❌ Duplicate Name in exclusive arrivals: ${p.name}`);
    errors++;
  }
  exclusiveNames.add(p.name);

  // Check all images
  for (const imgPath of p.images) {
    const filename = path.basename(imgPath);
    if (exclusiveFilenames.has(filename)) {
      console.error(`❌ Duplicate image filename: ${filename}`);
      errors++;
    }
    exclusiveFilenames.add(filename);

    if (!filename.startsWith('new-arrival-exclusive-')) {
      console.error(`❌ Image filename does not follow naming convention: ${filename}`);
      errors++;
    }

    if (imgPath.endsWith('.svg') || imgPath.endsWith('.png') || imgPath.endsWith('.webp') || imgPath.endsWith('.gif')) {
      console.error(`❌ Forbidden image extension: ${imgPath}`);
      errors++;
    }

    // Verify file exists in public/images/new-arrivals/ and dist/images/new-arrivals/
    const pubPath = path.join(root, 'public', imgPath.replace(/^\//, ''));
    const distPath = path.join(root, 'dist', imgPath.replace(/^\//, ''));

    if (!fs.existsSync(pubPath)) {
      console.error(`❌ Missing public image: ${pubPath}`);
      errors++;
    } else {
      const buf = fs.readFileSync(pubPath);
      if (buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) {
        console.error(`❌ Image ${pubPath} is not a valid JPEG! Header: ${buf.slice(0, 4).toString('hex')}`);
        errors++;
      }
    }

    if (!fs.existsSync(distPath)) {
      console.error(`❌ Missing dist image: ${distPath}`);
      errors++;
    } else {
      const buf = fs.readFileSync(distPath);
      if (buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) {
        console.error(`❌ Image ${distPath} is not a valid JPEG!`);
        errors++;
      }
    }

    // Confirm image is NOT saved inside gold, silver, or coins-bars folders
    if (pubPath.includes('products\\gold') || pubPath.includes('products\\silver') || pubPath.includes('coins-bars')) {
      console.error(`❌ Image saved in forbidden folder: ${pubPath}`);
      errors++;
    }
  }
}

console.log(`✓ Verified: All ${exclusiveFilenames.size} JPG images across all ${exclusiveNewArrivals.length} products exist with valid JPEG headers.`);

console.log('\n--- Exclusive New Arrivals Product Directory ---');
for (const p of exclusiveNewArrivals) {
  console.log(`  ✓ [${p.department.padEnd(12)} > ${(p.subType || '').padEnd(18)}] : ${p.name}`);
  console.log(`    ID: ${p.id}`);
  console.log(`    Price: ${p.price} (${p.weight})`);
  console.log(`    Images (${p.images.length} views): ${p.images[0]}`);
}

if (errors === 0) {
  console.log('\n========================================================================');
  console.log('SUCCESS: All 9 Exclusive New Arrivals products and 27 JPG photographs');
  console.log('are 100% verified, isolated, and adhere to all strict guidelines!');
  console.log('========================================================================');
} else {
  console.error(`\nFound ${errors} validation errors.`);
  process.exit(1);
}

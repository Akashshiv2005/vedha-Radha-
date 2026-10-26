import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';
import { silverCategories } from '../src/data/categoryData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const publicSilverDir = path.join(root, 'public', 'images', 'products', 'silver');
const distSilverDir = path.join(root, 'dist', 'images', 'products', 'silver');

console.log('========================================================================');
console.log('VERIFYING SILVER PRODUCTS & ASSET INTEGRITY');
console.log('========================================================================');

const silverProducts = products.filter(p => p.category === 'Silver');
console.log(`Total Silver Products in database: ${silverProducts.length}`);

if (silverProducts.length !== 57) {
  console.error(`❌ Expected 57 Silver products, found ${silverProducts.length}`);
  process.exit(1);
}

// 1. Check all JPG files exist and have valid JPEG magic bytes
let errors = 0;
const checkedFiles = new Set();

for (const p of silverProducts) {
  // Check required fields
  if (!p.id || !p.name || !p.price || !p.numericPrice || !p.image || !p.altText || !p.purity || !p.description) {
    console.error(`❌ Product ${p.id} missing required metadata fields.`);
    errors++;
  }

  if (p.image.endsWith('.svg') || p.image.endsWith('.png') || p.image.endsWith('.webp')) {
    console.error(`❌ Product ${p.id} uses non-JPG format: ${p.image}`);
    errors++;
  }

  const relPath = p.image.replace(/^\//, '');
  const pubPath = path.join(root, 'public', relPath);
  const distPath = path.join(root, 'dist', relPath);

  if (!fs.existsSync(pubPath)) {
    console.error(`❌ Missing public image: ${pubPath}`);
    errors++;
  } else {
    // Check magic bytes
    const buf = fs.readFileSync(pubPath);
    if (buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) {
      console.error(`❌ File ${pubPath} is not a valid JPEG! Header: ${buf.slice(0, 4).toString('hex')}`);
      errors++;
    }
    checkedFiles.add(p.image);
  }

  if (!fs.existsSync(distPath)) {
    console.error(`❌ Missing dist image: ${distPath}`);
    errors++;
  } else {
    const buf = fs.readFileSync(distPath);
    if (buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) {
      console.error(`❌ File ${distPath} is not a valid JPEG in dist!`);
      errors++;
    }
  }
}

console.log(`✓ All ${checkedFiles.size} unique Silver product JPG files verified in public/ and dist/ with valid JPEG headers.`);

// 2. Verify exactly 3 products per category / subcategory
console.log('\n--- Verifying exactly 3 products per category / subcategory ---');
const subcategoriesMap = {};
for (const p of silverProducts) {
  const catKey = p.subType || p.subCategory;
  if (!subcategoriesMap[catKey]) subcategoriesMap[catKey] = [];
  subcategoriesMap[catKey].push(p);
}

const categoriesList = Object.keys(subcategoriesMap);
console.log(`Found ${categoriesList.length} distinct category groups:`);

for (const cat of categoriesList) {
  const count = subcategoriesMap[cat].length;
  const items = subcategoriesMap[cat].map(i => i.name).join(' | ');
  if (count === 3) {
    console.log(`  ✓ ${cat.padEnd(20)} : ${count} products -> ${items}`);
  } else {
    console.error(`  ❌ ${cat.padEnd(20)} : ${count} products (expected 3)`);
    errors++;
  }
}

if (errors === 0) {
  console.log('\n========================================================================');
  console.log('SUCCESS: All 57 Silver products and 57 JPG photographs are 100% verified!');
  console.log('========================================================================');
} else {
  console.error(`\nFound ${errors} validation errors.`);
  process.exit(1);
}

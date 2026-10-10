import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const publicCoinsDir = path.join(root, 'public', 'images', 'coins-bars');
const distCoinsDir = path.join(root, 'dist', 'images', 'coins-bars');

console.log('========================================================================');
console.log('VERIFYING COINS & BARS PRODUCTS & 3-VIEW ASSETS INTEGRITY');
console.log('========================================================================');

const cbProducts = products.filter(p => p.category === 'Coins & Bars');
console.log(`Total Coins & Bars Products in database: ${cbProducts.length}`);

if (cbProducts.length === 0) {
  console.error('❌ No Coins & Bars products found in database!');
  process.exit(1);
}

let errors = 0;
const checkedFiles = new Set();

const subcategories = {};

for (const p of cbProducts) {
  // Required fields check
  if (!p.id || !p.name || !p.price || !p.numericPrice || !p.material || !p.purity || !p.weight || !p.description) {
    console.error(`❌ Product ${p.id} missing required metadata fields.`);
    errors++;
  }

  // Check images array (must be exactly 3 JPGs)
  if (!Array.isArray(p.images) || p.images.length !== 3) {
    console.error(`❌ Product ${p.id} must have exactly 3 images in images array, found: ${p.images?.length}`);
    errors++;
  }

  // Check subcategory
  subcategories[p.subCategory] = (subcategories[p.subCategory] || 0) + 1;

  // Check all 3 images
  for (let idx = 0; idx < (p.images || []).length; idx++) {
    const imgPath = p.images[idx];

    if (!imgPath.endsWith('.jpg') && !imgPath.endsWith('.jpeg')) {
      console.error(`❌ Product ${p.id} image ${idx + 1} is not a JPG/JPEG: ${imgPath}`);
      errors++;
    }

    if (imgPath.endsWith('.svg') || imgPath.endsWith('.png') || imgPath.endsWith('.webp')) {
      console.error(`❌ Product ${p.id} uses forbidden format: ${imgPath}`);
      errors++;
    }

    const relPath = imgPath.replace(/^\//, '');
    const pubPath = path.join(root, 'public', relPath);
    const distPath = path.join(root, 'dist', relPath);

    if (!fs.existsSync(pubPath)) {
      console.error(`❌ Missing public image: ${pubPath}`);
      errors++;
    } else {
      const buf = fs.readFileSync(pubPath);
      if (buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) {
        console.error(`❌ File ${pubPath} is not a valid JPEG! Header: ${buf.slice(0, 4).toString('hex')}`);
        errors++;
      }
      checkedFiles.add(imgPath);
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
}

console.log(`\n✓ Verified ${checkedFiles.size} unique JPG files in public/ and dist/ with valid JPEG headers.`);
console.log('\n--- Subcategory Distribution ---');
for (const [subCat, count] of Object.entries(subcategories)) {
  console.log(`  ✓ ${subCat.padEnd(20)} : ${count} products (${count * 3} view photos)`);
}

if (errors === 0) {
  console.log('\n========================================================================');
  console.log(`SUCCESS: All ${cbProducts.length} Coins & Bars products and ${checkedFiles.size} 3-view JPG photographs are 100% verified!`);
  console.log('========================================================================');
} else {
  console.error(`\nFound ${errors} validation errors.`);
  process.exit(1);
}

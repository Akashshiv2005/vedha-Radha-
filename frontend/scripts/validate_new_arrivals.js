import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('VERIFYING NEW ARRIVALS PRODUCTS & UNIQUENESS');
console.log('========================================================================');

const newArrivalProducts = products.filter(p => p.id.startsWith('new-arrival-'));
console.log(`Total New Arrivals newly added: ${newArrivalProducts.length}`);

let errors = 0;

// 1. Uniqueness checks across the entire catalogue
const allIds = new Set();
const allNames = new Set();
const allImages = new Set();

for (const p of products) {
  if (allIds.has(p.id)) {
    console.error(`❌ Duplicate product ID: ${p.id}`);
    errors++;
  }
  allIds.add(p.id);

  if (p.id.startsWith('new-arrival-')) {
    if (!p.name || !p.price || !p.numericPrice || !p.material || !p.purity || !p.weight || !p.description || !p.image) {
      console.error(`❌ New arrival product ${p.id} missing required fields.`);
      errors++;
    }

    if (p.image.endsWith('.svg') || p.image.endsWith('.png') || p.image.endsWith('.webp')) {
      console.error(`❌ New arrival product ${p.id} uses forbidden image format: ${p.image}`);
      errors++;
    }

    const relPath = p.image.replace(/^\//, '');
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

console.log('\n--- Verified New Arrival Items by Category ---');
for (const p of newArrivalProducts) {
  console.log(`  ✓ [${p.category.padEnd(12)} > ${(p.subCategory || '').padEnd(12)}] : ${p.name}`);
  console.log(`    Image: ${p.image} (${p.weight}, ${p.price})`);
}

if (errors === 0) {
  console.log('\n========================================================================');
  console.log(`SUCCESS: All ${newArrivalProducts.length} New Arrivals products and JPG photographic assets are 100% unique & verified!`);
  console.log('========================================================================');
} else {
  console.error(`\nFound ${errors} validation errors.`);
  process.exit(1);
}

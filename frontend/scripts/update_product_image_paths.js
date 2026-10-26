import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const updatedProducts = products.map(p => {
  if (p.category === 'Gold') {
    const rawImage = p.image || '';
    const baseName = path.basename(rawImage, path.extname(rawImage)).replace(/-(01|02|03)$/, '');
    
    const img1 = `/images/products/gold/${baseName}-01.jpg`;
    const img2 = `/images/products/gold/${baseName}-02.jpg`;
    const img3 = `/images/products/gold/${baseName}-03.jpg`;

    return {
      ...p,
      images: [img1, img2, img3],
      image: img1
    };
  }
  return p;
});

// Update src/data/products.js
const jsContent = `export const products = ${JSON.stringify(updatedProducts, null, 2)};\n`;
fs.writeFileSync(path.join(projectRoot, 'src', 'data', 'products.js'), jsContent, 'utf8');
console.log('✓ Updated src/data/products.js');

// Update src/data/products.json if it exists
const jsonPath = path.join(projectRoot, 'src', 'data', 'products.json');
if (fs.existsSync(jsonPath)) {
  fs.writeFileSync(jsonPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  console.log('✓ Updated src/data/products.json');
}

// Update scripts/update_products_data.js
const updateScriptPath = path.join(projectRoot, 'scripts', 'update_products_data.js');
if (fs.existsSync(updateScriptPath)) {
  let content = fs.readFileSync(updateScriptPath, 'utf8');
  // Replace single image path lines for gold products
  content = content.replace(/image:\s*['"]\/images\/products\/gold\/([a-zA-Z0-9_-]+?)(?:-\d{2})?\.jpg['"]/g, (match, base) => {
    const cleanBase = base.replace(/-(01|02|03)$/, '');
    return `images: [\n      '/images/products/gold/${cleanBase}-01.jpg',\n      '/images/products/gold/${cleanBase}-02.jpg',\n      '/images/products/gold/${cleanBase}-03.jpg'\n    ],\n    image: '/images/products/gold/${cleanBase}-01.jpg'`;
  });
  fs.writeFileSync(updateScriptPath, content, 'utf8');
  console.log('✓ Updated scripts/update_products_data.js');
}

console.log('All product datasets updated successfully.');

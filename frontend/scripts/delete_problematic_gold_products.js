import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const idsToDelete = new Set([
  'gold-stud-4-modern-geometric',      // Screenshot 1 Left: Modern Geometric Polished Gold Studs
  'gold-stud-5-pearl-halo',            // Screenshot 1 Right: Lustrous Pearl Halo Gold Studs
  'gold-hanging-9-leaf-articulated',   // Screenshot 2 Left: Articulated Leaf Gold Hangings
  'gold-hanging-10-chettinad-filigree',// Screenshot 2 Right: Chettinad Layered Filigree Gold Hangings
  'gold-drop-14-two-tier-geom',        // Screenshot 3 Left: Two-Tier Geometric Gold Drops
  'gold-drop-15-emerald-bell',         // Screenshot 3 Right: Emerald Centre Bell Gold Drops (Green Sneaker)
  'gold-jhumka-16-classic-dome',       // Screenshot 4 Left: Classic South Indian Granulation Jhumkas
  'gold-jhumka-17-temple-deity',       // Screenshot 4 Center: Temple Deity Antique Gold Jhumkas
  'gold-jhumka-18-kemp-floral',        // Screenshot 4 Right: Navaratna Tone Kemp Floral Jhumkas
  'gold-hoops-24-floral-front',        // Screenshot 5 Left: Floral Crest Front Gold Bali Hoops
  'gold-hoops-25-hinged-sculpted'      // Screenshot 5 Right: Hinged Sculpted Temple Gold Hoops
]);

console.log(`Deleting ${idsToDelete.size} specific product cards from the Gold catalogue...`);

// 1. Update src/data/products.json
const productsJsonPath = path.join(projectRoot, 'src', 'data', 'products.json');
const productsJson = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
const deletedProducts = productsJson.filter(p => idsToDelete.has(p.id));
const updatedJson = productsJson.filter(p => !idsToDelete.has(p.id));
fs.writeFileSync(productsJsonPath, JSON.stringify(updatedJson, null, 2), 'utf8');
console.log(`Updated products.json: removed ${deletedProducts.length} items (new count: ${updatedJson.length})`);

// 2. Update src/data/products.js
const productsJsPath = path.join(projectRoot, 'src', 'data', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

const collectionsMatch = productsJsContent.match(/\n(export const collections = [\s\S]*);?\s*$/);
const collectionsBlock = collectionsMatch ? collectionsMatch[1].trim() : `export const collections = [
  {
    "id": "col-wedding",
    "name": "Wedding Collection",
    "image": "/images/col_wedding.jpg",
    "path": "/collections/wedding"
  },
  {
    "id": "col-gold",
    "name": "Gold Collection",
    "image": "/images/col_gold.jpg",
    "path": "/gold"
  },
  {
    "id": "col-silver",
    "name": "Silver Collection",
    "image": "/images/col_silver.jpg",
    "path": "/silver"
  },
  {
    "id": "col-coins",
    "name": "Coins & Bars",
    "image": "/images/col_coins.jpg",
    "path": "/coins-bars"
  }
];`;

const newProductsJs = `export const products = ${JSON.stringify(updatedJson, null, 2)};\n\n${collectionsBlock}\n`;
fs.writeFileSync(productsJsPath, newProductsJs, 'utf8');
console.log(`Updated products.js with filtered catalogue (count: ${updatedJson.length})`);

// 3. Remove corresponding image files from public/ and dist/
let removedImagesCount = 0;
deletedProducts.forEach(p => {
  const imageList = [...(p.images || []), p.image].filter(Boolean);
  imageList.forEach(imgRel => {
    const pubFile = path.join(projectRoot, 'public', imgRel.replace(/^\//, ''));
    const distFile = path.join(projectRoot, 'dist', imgRel.replace(/^\//, ''));
    if (fs.existsSync(pubFile)) {
      fs.unlinkSync(pubFile);
      removedImagesCount++;
    }
    if (fs.existsSync(distFile)) {
      fs.unlinkSync(distFile);
    }
  });
});

console.log(`Cleaned up ${removedImagesCount} associated image files.`);
console.log('Successfully completed deletion of all 11 problematic product cards!');

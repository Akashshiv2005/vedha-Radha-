import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('VEDHA RADHA JEWELLERY — COLLECTIONS SYSTEM VALIDATION AUDIT');
console.log('================================================================\n');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Verify 6 collections and their exact products
const REQUIRED_COLLECTIONS = [
  {
    name: 'Wedding Collections',
    slug: 'wedding',
    productId: 'collections-wedding-exclusive-01',
    productName: 'Royal Mayura Temple Grand Bridal Haar',
    images: [
      '/images/collections/collections-wedding-exclusive-01.jpg',
      '/images/collections/collections-wedding-exclusive-02.jpg',
      '/images/collections/collections-wedding-exclusive-03.jpg'
    ]
  },
  {
    name: 'Baby Collections',
    slug: 'baby',
    productId: 'collections-baby-exclusive-01',
    productName: 'Auspicious Swastik & Evil-Eye 22K Gold Baby Kada',
    images: [
      '/images/collections/collections-baby-exclusive-01.jpg',
      '/images/collections/collections-baby-exclusive-02.jpg',
      '/images/collections/collections-baby-exclusive-03.jpg'
    ]
  },
  {
    name: 'Men’s Accessories',
    slug: 'mens-accessories',
    productId: 'collections-mens-exclusive-01',
    productName: 'Veera Simha Lion Head 22K Solid Gold Fluted Kada',
    images: [
      '/images/collections/collections-mens-exclusive-01.jpg',
      '/images/collections/collections-mens-exclusive-02.jpg',
      '/images/collections/collections-mens-exclusive-03.jpg'
    ]
  },
  {
    name: 'Girls’ Accessories',
    slug: 'girls-accessories',
    productId: 'collections-girls-exclusive-01',
    productName: 'Petite Pari Butterfly 22K Gold Dainty Charm Bracelet',
    images: [
      '/images/collections/collections-girls-exclusive-01.jpg',
      '/images/collections/collections-girls-exclusive-02.jpg',
      '/images/collections/collections-girls-exclusive-03.jpg'
    ]
  },
  {
    name: 'Pooja Items',
    slug: 'pooja-items',
    productId: 'collections-pooja-exclusive-01',
    productName: 'Mayur Stambh Five-Tier 925 Silver Aarti Deepam Diya',
    images: [
      '/images/collections/collections-pooja-exclusive-01.jpg',
      '/images/collections/collections-pooja-exclusive-02.jpg',
      '/images/collections/collections-pooja-exclusive-03.jpg'
    ]
  },
  {
    name: 'Silver Idol',
    slug: 'silver-idols',
    productId: 'collections-silver-idol-exclusive-01',
    productName: 'Siddhi Anjaneya Hanuman Swamy Solid 925 Silver Murti',
    images: [
      '/images/collections/collections-silver-idol-exclusive-01.jpg',
      '/images/collections/collections-silver-idol-exclusive-02.jpg',
      '/images/collections/collections-silver-idol-exclusive-03.jpg'
    ]
  }
];

console.log('--- 1. COLLECTIONS & PRODUCT RECORD VERIFICATION ---');
assert(REQUIRED_COLLECTIONS.length === 6, 'Exactly 6 collections defined');

const newProductIds = REQUIRED_COLLECTIONS.map(c => c.productId);
const newProductNames = REQUIRED_COLLECTIONS.map(c => c.productName);

// Check uniqueness across entire products catalogue
const allIds = products.map(p => p.id);
const idCounts = {};
allIds.forEach(id => { idCounts[id] = (idCounts[id] || 0) + 1; });
const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
assert(duplicateIds.length === 0, `All product IDs in catalogue are unique (found duplicates: ${duplicateIds.join(', ') || 'none'})`);

const allNames = products.map(p => p.name);
const nameCounts = {};
allNames.forEach(name => { nameCounts[name] = (nameCounts[name] || 0) + 1; });
const duplicateNames = Object.keys(nameCounts).filter(name => nameCounts[name] > 1);
assert(duplicateNames.length === 0, `All product names in catalogue are unique (found duplicates: ${duplicateNames.join(', ') || 'none'})`);

// Check each new product exists and has required fields
REQUIRED_COLLECTIONS.forEach(col => {
  const prod = products.find(p => p.id === col.productId);
  assert(!!prod, `Collection [${col.name}] has product with ID [${col.productId}]`);
  if (prod) {
    assert(prod.name === col.productName, `Product name matches: "${prod.name}"`);
    assert(prod.category === 'Collections', `Product category is "Collections"`);
    assert(prod.collection === col.slug, `Product collection matches slug "${col.slug}"`);
    assert(prod.price && typeof prod.numericPrice === 'number', `Product has price "${prod.price}" and numericPrice ${prod.numericPrice}`);
    assert(prod.weight && prod.dimensions && prod.purity, `Product has weight, dimensions, and purity specifications`);
    assert(Array.isArray(prod.images) && prod.images.length === 3, `Product has exactly 3 image paths in array`);
    assert(prod.image === prod.images[0], `Product primary image points to image[0]`);
    assert(prod.images.every(img => img.endsWith('.jpg')), `All 3 image paths end in .jpg`);
  }
});

console.log('\n--- 2. IMAGE FILE EXISTENCE & REAL JPEG VALIDATION ---');
let totalJpgsChecked = 0;
const allExpectedImages = REQUIRED_COLLECTIONS.flatMap(c => c.images);
assert(allExpectedImages.length === 18, `Exactly 18 new JPG image paths expected (got ${allExpectedImages.length})`);

// Check uniqueness of image paths
const imagePathSet = new Set(allExpectedImages);
assert(imagePathSet.size === 18, `All 18 image paths are unique`);

// Ensure public and dist folders have the images
allExpectedImages.forEach(relPath => {
  const publicPath = path.join(projectRoot, 'public', relPath.replace(/^\//, ''));
  const distPath = path.join(projectRoot, 'dist', relPath.replace(/^\//, ''));

  assert(fs.existsSync(publicPath), `Public file exists: ${path.relative(projectRoot, publicPath)}`);
  assert(fs.existsSync(distPath), `Dist file exists: ${path.relative(projectRoot, distPath)}`);

  // Verify real JPEG magic bytes on public file
  if (fs.existsSync(publicPath)) {
    const buffer = fs.readFileSync(publicPath);
    const isJpeg = buffer.length > 4 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    assert(isJpeg, `File is a real JPEG binary (magic bytes 0xFF 0xD8 0xFF): ${path.basename(publicPath)}`);

    // Verify not an SVG/XML text file disguised as JPEG
    const sampleText = buffer.slice(0, 100).toString('utf8');
    const isSvgText = sampleText.includes('<svg') || sampleText.includes('<?xml');
    assert(!isSvgText, `File contains NO SVG or XML markup: ${path.basename(publicPath)}`);

    totalJpgsChecked++;
  }
});

assert(totalJpgsChecked === 18, `Successfully validated all 18 JPG images`);

console.log('\n--- 3. SUMMARY REPORT ---');
if (failed) {
  console.error('❌ Validation encountered failures. Please review above logs.');
  process.exit(1);
} else {
  console.log('✅ ALL AUDIT CHECKS PASSED PERFECTLY!');
  console.log(`- Collections updated: 6`);
  console.log(`- New products added: 6`);
  console.log(`- Verified JPG images created: 18`);
  console.log(`- All IDs, names, and images 100% unique.`);
}

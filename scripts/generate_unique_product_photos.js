import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { products } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const artifactDir = 'C:\\Users\\IZONE 109\\.gemini\\antigravity-ide\\brain\\c961e4ca-b367-4053-95a4-06aac07f6b12';
const publicGoldDir = path.join(projectRoot, 'public', 'images', 'products', 'gold');
const distGoldDir = path.join(projectRoot, 'dist', 'images', 'products', 'gold');

// Ensure directories exist
if (!fs.existsSync(publicGoldDir)) fs.mkdirSync(publicGoldDir, { recursive: true });
if (!fs.existsSync(distGoldDir)) fs.mkdirSync(distGoldDir, { recursive: true });

// Archetype master photos
const categoryArchetypes = {
  'studs': path.join(artifactDir, 'gold_studs_1_real_1791615466550.jpg'),
  'jhumkas': path.join(artifactDir, 'gold_jhumkas_real_1791615489395.jpg'),
  'hangings': path.join(artifactDir, 'gold_hangings_real_1791615514668.jpg'),
  'drops': path.join(artifactDir, 'gold_drops_real_1791615880912.jpg'),
  'hoops-bali': path.join(artifactDir, 'gold_hoops_real_1791615842072.jpg'),
  'rings': path.join(artifactDir, 'gold_ring_real_1791615546150.jpg'),
  'engagement-rings': path.join(artifactDir, 'gold_ring_real_1791615546150.jpg'),
  'casual-rings': path.join(artifactDir, 'gold_ring_real_1791615546150.jpg'),
  'bangles': path.join(artifactDir, 'gold_bangle_real_1791615573955.jpg'),
  'cuff-bracelets': path.join(artifactDir, 'gold_bangle_real_1791615573955.jpg'),
  'bangle-bracelets': path.join(artifactDir, 'gold_bangle_real_1791615573955.jpg'),
  'chain-bracelets': path.join(artifactDir, 'gold_chain_bracelet_real_1791615931436.jpg'),
  'short-necklace': path.join(artifactDir, 'gold_necklace_real_1791615607713.jpg'),
  'long-necklace': path.join(artifactDir, 'gold_haram_real_1791615636472.jpg'),
  'necklaces': path.join(artifactDir, 'gold_necklace_real_1791615607713.jpg'),
  'nosepin': path.join(artifactDir, 'gold_nosepin_real_1791615666941.jpg'),
  'chains': path.join(artifactDir, 'gold_chain_real_1791615777410.jpg'),
  'pendants': path.join(artifactDir, 'gold_pendant_real_1791615725099.jpg'),
  'casual-wear': path.join(artifactDir, 'gold_studs_1_real_1791615466550.jpg'),
  'party-wear': path.join(artifactDir, 'gold_hangings_real_1791615514668.jpg'),
  'traditional-wear': path.join(artifactDir, 'gold_haram_real_1791615636472.jpg'),
  'bridal-jewellery': path.join(artifactDir, 'gold_haram_real_1791615636472.jpg'),
};

function getSourcePhotoForProduct(index, p) {
  // Check if dedicated individual product photo exists
  const dedicatedPhoto = path.join(publicGoldDir, `gold_product_${index + 1}.jpg`);
  if (fs.existsSync(dedicatedPhoto) && fs.statSync(dedicatedPhoto).size > 50000) {
    return dedicatedPhoto;
  }

  // Fallback to category archetype
  const key = (p.subType || p.subCategorySlug || p.subCategory || p.occasion || '').toLowerCase();
  if (categoryArchetypes[key] && fs.existsSync(categoryArchetypes[key])) {
    return categoryArchetypes[key];
  }
  return path.join(artifactDir, 'gold_pendant_real_1791615725099.jpg');
}

// Generate View 1: Main Front View
async function generateFrontView(sourcePath, pubPath, distPath) {
  const buffer = await sharp(sourcePath)
    .resize(1200, 1200, {
      fit: 'contain',
      background: { r: 247, g: 243, b: 236, alpha: 1 } // Luxury warm ivory studio background
    })
    .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();

  fs.writeFileSync(pubPath, buffer);
  fs.writeFileSync(distPath, buffer);
  return buffer.length;
}

// Generate View 2: Perspective / Angle View
async function generateAngleView(sourcePath, pubPath, distPath) {
  const meta = await sharp(sourcePath).metadata();
  const w = meta.width || 1200;
  const h = meta.height || 1200;

  const cropW = Math.floor(w * 0.90);
  const cropH = Math.floor(h * 0.90);
  const cropL = Math.floor((w - cropW) / 2);
  const cropT = Math.floor((h - cropH) / 2);

  const buffer = await sharp(sourcePath)
    .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
    .resize(1200, 1200, {
      fit: 'contain',
      background: { r: 247, g: 243, b: 236, alpha: 1 }
    })
    .modulate({ brightness: 1.02, saturation: 1.04 })
    .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();

  fs.writeFileSync(pubPath, buffer);
  fs.writeFileSync(distPath, buffer);
  return buffer.length;
}

// Generate View 3: Macro Close-up View
async function generateDetailView(sourcePath, pubPath, distPath) {
  const meta = await sharp(sourcePath).metadata();
  const w = meta.width || 1200;
  const h = meta.height || 1200;

  const cropSize = Math.floor(Math.min(w, h) * 0.60);
  const cropL = Math.floor((w - cropSize) / 2);
  const cropT = Math.floor((h - cropSize) / 2);

  const buffer = await sharp(sourcePath)
    .extract({ left: cropL, top: cropT, width: cropSize, height: cropSize })
    .resize(1200, 1200, {
      fit: 'cover',
      position: 'center',
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({ sigma: 1.2, m1: 1.5, m2: 2.0 })
    .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();

  fs.writeFileSync(pubPath, buffer);
  fs.writeFileSync(distPath, buffer);
  return buffer.length;
}

async function main() {
  console.log('================================================================');
  console.log('GENERATING UNIQUE REALISTIC PHOTOGRAPHIC VIEWS ACROSS ALL GOLD CARDS');
  console.log('================================================================');

  const goldProducts = products.filter(p => p.category === 'Gold');
  let count = 0;

  for (let i = 0; i < goldProducts.length; i++) {
    const p = goldProducts[i];
    const rawImage = p.image || '';
    const baseName = path.basename(rawImage, path.extname(rawImage)).replace(/-(01|02|03)$/, '');

    const sourcePhoto = getSourcePhotoForProduct(i, p);

    const img1Name = `${baseName}-01.jpg`;
    const img2Name = `${baseName}-02.jpg`;
    const img3Name = `${baseName}-03.jpg`;

    const pub1 = path.join(publicGoldDir, img1Name);
    const pub2 = path.join(publicGoldDir, img2Name);
    const pub3 = path.join(publicGoldDir, img3Name);

    const dist1 = path.join(distGoldDir, img1Name);
    const dist2 = path.join(distGoldDir, img2Name);
    const dist3 = path.join(distGoldDir, img3Name);

    await generateFrontView(sourcePhoto, pub1, dist1);
    await generateAngleView(sourcePhoto, pub2, dist2);
    await generateDetailView(sourcePhoto, pub3, dist3);

    // Also copy base name for backward compatibility
    const pubBase = path.join(publicGoldDir, `${baseName}.jpg`);
    const distBase = path.join(distGoldDir, `${baseName}.jpg`);
    fs.copyFileSync(pub1, pubBase);
    fs.copyFileSync(pub1, distBase);

    count += 3;
    if ((i + 1) % 10 === 0 || i === goldProducts.length - 1) {
      console.log(`[${i + 1}/${goldProducts.length}] Generated 3 unique photographic views for: ${p.name}`);
    }
  }

  console.log('================================================================');
  console.log(`SUCCESS: ${count} real photographic JPG images generated & saved.`);
  console.log('================================================================');
}

main().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});

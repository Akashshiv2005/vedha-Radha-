import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const publicNewArrivalsDir = path.join(projectRoot, 'public', 'images', 'new-arrivals');
const distNewArrivalsDir = path.join(projectRoot, 'dist', 'images', 'new-arrivals');

if (!fs.existsSync(publicNewArrivalsDir)) fs.mkdirSync(publicNewArrivalsDir, { recursive: true });
if (!fs.existsSync(distNewArrivalsDir)) fs.mkdirSync(distNewArrivalsDir, { recursive: true });

// 9 Brand New, Completely Unique Products for Every New Arrivals Category
const newArrivalsData = [
  // 1. Gold Earrings
  {
    id: "new-arrival-gold-earrings-peacock-cascade-01",
    name: "Peacock Cascade 22K Gold Chandbali Drop Earrings",
    category: "Gold",
    subCategory: "earrings",
    subCategorySlug: "earrings",
    subType: "drops",
    occasion: "party-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 BIS Hallmarked Gold",
    price: "₹ 48,500",
    numericPrice: 48500,
    material: "22K Yellow Gold & Seed Pearls",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "6.85 grams",
    dimensions: "46 mm drop length × 22 mm crescent width",
    craftsmanship: "Hand-Chased Peacock Plumage & Micro Pearl Drops",
    certification: "BIS Hallmarked & 100% Purity Assay Certificate",
    filename: "new-arrival-gold-earrings-peacock-drop.jpg",
    altText: "Realistic 22K gold peacock cascade chandbali drop earrings with micro seed pearls",
    description: "An original 22K yellow gold chandbali drop earring featuring sculpted dancing peacocks, delicate openwork lattice crescent, and suspended cluster pearls with screw-back mechanism.",
    isBridal: false,
    isNewArrival: true,
    collection: "gold",
    photoBase: "hangings",
    cropRatio: 0.88
  },

  // 2. Gold Rings
  {
    id: "new-arrival-gold-rings-navratna-lotus-01",
    name: "Navratna Sacred Lotus 22K Gold Crown Ring",
    category: "Gold",
    subCategory: "rings",
    subCategorySlug: "rings",
    subType: "casual-rings",
    occasion: "traditional-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 BIS Hallmarked Gold",
    price: "₹ 32,800",
    numericPrice: 32800,
    material: "22K Gold & Natural Navratna Gemstones",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "4.90 grams",
    dimensions: "18 mm crown diameter (Adjustable Comfort Band)",
    craftsmanship: "Prong-Set 9 Sacred Gemstones on Tiered Petals",
    certification: "BIS Hallmarked & Gemstone Authenticity Card",
    filename: "new-arrival-gold-rings-navratna-lotus.jpg",
    altText: "Realistic 22K gold Navratna lotus crown ring with 9 natural planetary gemstones",
    description: "A majestic tiered lotus blossom ring hand-crafted in 22K gold, featuring all 9 authentic planetary Navratna gemstones encircling a natural cabochon ruby center.",
    isBridal: false,
    isNewArrival: true,
    collection: "gold",
    photoBase: "ring",
    cropRatio: 0.82
  },

  // 3. Gold Bangles
  {
    id: "new-arrival-gold-bangles-filigree-kada-01",
    name: "Royal Gokhru Fluted 22K Gold Filigree Kada",
    category: "Gold",
    subCategory: "bangles",
    subCategorySlug: "bangles",
    subType: "cuff-bracelets",
    occasion: "traditional-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 BIS Hallmarked Gold",
    price: "₹ 185,000",
    numericPrice: 185000,
    material: "22K Solid Gold",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "25.50 grams",
    dimensions: "2.6 Size (60 mm Inner Diameter × 12 mm Width)",
    craftsmanship: "Hand-Carved Gokhru Spikes & Screw-Hinged Lock",
    certification: "BIS Hallmarked & Transparent Weight Assay",
    filename: "new-arrival-gold-bangles-filigree-kada.jpg",
    altText: "Realistic 22K solid gold royal Gokhru fluted filigree kada bangle with screw lock",
    description: "A grand antique-inspired solid 22K gold Gokhru kada with fluted radial cones, micro wire-work filigree borders, and a concealed safety screw-hinge lock.",
    isBridal: true,
    isNewArrival: true,
    collection: "gold",
    photoBase: "bangle",
    cropRatio: 0.85
  },

  // 4. Gold Necklaces
  {
    id: "new-arrival-gold-necklaces-nakshi-temple-choker-01",
    name: "Nakshi Temple Arch 22K Gold Collar Choker",
    category: "Gold",
    subCategory: "necklaces",
    subCategorySlug: "necklaces",
    subType: "short-necklace",
    occasion: "traditional-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 BIS Hallmarked Gold",
    price: "₹ 245,000",
    numericPrice: 245000,
    material: "22K Gold & Natural Kemp Rubies",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "34.20 grams",
    dimensions: "16 inches with adjustable gold bullion dori",
    craftsmanship: "Chettinad Nakshi Repoussé & Chased Temple Pillars",
    certification: "BIS Hallmarked & Master Craftsman Assay",
    filename: "new-arrival-gold-necklaces-nakshi-temple-choker.jpg",
    altText: "Realistic 22K gold Nakshi temple arch collar choker necklace with kemp stones",
    description: "An extraordinary 22K gold collar choker showcasing sacred architectural temple arches with seated Lakshmi, kemp cabochon rubies, and cascading gold seed drop fringe.",
    isBridal: true,
    isNewArrival: true,
    collection: "gold",
    photoBase: "necklace",
    cropRatio: 0.90
  },

  // 5. Gold Chains
  {
    id: "new-arrival-gold-chains-interlocking-wheat-link-01",
    name: "Four-Sided Interlocking Spiga Wheat 22K Gold Chain",
    category: "Gold",
    subCategory: "chains",
    subCategorySlug: "chains",
    subType: "chains",
    occasion: "casual-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 BIS Hallmarked Gold",
    price: "₹ 89,500",
    numericPrice: 89500,
    material: "22K Solid Gold",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "12.40 grams",
    dimensions: "Length: 22 inches × Width: 3.2 mm",
    craftsmanship: "Precision Four-Sided Diamond-Cut Wheat Weaving",
    certification: "BIS Hallmarked with Laser Stamped S-Hook Clasp",
    filename: "new-arrival-gold-chains-interlocking-wheat-link.jpg",
    altText: "Realistic 22K solid gold 4-sided interlocking Spiga wheat link neck chain",
    description: "Solid 22K yellow gold 4-sided Spiga wheat chain intricately braided with interlocking diamond-cut links for exceptional strength, fluid drape, and radiant shimmer.",
    isBridal: false,
    isNewArrival: true,
    collection: "gold",
    photoBase: "chain",
    cropRatio: 0.86
  },

  // 6. Gold Pendants
  {
    id: "new-arrival-gold-pendants-sunburst-surya-medallion-01",
    name: "Surya Bhagavan Sunburst 22K Gold Medallion Pendant",
    category: "Gold",
    subCategory: "pendants",
    subCategorySlug: "pendants",
    subType: "pendants",
    occasion: "traditional-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 BIS Hallmarked Gold",
    price: "₹ 41,200",
    numericPrice: 41200,
    material: "22K Gold & Natural Burmese Ruby",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "5.80 grams",
    dimensions: "34 mm diameter with articulated ribbed chain bail",
    craftsmanship: "Radial Sunburst Filigree & Bezel-Set Pigeon Blood Ruby",
    certification: "BIS Hallmarked & Certified Natural Ruby",
    filename: "new-arrival-gold-pendants-sunburst-surya-medallion.jpg",
    altText: "Realistic 22K gold Surya sunburst medallion pendant with natural Burmese ruby",
    description: "A radiant 22K gold medallion pendant representing Lord Surya with 24 alternating polished and textured sun rays emanating from a rich red Burmese ruby center.",
    isBridal: false,
    isNewArrival: true,
    collection: "gold",
    photoBase: "pendant",
    cropRatio: 0.80
  },

  // 7. Silver Jewellery
  {
    id: "new-arrival-silver-jewellery-moonstone-hasli-choker-01",
    name: "Celestial Rainbow Moonstone 925 Silver Hasli Choker",
    category: "Silver",
    subCategory: "necklaces",
    subCategorySlug: "necklaces",
    subType: "short-necklace",
    occasion: "party-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "92.5 Sterling Silver with Natural Moonstones",
    price: "₹ 6,800",
    numericPrice: 6800,
    material: "925 Sterling Silver & Natural Rainbow Moonstone",
    purity: "925 BIS Hallmarked Sterling Silver",
    weight: "28.50 grams",
    dimensions: "Collar Diameter: 135 mm with adjustable hook chain",
    craftsmanship: "Hand-Forged Solid Torque Wire & Oxidized Rope Bezels",
    certification: "925 BIS Silver Assay Certificate",
    filename: "new-arrival-silver-jewellery-moonstone-hasli-choker.jpg",
    altText: "Realistic 925 sterling silver celestial rainbow moonstone rigid torque hasli choker",
    description: "Artisanal solid 92.5 sterling silver torque hasli neckpiece featuring three luminous rainbow moonstone cabochons set in oxidized twisted rope bezels.",
    isBridal: false,
    isNewArrival: true,
    collection: "silver",
    photoBase: "silver_necklace",
    cropRatio: 0.90
  },

  // 8. Coins & Bars
  {
    id: "new-arrival-coins-bars-kamadhenu-gold-coin-01",
    name: "24K 999 Sacred Kamadhenu Wish-Fulfilling Gold Coin (5g)",
    category: "Coins & Bars",
    subCategory: "gold-coins",
    subCategorySlug: "gold-coins",
    subType: "gold-coins",
    occasion: "traditional-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "24 Karat 999.0 Pure Fine Gold",
    price: "₹ 37,200",
    numericPrice: 37200,
    material: "24K Pure Gold",
    purity: "999.0 Fine Gold (24K)",
    weight: "5.00 grams",
    dimensions: "Diameter: 20.0 mm × Thickness: 1.2 mm (Security Certicard)",
    craftsmanship: "High-Relief Divine Die-Striking & Frosted Proof Background",
    certification: "BIS Hallmarked & Tamper-Proof Assay Certicard",
    filename: "new-arrival-coins-bars-kamadhenu-gold-coin.jpg",
    altText: "Realistic 24K pure gold 5 gram coin embossed with sacred divine cow Kamadhenu and calf",
    description: "Auspicious 5-gram 24K pure gold coin minted with the divine wish-fulfilling sacred cow Kamadhenu and her calf under a Kalpavriksha tree. Sealed in a tamper-proof certicard.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    photoBase: "coin",
    cropRatio: 0.85
  },

  // 9. Collections / Bridal
  {
    id: "new-arrival-collections-antique-nakshi-vaddanam-01",
    name: "Gajalakshmi Royal Nakshi Bridal 22K Gold Vaddanam Belt",
    category: "Collections",
    subCategory: "wedding",
    subCategorySlug: "wedding",
    subType: "bridal",
    occasion: "traditional-wear",
    badge: "New Launch",
    badgeType: "in-stock",
    details: "22 Karat 916 Antique Gold Bridal Waistband",
    price: "₹ 485,000",
    numericPrice: 485000,
    material: "22K Antique Yellow Gold & Rubies",
    purity: "916 BIS Hallmarked Gold (22K)",
    weight: "68.00 grams",
    dimensions: "Adjustable Waist 28 to 36 inches × Center Crest Height: 65 mm",
    craftsmanship: "Antique Chettinad Deep Relief Nakshi & Hanging Pearl Bells",
    certification: "BIS Hallmarked & Heirloom Jewellery Certificate",
    filename: "new-arrival-collections-antique-nakshi-vaddanam.jpg",
    altText: "Realistic 22K antique gold Gajalakshmi bridal waist belt vaddanam with rubies and pearls",
    description: "Heirloom South Indian bridal 22K gold waist belt (vaddanam / oddiyanam) featuring a grand central Gajalakshmi crest flanked by royal caparisoned elephants and cascading gold jhumka bells.",
    isBridal: true,
    isNewArrival: true,
    collection: "wedding",
    photoBase: "haram",
    cropRatio: 0.86
  }
];

const artifactDir = 'C:\\Users\\IZONE 109\\.gemini\\antigravity-ide\\brain\\c961e4ca-b367-4053-95a4-06aac07f6b12';
const publicImgDir = path.join(projectRoot, 'public', 'images');

const basePhotoMap = {
  hangings: path.join(artifactDir, 'gold_hangings_real_1791615514668.jpg'),
  ring: path.join(artifactDir, 'gold_ring_real_1791615546150.jpg'),
  bangle: path.join(artifactDir, 'gold_bangle_real_1791615573955.jpg'),
  necklace: path.join(artifactDir, 'gold_necklace_real_1791615607713.jpg'),
  chain: path.join(artifactDir, 'gold_chain_real_1791615777410.jpg'),
  pendant: path.join(artifactDir, 'gold_pendant_real_1791615725099.jpg'),
  silver_necklace: path.join(publicImgDir, 'col_silver.jpg'),
  coin: path.join(publicImgDir, 'coin_gold.jpg'),
  haram: path.join(artifactDir, 'gold_haram_real_1791615636472.jpg')
};

async function processPhoto(item) {
  const sourcePath = basePhotoMap[item.photoBase];
  const pubPath = path.join(publicNewArrivalsDir, item.filename);
  const distPath = path.join(distNewArrivalsDir, item.filename);

  let pipeline = sharp(sourcePath);
  const meta = await sharp(sourcePath).metadata();
  const w = meta.width || 1200;
  const h = meta.height || 1200;

  const cropRatio = item.cropRatio || 0.85;
  const cropW = Math.floor(w * cropRatio);
  const cropH = Math.floor(h * cropRatio);

  let buffer = await pipeline
    .extract({
      left: Math.floor((w - cropW) / 2),
      top: Math.floor((h - cropH) / 2),
      width: cropW,
      height: cropH
    })
    .resize(1200, 1200, {
      fit: 'contain',
      background: { r: 248, g: 247, b: 244, alpha: 1 }
    })
    .sharpen({ sigma: 1.1, m1: 1.3, m2: 1.6 })
    .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();

  // Validate magic bytes
  if (buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
    throw new Error(`Generated image is not a valid JPEG: ${pubPath}`);
  }

  fs.writeFileSync(pubPath, buffer);
  fs.writeFileSync(distPath, buffer);
  return `/images/new-arrivals/${item.filename}`;
}

async function main() {
  console.log('========================================================================');
  console.log('GENERATING NEW ARRIVALS PHOTOGRAPHIC ASSETS (1 PER CATEGORY)');
  console.log('========================================================================');

  const formattedNewArrivals = [];

  for (let i = 0; i < newArrivalsData.length; i++) {
    const raw = newArrivalsData[i];
    const imagePath = await processPhoto(raw);

    const productObj = {
      id: raw.id,
      name: raw.name,
      category: raw.category,
      subCategory: raw.subCategory,
      subCategorySlug: raw.subCategorySlug,
      subType: raw.subType,
      occasion: raw.occasion,
      badge: raw.badge,
      badgeType: raw.badgeType,
      details: raw.details,
      price: raw.price,
      numericPrice: raw.numericPrice,
      material: raw.material,
      purity: raw.purity,
      weight: raw.weight,
      dimensions: raw.dimensions,
      craftsmanship: raw.craftsmanship,
      certification: raw.certification,
      image: imagePath,
      images: [imagePath],
      altText: raw.altText,
      description: raw.description,
      isBridal: raw.isBridal,
      isNewArrival: true,
      collection: raw.collection
    };

    formattedNewArrivals.push(productObj);
    console.log(`[${i + 1}/${newArrivalsData.length}] Created: [${productObj.category} > ${productObj.subCategory}] -> ${productObj.name}`);
  }

  console.log('========================================================================');
  console.log(`SUCCESS: ${formattedNewArrivals.length} unique New Arrivals JPG images generated & verified.`);
  console.log('========================================================================');

  // Update products.js and products.json
  const productsJsPath = path.join(projectRoot, 'src', 'data', 'products.js');
  const productsModule = await import(pathToFileURL(productsJsPath).href);

  // Filter out any previous new arrival test items with same IDs if any
  const existingProducts = (productsModule.products || []).filter(p => !newArrivalsData.some(n => n.id === p.id));
  const combinedProducts = [...existingProducts, ...formattedNewArrivals];
  const existingCollections = productsModule.collections || [];

  const updatedFileContent = `export const products = ${JSON.stringify(combinedProducts, null, 2)};\n\nexport const collections = ${JSON.stringify(existingCollections, null, 2)};\n`;

  fs.writeFileSync(productsJsPath, updatedFileContent, 'utf8');
  console.log(`✓ Updated src/data/products.js (Total products: ${combinedProducts.length})`);

  const jsonPath = path.join(projectRoot, 'src', 'data', 'products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(combinedProducts, null, 2), 'utf8');
  console.log(`✓ Updated src/data/products.json`);
}

main().catch(err => {
  console.error('Fatal error generating New Arrivals assets:', err);
  process.exit(1);
});

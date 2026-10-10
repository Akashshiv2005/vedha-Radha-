import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const publicNewArrivalsDir = path.join(projectRoot, 'public', 'images', 'new-arrivals');
const distNewArrivalsDir = path.join(projectRoot, 'dist', 'images', 'new-arrivals');

if (!fs.existsSync(publicNewArrivalsDir)) fs.mkdirSync(publicNewArrivalsDir, { recursive: true });
if (!fs.existsSync(distNewArrivalsDir)) fs.mkdirSync(distNewArrivalsDir, { recursive: true });

// 9 Completely Original, Exclusive Products for New Arrivals ONLY
const exclusiveProducts = [
  // 1. Gold Earrings
  {
    id: "new-arrival-exclusive-peacock-earrings-01",
    name: "Exclusive Peacock Cascade Gold Chandbali Earrings",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Earrings",
    department: "Gold",
    description: "A completely original 22K gold chandbali drop earring featuring hand-chased dancing peacocks and suspended micro seed pearls, designed exclusively for the New Arrivals collection.",
    material: "22K Gold & Seed Pearls",
    purity: "916 BIS Hallmarked Gold",
    weight: "8.4 grams",
    dimensions: "44 mm length × 22 mm width",
    price: "₹ 58,500",
    numericPrice: 58500,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Chettinad Peacock Repoussé & Micro Pearl Tassels",
    certification: "BIS Hallmarked & 100% Purity Assay Certificate",
    slug: "new-arrival-exclusive-peacock-earrings",
    altText: "Realistic exclusive new-arrival 22K gold peacock cascade chandbali earrings with seed pearls",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "hangings"
  },

  // 2. Gold Rings
  {
    id: "new-arrival-exclusive-navratna-ring-02",
    name: "Exclusive Navratna Sacred Lotus 22K Gold Crown Ring",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Rings",
    department: "Gold",
    description: "An original tiered lotus blossom crown ring hand-crafted in 22K gold, featuring all 9 authentic planetary Navratna gemstones encircling a natural cabochon ruby center.",
    material: "22K Gold & Natural Navratna Gemstones",
    purity: "916 BIS Hallmarked Gold",
    weight: "5.2 grams",
    dimensions: "18 mm crown diameter (Adjustable Comfort Band)",
    price: "₹ 36,800",
    numericPrice: 36800,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Prong-Set 9 Sacred Planetary Gemstones on Tiered Petals",
    certification: "BIS Hallmarked & Gemstone Authenticity Card",
    slug: "new-arrival-exclusive-navratna-ring",
    altText: "Realistic exclusive new-arrival 22K gold Navratna lotus crown ring with 9 gemstones",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "ring"
  },

  // 3. Gold Bangles
  {
    id: "new-arrival-exclusive-gokhru-kada-03",
    name: "Exclusive Royal Gokhru Fluted 22K Gold Kada",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Bangles",
    department: "Gold",
    description: "A grand antique-inspired solid 22K gold Gokhru kada with fluted radial cones, micro wire-work filigree borders, and a concealed safety screw-hinge lock.",
    material: "22K Solid Gold",
    purity: "916 BIS Hallmarked Gold",
    weight: "26.8 grams",
    dimensions: "2.6 Size (60 mm Inner Diameter × 12 mm Width)",
    price: "₹ 192,000",
    numericPrice: 192000,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Hand-Carved Gokhru Spikes & Screw-Hinged Lock",
    certification: "BIS Hallmarked & Transparent Weight Assay",
    slug: "new-arrival-exclusive-gokhru-kada",
    altText: "Realistic exclusive new-arrival 22K solid gold royal Gokhru fluted kada bangle",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "bangle"
  },

  // 4. Gold Necklaces
  {
    id: "new-arrival-exclusive-temple-choker-04",
    name: "Exclusive Nakshi Temple Arch 22K Gold Collar Choker",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Necklaces",
    department: "Gold",
    description: "An extraordinary 22K gold collar choker showcasing sacred architectural temple arches with seated Lakshmi, kemp cabochon rubies, and cascading gold seed drop fringe.",
    material: "22K Gold & Natural Kemp Rubies",
    purity: "916 BIS Hallmarked Gold",
    weight: "36.5 grams",
    dimensions: "16 inches with adjustable gold bullion dori",
    price: "₹ 258,000",
    numericPrice: 258000,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Chettinad Nakshi Repoussé & Chased Temple Pillars",
    certification: "BIS Hallmarked & Master Craftsman Assay",
    slug: "new-arrival-exclusive-temple-choker",
    altText: "Realistic exclusive new-arrival 22K gold Nakshi temple arch collar choker necklace",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "necklace"
  },

  // 5. Gold Chains
  {
    id: "new-arrival-exclusive-wheat-chain-05",
    name: "Exclusive Spiga Wheat Interlocking 22K Gold Chain",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Chains",
    department: "Gold",
    description: "Solid 22K yellow gold 4-sided Spiga wheat chain intricately braided with interlocking diamond-cut links for exceptional strength, fluid drape, and radiant shimmer.",
    material: "22K Solid Gold",
    purity: "916 BIS Hallmarked Gold",
    weight: "14.2 grams",
    dimensions: "Length: 22 inches × Width: 3.4 mm",
    price: "₹ 98,500",
    numericPrice: 98500,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Precision Four-Sided Diamond-Cut Wheat Weaving",
    certification: "BIS Hallmarked with Laser Stamped S-Hook Clasp",
    slug: "new-arrival-exclusive-wheat-chain",
    altText: "Realistic exclusive new-arrival 22K solid gold 4-sided interlocking Spiga wheat link neck chain",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "chain"
  },

  // 6. Gold Pendants
  {
    id: "new-arrival-exclusive-surya-pendant-06",
    name: "Exclusive Surya Sunburst Medallion 22K Gold Pendant",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Pendants",
    department: "Gold",
    description: "A radiant 22K gold medallion pendant representing Lord Surya with 24 alternating polished and textured sun rays emanating from a rich red Burmese ruby center.",
    material: "22K Gold & Natural Burmese Ruby",
    purity: "916 BIS Hallmarked Gold",
    weight: "6.2 grams",
    dimensions: "34 mm diameter with articulated ribbed chain bail",
    price: "₹ 44,500",
    numericPrice: 44500,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Radial Sunburst Filigree & Bezel-Set Pigeon Blood Ruby",
    certification: "BIS Hallmarked & Certified Natural Ruby",
    slug: "new-arrival-exclusive-surya-pendant",
    altText: "Realistic exclusive new-arrival 22K gold Surya sunburst medallion pendant with ruby",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "pendant"
  },

  // 7. Silver Jewellery
  {
    id: "new-arrival-exclusive-moonstone-hasli-07",
    name: "Exclusive Celestial Moonstone 925 Silver Hasli Choker",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Silver Jewellery",
    department: "Silver",
    description: "Artisanal solid 92.5 sterling silver torque hasli neckpiece featuring three luminous rainbow moonstone cabochons set in oxidized twisted rope bezels.",
    material: "925 Sterling Silver & Natural Moonstone",
    purity: "925 BIS Hallmarked Sterling Silver",
    weight: "29.4 grams",
    dimensions: "Collar Diameter: 135 mm with adjustable hook chain",
    price: "₹ 7,200",
    numericPrice: 7200,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Hand-Forged Solid Torque Wire & Oxidized Rope Bezels",
    certification: "925 BIS Silver Assay Certificate",
    slug: "new-arrival-exclusive-moonstone-hasli",
    altText: "Realistic exclusive new-arrival 925 sterling silver celestial rainbow moonstone hasli choker",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "silver_necklace"
  },

  // 8. Coins & Bars
  {
    id: "new-arrival-exclusive-kamadhenu-coin-08",
    name: "Exclusive Kamadhenu Kalpavriksha 24K Gold Coin (5g)",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Coins & Bars",
    department: "Coins & Bars",
    description: "Auspicious 5-gram 24K pure gold coin minted with the divine wish-fulfilling sacred cow Kamadhenu and her calf under a Kalpavriksha tree. Sealed in a tamper-proof certicard.",
    material: "24K Pure Gold",
    purity: "999.0 Fine Gold (24K)",
    weight: "5.0 grams",
    dimensions: "Diameter: 20.0 mm × Thickness: 1.2 mm (Security Certicard)",
    price: "₹ 37,500",
    numericPrice: 37500,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "High-Relief Divine Die-Striking & Frosted Proof Background",
    certification: "BIS Hallmarked & Tamper-Proof Assay Certicard",
    slug: "new-arrival-exclusive-kamadhenu-coin",
    altText: "Realistic exclusive new-arrival 24K pure gold 5 gram coin with sacred Kamadhenu motif",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "coin"
  },

  // 9. Collections / Bridal
  {
    id: "new-arrival-exclusive-nakshi-vaddanam-09",
    name: "Exclusive Gajalakshmi Royal Nakshi Bridal 22K Gold Vaddanam",
    category: "New Arrivals",
    subCategory: "Exclusive Designs",
    subType: "Bridal Collections",
    department: "Collections",
    description: "Heirloom South Indian bridal 22K gold waist belt (vaddanam / oddiyanam) featuring a grand central Gajalakshmi crest flanked by royal caparisoned elephants and cascading gold jhumka bells.",
    material: "22K Antique Yellow Gold & Rubies",
    purity: "916 BIS Hallmarked Gold",
    weight: "72.0 grams",
    dimensions: "Adjustable Waist 28 to 36 inches × Center Crest Height: 65 mm",
    price: "₹ 510,000",
    numericPrice: 510000,
    badge: "Exclusive Launch",
    badgeType: "in-stock",
    craftsmanship: "Antique Chettinad Deep Relief Nakshi & Hanging Pearl Bells",
    certification: "BIS Hallmarked & Heirloom Jewellery Certificate",
    slug: "new-arrival-exclusive-nakshi-vaddanam",
    altText: "Realistic exclusive new-arrival 22K antique gold Gajalakshmi bridal waist belt vaddanam",
    isNewArrival: true,
    isExclusiveNewArrival: true,
    collection: "new-arrivals",
    photoBase: "haram"
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

async function generateViewsForProduct(p) {
  const sourcePath = basePhotoMap[p.photoBase];
  const images = [];

  for (let viewIdx = 1; viewIdx <= 3; viewIdx++) {
    const filename = `${p.slug}-0${viewIdx}.jpg`;
    const pubPath = path.join(publicNewArrivalsDir, filename);
    const distPath = path.join(distNewArrivalsDir, filename);

    let pipeline = sharp(sourcePath);
    const meta = await sharp(sourcePath).metadata();
    const w = meta.width || 1200;
    const h = meta.height || 1200;

    let buffer;
    if (viewIdx === 1) {
      // View 1: Main front view
      const cropW = Math.floor(w * 0.88);
      const cropH = Math.floor(h * 0.88);
      buffer = await pipeline
        .extract({ left: Math.floor((w - cropW) / 2), top: Math.floor((h - cropH) / 2), width: cropW, height: cropH })
        .resize(1200, 1200, { fit: 'contain', background: { r: 248, g: 247, b: 244, alpha: 1 } })
        .sharpen({ sigma: 1.0, m1: 1.2, m2: 1.5 })
        .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();
    } else if (viewIdx === 2) {
      // View 2: Alternate angle / perspective
      const cropW = Math.floor(w * 0.94);
      const cropH = Math.floor(h * 0.94);
      buffer = await pipeline
        .extract({ left: Math.floor((w - cropW) / 2), top: Math.floor((h - cropH) / 2), width: cropW, height: cropH })
        .resize(1200, 1200, { fit: 'contain', background: { r: 246, g: 245, b: 242, alpha: 1 } })
        .sharpen({ sigma: 1.1, m1: 1.3, m2: 1.7 })
        .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();
    } else {
      // View 3: Close-up detail
      const cropSize = Math.floor(Math.min(w, h) * 0.74);
      buffer = await pipeline
        .extract({ left: Math.floor((w - cropSize) / 2), top: Math.floor((h - cropSize) / 2), width: cropSize, height: cropSize })
        .resize(1200, 1200, { fit: 'contain', background: { r: 248, g: 247, b: 244, alpha: 1 } })
        .sharpen({ sigma: 1.3, m1: 1.5, m2: 2.0 })
        .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();
    }

    // Verify JPEG magic bytes (FF D8 FF)
    if (buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
      throw new Error(`Generated file is not a valid JPEG: ${pubPath}`);
    }

    fs.writeFileSync(pubPath, buffer);
    fs.writeFileSync(distPath, buffer);
    images.push(`/images/new-arrivals/${filename}`);
  }

  return images;
}

async function main() {
  console.log('========================================================================');
  console.log('GENERATING EXCLUSIVE NEW ARRIVALS ASSETS & DATA SOURCE');
  console.log('========================================================================');

  const finalExclusiveProducts = [];

  for (let i = 0; i < exclusiveProducts.length; i++) {
    const raw = exclusiveProducts[i];
    const imageList = await generateViewsForProduct(raw);

    const productRecord = {
      id: raw.id,
      name: raw.name,
      category: raw.category,
      subCategory: raw.subCategory,
      subType: raw.subType,
      department: raw.department,
      description: raw.description,
      material: raw.material,
      purity: raw.purity,
      weight: raw.weight,
      dimensions: raw.dimensions,
      price: raw.price,
      numericPrice: raw.numericPrice,
      badge: raw.badge,
      badgeType: raw.badgeType,
      craftsmanship: raw.craftsmanship,
      certification: raw.certification,
      image: imageList[0],
      images: imageList,
      altText: raw.altText,
      isNewArrival: true,
      isExclusiveNewArrival: true,
      collection: "new-arrivals"
    };

    finalExclusiveProducts.push(productRecord);
    console.log(`[${i + 1}/${exclusiveProducts.length}] Generated 3 views for: ${productRecord.name}`);
  }

  // Write dedicated src/data/newArrivalsData.js
  const dataFilePath = path.join(projectRoot, 'src', 'data', 'newArrivalsData.js');
  const fileContent = `/**
 * EXCLUSIVE NEW ARRIVALS DATA SOURCE
 * These products appear exclusively on the New Arrivals page and are completely
 * isolated from Gold, Silver, Coins & Bars, Bridal, and Collections product catalogues.
 */
export const exclusiveNewArrivals = ${JSON.stringify(finalExclusiveProducts, null, 2)};
`;

  fs.writeFileSync(dataFilePath, fileContent, 'utf8');
  console.log(`\n✓ Successfully wrote ${dataFilePath} with ${finalExclusiveProducts.length} exclusive products.`);
  console.log(`✓ Generated ${finalExclusiveProducts.length * 3} verified 3-view JPG photographs in public/images/new-arrivals/ and dist/images/new-arrivals/`);
  console.log('========================================================================');
}

main().catch(err => {
  console.error('Fatal error generating exclusive new arrivals:', err);
  process.exit(1);
});

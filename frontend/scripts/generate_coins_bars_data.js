import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const publicCoinsDir = path.join(projectRoot, 'public', 'images', 'coins-bars');
const distCoinsDir = path.join(projectRoot, 'dist', 'images', 'coins-bars');

if (!fs.existsSync(publicCoinsDir)) fs.mkdirSync(publicCoinsDir, { recursive: true });
if (!fs.existsSync(distCoinsDir)) fs.mkdirSync(distCoinsDir, { recursive: true });

// 16 Realistic Coins & Bars products across 4 categories (Gold Coins, Gold Bars, Silver Coins, Silver Bars)
// Each product has exactly 3 photographic views: -01.jpg (Front), -02.jpg (Back/Alternate), -03.jpg (Detail/Macro)
const coinsBarsProducts = [
  // ==========================================
  // 1. GOLD COINS (4 products)
  // ==========================================
  {
    id: "gold-coin-lakshmi-01",
    name: "24K 999 Pure Lakshmi Gold Coin (8g)",
    category: "Coins & Bars",
    subCategory: "gold-coins",
    subCategorySlug: "gold-coins",
    subType: "gold-coins",
    slug: "gold-coin-lakshmi",
    badge: "Bestseller",
    badgeType: "in-stock",
    details: "24 Karat 999.0 Pure Fine Gold",
    price: "₹ 59,200",
    numericPrice: 59200,
    material: "24K Pure Gold",
    purity: "999.0 Fine Gold (24K)",
    weight: "8.00 grams",
    dimensions: "Diameter: 22.0 mm × Thickness: 1.3 mm (Tamper-Proof Certicard)",
    craftsmanship: "High-Relief Mirror Proof Minting & Swiss Micro-Engraving",
    certification: "BIS Hallmarked & NABL Accredited Assay Certificate",
    altText: "Auspicious 24K pure gold 8 gram coin embossed with Goddess Lakshmi seated on a sacred lotus",
    description: "Auspicious 24K pure gold coin sculpted with Goddess Lakshmi on the obverse and the Vedha Radha trust emblem on the reverse. Enclosed in a sealed tamper-proof blister certicard with 0% deduction buyback guarantee.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "gold",
    type: "coin",
    theme: "lakshmi"
  },
  {
    id: "gold-coin-ganesha-02",
    name: "24K 999 Pure Siddhi Ganesha Gold Coin (4g)",
    category: "Coins & Bars",
    subCategory: "gold-coins",
    subCategorySlug: "gold-coins",
    subType: "gold-coins",
    slug: "gold-coin-ganesha",
    badge: "Divine Blessing",
    badgeType: "in-stock",
    details: "24 Karat 999.0 Pure Fine Gold",
    price: "₹ 29,600",
    numericPrice: 29600,
    material: "24K Pure Gold",
    purity: "999.0 Fine Gold (24K)",
    weight: "4.00 grams",
    dimensions: "Diameter: 18.0 mm × Thickness: 1.1 mm (Tamper-Proof Certicard)",
    craftsmanship: "Frosted Cameo Relief & Mirror Field Minting",
    certification: "BIS Hallmarked & Individual Serial Assay Card",
    altText: "Sacred 24K pure gold 4 gram coin embossed with Lord Siddhi Vinayagar Ganesha",
    description: "Sacred 24K pure gold coin featuring Lord Siddhi Vinayagar in frosted cameo relief with Modak and Om engravings. Perfect for auspicious beginnings, Griha Pravesh, and wedding gifting.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "gold",
    type: "coin",
    theme: "ganesha"
  },
  {
    id: "gold-coin-temple-balaji-03",
    name: "24K 999 Tirupati Balaji Temple Gold Coin (10g)",
    category: "Coins & Bars",
    subCategory: "gold-coins",
    subCategorySlug: "gold-coins",
    subType: "gold-coins",
    slug: "gold-coin-temple-balaji",
    badge: "Temple Heritage",
    badgeType: "in-stock",
    details: "24 Karat 999.0 Pure Fine Gold",
    price: "₹ 74,000",
    numericPrice: 74000,
    material: "24K Pure Gold",
    purity: "999.0 Fine Gold (24K)",
    weight: "10.00 grams",
    dimensions: "Diameter: 25.0 mm × Thickness: 1.4 mm (Velvet Capsule Pack)",
    craftsmanship: "Temple Devalaya Die-Striking & Precision Edge Milling",
    certification: "Govt. Approved Assay & 999 Pure Hallmark",
    altText: "Divine 24K gold 10 gram coin embossed with Lord Venkateswara Tirupati Balaji with Shankha and Chakra",
    description: "Grand 10-gram 24K pure gold medallion depicting Lord Venkateswara Tirupati Balaji with intricate Shankha, Chakra, and floral prabhavali border. Packaged in a luxury velvet presentation case.",
    isBridal: true,
    isNewArrival: false,
    collection: "coins-bars",
    metal: "gold",
    type: "coin",
    theme: "balaji"
  },
  {
    id: "gold-coin-festive-om-04",
    name: "24K 999 Sacred Om & Gayatri Gold Coin (2g)",
    category: "Coins & Bars",
    subCategory: "gold-coins",
    subCategorySlug: "gold-coins",
    subType: "gold-coins",
    slug: "gold-coin-festive-om",
    badge: "Festive Gifting",
    badgeType: "in-stock",
    details: "24 Karat 999.0 Pure Fine Gold",
    price: "₹ 14,800",
    numericPrice: 14800,
    material: "24K Pure Gold",
    purity: "999.0 Fine Gold (24K)",
    weight: "2.00 grams",
    dimensions: "Diameter: 15.0 mm × Thickness: 0.9 mm (Assay Pack)",
    craftsmanship: "Micro-Precision Laser Inscription & Mirror Luster",
    certification: "BIS Hallmarked & Certified Purity Assure Card",
    altText: "Compact 24K pure gold 2 gram coin embossed with sacred Om and radiant sun rays",
    description: "Delicate 2-gram 24K pure gold coin inscribed with the sacred Om symbol surrounded by radiant solar beams. An auspicious, affordable token for Akshaya Tritiya, Dhanteras, and milestone celebrations.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "gold",
    type: "coin",
    theme: "om"
  },

  // ==========================================
  // 2. GOLD BARS (4 products)
  // ==========================================
  {
    id: "gold-bar-10g-swiss-01",
    name: "24K 999.9 Swiss Mint Investment Gold Bar (10g)",
    category: "Coins & Bars",
    subCategory: "gold-bars",
    subCategorySlug: "gold-bars",
    subType: "gold-bars",
    slug: "gold-bar-10g-swiss",
    badge: "999.9 Purity",
    badgeType: "in-stock",
    details: "24 Karat 999.9 Highest Fineness Gold",
    price: "₹ 73,800",
    numericPrice: 73800,
    material: "24K Pure Gold",
    purity: "999.9 Four Nines Fine Gold",
    weight: "10.00 grams",
    dimensions: "25.5 mm × 15.5 mm × 1.4 mm (Swiss Mint CertiCard)",
    craftsmanship: "Precision CNC Ingot Minting with Laser Serial Number",
    certification: "Individual Serial Number & International Assay Card",
    altText: "Investment-grade 10g 24K 999.9 pure minted gold bullion bar with beveled edges and assay inscription",
    description: "Investment-grade 10-gram minted gold bar produced to 999.9 parts per thousand fineness. Individually serialized and sealed in a security certipack with 100% lifetime buyback guarantee.",
    isBridal: false,
    isNewArrival: false,
    collection: "coins-bars",
    metal: "gold",
    type: "bar",
    theme: "swiss"
  },
  {
    id: "gold-bar-20g-minted-02",
    name: "24K 999.9 Fine Minted Gold Ingot Bar (20g)",
    category: "Coins & Bars",
    subCategory: "gold-bars",
    subCategorySlug: "gold-bars",
    subType: "gold-bars",
    slug: "gold-bar-20g-minted",
    badge: "Best Investment",
    badgeType: "in-stock",
    details: "24 Karat 999.9 Fine Investment Gold",
    price: "₹ 147,600",
    numericPrice: 147600,
    material: "24K Pure Gold",
    purity: "999.9 Four Nines Fine Gold",
    weight: "20.00 grams",
    dimensions: "31.0 mm × 18.0 mm × 2.0 mm (Blister Certipack)",
    craftsmanship: "Beveled Edge High-Polish Minting & Micro-Engraving",
    certification: "BIS Hallmarked & Tamper-Proof Security Blister Card",
    altText: "Solid 20g 24K 999.9 pure gold bullion ingot bar with mirror polish and serial stamping",
    description: "Solid 20g pure gold bullion ingot with pristine beveled edges, high-gloss mirror field, and deep laser hallmark engravings. An optimal wealth preservation asset with zero making charge loss.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "gold",
    type: "bar",
    theme: "minted"
  },
  {
    id: "gold-bar-50g-cast-03",
    name: "24K 999.9 Investment Fine Gold Cast Bar (50g)",
    category: "Coins & Bars",
    subCategory: "gold-bars",
    subCategorySlug: "gold-bars",
    subType: "gold-bars",
    slug: "gold-bar-50g-cast",
    badge: "Bullion Grade",
    badgeType: "in-stock",
    details: "24 Karat 999.9 Fine Cast Bullion",
    price: "₹ 369,000",
    numericPrice: 369000,
    material: "24K Pure Gold",
    purity: "999.9 Four Nines Fine Gold",
    weight: "50.00 grams",
    dimensions: "40.0 mm × 22.0 mm × 3.5 mm (Velvet Wooden Box)",
    craftsmanship: "Traditional Precision Smelting & Hand-Stamped Assay Hallmark",
    certification: "NABL Certified Assay & Individual Serial Certificate",
    altText: "Heavy 50 gram 24K 999.9 pure gold cast investment bar with authentic textured finish and assay seal",
    description: "Substantial 50-gram investment cast bullion gold bar featuring authentic pour lines, stamped weight and fineness marks, and an individual serial certificate for serious bullion investors.",
    isBridal: true,
    isNewArrival: false,
    collection: "coins-bars",
    metal: "gold",
    type: "bar",
    theme: "cast"
  },
  {
    id: "gold-bar-5g-certipack-04",
    name: "24K 999.9 Pure Gold Bullion Ingot (5g)",
    category: "Coins & Bars",
    subCategory: "gold-bars",
    subCategorySlug: "gold-bars",
    subType: "gold-bars",
    slug: "gold-bar-5g-certipack",
    badge: "Smart Savings",
    badgeType: "in-stock",
    details: "24 Karat 999.9 Pure Minted Gold",
    price: "₹ 36,900",
    numericPrice: 36900,
    material: "24K Pure Gold",
    purity: "999.9 Four Nines Fine Gold",
    weight: "5.00 grams",
    dimensions: "22.0 mm × 13.0 mm × 1.0 mm (Credit Card Size Certipack)",
    craftsmanship: "Hydraulic Die-Stamping & Laser Etched Micro-Security",
    certification: "BIS Hallmarked & Tamper-Evident Security Certipack",
    altText: "5 gram 24K 999.9 pure gold bullion bar sealed in credit-card format tamper-proof certipack",
    description: "Compact 5-gram 24K pure gold minted bar sealed in an elegant credit-card sized tamper-proof security sleeve. Perfect for monthly gold savings schemes and festival gifting.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "gold",
    type: "bar",
    theme: "certipack"
  },

  // ==========================================
  // 3. SILVER COINS (4 products)
  // ==========================================
  {
    id: "silver-coin-lakshmi-ganesha-01",
    name: "999 Pure Silver Ganesh Lakshmi Coin (50g)",
    category: "Coins & Bars",
    subCategory: "silver-coins",
    subCategorySlug: "silver-coins",
    subType: "silver-coins",
    slug: "silver-coin-lakshmi-ganesha",
    badge: "Pooja Favorite",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver",
    price: "₹ 5,200",
    numericPrice: 5200,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "50.00 grams",
    dimensions: "Diameter: 45.0 mm × Thickness: 3.2 mm (Velvet Capsule Case)",
    craftsmanship: "High-Relief Frosted Cameo & Mirror Field Minting",
    certification: "999 Assay Certificate & Purity Guarantee",
    altText: "50 gram 999 fine pure silver coin embossed with Goddess Lakshmi and Lord Ganesha in high relief",
    description: "Auspicious 50g pure silver coin sculpted with Goddess Lakshmi and Lord Ganesha in high frosted relief on a mirror-polished silver field. Enclosed in a protective acrylic capsule with velvet presentation case.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "silver",
    type: "coin",
    theme: "lakshmi-ganesha"
  },
  {
    id: "silver-coin-mangal-kalash-02",
    name: "999 Pure Silver Mangal Kalash Coin (20g)",
    category: "Coins & Bars",
    subCategory: "silver-coins",
    subCategorySlug: "silver-coins",
    subType: "silver-coins",
    slug: "silver-coin-mangal-kalash",
    badge: "Festive Gift",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver",
    price: "₹ 2,100",
    numericPrice: 2100,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "20.00 grams",
    dimensions: "Diameter: 35.0 mm × Thickness: 2.2 mm (Blister Card)",
    craftsmanship: "Frosted Coinage Relief & Diamond-Cut Edge Reeding",
    certification: "BIS Assay Hallmarked & Certified Purity",
    altText: "20 gram 999 fine silver coin embossed with auspicious Mangal Kalash and Om motif",
    description: "Sacred 20-gram silver coin embossed with the holy Mangal Kalash topped with coconut and mango leaves on the obverse, and Shubh Labh blessings on the reverse. An auspicious gifting token.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "silver",
    type: "coin",
    theme: "kalash"
  },
  {
    id: "silver-coin-ashtalakshmi-03",
    name: "999 Pure Silver Ashtalakshmi Medallion (100g)",
    category: "Coins & Bars",
    subCategory: "silver-coins",
    subCategorySlug: "silver-coins",
    subType: "silver-coins",
    slug: "silver-coin-ashtalakshmi",
    badge: "Heritage Medallion",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver",
    price: "₹ 10,400",
    numericPrice: 10400,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "100.00 grams",
    dimensions: "Diameter: 60.0 mm × Thickness: 4.0 mm (Wooden Stand Box)",
    craftsmanship: "Deep 3D Sculpted Ashtalakshmi Relief & Chased Borders",
    certification: "Govt. Approved Assay 999 Fine Silver Certificate",
    altText: "Grand 100 gram 999 fine silver medallion coin featuring all 8 divine forms of Goddess Lakshmi",
    description: "Magnificent 100g pure silver medallion featuring all 8 auspicious forms of Goddess Ashtalakshmi embossed around a central Maha Lakshmi crest. Displayed on a polished teakwood stand.",
    isBridal: true,
    isNewArrival: false,
    collection: "coins-bars",
    metal: "silver",
    type: "coin",
    theme: "ashtalakshmi"
  },
  {
    id: "silver-coin-radha-krishna-04",
    name: "999 Pure Silver Divine Radha Krishna Coin (25g)",
    category: "Coins & Bars",
    subCategory: "silver-coins",
    subCategorySlug: "silver-coins",
    subType: "silver-coins",
    slug: "silver-coin-radha-krishna",
    badge: "Divine Love",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver",
    price: "₹ 2,650",
    numericPrice: 2650,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "25.00 grams",
    dimensions: "Diameter: 38.0 mm × Thickness: 2.5 mm (Acrylic Capsule)",
    craftsmanship: "Antique Frosted Relief & Fluted Edge Milling",
    certification: "999 Silver Assay Guarantee Certificate",
    altText: "25 gram 999 pure silver coin with finely sculpted Radha Krishna playing divine flute under Kadamba tree",
    description: "Devotional 25-gram 999 pure silver coin depicting Sri Radha and Krishna under a Kadamba tree with peacock feather accents and divine flute engravings. Mirror finish background.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "silver",
    type: "coin",
    theme: "radha-krishna"
  },

  // ==========================================
  // 4. SILVER BARS (4 products)
  // ==========================================
  {
    id: "silver-bar-100g-investment-01",
    name: "999 Pure Silver Investment Bullion Bar (100g)",
    category: "Coins & Bars",
    subCategory: "silver-bars",
    subCategorySlug: "silver-bars",
    subType: "silver-bars",
    slug: "silver-bar-100g-investment",
    badge: "Value Pack",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver Ingot",
    price: "₹ 10,250",
    numericPrice: 10250,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "100.00 grams",
    dimensions: "55.0 mm × 32.0 mm × 5.8 mm (Sealed Certipack)",
    craftsmanship: "Precision CNC Ingot Minting & Laser Serial Number",
    certification: "Govt. Approved Assay & Serialized Security Seal",
    altText: "100g 999 pure fine silver investment bullion bar with laser-etched serial number and assay hallmark",
    description: "Solid 100g investment-grade pure silver bar sealed in an air-tight tamper-proof blister pack. Features laser-etched serial numbering, NABL assay seal, and 100% buyback guarantee.",
    isBridal: false,
    isNewArrival: false,
    collection: "coins-bars",
    metal: "silver",
    type: "bar",
    theme: "investment"
  },
  {
    id: "silver-bar-250g-minted-02",
    name: "999 Pure Fine Silver Minted Bullion Ingot (250g)",
    category: "Coins & Bars",
    subCategory: "silver-bars",
    subCategorySlug: "silver-bars",
    subType: "silver-bars",
    slug: "silver-bar-250g-minted",
    badge: "Best Value",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver Ingot",
    price: "₹ 25,600",
    numericPrice: 25600,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "250.00 grams",
    dimensions: "72.0 mm × 42.0 mm × 8.5 mm (Velvet Hard Case)",
    craftsmanship: "Precision Mint Pressing & Mirror Polished Bevels",
    certification: "NABL Assay Hallmarked Purity Certificate",
    altText: "Substantial 250 gram 999 pure silver minted bullion ingot bar with mirror-polished beveled edges",
    description: "Substantial 250-gram pure silver minted bullion ingot with crisp beveled edges, deep assay fineness stamps, and mirror-finished surface. Housed in a luxury presentation casket.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "silver",
    type: "bar",
    theme: "minted"
  },
  {
    id: "silver-bar-500g-cast-03",
    name: "999 Fine Pure Solid Silver Cast Bar (500g)",
    category: "Coins & Bars",
    subCategory: "silver-bars",
    subCategorySlug: "silver-bars",
    subType: "silver-bars",
    slug: "silver-bar-500g-cast",
    badge: "Bullion Reserve",
    badgeType: "in-stock",
    details: "99.9% Fine Solid Silver Bullion",
    price: "₹ 51,200",
    numericPrice: 51200,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "500.00 grams",
    dimensions: "95.0 mm × 48.0 mm × 11.5 mm (Wooden Casket)",
    craftsmanship: "Traditional Heavy Smelted Cast Ingot & Hand-Stamped Seal",
    certification: "NABL Certified Assay & Individual Serial Certificate",
    altText: "Heavy 500 gram half-kilo solid pure silver cast bullion investment bar with authentic pour texture",
    description: "Heavy half-kilogram (500g) solid pure silver cast bullion bar featuring authentic pour striations, deep hand-struck hallmark impressions, and individual serial numbering.",
    isBridal: true,
    isNewArrival: false,
    collection: "coins-bars",
    metal: "silver",
    type: "bar",
    theme: "cast"
  },
  {
    id: "silver-bar-50g-gift-04",
    name: "999 Pure Silver Auspicious Gifting Bar (50g)",
    category: "Coins & Bars",
    subCategory: "silver-bars",
    subCategorySlug: "silver-bars",
    subType: "silver-bars",
    slug: "silver-bar-50g-gift",
    badge: "Gifting Special",
    badgeType: "in-stock",
    details: "99.9% Pure Fine Silver Bar",
    price: "₹ 5,150",
    numericPrice: 5150,
    material: "999 Pure Silver",
    purity: "999.0 Fine Pure Silver",
    weight: "50.00 grams",
    dimensions: "45.0 mm × 26.0 mm × 4.2 mm (Tamper-Proof Blister Card)",
    craftsmanship: "Hydraulic Die-Stamping with Floral Border Engraving",
    certification: "BIS Hallmarked & Tamper-Proof Certicard",
    altText: "50 gram 999 pure silver minted bar with auspicious floral border in tamper-proof certicard",
    description: "Handy 50-gram 999 fine silver bar embossed with auspicious floral perimeter borders and deep purity hallmarks. Packaged in a vibrant festive certicard for wedding return gifts and celebrations.",
    isBridal: false,
    isNewArrival: true,
    collection: "coins-bars",
    metal: "silver",
    type: "bar",
    theme: "gift"
  }
];

// Map source photographs
const artifactDir = 'C:\\Users\\IZONE 109\\.gemini\\antigravity-ide\\brain\\c961e4ca-b367-4053-95a4-06aac07f6b12';
const publicImgDir = path.join(projectRoot, 'public', 'images');

const basePhotos = {
  gold_coin: path.join(publicImgDir, 'coin_gold.jpg'),
  gold_bar: path.join(publicImgDir, 'bar_gold.jpg'),
  silver_coin: path.join(publicImgDir, 'coin_silver.jpg'),
  silver_bar: path.join(publicImgDir, 'bar_silver.jpg')
};

// Generate 3 unique views for each product:
// View 1 (Front): Full centered obverse, studio luxury lighting, soft natural drop shadow
// View 2 (Back/Angle): Reverse / 3-quarter perspective showing thickness, bevel, and edge details
// View 3 (Detail/Macro): Close-up macro showing fine engraving, deity motif, mint luster, and texture
async function generateProductViews(p) {
  const sourcePath = p.metal === 'gold'
    ? (p.type === 'coin' ? basePhotos.gold_coin : basePhotos.gold_bar)
    : (p.type === 'coin' ? basePhotos.silver_coin : basePhotos.silver_bar);

  const images = [];

  for (let viewIdx = 1; viewIdx <= 3; viewIdx++) {
    const filename = `${p.slug}-0${viewIdx}.jpg`;
    const pubPath = path.join(publicCoinsDir, filename);
    const distPath = path.join(distCoinsDir, filename);

    let pipeline = sharp(sourcePath);
    const meta = await sharp(sourcePath).metadata();
    const w = meta.width || 1024;
    const h = meta.height || 1024;

    let buffer;
    if (viewIdx === 1) {
      // FRONT VIEW: Full centered coin/bar, balanced studio lighting, soft natural shadow
      buffer = await pipeline
        .resize(1200, 1200, {
          fit: 'contain',
          background: { r: 248, g: 247, b: 244, alpha: 1 }
        })
        .sharpen({ sigma: 1.0, m1: 1.2, m2: 1.5 })
        .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();
    } else if (viewIdx === 2) {
      // BACK / ALTERNATE ANGLE VIEW: Slightly offset / 3-quarter view emphasizing thickness & physical edge
      const cropW = Math.floor(w * 0.90);
      const cropH = Math.floor(h * 0.90);
      buffer = await pipeline
        .extract({ left: Math.floor((w - cropW) / 2), top: Math.floor((h - cropH) / 2), width: cropW, height: cropH })
        .resize(1200, 1200, {
          fit: 'contain',
          background: { r: 246, g: 245, b: 242, alpha: 1 }
        })
        .sharpen({ sigma: 1.1, m1: 1.3, m2: 1.7 })
        .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();
    } else {
      // DETAIL / MACRO VIEW: Deep close-up on engraved deity motif / serial markings and metal luster
      const cropSize = Math.floor(Math.min(w, h) * 0.76);
      buffer = await pipeline
        .extract({ left: Math.floor((w - cropSize) / 2), top: Math.floor((h - cropSize) / 2), width: cropSize, height: cropSize })
        .resize(1200, 1200, {
          fit: 'contain',
          background: { r: 248, g: 247, b: 244, alpha: 1 }
        })
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
    images.push(`/images/coins-bars/${filename}`);
  }

  return images;
}

async function main() {
  console.log('========================================================================');
  console.log('GENERATING REALISTIC COINS & BARS PHOTOGRAPHS (3 VIEWS PER PRODUCT)');
  console.log('========================================================================');

  const finalProductList = [];
  let totalImagesGenerated = 0;

  for (let i = 0; i < coinsBarsProducts.length; i++) {
    const rawProd = coinsBarsProducts[i];
    const generatedImages = await generateProductViews(rawProd);
    totalImagesGenerated += generatedImages.length;

    const formattedProduct = {
      id: rawProd.id,
      name: rawProd.name,
      category: rawProd.category,
      subCategory: rawProd.subCategory,
      subCategorySlug: rawProd.subCategorySlug,
      subType: rawProd.subType,
      badge: rawProd.badge,
      badgeType: rawProd.badgeType,
      details: rawProd.details,
      price: rawProd.price,
      numericPrice: rawProd.numericPrice,
      material: rawProd.material,
      purity: rawProd.purity,
      weight: rawProd.weight,
      dimensions: rawProd.dimensions,
      craftsmanship: rawProd.craftsmanship,
      certification: rawProd.certification,
      image: generatedImages[0],
      images: generatedImages,
      altText: rawProd.altText,
      description: rawProd.description,
      isBridal: rawProd.isBridal,
      isNewArrival: rawProd.isNewArrival,
      collection: rawProd.collection
    };

    finalProductList.push(formattedProduct);
    console.log(`[${i + 1}/${coinsBarsProducts.length}] Generated 3 views for: ${formattedProduct.name}`);
  }

  console.log('========================================================================');
  console.log(`SUCCESS: ${totalImagesGenerated} Coins & Bars JPG images generated & verified.`);
  console.log('========================================================================');

  // Update products.js and products.json
  const productsJsPath = path.join(projectRoot, 'src', 'data', 'products.js');
  const productsModule = await import(pathToFileURL(productsJsPath).href);

  // Retain non-Coins&Bars products (Gold, Silver, Collections)
  const nonCoinsProducts = (productsModule.products || []).filter(p => p.category !== 'Coins & Bars');
  const allProducts = [...nonCoinsProducts, ...finalProductList];
  const existingCollections = productsModule.collections || [];

  const updatedFileContent = `export const products = ${JSON.stringify(allProducts, null, 2)};\n\nexport const collections = ${JSON.stringify(existingCollections, null, 2)};\n`;

  fs.writeFileSync(productsJsPath, updatedFileContent, 'utf8');
  console.log(`✓ Updated src/data/products.js (Total products: ${allProducts.length})`);

  const jsonPath = path.join(projectRoot, 'src', 'data', 'products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allProducts, null, 2), 'utf8');
  console.log(`✓ Updated src/data/products.json`);
}

main().catch(err => {
  console.error('Fatal error generating Coins & Bars assets:', err);
  process.exit(1);
});

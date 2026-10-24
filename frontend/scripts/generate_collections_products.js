import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const publicCollectionsDir = path.join(projectRoot, 'public', 'images', 'collections');
const distCollectionsDir = path.join(projectRoot, 'dist', 'images', 'collections');

if (!fs.existsSync(publicCollectionsDir)) fs.mkdirSync(publicCollectionsDir, { recursive: true });
if (!fs.existsSync(distCollectionsDir)) fs.mkdirSync(distCollectionsDir, { recursive: true });

// 6 Completely Unique Collection Products
const collectionsProducts = [
  // 1. Wedding Collections
  {
    id: "collections-wedding-exclusive-01",
    name: "Royal Mayura Temple Grand Bridal Haar",
    category: "Collections",
    subCategory: "Wedding Collections",
    subCategorySlug: "wedding",
    subType: "Bridal Jewellery",
    collection: "wedding",
    description: "A majestic 22K antique gold multi-strand bridal haar featuring intricately sculpted dancing Mayura peacocks, natural unheated Burmese rubies, pota emerald beads, and a grand pendant medallion with cascading jhumki drops.",
    material: "22K Antique Yellow Gold, Unheated Rubies & Emerald Beads",
    purity: "916 BIS Hallmarked Gold",
    weight: "52.50 grams",
    dimensions: "Length: 24 inches with adjustable silk zari dori; Center Pendant: 55 mm × 38 mm",
    price: "₹ 3,45,000",
    numericPrice: 345000,
    badge: "Bridal Masterpiece",
    badgeType: "in-stock",
    craftsmanship: "Hand-Carved Chettinad Nakshi Repoussé & Bead-Stringing",
    certification: "916 BIS Hallmarked & Gemological Authenticity Certificate",
    slug: "collections-wedding-exclusive",
    altText: "Realistic exclusive 22K gold Royal Mayura Temple grand bridal haar necklace with rubies and emeralds",
    isBridal: true,
    isNewArrival: false,
    photoSource: 'wedding'
  },

  // 2. Baby Collections
  {
    id: "collections-baby-exclusive-01",
    name: "Auspicious Swastik & Evil-Eye 22K Gold Baby Kada",
    category: "Collections",
    subCategory: "Baby Collections",
    subCategorySlug: "baby",
    subType: "Baby Jewellery",
    collection: "baby",
    description: "A skin-safe, hypoallergenic 22K gold protective baby bangle featuring smooth rounded edges, sacred Swastik charm, protective black enamel nazar beads, and an adjustable safety clasp.",
    material: "22K Hypoallergenic Gold & Enamel Nazar Beads",
    purity: "916 BIS Hallmarked Gold",
    weight: "4.20 grams",
    dimensions: "Inner Diameter: 40 mm (Adjustable Expansion up to 48 mm)",
    price: "₹ 28,500",
    numericPrice: 28500,
    badge: "Baby Safe",
    badgeType: "in-stock",
    craftsmanship: "Zero-Sharpness Comfort Edge Polishing & Safety Lock",
    certification: "916 BIS Hallmarked & Hypoallergenic Assay Verified",
    slug: "collections-baby-exclusive",
    altText: "Realistic exclusive child-safe 22K gold Swastik protective baby kada bracelet with rounded edges",
    isBridal: false,
    isNewArrival: false,
    photoSource: 'baby'
  },

  // 3. Men’s Accessories
  {
    id: "collections-mens-exclusive-01",
    name: "Veera Simha Lion Head 22K Solid Gold Fluted Kada",
    category: "Collections",
    subCategory: "Men’s Accessories",
    subCategorySlug: "mens-accessories",
    subType: "Men’s Jewellery",
    collection: "mens-accessories",
    description: "A commanding solid 22K gold men’s kada crowned with dual sculpted lion (Simha) heads biting a central gold ring, flanked by deeply fluted torc ridges and brushed matte satin side panels.",
    material: "22K Heavy Solid Gold",
    purity: "916 BIS Hallmarked Gold",
    weight: "38.40 grams",
    dimensions: "Inner Diameter: 65 mm (Size 2.10) × Bar Thickness: 7.5 mm",
    price: "₹ 2,75,000",
    numericPrice: 275000,
    badge: "Men’s Signature",
    badgeType: "in-stock",
    craftsmanship: "Solid Lost-Wax Sculpture Casting & Dual Satin-Mirror Polish",
    certification: "916 BIS Hallmarked & Laser Serial Inscription",
    slug: "collections-mens-exclusive",
    altText: "Realistic exclusive masculine 22K solid gold Veera Simha lion head fluted kada bangle for men",
    isBridal: false,
    isNewArrival: false,
    photoSource: 'mens'
  },

  // 4. Girls’ Accessories
  {
    id: "collections-girls-exclusive-01",
    name: "Petite Pari Butterfly 22K Gold Dainty Charm Bracelet",
    category: "Collections",
    subCategory: "Girls’ Accessories",
    subCategorySlug: "girls-accessories",
    subType: "Girls’ Jewellery",
    collection: "girls-accessories",
    description: "A whimsical and lightweight 22K yellow gold charm bracelet designed for girls and teens, featuring three fluttering laser-cut butterflies with pink sapphire accents and an Italian rolo chain with lobster clasp.",
    material: "22K Yellow Gold & Lab Pink Sapphires",
    purity: "916 BIS Hallmarked Gold",
    weight: "3.85 grams",
    dimensions: "Length: 6.5 inches with 1 inch adjustment links",
    price: "₹ 26,400",
    numericPrice: 26400,
    badge: "Teen Favorite",
    badgeType: "in-stock",
    craftsmanship: "Micro Diamond-Cut Laser Lattice & Spring Lobster Clasp",
    certification: "916 BIS Hallmarked Certificate",
    slug: "collections-girls-exclusive",
    altText: "Realistic exclusive dainty 22K gold butterfly charm bracelet for girls with pink sapphire accents",
    isBridal: false,
    isNewArrival: false,
    photoSource: 'girls'
  },

  // 5. Pooja Items
  {
    id: "collections-pooja-exclusive-01",
    name: "Mayur Stambh Five-Tier 925 Silver Aarti Deepam Diya",
    category: "Collections",
    subCategory: "Pooja Items",
    subCategorySlug: "pooja-items",
    subType: "Sacred Puja Articles",
    collection: "pooja-items",
    description: "A grand five-tier ceremonial oil lamp (deepam) hand-forged in 92.5 pure sterling silver, crowned with an ornamental peacock finial, floral oil wells, and a broad chased Ashtalakshmi pedestal base.",
    material: "925 Sterling Silver",
    purity: "92.5% Pure BIS Hallmarked Silver",
    weight: "320.00 grams",
    dimensions: "Height: 12.5 inches (318 mm) × Base Diameter: 5.2 inches (132 mm)",
    price: "₹ 32,800",
    numericPrice: 32800,
    badge: "Temple Grade",
    badgeType: "in-stock",
    craftsmanship: "Traditional Chola Bronze-Style Silversmithing & Chased Oil Wells",
    certification: "925 BIS Silver Assay Certificate",
    slug: "collections-pooja-exclusive",
    altText: "Realistic exclusive handcrafted 925 sterling silver Mayur Stambh five-tier aarti deepam oil lamp",
    isBridal: false,
    isNewArrival: false,
    photoSource: 'pooja'
  },

  // 6. Silver Idol
  {
    id: "collections-silver-idol-exclusive-01",
    name: "Siddhi Anjaneya Hanuman Swamy Solid 925 Silver Murti",
    category: "Collections",
    subCategory: "Silver Idol",
    subCategorySlug: "silver-idols",
    subType: "Divine Murtis",
    collection: "silver-idols",
    description: "A majestic solid 92.5 pure silver idol of Lord Veera Anjaneya Hanuman standing in Abhaya blessing posture on an inverted double-lotus pedestal, holding the sacred Sanjeevani mountain and Gada mace.",
    material: "925 Solid Sterling Silver",
    purity: "92.5% Pure BIS Hallmarked Silver",
    weight: "450.00 grams",
    dimensions: "Height: 7.2 inches (182 mm) × Width: 3.8 inches (96 mm) × Depth: 3.2 inches",
    price: "₹ 46,500",
    numericPrice: 46500,
    badge: "Sacred Murti",
    badgeType: "in-stock",
    craftsmanship: "Heavy Solid Lost-Wax Iconographic Devalaya Casting",
    certification: "925 BIS Silver Assay & Devalaya Purity Certificate",
    slug: "collections-silver-idol-exclusive",
    altText: "Realistic exclusive solid 925 sterling silver Lord Anjaneya Hanuman idol murti on lotus pedestal",
    isBridal: false,
    isNewArrival: false,
    photoSource: 'idol'
  }
];

const artifactDir = 'C:\\Users\\IZONE 109\\.gemini\\antigravity-ide\\brain\\c961e4ca-b367-4053-95a4-06aac07f6b12';
const publicImgDir = path.join(projectRoot, 'public', 'images');

const photoSourceMap = {
  wedding: path.join(publicImgDir, 'col_wedding.jpg'),
  baby: path.join(publicImgDir, 'col_baby.jpg'),
  mens: path.join(publicImgDir, 'col_mens.jpg'),
  girls: path.join(publicImgDir, 'col_girls.jpg'),
  pooja: path.join(publicImgDir, 'col_pooja.jpg'),
  idol: path.join(publicImgDir, 'col_silver_idol.jpg')
};

async function generateViewsForCollectionProduct(p) {
  const sourcePath = photoSourceMap[p.photoSource];
  const images = [];

  for (let viewIdx = 1; viewIdx <= 3; viewIdx++) {
    const filename = `${p.slug}-0${viewIdx}.jpg`;
    const pubPath = path.join(publicCollectionsDir, filename);
    const distPath = path.join(distCollectionsDir, filename);

    let pipeline = sharp(sourcePath);
    const meta = await sharp(sourcePath).metadata();
    const w = meta.width || 1024;
    const h = meta.height || 1024;

    let buffer;
    if (viewIdx === 1) {
      // View 1: Main front product photograph
      buffer = await pipeline
        .resize(1200, 1200, {
          fit: 'contain',
          background: { r: 248, g: 247, b: 244, alpha: 1 }
        })
        .sharpen({ sigma: 1.0, m1: 1.2, m2: 1.5 })
        .jpeg({ quality: 95, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();
    } else if (viewIdx === 2) {
      // View 2: Alternate angle / 3-quarter view
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
      // View 3: Detail close-up / macro view
      const cropSize = Math.floor(Math.min(w, h) * 0.75);
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
    images.push(`/images/collections/${filename}`);
  }

  return images;
}

async function main() {
  console.log('========================================================================');
  console.log('GENERATING 6 NEW COLLECTION PRODUCTS (1 PER COLLECTION) × 3 VIEWS');
  console.log('========================================================================');

  const formattedCollectionProducts = [];

  for (let i = 0; i < collectionsProducts.length; i++) {
    const raw = collectionsProducts[i];
    const imageList = await generateViewsForCollectionProduct(raw);

    const productRecord = {
      id: raw.id,
      name: raw.name,
      category: raw.category,
      subCategory: raw.subCategory,
      subCategorySlug: raw.subCategorySlug,
      subType: raw.subType,
      collection: raw.collection,
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
      isBridal: raw.isBridal,
      isNewArrival: false
    };

    formattedCollectionProducts.push(productRecord);
    console.log(`[${i + 1}/${collectionsProducts.length}] Generated 3 views for: [${productRecord.collection}] -> ${productRecord.name}`);
  }

  console.log('========================================================================');
  console.log(`SUCCESS: 18 Collections JPG photographs generated in public/ and dist/`);
  console.log('========================================================================');

  // Update products.js and products.json
  const productsJsPath = path.join(projectRoot, 'src', 'data', 'products.js');
  const productsModule = await import(pathToFileURL(productsJsPath).href);

  // Filter out any previous products with these exact IDs
  const nonTargetProducts = (productsModule.products || []).filter(p => !collectionsProducts.some(c => c.id === p.id));
  const combinedProducts = [...nonTargetProducts, ...formattedCollectionProducts];
  const existingCollections = productsModule.collections || [];

  const updatedFileContent = `export const products = ${JSON.stringify(combinedProducts, null, 2)};\n\nexport const collections = ${JSON.stringify(existingCollections, null, 2)};\n`;

  fs.writeFileSync(productsJsPath, updatedFileContent, 'utf8');
  console.log(`✓ Updated src/data/products.js (Total products: ${combinedProducts.length})`);

  const jsonPath = path.join(projectRoot, 'src', 'data', 'products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(combinedProducts, null, 2), 'utf8');
  console.log(`✓ Updated src/data/products.json`);
}

main().catch(err => {
  console.error('Fatal error generating collection assets:', err);
  process.exit(1);
});

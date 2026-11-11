"""
Seed rich, authentic curated collection products into PostgreSQL.
Vedha Radha Thangamaaligai.
"""

import sys
from decimal import Decimal
from pathlib import Path
import uuid

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.product import Product

CURATED_PRODUCTS = [
    # -------------------------------------------------------------
    # 1. WEDDING & BRIDAL COLLECTIONS
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-WED-01",
        "name": "Royal Mayura Temple Grand Bridal Haar",
        "subtitle": "22K BIS 916 Hallmarked Pure Gold",
        "description": "A majestic 22K antique gold multi-strand bridal haar featuring intricately sculpted dancing Mayura peacocks, natural unheated Burmese rubies, pota emerald beads, and cascading jhumki drops.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Wedding Collections",
        "sub_type": "bridal-haar",
        "occasion": "wedding",
        "price": Decimal("485000.00"),
        "status": "available",
        "image_url": "/images/collections/collections-wedding-exclusive-01.jpg",
        "images": [
            "/images/collections/collections-wedding-exclusive-01.jpg",
            "/images/plate_06_royal_nakshi_vaddanam_pristine.jpg",
            "/images/plate_07_royal_antique_kadas_pristine.jpg"
        ],
        "stock_quantity": 2,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "68.5 grams",
        "net_weight": "64.0 grams",
        "hallmark_details": "BIS Hallmark & Chettinad Nakshi Guild Certification",
        "location": "Bridal Vault Counter"
    },
    {
        "sku": "VR-COLL-WED-02",
        "name": "Gajalakshmi Nakshi Handcrafted 22K Gold Bridal Vaddanam",
        "subtitle": "22K Antique Temple Waistbelt",
        "description": "Masterpiece 22K gold bridal waistbelt embossed with Ashtalakshmi central icon, surrounded by dancing peacocks and uncut cabochon rubies.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Wedding Collections",
        "sub_type": "vaddanam",
        "occasion": "wedding",
        "price": Decimal("520000.00"),
        "status": "available",
        "image_url": "/images/plate_06_royal_nakshi_vaddanam_pristine.jpg",
        "images": [
            "/images/plate_06_royal_nakshi_vaddanam_pristine.jpg",
            "/images/plate_07_royal_antique_kadas_pristine.jpg"
        ],
        "stock_quantity": 1,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "76.0 grams",
        "net_weight": "72.5 grams",
        "hallmark_details": "BIS 916 Laser Inscribed",
        "location": "Bridal Vault Counter"
    },
    {
        "sku": "VR-COLL-WED-03",
        "name": "Imperial Peacock Antique Gold Vanki (Armlet Pair)",
        "subtitle": "Traditional South Indian Bridal Bajuband",
        "description": "Pair of antique 22K gold temple vankis with hand-carved peacock finials, suspended with seed pearls and ruby drops.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Wedding Collections",
        "sub_type": "vanki",
        "occasion": "wedding",
        "price": Decimal("215000.00"),
        "status": "available",
        "image_url": "/images/plate_07_royal_antique_kadas_pristine.jpg",
        "images": [
            "/images/plate_07_royal_antique_kadas_pristine.jpg"
        ],
        "stock_quantity": 2,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "34.5 grams",
        "net_weight": "32.0 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Bridal Vault Counter"
    },
    {
        "sku": "VR-COLL-WED-04",
        "name": "Grand Chettinad 22K Solid Gold Bridal Kasu Mala",
        "subtitle": "Consecrated Temple Coin Garland",
        "description": "Traditional 22K gold Kasu Mala featuring 108 embossed Lakshmi coins with cabochon rubies and Basra pearls.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Wedding Collections",
        "sub_type": "kasu-mala",
        "occasion": "wedding",
        "price": Decimal("365000.00"),
        "status": "available",
        "image_url": "/images/plate_01_temple_kasu_haram_pristine.jpg",
        "images": ["/images/plate_01_temple_kasu_haram_pristine.jpg"],
        "stock_quantity": 2,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "52.0 grams",
        "net_weight": "50.5 grams",
        "hallmark_details": "BIS Hallmark & Vedha Radha Heritage Seal",
        "location": "Bridal Vault Counter"
    },

    # -------------------------------------------------------------
    # 2. BABY COLLECTIONS
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-BABY-01",
        "name": "Auspicious Swastik & Evil-Eye 22K Gold Baby Kada",
        "subtitle": "Child-Safe Rounded Smooth Finish",
        "description": "A skin-safe, hypoallergenic 22K gold protective baby bangle featuring smooth rounded edges, sacred Swastik charm, protective black enamel nazar beads, and an adjustable safety clasp.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Baby Collections",
        "sub_type": "baby-bangle",
        "occasion": "ceremony",
        "price": Decimal("34500.00"),
        "status": "available",
        "image_url": "/images/collections/collections-baby-exclusive-01.jpg",
        "images": [
            "/images/collections/collections-baby-exclusive-01.jpg",
            "/images/collections/baby_nazariya_bracelets.jpg",
            "/images/collections/baby_silver_payal_anklets.jpg"
        ],
        "stock_quantity": 4,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "5.8 grams",
        "net_weight": "5.6 grams",
        "hallmark_details": "Pediatric Safety Certified Goldsmiths & BIS Hallmark",
        "location": "Family Heritage Counter"
    },
    {
        "sku": "VR-COLL-BABY-02",
        "name": "Baby 22K Gold & Black Bead Nazariya Bracelet Set",
        "subtitle": "Traditional Protection Bangle Pair",
        "description": "Pair of adjustable 22K gold baby bracelets with high-grade protective black onyx nazar beads and smooth polished gold beads.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Baby Collections",
        "sub_type": "nazariya",
        "occasion": "daily",
        "price": Decimal("22800.00"),
        "status": "available",
        "image_url": "/images/collections/baby_nazariya_bracelets.jpg",
        "images": [
            "/images/collections/baby_nazariya_bracelets.jpg"
        ],
        "stock_quantity": 5,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "4.2 grams",
        "net_weight": "3.8 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Family Heritage Counter"
    },
    {
        "sku": "VR-COLL-BABY-03",
        "name": "Chiming 92.5 Sterling Silver Baby Payal (Anklet Pair)",
        "subtitle": "Soft Chiming Ghungroo Bells",
        "description": "Pure 925 sterling silver baby anklets crafted with delicate chiming silver bells and child-friendly smooth links.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Baby Collections",
        "sub_type": "silver-payal",
        "occasion": "daily",
        "price": Decimal("8900.00"),
        "status": "available",
        "image_url": "/images/collections/baby_silver_payal_anklets.jpg",
        "images": [
            "/images/collections/baby_silver_payal_anklets.jpg"
        ],
        "stock_quantity": 6,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "16.0 grams",
        "net_weight": "16.0 grams",
        "hallmark_details": "925 Silver Hallmarked",
        "location": "Silver Counter"
    },
    {
        "sku": "VR-COLL-BABY-04",
        "name": "Little Ganesha 22K Gold Auspicious Baby Locket",
        "subtitle": "Blessing & Protection Pendant",
        "description": "Dainty 22K pure yellow gold medallion pendant embossed with infant Ganesha seated on a lotus, featuring rounded edges safe for tender skin.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Baby Collections",
        "sub_type": "baby-pendant",
        "occasion": "gift",
        "price": Decimal("18500.00"),
        "status": "available",
        "image_url": "/images/collections/baby_gold_ganesha_locket.jpg",
        "images": ["/images/collections/baby_gold_ganesha_locket.jpg"],
        "stock_quantity": 3,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "3.1 grams",
        "net_weight": "3.1 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Family Heritage Counter"
    },

    # -------------------------------------------------------------
    # 3. MEN'S ACCESSORIES
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-MENS-01",
        "name": "Men's Royal 22K Solid Gold Veera Simha Kada",
        "subtitle": "Solid Torc Kada with Lion Finials",
        "description": "A commanding solid 22K gold men's kada crowned with dual sculpted lion (Simha) heads biting a central gold ring, flanked by deeply fluted torc ridges and brushed satin panels.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Men's Accessories",
        "sub_type": "mens-kada",
        "occasion": "royal",
        "price": Decimal("245000.00"),
        "status": "available",
        "image_url": "/images/collections/collections-mens-exclusive-01.jpg",
        "images": [
            "/images/collections/collections-mens-exclusive-01.jpg",
            "/images/collections/collections-mens-exclusive-02.jpg",
            "/images/collections/mens_silver_byzantine_chain.jpg"
        ],
        "stock_quantity": 2,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "38.2 grams",
        "net_weight": "38.2 grams",
        "hallmark_details": "BIS 916 Hallmarked & Royal Armoury Seal",
        "location": "Gentlemen's Executive Lounge"
    },
    {
        "sku": "VR-COLL-MENS-02",
        "name": "Executive 22K Solid Gold Engraved Cufflinks Set",
        "subtitle": "Bespoke Royal Monogram Cufflinks",
        "description": "Pair of solid 22K yellow gold cufflinks featuring engine-turned guilloche engraving and secure swivel closures.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Men's Accessories",
        "sub_type": "cufflinks",
        "occasion": "formal",
        "price": Decimal("88500.00"),
        "status": "available",
        "image_url": "/images/collections/collections-mens-exclusive-02.jpg",
        "images": [
            "/images/collections/collections-mens-exclusive-02.jpg"
        ],
        "stock_quantity": 3,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "14.0 grams",
        "net_weight": "14.0 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Gentlemen's Executive Lounge"
    },
    {
        "sku": "VR-COLL-MENS-03",
        "name": "Heavy 925 Sterling Silver Byzantine Chain (75g)",
        "subtitle": "Solid Handcrafted Interlocking Links",
        "description": "Substantial 75-gram solid 92.5 pure silver Byzantine weave neck chain with heavy-duty lobster clasp.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Men's Accessories",
        "sub_type": "silver-chain",
        "occasion": "daily",
        "price": Decimal("28500.00"),
        "status": "available",
        "image_url": "/images/collections/mens_silver_byzantine_chain.jpg",
        "images": [
            "/images/collections/mens_silver_byzantine_chain.jpg"
        ],
        "stock_quantity": 4,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "75.0 grams",
        "net_weight": "75.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Silver Counter"
    },
    {
        "sku": "VR-COLL-MENS-04",
        "name": "Solid 22K Gold Royal Elephant Signet Ring",
        "subtitle": "Antique Regal Crest Ring",
        "description": "Solid cast 22K gold signet ring embossed with the majestic royal elephant motif and brushed border detailing.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Men's Accessories",
        "sub_type": "mens-ring",
        "occasion": "festive",
        "price": Decimal("68000.00"),
        "status": "available",
        "image_url": "/images/new-arrivals/new-arrival-exclusive-navratna-ring-01.jpg",
        "images": ["/images/new-arrivals/new-arrival-exclusive-navratna-ring-01.jpg"],
        "stock_quantity": 3,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "11.2 grams",
        "net_weight": "11.2 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Gentlemen's Executive Lounge"
    },

    # -------------------------------------------------------------
    # 4. GIRLS' ACCESSORIES
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-GIRLS-01",
        "name": "Petite Pari Butterfly 22K Gold Dainty Charm Bracelet",
        "subtitle": "Laser-Cut Butterflies with Pink Sapphire",
        "description": "A whimsical and lightweight 22K yellow gold charm bracelet designed for girls and teens, featuring three fluttering laser-cut butterflies with pink sapphire accents and Italian rolo chain.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Girls' Accessories",
        "sub_type": "charm-bracelet",
        "occasion": "daily",
        "price": Decimal("36500.00"),
        "status": "available",
        "image_url": "/images/collections/collections-girls-exclusive-01.jpg",
        "images": [
            "/images/collections/collections-girls-exclusive-01.jpg",
            "/images/products/silver/anklets/silver-anklets-payal-01.jpg",
            "/images/new-arrivals/new-arrival-chettinad-bell-jhumkas-luxe.jpg"
        ],
        "stock_quantity": 4,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "6.2 grams",
        "net_weight": "5.9 grams",
        "hallmark_details": "Modern Micro-Laser Atelier & BIS 916 Hallmark",
        "location": "Young Heritage Atelier"
    },
    {
        "sku": "VR-COLL-GIRLS-02",
        "name": "Chiming Silver Floral Payal Pair with Pink Enamel Bells",
        "subtitle": "Artisanal Pure 925 Payal Pair",
        "description": "Pair of delicate 925 sterling silver anklets adorned with miniature cherry blossom petals, pink meenakari enamel, and soft chiming silver bells.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Girls' Accessories",
        "sub_type": "girls-payal",
        "occasion": "festive",
        "price": Decimal("9500.00"),
        "status": "available",
        "image_url": "/images/products/silver/anklets/silver-anklets-payal-01.jpg",
        "images": [
            "/images/products/silver/anklets/silver-anklets-payal-01.jpg"
        ],
        "stock_quantity": 5,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "18.5 grams",
        "net_weight": "18.5 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Young Heritage Atelier"
    },
    {
        "sku": "VR-COLL-GIRLS-03",
        "name": "Lightweight 22K Gold Floral Jhumki Drops for Teens",
        "subtitle": "Festive South Indian Jhumkis",
        "description": "Miniature handcrafted 22K gold jhumkis with floral studs and dangling ruby beads, designed for lightweight festive elegance.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Girls' Accessories",
        "sub_type": "girls-earrings",
        "occasion": "festive",
        "price": Decimal("29800.00"),
        "status": "available",
        "image_url": "/images/new-arrivals/new-arrival-chettinad-bell-jhumkas-luxe.jpg",
        "images": [
            "/images/new-arrivals/new-arrival-chettinad-bell-jhumkas-luxe.jpg"
        ],
        "stock_quantity": 3,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "5.0 grams",
        "net_weight": "4.8 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Young Heritage Atelier"
    },
    {
        "sku": "VR-COLL-GIRLS-04",
        "name": "Dainty Dancing Peacock 22K Gold Pendant & Chain",
        "subtitle": "Fine Italian Box Chain Included",
        "description": "A delightful 22K gold peacock pendant with emerald eye and diamond accent, strung on a slender hallmarked gold chain.",
        "product_type": "gold",
        "category": "Collections",
        "sub_category": "Girls' Accessories",
        "sub_type": "girls-pendant",
        "occasion": "casual",
        "price": Decimal("24200.00"),
        "status": "available",
        "image_url": "/images/new-arrivals/new-arrival-temple-lakshmi-pendant-luxe.jpg",
        "images": ["/images/new-arrivals/new-arrival-temple-lakshmi-pendant-luxe.jpg"],
        "stock_quantity": 4,
        "purity": "22K BIS 916 Hallmarked",
        "gross_weight": "4.1 grams",
        "net_weight": "4.1 grams",
        "hallmark_details": "BIS 916 Hallmarked",
        "location": "Young Heritage Atelier"
    },

    # -------------------------------------------------------------
    # 5. POOJA ITEMS
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-POOJA-01",
        "name": "Swamimalai Sacred Five-Tier Peacock Silver Deepam Pair",
        "subtitle": "Traditional Chased Aarti Lamps",
        "description": "A grand five-tier ceremonial oil lamp (deepam) hand-forged in 92.5 pure sterling silver, crowned with an ornamental peacock finial, floral oil wells, and Ashtalakshmi pedestal base.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Pooja Items",
        "sub_type": "deepam",
        "occasion": "pooja",
        "price": Decimal("85000.00"),
        "status": "available",
        "image_url": "/images/collections/collections-pooja-exclusive-01.jpg",
        "images": [
            "/images/collections/collections-pooja-exclusive-01.jpg",
            "/images/products/silver/pooja-items/silver-new-arrival-ashtalakshmi-kalash-01.jpg",
            "/images/products/silver/pooja-items/silver-pooja-thali-01.jpg"
        ],
        "stock_quantity": 3,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "320.0 grams",
        "net_weight": "320.0 grams",
        "hallmark_details": "Swamimalai Temple Silversmith Guild & 925 Hallmark",
        "location": "Sacred Silver Vault"
    },
    {
        "sku": "VR-COLL-POOJA-02",
        "name": "Kamadhenu Ashtalakshmi Pure Silver Pooja Kalash",
        "subtitle": "Consecrated Auspicious Sacred Pot",
        "description": "Hand-hammered 925 sterling silver Kalash embossed with the eight forms of Goddess Lakshmi (Ashtalakshmi) and Kamadhenu motifs.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Pooja Items",
        "sub_type": "kalash",
        "occasion": "pooja",
        "price": Decimal("48000.00"),
        "status": "available",
        "image_url": "/images/products/silver/pooja-items/silver-new-arrival-ashtalakshmi-kalash-01.jpg",
        "images": [
            "/images/products/silver/pooja-items/silver-new-arrival-ashtalakshmi-kalash-01.jpg"
        ],
        "stock_quantity": 4,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "180.0 grams",
        "net_weight": "180.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Sacred Silver Vault"
    },
    {
        "sku": "VR-COLL-POOJA-03",
        "name": "Ashtalakshmi Embossed 925 Silver Pooja Thali (Plate)",
        "subtitle": "11-Inch Hand-Engraved Sacred Plate",
        "description": "Grand 11-inch ceremonial prayer thali with eight embossed Ashtalakshmi medallions along the scalloped rim and Om centerpiece.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Pooja Items",
        "sub_type": "thali",
        "occasion": "pooja",
        "price": Decimal("54000.00"),
        "status": "available",
        "image_url": "/images/products/silver/pooja-items/silver-pooja-thali-01.jpg",
        "images": [
            "/images/products/silver/pooja-items/silver-pooja-thali-01.jpg"
        ],
        "stock_quantity": 4,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "210.0 grams",
        "net_weight": "210.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Sacred Silver Vault"
    },

    # -------------------------------------------------------------
    # 6. SILVER IDOLS
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-IDOL-01",
        "name": "Lord Veera Anjaneya Sacred Solid Silver Murti",
        "subtitle": "Hand-Cast Lost Wax Pure 925 Silver",
        "description": "A majestic solid 92.5 pure silver idol of Lord Veera Anjaneya Hanuman standing in Abhaya blessing posture on an inverted double-lotus pedestal, holding the sacred Sanjeevani mountain and Gada mace.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Silver Idol",
        "sub_type": "murti",
        "occasion": "pooja",
        "price": Decimal("82000.00"),
        "status": "available",
        "image_url": "/images/collections/collections-silver-idol-exclusive-01.jpg",
        "images": [
            "/images/collections/collections-silver-idol-exclusive-01.jpg",
            "/images/products/silver/silver-idols/silver-idols-balaji-01.jpg",
            "/images/products/silver/silver-idols/silver-idols-lakshmi-02.jpg"
        ],
        "stock_quantity": 2,
        "purity": "92.5 Pure Silver",
        "gross_weight": "350.0 grams",
        "net_weight": "350.0 grams",
        "hallmark_details": "Devalaya Iconographic Sculptors & 925 Hallmark",
        "location": "Sacred Silver Vault"
    },
    {
        "sku": "VR-COLL-IDOL-02",
        "name": "Divine 92.5 Silver Tirupati Balaji Murti (10 inches)",
        "subtitle": "Venkateswara Swamy Sanctified Murti",
        "description": "Handcrafted solid 925 sterling silver statue of Lord Venkateswara with Shankha, Chakra, and intricate Tirupati adornments.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Silver Idol",
        "sub_type": "murti",
        "occasion": "pooja",
        "price": Decimal("98000.00"),
        "status": "available",
        "image_url": "/images/products/silver/silver-idols/silver-idols-balaji-01.jpg",
        "images": [
            "/images/products/silver/silver-idols/silver-idols-balaji-01.jpg"
        ],
        "stock_quantity": 2,
        "purity": "92.5 Pure Silver",
        "gross_weight": "420.0 grams",
        "net_weight": "420.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Sacred Silver Vault"
    },
    {
        "sku": "VR-COLL-IDOL-03",
        "name": "Goddess Mahalakshmi Lotus 925 Solid Silver Murti",
        "subtitle": "Gajalakshmi Prosperity Idol",
        "description": "Exquisite solid 925 sterling silver idol of Goddess Lakshmi seated on a blooming lotus with twin Kalash jars pouring golden boons.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Silver Idol",
        "sub_type": "murti",
        "occasion": "pooja",
        "price": Decimal("76000.00"),
        "status": "available",
        "image_url": "/images/products/silver/silver-idols/silver-idols-lakshmi-02.jpg",
        "images": [
            "/images/products/silver/silver-idols/silver-idols-lakshmi-02.jpg"
        ],
        "stock_quantity": 3,
        "purity": "92.5 Pure Silver",
        "gross_weight": "310.0 grams",
        "net_weight": "310.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Sacred Silver Vault"
    },

    # -------------------------------------------------------------
    # 7. GIFT COLLECTION
    # -------------------------------------------------------------
    {
        "sku": "VR-COLL-GIFT-01",
        "name": "Royal Nakshi Pure 925 Silver Footed Katori & Spoon Set",
        "subtitle": "Auspicious Heritage Presentation Gift",
        "description": "An auspicious pure 92.5 hallmarked silver bowl and spoon presentation set in royal red velvet and satin casing, handcrafted for timeless celebrations.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Gift Collection",
        "sub_type": "gift-set",
        "occasion": "gift",
        "price": Decimal("24500.00"),
        "status": "available",
        "image_url": "/images/collections/collections-gift-02.jpg",
        "images": [
            "/images/collections/collections-gift-02.jpg",
            "/images/collections/collections-gift-01.jpg",
            "/images/collections/collections-gift-03-4x3.jpg"
        ],
        "stock_quantity": 6,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "85.0 grams",
        "net_weight": "85.0 grams",
        "hallmark_details": "Vedic Uphar Silversmith Guild & 925 Hallmark",
        "location": "Gift Boutique Pavilion"
    },
    {
        "sku": "VR-COLL-GIFT-02",
        "name": "Heritage Shubh Aarambh Pure 925 Silver Grand Gift Ensemble",
        "subtitle": "Velvet Cased Royal Presentation Set",
        "description": "Comprehensive ceremonial silver presentation set including embossed silver tumbler, katori, spoon, and auspicious Lakshmi coin in satin casing.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Gift Collection",
        "sub_type": "gift-ensemble",
        "occasion": "gift",
        "price": Decimal("68000.00"),
        "status": "available",
        "image_url": "/images/collections/collections-gift-01.jpg",
        "images": [
            "/images/collections/collections-gift-01.jpg"
        ],
        "stock_quantity": 4,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "240.0 grams",
        "net_weight": "240.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Gift Boutique Pavilion"
    },
    {
        "sku": "VR-COLL-GIFT-03",
        "name": "Pure 925 Silver Royal Peacock Dry Fruit Presentation Box",
        "subtitle": "Luxury Hand-Chased Serving Box",
        "description": "Exquisite handcrafted pure 925 sterling silver dual-compartment dry fruit box with a sculpted peacock handle and floral filigree repoussé work.",
        "product_type": "silver",
        "category": "Collections",
        "sub_category": "Gift Collection",
        "sub_type": "silver-box",
        "occasion": "gift",
        "price": Decimal("46000.00"),
        "status": "available",
        "image_url": "/images/collections/collections-gift-03-4x3.jpg",
        "images": [
            "/images/collections/collections-gift-03-4x3.jpg"
        ],
        "stock_quantity": 3,
        "purity": "92.5 Sterling Silver",
        "gross_weight": "165.0 grams",
        "net_weight": "165.0 grams",
        "hallmark_details": "925 Pure Silver Hallmarked",
        "location": "Gift Boutique Pavilion"
    }
]


def seed_curated():
    db = SessionLocal()
    added_count = 0
    updated_count = 0
    try:
        for pdata in CURATED_PRODUCTS:
            sku = pdata["sku"]
            existing = db.query(Product).filter(Product.sku == sku).first()
            if existing:
                for k, v in pdata.items():
                    setattr(existing, k, v)
                updated_count += 1
            else:
                p = Product(
                    id=uuid.uuid4(),
                    sku=pdata["sku"],
                    name=pdata["name"],
                    subtitle=pdata["subtitle"],
                    description=pdata["description"],
                    product_type=pdata["product_type"],
                    category=pdata["category"],
                    sub_category=pdata["sub_category"],
                    sub_type=pdata["sub_type"],
                    occasion=pdata["occasion"],
                    item_type="unique",
                    price=pdata["price"],
                    status=pdata["status"],
                    image_url=pdata["image_url"],
                    images=pdata["images"],
                    stock_quantity=pdata["stock_quantity"],
                    purity=pdata["purity"],
                    gross_weight=pdata["gross_weight"],
                    net_weight=pdata["net_weight"],
                    hallmark_details=pdata["hallmark_details"],
                    location=pdata["location"],
                    is_active=True
                )
                db.add(p)
                added_count += 1
        db.commit()
        print(f"Successfully seeded curated collections: {added_count} added, {updated_count} updated.")
    except Exception as e:
        db.rollback()
        print("Error seeding products:", e)
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_curated()


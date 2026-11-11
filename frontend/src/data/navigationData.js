export const goldNavItems = [
  { name: 'Earrings', path: '/gold/earrings', count: '48 designs' },
  { name: 'Rings', path: '/gold/rings', count: '36 designs' },
  { name: 'Pendants', path: '/gold/pendants', count: '24 designs' },
  { name: 'Bangles', path: '/gold/bangles', count: '52 designs' },
  { name: 'Necklaces', path: '/gold/necklaces', count: '40 designs' },
  { name: 'Occasion', path: '/gold/occasion', count: '51 designs' },
  { name: 'Chains', path: '/gold/chains', count: '30 designs' },
  { name: 'Anklets', path: '/gold/anklets', count: '18 designs' },
  { name: 'Toe Rings', path: '/gold/toe-rings', count: '12 designs' },
  { name: 'Bridal Jewellery', path: '/gold/bridal-jewellery', count: '65 sets', highlight: true },
  { name: 'View All Gold', path: '/gold', isAll: true }
];

export const silverNavItems = [
  { name: 'Anklets', path: '/silver/anklets', count: '32 designs' },
  { name: 'Toe Rings', path: '/silver/toe-rings', count: '28 designs' },
  { name: 'Lamps', path: '/silver/lamps', count: '18 designs' },
  { name: 'Pooja Items', path: '/silver/pooja-items', count: '44 items' },
  { name: 'Chains', path: '/silver/chains', count: '20 designs' },
  { name: 'Handcrafted Silver', path: '/silver/handcrafted-silver', count: '25 items', highlight: true },
  { name: 'View All Silver', path: '/silver', isAll: true }
];

export const coinsBarsNavItems = [
  { name: 'Gold Coins', path: '/coins-bars/gold-coins', count: '1g to 50g', image: '/images/coin_gold.jpg' },
  { name: 'Gold Bars', path: '/coins-bars/gold-bars', count: '5g to 100g', image: '/images/bar_gold.jpg' },
  { name: 'Silver Coins', path: '/coins-bars/silver-coins', count: '10g to 500g', image: '/images/coin_silver.jpg' },
  { name: 'Silver Bars', path: '/coins-bars/silver-bars', count: '50g to 1kg', image: '/images/bar_silver.jpg' },
  { name: 'View All Coins & Bars', path: '/coins-bars', isAll: true }
];

export const collectionsNavItems = [
  { 
    name: 'Certified Diamonds', 
    slug: 'diamonds',
    path: '/diamonds', 
    image: '/images/generated/diamond_solitaire_luxe.jpg',
    tag: 'Solitaires & Fine Diamonds',
    desc: 'Certified natural diamond engagement rings, tennis bracelets, and halo harams.'
  },
  { 
    name: 'Wedding Collections', 
    slug: 'wedding',
    path: '/collections/wedding', 
    image: '/images/col_wedding.jpg',
    tag: 'Muhurtham Harams & Bridal Sets',
    desc: 'Grand 22K temple chokers, Kasu malas, and matching trousseau ornaments.'
  },
  { 
    name: 'Baby Collections', 
    slug: 'baby',
    path: '/collections/baby', 
    image: '/images/col_baby.jpg',
    tag: 'Auspicious First Jewels',
    desc: 'Protective Nazariya bangles, waist cords, and gentle 22K gold charms.'
  },
  { 
    name: "Men's Accessories", 
    slug: 'mens-accessories',
    path: '/collections/mens-accessories', 
    image: '/images/col_mens.jpg',
    tag: 'Solid Kadas & Chains',
    desc: 'Heavy fluted gold kadas, gemstone signet rings, and durable neck chains.'
  },
  { 
    name: "Girls' Accessories", 
    slug: 'girls-accessories',
    path: '/collections/girls-accessories', 
    image: '/images/col_girls.jpg',
    tag: 'Lightweight & Daily Wear',
    desc: 'Charming 925 payals, floral earrings, and stackable casual rings.'
  },
  { 
    name: 'Pooja Items', 
    slug: 'pooja-items',
    path: '/collections/pooja-items', 
    image: '/images/col_pooja.jpg',
    tag: 'Sacred Temple Vessels',
    desc: 'Hand-chased Ashtalakshmi thalis, Kamakshi deepams, and aarti sets.'
  },
  { 
    name: 'Silver Idol', 
    slug: 'silver-idols',
    path: '/collections/silver-idols', 
    image: '/images/col_silver_idol.jpg',
    tag: 'Divine Murti Collection',
    desc: 'Sacred Balaji, Ganesha, and Lakshmi murtis in pure 92.5 solid silver.'
  },
  { 
    name: 'Gift Collection', 
    slug: 'gift-collection',
    path: '/collections/gift-collection', 
    image: '/images/col_gift.jpg',
    tag: 'Auspicious Silver Gift Keepsakes',
    desc: 'Pure 92.5 silver bowls, dinner sets, and presentation boxes for cherished celebrations.'
  },
  { 
    name: 'View All Collections', 
    path: '/collections', 
    isAll: true 
  }
];

export const newArrivalsNavItem = {
  name: 'New Arrivals',
  path: '/new-arrivals'
};

export const initialPreciousRates = {
  gold22k: '6,742',
  gold24k: '7,355',
  silver1g: '94.50',
  lastUpdated: 'Today, 10:30 AM'
};

export const goldCategories = goldNavItems;
export const silverCategories = silverNavItems;

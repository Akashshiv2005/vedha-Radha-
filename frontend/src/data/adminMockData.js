// Initial realistic sample data for Veda Radha Thangamaaligai Admin Prototype

export const INITIAL_PRODUCTS = [
  {
    id: 'SA-001',
    sku: 'SA-001',
    name: 'Handcrafted Silver Anklet',
    subtitle: 'One of a kind • Handcrafted',
    category: 'Silver Jewellery',
    subCategory: 'Anklets & Kolusu',
    purity: '925 Sterling Silver',
    grossWeight: '45.00 g',
    netWeight: '45.00 g',
    price: '12,800',
    numericPrice: 12800,
    isPriceOnRequest: false,
    isUnique: true, // 1-of-1 Handcrafted piece
    status: 'reserved', // 'available' | 'reserved' | 'sold' | 'unavailable'
    image: '/images/product_anklet.jpg',
    isSampleImage: true,
    sampleImageNote: 'Sample reference photo — Handcrafted piece varies slightly in ghungroo engraving',
    description: 'Traditional heavy Chettinad silver payal with intricately sculpted peacock clasps and melodic chime ghungroos. Handcrafted by master silversmiths.',
    hallmarkDetails: '925 Fineness Stamped (Sample / Subject to lab verification)',
    stockQty: 1,
    availability: 'in_stock',
    location: 'Showroom Counter 3 - Silver Section',
    updatedDate: '12 Jun 2024',
    updatedTime: '10:24 AM',
    lastUpdated: '12 Jun 2024\n10:24 AM'
  },
  {
    id: 'GC-1045',
    sku: 'GC-1045',
    name: '22K Gold Chain',
    subtitle: '22K 916 Hallmark • Classic Curb',
    category: 'Gold Jewellery',
    subCategory: 'Chains & Neckwear',
    purity: '22K (916 Fineness)',
    grossWeight: '24.20 g',
    netWeight: '24.20 g',
    price: '48,500',
    numericPrice: 48500,
    isPriceOnRequest: false,
    isUnique: false,
    status: 'available',
    image: '/images/product_gold_chain.jpg',
    isSampleImage: false,
    sampleImageNote: 'High-definition showroom archival photo',
    description: '22K yellow gold classic curb chain featuring precision soldered links with BIS hallmarked lock mechanism.',
    hallmarkDetails: '916 BIS Laser Inscription (Editable demo field)',
    stockQty: 3,
    availability: 'in_stock',
    location: 'Locker Safe B - Vault 2',
    updatedDate: '11 Jun 2024',
    updatedTime: '04:18 PM',
    lastUpdated: '11 Jun 2024\n04:18 PM'
  },
  {
    id: 'SB-778',
    sku: 'SB-778',
    name: 'Silver Bowl',
    subtitle: 'Pure Silver Pooja Kinnam',
    category: 'Silver Articles',
    subCategory: 'Pooja Utensils',
    purity: '92.5% Silver Grade',
    grossWeight: '118.00 g',
    netWeight: '118.00 g',
    price: '16,200',
    numericPrice: 16200,
    isPriceOnRequest: false,
    isUnique: false,
    status: 'available',
    image: '/images/product_silver_bowl.jpg',
    isSampleImage: true,
    sampleImageNote: 'Representative collection visual',
    description: 'Handcrafted pure silver puja bowl with fluted lotus petals and auspicious Ashtalakshmi relief border.',
    hallmarkDetails: 'Showroom Purity Stamp (Demo field)',
    stockQty: 2,
    availability: 'in_stock',
    location: 'Showroom Counter 4 - Gift & Pooja',
    updatedDate: '10 Jun 2024',
    updatedTime: '02:41 PM',
    lastUpdated: '10 Jun 2024\n02:41 PM'
  },
  {
    id: 'GE-332',
    sku: 'GE-332',
    name: 'Gold Earrings',
    subtitle: 'Temple Antique Jhumkas',
    category: 'Gold Jewellery',
    subCategory: 'Earrings & Jhumkas',
    purity: '22K Antique Finish',
    grossWeight: '18.40 g',
    netWeight: '18.40 g',
    price: '28,600',
    numericPrice: 28600,
    isPriceOnRequest: false,
    isUnique: false,
    status: 'sold',
    image: '/images/product_gold_earrings.jpg',
    isSampleImage: true,
    sampleImageNote: 'Sample gallery asset',
    description: 'Heritage antique finish screw-type jhumkas with ruby accents and delicate floral filigree drops.',
    hallmarkDetails: '22K BIS Hallmarked',
    stockQty: 0,
    availability: 'out_of_stock',
    location: 'Sold in Showroom Counter 1 (Bill #VR-POS-9481)',
    updatedDate: '09 Jun 2024',
    updatedTime: '11:03 AM',
    lastUpdated: '09 Jun 2024\n11:03 AM'
  },
  {
    id: 'TN-918',
    sku: 'TN-918',
    name: 'Temple Necklace',
    subtitle: 'Goddess Lakshmi Nakashi Work',
    category: 'Temple Jewellery',
    subCategory: 'Heritage Necklaces',
    purity: '22K (916 Fineness)',
    grossWeight: '38.60 g',
    netWeight: '36.20 g',
    price: '72,400',
    numericPrice: 72400,
    isPriceOnRequest: false,
    isUnique: false,
    status: 'available',
    image: '/images/product_necklace.jpg',
    isSampleImage: true,
    sampleImageNote: 'High-definition showroom archival photo',
    description: '22K yellow gold temple necklace featuring Goddess Lakshmi medallion with Burmese ruby accents and hand-carved floral nakashi motifs.',
    hallmarkDetails: '916 BIS Laser Inscription (Editable demo field)',
    stockQty: 1,
    availability: 'in_stock',
    location: 'Showroom Counter 2 - Gold Floor',
    updatedDate: '08 Jun 2024',
    updatedTime: '05:27 PM',
    lastUpdated: '08 Jun 2024\n05:27 PM'
  },
  {
    id: 'VR-BRD-501',
    sku: 'VR-BRD-501',
    name: 'Grand Muhurtham Navaratna Bridal Choker Set',
    subtitle: 'Bespoke Wedding Collection',
    category: 'Bridal Jewellery',
    subCategory: 'Bridal Sets',
    purity: '22K Gold & Semi-precious Gemstones',
    grossWeight: '92.40 g',
    netWeight: '81.10 g',
    price: '6,80,000',
    numericPrice: 680000,
    isPriceOnRequest: true,
    isUnique: true,
    status: 'reserved',
    image: '/images/col_bridal.jpg',
    isSampleImage: true,
    sampleImageNote: 'Bridal campaign visual reference',
    description: 'Masterpiece ceremonial bridal choker set accompanied by matching jhumkas and maang tikka. Handcrafted for bespoke wedding orders.',
    hallmarkDetails: '22K Hallmarked with Gemstone Report',
    stockQty: 1,
    availability: 'in_stock',
    location: 'VIP Bridal Lounge Suite',
    updatedDate: '07 Jun 2024',
    updatedTime: '03:15 PM',
    lastUpdated: '07 Jun 2024\n03:15 PM'
  },
  {
    id: 'VR-COIN-010',
    sku: 'VR-COIN-010',
    name: '24K Pure Gold Lakshmi Ganesha Coin (10 Grams)',
    subtitle: 'Swiss Minted 999.9 Purity',
    category: 'Coins & Bars',
    subCategory: 'Gold Coins',
    purity: '999.9 Fine Gold (24 Karat)',
    grossWeight: '10.00 g',
    netWeight: '10.00 g',
    price: '82,400',
    numericPrice: 82400,
    isPriceOnRequest: false,
    isUnique: false,
    status: 'available',
    image: '/images/col_gold.jpg',
    isSampleImage: false,
    sampleImageNote: 'Direct scan of certified tamper-proof blister pack',
    description: 'Swiss-grade minted pure gold coin with embossed Goddess Lakshmi and Lord Ganesha. Certified purity packaging.',
    hallmarkDetails: 'NABL Certified 999.9 Purity Barcode',
    stockQty: 18,
    availability: 'in_stock',
    location: 'Safe Vault 1',
    updatedDate: '06 Jun 2024',
    updatedTime: '01:20 PM',
    lastUpdated: '06 Jun 2024\n01:20 PM'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'VR-2024-00128',
    orderNumber: 'VR-2024-00128',
    channel: 'Showroom',
    customerName: 'Ananya Sharma',
    phone: '+91 98765 43210',
    email: 'ananya.sharma@example.com',
    city: 'Madurai',
    pincode: '625001',
    deliveryAddress: 'No. 14, West Masi Street, Madurai, Tamil Nadu',
    productSku: 'DR-0018',
    productName: 'Diamond Ring',
    productPrice: '₹ 2,48,000',
    numericPrice: 248000,
    productImage: '/images/products/gold/gold_studs_1_photo.jpg',
    isUniqueItem: true,
    orderType: 'reservation',
    fulfilmentType: 'showroom_pickup',
    status: 'awaiting_confirmation',
    receivedDate: '03 Sep 2024',
    receivedTime: '11:20 AM',
    receivedAt: '2024-09-03T11:20:00',
    holdExpiresDate: '06 Sep 2024',
    holdExpiresTime: '11:20 AM',
    holdExpiresText: 'Expires in 1 day',
    holdExpiresAt: '2024-09-06T11:20:00',
    nextAction: 'Confirm with customer',
    primaryAction: 'Confirm Hold',
    notes: 'Customer scheduled showroom visit. Requires phone confirmation before holding unique piece.',
    tracking: {
      carrier: 'Showroom Concierge Reserve',
      trackingId: 'HOLD-DR-0018',
      dispatchedAt: null,
      deliveryStatus: 'Pending Customer Phone Confirmation'
    },
    timeline: [
      { timestamp: '03 Sep 11:20 AM', event: 'Showroom hold reservation placed by customer', user: 'Showroom Concierge' }
    ]
  },
  {
    id: 'VR-2024-00127',
    orderNumber: 'VR-2024-00127',
    channel: 'Online',
    customerName: 'Rohan Mehta',
    phone: '+91 98112 33445',
    email: 'rohan.mehta@example.com',
    city: 'Chennai',
    pincode: '600028',
    deliveryAddress: 'Flat 4B, Emerald Apts, Greenways Road, Chennai, TN',
    productSku: 'GN-0456',
    productName: 'Gold Necklace',
    productPrice: '₹ 1,12,000',
    numericPrice: 112000,
    productImage: '/images/product_necklace.jpg',
    isUniqueItem: true,
    orderType: 'reservation',
    fulfilmentType: 'showroom_pickup',
    status: 'reserved',
    receivedDate: '03 Sep 2024',
    receivedTime: '05:42 PM',
    receivedAt: '2024-09-03T17:42:00',
    holdExpiresDate: '08 Sep 2024',
    holdExpiresTime: '05:42 PM',
    holdExpiresText: '2 days left',
    holdExpiresAt: '2024-09-08T17:42:00',
    nextAction: 'Customer visit scheduled',
    primaryAction: 'Extend Hold',
    notes: 'Customer confirmed physical showroom viewing scheduled for tomorrow.',
    tracking: {
      carrier: 'Showroom Vault Safe',
      trackingId: 'HOLD-GN-0456',
      dispatchedAt: null,
      deliveryStatus: 'Secured in Vault Safe B'
    },
    timeline: [
      { timestamp: '03 Sep 05:42 PM', event: 'Online hold approved and locked', user: 'System Safeguard' }
    ]
  },
  {
    id: 'VR-2024-00126',
    orderNumber: 'VR-2024-00126',
    channel: 'Showroom',
    customerName: 'Priya Nair',
    phone: '+91 98450 22117',
    email: 'priya.nair@example.com',
    city: 'Coimbatore',
    pincode: '641018',
    deliveryAddress: '12/4 Race Course Road, Coimbatore, Tamil Nadu',
    productSku: 'TE-0781',
    productName: 'Temple Earrings',
    productPrice: '₹ 86,500',
    numericPrice: 86500,
    productImage: '/images/product_gold_earrings.jpg',
    isUniqueItem: false,
    orderType: 'direct_order',
    fulfilmentType: 'showroom_pickup',
    status: 'processing',
    receivedDate: '02 Sep 2024',
    receivedTime: '03:15 PM',
    receivedAt: '2024-09-02T15:15:00',
    holdExpiresDate: null,
    holdExpiresTime: null,
    holdExpiresText: null,
    holdExpiresAt: null,
    nextAction: 'Prepare for dispatch',
    primaryAction: 'View Details',
    notes: 'Invoice generated. Moving piece to vault packaging desk.',
    tracking: {
      carrier: 'Showroom Courier Service',
      trackingId: 'VR-EXP-2026',
      dispatchedAt: null,
      deliveryStatus: 'Packaging at Vault Desk'
    },
    timeline: [
      { timestamp: '02 Sep 03:15 PM', event: 'Showroom counter billing completed', user: 'Staff (Thangaraj)' }
    ]
  },
  {
    id: 'VR-2024-00125',
    orderNumber: 'VR-2024-00125',
    channel: 'Online',
    customerName: 'Karan Malhotra',
    phone: '+91 99887 66554',
    email: 'karan.malhotra@example.com',
    city: 'Bengaluru',
    pincode: '560001',
    deliveryAddress: 'Indiranagar 100ft Road, Bengaluru, KA',
    productSku: 'GB-0322',
    productName: 'Gold Bangle',
    productPrice: '₹ 1,78,000',
    numericPrice: 178000,
    productImage: '/images/product_bangles.jpg',
    isUniqueItem: false,
    orderType: 'direct_order',
    fulfilmentType: 'home_delivery',
    status: 'dispatched',
    receivedDate: '01 Sep 2024',
    receivedTime: '10:05 AM',
    receivedAt: '2024-09-01T10:05:00',
    holdExpiresDate: null,
    holdExpiresTime: null,
    holdExpiresText: null,
    holdExpiresAt: null,
    nextAction: 'Out for delivery (BlueDart)',
    primaryAction: 'View Details',
    notes: 'Insured valuable transit cargo handed to BlueDart agent.',
    tracking: {
      carrier: 'BlueDart Apex Gold Secure',
      trackingId: 'BD-EXP-992144',
      dispatchedAt: '2024-09-01T14:30:00',
      deliveryStatus: 'Out for Delivery with Courier Agent'
    },
    timeline: [
      { timestamp: '01 Sep 10:05 AM', event: 'Online payment authorized', user: 'Gateway' },
      { timestamp: '01 Sep 02:30 PM', event: 'Dispatched via BlueDart insured express', user: 'Logistics Desk' }
    ]
  },
  {
    id: 'VR-2024-00124',
    orderNumber: 'VR-2024-00124',
    channel: 'Showroom',
    customerName: 'Sneha Iyer',
    phone: '+91 96111 44556',
    email: 'sneha.iyer@example.com',
    city: 'Madurai',
    pincode: '625001',
    deliveryAddress: 'North Veli Street, Madurai, TN',
    productSku: 'DP-0190',
    productName: 'Diamond Pendant',
    productPrice: '₹ 95,000',
    numericPrice: 95000,
    productImage: '/images/col_gold.jpg',
    isUniqueItem: true,
    orderType: 'reservation',
    fulfilmentType: 'showroom_pickup',
    status: 'awaiting_confirmation',
    receivedDate: '31 Aug 2024',
    receivedTime: '04:50 PM',
    receivedAt: '2024-08-31T16:50:00',
    holdExpiresDate: '05 Sep 2024',
    holdExpiresTime: '04:50 PM',
    holdExpiresText: 'Expires today',
    holdExpiresAt: '2024-09-05T16:50:00',
    nextAction: 'Follow up with customer',
    primaryAction: 'Confirm Hold',
    notes: 'Customer requested courtesy hold before bridal trial.',
    tracking: {
      carrier: 'Showroom Concierge Reserve',
      trackingId: 'HOLD-DP-0190',
      dispatchedAt: null,
      deliveryStatus: 'Hold expiring today'
    },
    timeline: [
      { timestamp: '31 Aug 04:50 PM', event: 'Showroom reservation entered', user: 'Showroom Desk' }
    ]
  },
  {
    id: 'VR-2024-00123',
    orderNumber: 'VR-2024-00123',
    channel: 'Online',
    customerName: 'Vikram Rao',
    phone: '+91 98336 77881',
    email: 'vikram.rao@example.com',
    city: 'Tiruchirappalli',
    pincode: '620001',
    deliveryAddress: 'Big Bazaar Street, Trichy, Tamil Nadu',
    productSku: 'PR-0665',
    productName: 'Platinum Ring',
    productPrice: '₹ 3,10,000',
    numericPrice: 310000,
    productImage: '/images/product_silver_bowl.jpg',
    isUniqueItem: true,
    orderType: 'reservation',
    fulfilmentType: 'showroom_pickup',
    status: 'reserved',
    receivedDate: '31 Aug 2024',
    receivedTime: '11:18 AM',
    receivedAt: '2024-08-31T11:18:00',
    holdExpiresDate: null,
    holdExpiresTime: null,
    holdExpiresText: null,
    holdExpiresAt: null,
    nextAction: 'Customer confirmed (visit on 07 Sep)',
    primaryAction: 'Extend Hold',
    notes: 'Customer deposit acknowledged. Piece safely locked in vault.',
    tracking: {
      carrier: 'Showroom Safe Vault',
      trackingId: 'HOLD-PR-0665',
      dispatchedAt: null,
      deliveryStatus: 'Secured in Vault'
    },
    timeline: [
      { timestamp: '31 Aug 11:18 AM', event: 'Online reservation confirmed by customer', user: 'Online Storefront' }
    ]
  },
  {
    id: 'VR-2024-00122',
    orderNumber: 'VR-2024-00122',
    channel: 'Showroom',
    customerName: 'Neha Kapoor',
    phone: '+91 98703 22990',
    email: 'neha.kapoor@example.com',
    city: 'Salem',
    pincode: '636001',
    deliveryAddress: 'Main Road, Salem, Tamil Nadu',
    productSku: 'KN-0112',
    productName: 'Kundan Necklace',
    productPrice: '₹ 3,25,000',
    numericPrice: 325000,
    productImage: '/images/product_necklace.jpg',
    isUniqueItem: true,
    orderType: 'direct_order',
    fulfilmentType: 'showroom_pickup',
    status: 'processing',
    receivedDate: '30 Aug 2024',
    receivedTime: '06:25 PM',
    receivedAt: '2024-08-30T18:25:00',
    holdExpiresDate: null,
    holdExpiresTime: null,
    holdExpiresText: null,
    holdExpiresAt: null,
    nextAction: 'Quality check',
    primaryAction: 'View Details',
    notes: 'Final hallmark inspection & gemstone verification.',
    tracking: {
      carrier: 'VIP Lounge Desk',
      trackingId: 'QC-KN-0112',
      dispatchedAt: null,
      deliveryStatus: 'Under Final Quality Inspection'
    },
    timeline: [
      { timestamp: '30 Aug 06:25 PM', event: 'Order verified by Senior Manager', user: 'Manager' }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: 'DEL-0847',
    orderNumber: 'VRJ-2025-0847',
    date: '09 Mar 2025',
    customerName: 'Aditi Sharma',
    phone: '+91 98765 43210',
    destination: 'Mumbai, Maharashtra',
    pincode: '400001',
    courier: 'Blue Dart',
    trackingId: 'BD780123456IN',
    status: 'Ready to Dispatch',
    itemsSummary: '22K Gold Antique Choker Set',
    itemPrice: '₹ 2,48,000',
    timeline: [
      { timestamp: '09 Mar 10:30 AM', event: 'Vault packed & tamper-proof sealed', user: 'Vault Supervisor' },
      { timestamp: '09 Mar 09:15 AM', event: 'Dispatch manifest created with Blue Dart', user: 'Logistics Desk' }
    ]
  },
  {
    id: 'DEL-0846',
    orderNumber: 'VRJ-2025-0846',
    date: '09 Mar 2025',
    customerName: 'Rohan Mehta',
    phone: '+91 98201 66778',
    destination: 'Bengaluru, Karnataka',
    pincode: '560001',
    courier: 'Delhivery',
    trackingId: 'DLV1597632456',
    status: 'In Transit',
    itemsSummary: 'Handcrafted Silver Anklet (Payal)',
    itemPrice: '₹ 12,800',
    timeline: [
      { timestamp: '09 Mar 02:40 PM', event: 'Consignment departed BLR Airport Sorting Facility', user: 'Delhivery Agent' },
      { timestamp: '09 Mar 11:20 AM', event: 'Picked up from showroom dispatch hub', user: 'Delhivery Driver' }
    ]
  },
  {
    id: 'DEL-0845',
    orderNumber: 'VRJ-2025-0845',
    date: '08 Mar 2025',
    customerName: 'Priya Nair',
    phone: '+91 97456 22110',
    destination: 'Chennai, Tamil Nadu',
    pincode: '600028',
    courier: 'DTDC',
    trackingId: 'DT1234567890',
    status: 'Delivered',
    itemsSummary: '24K Pure Gold Lakshmi Coin (10g)',
    itemPrice: '₹ 82,400',
    deliveredAt: '08 Mar 2025, 04:30 PM',
    timeline: [
      { timestamp: '08 Mar 04:30 PM', event: 'Successfully handed over to customer (OTP verified)', user: 'DTDC Courier' },
      { timestamp: '08 Mar 01:15 PM', event: 'Out for delivery in Chennai Central', user: 'DTDC Dispatch' }
    ]
  },
  {
    id: 'DEL-0844',
    orderNumber: 'VRJ-2025-0844',
    date: '08 Mar 2025',
    customerName: 'Karan Malhotra',
    phone: '+91 98112 33445',
    destination: 'New Delhi, Delhi',
    pincode: '110001',
    courier: 'Ekart',
    trackingId: 'EK7890123456',
    status: 'In Transit',
    itemsSummary: 'Temple Antique Gold Jhumkas',
    itemPrice: '₹ 28,600',
    timeline: [
      { timestamp: '08 Mar 07:15 PM', event: 'In transit: Arrived at Delhi Aerocity Hub', user: 'Ekart Logistics' },
      { timestamp: '08 Mar 12:00 PM', event: 'Air freight handed over at Chennai Cargo Hub', user: 'Ekart Driver' }
    ]
  },
  {
    id: 'DEL-0843',
    orderNumber: 'VRJ-2025-0843',
    date: '07 Mar 2025',
    customerName: 'Sneha Iyer',
    phone: '+91 98900 77665',
    destination: 'Hyderabad, Telangana',
    pincode: '500001',
    courier: 'Blue Dart',
    trackingId: 'BD780098765IN',
    status: 'Delivered',
    itemsSummary: 'Pure Silver Pooja Kinnam (Bowl)',
    itemPrice: '₹ 16,200',
    deliveredAt: '07 Mar 2025, 03:15 PM',
    timeline: [
      { timestamp: '07 Mar 03:15 PM', event: 'Package delivered with signed acknowledgement', user: 'Blue Dart Delivery' },
      { timestamp: '07 Mar 10:45 AM', event: 'Out for delivery in Banjara Hills Hub', user: 'Blue Dart Hub' }
    ]
  },
  {
    id: 'DEL-0842',
    orderNumber: 'VRJ-2025-0842',
    date: '07 Mar 2025',
    customerName: 'Vikram Sinha',
    phone: '+91 98333 11223',
    destination: 'Kolkata, West Bengal',
    pincode: '700001',
    courier: 'India Post',
    trackingId: 'IP345678901IN',
    status: 'Ready to Dispatch',
    itemsSummary: 'Classic 22K Gold Curb Chain',
    itemPrice: '₹ 48,500',
    timeline: [
      { timestamp: '07 Mar 04:00 PM', event: 'Packed in insured tamper-evident security box', user: 'Vault Supervisor' },
      { timestamp: '07 Mar 02:20 PM', event: 'Speed Post Insured consignment booked', user: 'Logistics Desk' }
    ]
  },
  {
    id: 'DEL-0841',
    orderNumber: 'VRJ-2025-0841',
    date: '06 Mar 2025',
    customerName: 'Neha Kapoor',
    phone: '+91 97654 88990',
    destination: 'Ahmedabad, Gujarat',
    pincode: '380001',
    courier: 'Delhivery',
    trackingId: 'DLV1597001123',
    status: 'In Transit',
    itemsSummary: 'Filigree Silver Dining Tumbler Set',
    itemPrice: '₹ 32,500',
    timeline: [
      { timestamp: '06 Mar 06:10 PM', event: 'Reached Ahmedabad Transshipment Hub', user: 'Delhivery Logistics' },
      { timestamp: '06 Mar 09:30 AM', event: 'Dispatched on morning transit run', user: 'Logistics Desk' }
    ]
  },
  {
    id: 'DEL-0840',
    orderNumber: 'VRJ-2025-0840',
    date: '06 Mar 2025',
    customerName: 'Ananya Joshi',
    phone: '+91 98220 11445',
    destination: 'Pune, Maharashtra',
    pincode: '411001',
    courier: 'Blue Dart',
    trackingId: 'BD780045612IN',
    status: 'Service Issues',
    issueDetails: 'Incorrect recipient pincode provided; package held at Pune Shivaji Nagar hub for phone verification.',
    itemsSummary: 'Floral Diamond Solitaire Ring',
    itemPrice: '₹ 1,12,000',
    timeline: [
      { timestamp: '06 Mar 05:20 PM', event: 'Flagged for attention: Consignee address incomplete', user: 'Blue Dart Pune Hub' },
      { timestamp: '06 Mar 11:00 AM', event: 'Out for delivery attempt failed', user: 'Blue Dart Courier' }
    ]
  },
  {
    id: 'DEL-0839',
    orderNumber: 'VRJ-2025-0839',
    date: '05 Mar 2025',
    customerName: 'Rajesh Sundaram',
    phone: '+91 98401 55667',
    destination: 'Madurai, Tamil Nadu',
    pincode: '625001',
    courier: 'Showroom Express',
    trackingId: 'SE890123456TN',
    status: 'Ready to Dispatch',
    itemsSummary: 'Artisan Silver Kumkum Chimizh',
    itemPrice: '₹ 9,500',
    timeline: [
      { timestamp: '05 Mar 03:00 PM', event: 'Showroom VIP messenger assigned for local hand-delivery', user: 'Showroom Desk' }
    ]
  },
  {
    id: 'DEL-0838',
    orderNumber: 'VRJ-2025-0838',
    date: '05 Mar 2025',
    customerName: 'Meera Nambiar',
    phone: '+91 98470 33445',
    destination: 'Kochi, Kerala',
    pincode: '682001',
    courier: 'Delhivery',
    trackingId: 'DLV1596784321',
    status: 'In Transit',
    itemsSummary: '22K Gold Kasu Malai Heritage Chain',
    itemPrice: '₹ 1,78,000',
    timeline: [
      { timestamp: '05 Mar 04:45 PM', event: 'Consignment in transit: Cochin SeaPort Cargo Terminal', user: 'Delhivery' }
    ]
  },
  {
    id: 'DEL-0837',
    orderNumber: 'VRJ-2025-0837',
    date: '04 Mar 2025',
    customerName: 'Siddharth Rao',
    phone: '+91 99200 44556',
    destination: 'Jaipur, Rajasthan',
    pincode: '302001',
    courier: 'Ekart',
    trackingId: 'EK7890334412',
    status: 'In Transit',
    itemsSummary: 'Platinum Couple Wedding Band Set',
    itemPrice: '₹ 3,10,000',
    timeline: [
      { timestamp: '04 Mar 08:30 PM', event: 'Air Cargo landed at Jaipur Sanganer Hub', user: 'Ekart Cargo' }
    ]
  },
  {
    id: 'DEL-0836',
    orderNumber: 'VRJ-2025-0836',
    date: '04 Mar 2025',
    customerName: 'Divya Krishnan',
    phone: '+91 98840 99887',
    destination: 'Coimbatore, Tamil Nadu',
    pincode: '641018',
    courier: 'Blue Dart',
    trackingId: 'BD780066778IN',
    status: 'Ready to Dispatch',
    itemsSummary: 'Antique Kemp Temple Bangle',
    itemPrice: '₹ 68,000',
    timeline: [
      { timestamp: '04 Mar 02:15 PM', event: 'Packaging complete; awaiting Blue Dart evening van pickup', user: 'Vault Desk' }
    ]
  },
  {
    id: 'DEL-0835',
    orderNumber: 'VRJ-2025-0835',
    date: '03 Mar 2025',
    customerName: 'Arun Subramanian',
    phone: '+91 97910 88776',
    destination: 'Trichy, Tamil Nadu',
    pincode: '620001',
    courier: 'DTDC',
    trackingId: 'DT1234889901',
    status: 'Delivered',
    itemsSummary: '925 Silver Ashtalakshmi Vilakku',
    itemPrice: '₹ 24,000',
    deliveredAt: '03 Mar 2025, 02:40 PM',
    timeline: [
      { timestamp: '03 Mar 02:40 PM', event: 'Delivered at customer address in Cantonment, Trichy', user: 'DTDC' }
    ]
  },
  {
    id: 'DEL-0834',
    orderNumber: 'VRJ-2025-0834',
    date: '03 Mar 2025',
    customerName: 'Pooja Verma',
    phone: '+91 98101 22334',
    destination: 'Lucknow, Uttar Pradesh',
    pincode: '226001',
    courier: 'Ekart',
    trackingId: 'EK7890556677',
    status: 'In Transit',
    itemsSummary: 'Diamond Studded Gold Pendant',
    itemPrice: '₹ 95,000',
    timeline: [
      { timestamp: '03 Mar 05:00 PM', event: 'Departed Lucknow Transit Hub', user: 'Ekart Agent' }
    ]
  },
  {
    id: 'DEL-0833',
    orderNumber: 'VRJ-2025-0833',
    date: '02 Mar 2025',
    customerName: 'Kavitha Rangan',
    phone: '+91 99400 11223',
    destination: 'Salem, Tamil Nadu',
    pincode: '636001',
    courier: 'India Post',
    trackingId: 'IP345611223IN',
    status: 'Ready to Dispatch',
    itemsSummary: 'Sterling Silver Peacock Diya Lamp',
    itemPrice: '₹ 18,500',
    timeline: [
      { timestamp: '02 Mar 04:30 PM', event: 'Barcoded packaging ready for dispatch window', user: 'Logistics Desk' }
    ]
  },
  {
    id: 'DEL-0832',
    orderNumber: 'VRJ-2025-0832',
    date: '02 Mar 2025',
    customerName: 'Gautam Singhania',
    phone: '+91 98210 66554',
    destination: 'Surat, Gujarat',
    pincode: '395001',
    courier: 'Delhivery',
    trackingId: 'DLV1595112233',
    status: 'In Transit',
    itemsSummary: '22K Gold Mens Royal Kada',
    itemPrice: '₹ 86,500',
    timeline: [
      { timestamp: '02 Mar 06:20 PM', event: 'Consignment moving via Western Express line', user: 'Delhivery' }
    ]
  },
  {
    id: 'DEL-0831',
    orderNumber: 'VRJ-2025-0831',
    date: '01 Mar 2025',
    customerName: 'Swati Deshmukh',
    phone: '+91 98230 77889',
    destination: 'Nagpur, Maharashtra',
    pincode: '440001',
    courier: 'Blue Dart',
    trackingId: 'BD780033221IN',
    status: 'In Transit',
    itemsSummary: 'Gold Mangalsutra with Black Beads',
    itemPrice: '₹ 54,000',
    timeline: [
      { timestamp: '01 Mar 07:45 PM', event: 'Arrived at Nagpur Central sorting terminal', user: 'Blue Dart' }
    ]
  },
  {
    id: 'DEL-0830',
    orderNumber: 'VRJ-2025-0830',
    date: '01 Mar 2025',
    customerName: 'Manoj Hegde',
    phone: '+91 98451 99001',
    destination: 'Mangaluru, Karnataka',
    pincode: '575001',
    courier: 'DTDC',
    trackingId: 'DT1234776655',
    status: 'Service Issues',
    issueDetails: 'Customer contact phone unreachable during delivery attempt; held at DTDC Mangaluru Main office.',
    itemsSummary: '999 Pure Silver Kalash Urli',
    itemPrice: '₹ 42,000',
    timeline: [
      { timestamp: '01 Mar 04:15 PM', event: 'Delivery attempt 2: Unreachable by phone', user: 'DTDC Courier' },
      { timestamp: '01 Mar 11:30 AM', event: 'First delivery attempt failed', user: 'DTDC Courier' }
    ]
  }
];

export const INITIAL_RETURNS_CASES = [
  {
    id: 'RET-1008',
    orderId: '#ORD-2456',
    customerName: 'Meera Krishnan',
    phone: '+91 98401 23456',
    productName: '22K Gold Chain',
    productSku: 'GC-1045',
    productImage: '/images/product_gold_chain.jpg',
    returnReason: 'Size issue',
    requestedDate: '08 Sep 2025',
    requestedTime: '11:20 AM',
    status: 'Pending',
    nextAction: 'Schedule Inspection',
    price: '₹ 48,500',
    timeline: [
      { timestamp: '08 Sep 11:20 AM', event: 'Return request submitted by customer (Size mismatch)', user: 'Customer Portal' }
    ]
  },
  {
    id: 'RET-1007',
    orderId: '#ORD-2432',
    customerName: 'Arjun Mehta',
    phone: '+91 98765 43210',
    productName: 'Silver Bowl',
    productSku: 'SB-778',
    productImage: '/images/product_silver_bowl.jpg',
    returnReason: 'Damaged item',
    requestedDate: '07 Sep 2025',
    requestedTime: '10:05 AM',
    status: 'Inspection',
    nextAction: 'View Details',
    price: '₹ 16,200',
    timeline: [
      { timestamp: '07 Sep 10:05 AM', event: 'Parcel received at showroom reception', user: 'Logistics Courier' },
      { timestamp: '07 Sep 11:30 AM', event: 'Assigned to Silversmith Bench for touchstone verification', user: 'Head Jeweller' }
    ]
  },
  {
    id: 'RET-1006',
    orderId: '#ORD-2411',
    customerName: 'Lakshmi Iyer',
    phone: '+91 99627 77889',
    productName: 'Gold Earrings',
    productSku: 'GE-322',
    productImage: '/images/product_gold_earrings.jpg',
    returnReason: 'Quality concern',
    requestedDate: '06 Sep 2025',
    requestedTime: '04:18 PM',
    status: 'Resolved',
    nextAction: 'View Report',
    price: '₹ 28,600',
    timeline: [
      { timestamp: '06 Sep 04:18 PM', event: 'Hallmark verified 22K (916 fineness). Approved & Restocked', user: 'Quality Assayer' }
    ]
  },
  {
    id: 'RET-1005',
    orderId: '#ORD-2387',
    customerName: 'Rohan Das',
    phone: '+91 98820 66554',
    productName: 'Diamond Ring',
    productSku: 'DR-011',
    productImage: '/images/products/gold/gold_studs_1_photo.jpg',
    returnReason: 'Wrong product',
    requestedDate: '05 Sep 2025',
    requestedTime: '02:45 PM',
    status: 'Cancelled',
    nextAction: 'View Details',
    price: '₹ 1,12,000',
    timeline: [
      { timestamp: '05 Sep 02:45 PM', event: 'Customer cancelled return request at counter', user: 'Customer Service' }
    ]
  },
  {
    id: 'RET-1004',
    orderId: '#ORD-2365',
    customerName: 'Priya Menon',
    phone: '+91 98840 11223',
    productName: 'Ruby Pendant',
    productSku: 'RP-009',
    productImage: '/images/col_bridal.jpg',
    returnReason: 'Exchange request',
    requestedDate: '04 Sep 2025',
    requestedTime: '01:30 PM',
    status: 'Pending',
    nextAction: 'Review Request',
    price: '₹ 68,000',
    timeline: [
      { timestamp: '04 Sep 01:30 PM', event: 'Customer initiated return for showroom exchange', user: 'Concierge Desk' }
    ]
  },
  {
    id: 'RET-1003',
    orderId: '#ORD-2340',
    customerName: 'Vikram Singhania',
    phone: '+91 98210 55443',
    productName: 'Antique Kemp Temple Bangle',
    productSku: 'AK-004',
    productImage: '/images/product_bangles.jpg',
    returnReason: 'Fit too tight',
    requestedDate: '03 Sep 2025',
    requestedTime: '03:20 PM',
    status: 'Pending',
    nextAction: 'Schedule Inspection',
    price: '₹ 86,500',
    timeline: [
      { timestamp: '03 Sep 03:20 PM', event: 'Bangle size adjustment return initiated', user: 'Online Portal' }
    ]
  },
  {
    id: 'RET-1002',
    orderId: '#ORD-2315',
    customerName: 'Divya Sundaram',
    phone: '+91 98402 77889',
    productName: 'Artisan Silver Kumkum Chimizh',
    productSku: 'KC-089',
    productImage: '/images/col_silver.jpg',
    returnReason: 'Minor surface scratch',
    requestedDate: '02 Sep 2025',
    requestedTime: '10:45 AM',
    status: 'Pending',
    nextAction: 'Review Request',
    price: '₹ 9,500',
    timeline: [
      { timestamp: '02 Sep 10:45 AM', event: 'Silver article return filed by customer', user: 'Storefront Service' }
    ]
  },
  {
    id: 'RET-1001',
    orderId: '#ORD-2290',
    customerName: 'Siddharth Rao',
    phone: '+91 99200 44556',
    productName: 'Platinum Couple Band Set',
    productSku: 'PR-0665',
    productImage: '/images/product_necklace.jpg',
    returnReason: 'Hallmark inspection request',
    requestedDate: '01 Sep 2025',
    requestedTime: '04:10 PM',
    status: 'Inspection',
    nextAction: 'View Details',
    price: '₹ 3,10,000',
    timeline: [
      { timestamp: '01 Sep 04:10 PM', event: 'Laser inspection & assay review underway', user: 'Master Assayer' }
    ]
  },
  {
    id: 'RET-1000',
    orderId: '#ORD-2275',
    customerName: 'Kavitha Rangan',
    phone: '+91 99400 11223',
    productName: 'Pure Silver Pooja Thali Plate',
    productSku: 'PT-042',
    productImage: '/images/col_handcrafted.jpg',
    returnReason: 'Weight verification inquiry',
    requestedDate: '31 Aug 2025',
    requestedTime: '11:30 AM',
    status: 'Inspection',
    nextAction: 'View Details',
    price: '₹ 32,500',
    timeline: [
      { timestamp: '31 Aug 11:30 AM', event: 'Precision electronic scale weighing in progress', user: 'Bench Silversmith' }
    ]
  },
  {
    id: 'RET-0999',
    orderId: '#ORD-2250',
    customerName: 'Deepa Ganesan',
    phone: '+91 99401 12345',
    productName: 'Repoussé Silver Pooja Bowl',
    productSku: 'SB-778',
    productImage: '/images/product_silver_bowl.jpg',
    returnReason: 'Altar dimensions mismatch',
    requestedDate: '30 Aug 2025',
    requestedTime: '02:15 PM',
    status: 'Resolved',
    nextAction: 'View Report',
    price: '₹ 18,200',
    timeline: [
      { timestamp: '30 Aug 02:15 PM', event: 'Return approved, amount refunded to original payment method', user: 'Finance Desk' }
    ]
  },
  {
    id: 'RET-0998',
    orderId: '#ORD-2230',
    customerName: 'Manoj Krishnamurthy',
    phone: '+91 98841 87654',
    productName: 'Filigree Silver Tumbler Set',
    productSku: 'FT-089',
    productImage: '/images/col_handcrafted.jpg',
    returnReason: 'Exchanged for dinner plate',
    requestedDate: '29 Aug 2025',
    requestedTime: '09:10 AM',
    status: 'Resolved',
    nextAction: 'View Report',
    price: '₹ 32,500',
    timeline: [
      { timestamp: '29 Aug 09:10 AM', event: 'Direct showroom counter exchange executed', user: 'Counter 1 Staff' }
    ]
  },
  {
    id: 'RET-0997',
    orderId: '#ORD-2210',
    customerName: 'Ananya Joshi',
    phone: '+91 98220 11445',
    productName: 'Temple Antique Jhumkas',
    productSku: 'GE-332',
    productImage: '/images/product_gold_earrings.jpg',
    returnReason: 'Defective push back clasp',
    requestedDate: '28 Aug 2025',
    requestedTime: '05:40 PM',
    status: 'Resolved',
    nextAction: 'View Report',
    price: '₹ 28,600',
    timeline: [
      { timestamp: '28 Aug 05:40 PM', event: 'Clasp serviced by in-house goldsmith; replacement verified', user: 'Master Jeweller' }
    ]
  },
  {
    id: 'RET-0996',
    orderId: '#ORD-2195',
    customerName: 'Gautam Singhania',
    phone: '+91 98210 66554',
    productName: '22K Gold Mens Royal Kada',
    productSku: 'GK-102',
    productImage: '/images/col_gold.jpg',
    returnReason: 'Size exchange completed',
    requestedDate: '27 Aug 2025',
    requestedTime: '12:00 PM',
    status: 'Resolved',
    nextAction: 'View Report',
    price: '₹ 86,500',
    timeline: [
      { timestamp: '27 Aug 12:00 PM', event: 'Customer accepted re-sized kada; case closed', user: 'VIP Lounge Concierge' }
    ]
  }
];

export const INITIAL_SETTINGS = {
  returnWindow: '7 days from delivery',
  inspectionPeriod: '2–3 business days',
  returnMethod: 'Courier / In-Store',
  refundMethod: 'Original payment method',
  returnEligibility: 'Only unused & undamaged items',
  reservationHoldHours: 24,
  allowHoldExtensionHours: 24,
  requireOwnerApprovalAbove: 200000, // ₹2,00,000 threshold
  serviceZones: [
    { zone: 'Zone A - Greater Chennai & Suburbs', pincodes: '600001 - 600130', sla: 'Same Day / Next Day Express', fee: 'Free above ₹ 5,000' },
    { zone: 'Zone B - Tamil Nadu Tier 1 & 2 Cities', pincodes: '620001 - 643000', sla: '24 - 48 Hours Insured Transit', fee: '₹ 150 (Free above ₹ 10,000)' },
    { zone: 'Zone C - South India Metro (BLR, HYD, COK)', pincodes: '560001 - 580000', sla: '2 - 3 Days Specialized Secured Logistics', fee: '₹ 350 Flat' },
    { zone: 'Zone D - Rest of India & Out-of-service', pincodes: 'All other pincodes', sla: 'Staff Manual Clearance Required', fee: 'Custom Insurance Quote' }
  ],
  deliveryRules: {
    freeShippingThreshold: 10000,
    baseDeliveryFee: 150,
    secureValuableInsuranceFee: 300,
    pickupShowroomAddress: 'Veda Radha Thangamaaligai, Main Bazaar Showroom Road, Tamil Nadu'
  },
  returnPolicy: {
    returnWindowDays: 7,
    silverDeductionRate: 'Zero deduction if tamper seal is intact',
    goldExchangeTerms: '100% value against current showroom gold rate upon hallmark verification',
    policyDisclaimer: 'Demo setting — Pending final legal and accounting confirmation with showroom management.'
  }
};

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-109',
    timestamp: 'Today 10:15 AM',
    action: 'SHOWROOM_SALE_LOCK',
    description: 'Product VR-GLD-204 (Royal Antique Gold Kadas) marked SOLD at Counter 1. Online availability immediately blocked.',
    user: 'Staff (Muthu)',
    type: 'danger'
  },
  {
    id: 'LOG-108',
    timestamp: 'Today 09:45 AM',
    action: 'SAFEGUARD_LOCK',
    description: 'Unique piece VR-SIL-001 locked under online reservation #RES-8821 for Smt. Rajeshwari Sundaram.',
    user: 'Online Safeguard Engine',
    type: 'warning'
  },
  {
    id: 'LOG-107',
    timestamp: 'Today 09:30 AM',
    action: 'RETURN_RECEIVED',
    description: 'Return parcel for VR-ORD-7685 received at reception. Assigned to silversmith inspection queue.',
    user: 'Staff (Thangaraj)',
    type: 'info'
  },
  {
    id: 'LOG-106',
    timestamp: 'Yesterday 06:30 PM',
    action: 'DISPATCH_LOGISTICS',
    description: 'Order #ORD-7712 (Filigree Silver Tumblers) handed over to BlueDart tracking BD-EXP-8891024.',
    user: 'Staff (Senthil)',
    type: 'success'
  }
];

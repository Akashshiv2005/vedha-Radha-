// Initial realistic sample data for Veda Radha Thangamaaligai Admin Prototype

export const INITIAL_PRODUCTS = [
  {
    id: 'VR-SIL-001',
    sku: 'VR-SIL-001',
    name: 'Heritage Kolusu Antique Silver Anklet (Pair)',
    category: 'Silver',
    subCategory: 'Anklets & Kolusu',
    purity: '925 Sterling Silver',
    grossWeight: '84.50 g',
    netWeight: '84.50 g',
    price: '₹ 14,800',
    numericPrice: 14800,
    isPriceOnRequest: false,
    isUnique: true, // 1-of-1 Handcrafted piece
    status: 'reserved', // 'available' | 'reserved' | 'sold_showroom' | 'sold_online' | 'unavailable'
    image: '/images/product_anklet.jpg',
    isSampleImage: true,
    sampleImageNote: 'Sample reference photo — Handcrafted piece varies slightly in ghungroo engraving',
    description: 'Traditional heavy Chettinad silver payal with intricately sculpted peacock clasps and melodic chime ghungroos. Handcrafted by master silversmiths.',
    hallmarkDetails: '925 Fineness Stamped (Sample / Subject to lab verification)',
    stockQty: 1,
    location: 'Showroom Counter 3 - Silver Section',
    lastUpdated: 'Today at 09:45 AM'
  },
  {
    id: 'VR-GLD-101',
    sku: 'VR-GLD-101',
    name: 'Temple Lakshmi Kasu Heritage Gold Necklace',
    category: 'Gold',
    subCategory: 'Heritage Necklaces',
    purity: '22K (916 Fineness)',
    grossWeight: '38.60 g',
    netWeight: '36.20 g',
    price: '₹ 2,94,500',
    numericPrice: 294500,
    isPriceOnRequest: false,
    isUnique: true,
    status: 'available',
    image: '/images/product_necklace.jpg',
    isSampleImage: true,
    sampleImageNote: 'High-definition showroom archival photo',
    description: '22K yellow gold temple necklace featuring Goddess Lakshmi medallion with Burmese ruby accents and hand-carved floral nakashi motifs.',
    hallmarkDetails: '916 BIS Laser Inscription (Editable demo field)',
    stockQty: 1,
    location: 'Locker Safe B - Vault 2',
    lastUpdated: 'Yesterday at 04:30 PM'
  },
  {
    id: 'VR-SIL-042',
    sku: 'VR-SIL-042',
    name: 'Artisan Repoussé Silver Pooja Bowl (Kinnam)',
    category: 'Silver',
    subCategory: 'Pooja Utensils',
    purity: '92.5% Silver Grade',
    grossWeight: '122.00 g',
    netWeight: '122.00 g',
    price: '₹ 18,200',
    numericPrice: 18200,
    isPriceOnRequest: false,
    isUnique: true,
    status: 'available',
    image: '/images/col_silver.jpg',
    isSampleImage: true,
    sampleImageNote: 'Representative collection visual',
    description: 'Hand-beaten pure silver puja bowl with fluted lotus petals and auspicious Ashtalakshmi relief border.',
    hallmarkDetails: 'Showroom Purity Stamp (Demo field)',
    stockQty: 1,
    location: 'Showroom Counter 4 - Gift & Pooja',
    lastUpdated: '2 days ago'
  },
  {
    id: 'VR-GLD-204',
    sku: 'VR-GLD-204',
    name: 'Royal Antique Patina Gold Kadas (Pair)',
    category: 'Gold',
    subCategory: 'Bangles & Kadas',
    purity: '22K Antique Finish',
    grossWeight: '46.80 g',
    netWeight: '46.80 g',
    price: '₹ 3,45,000',
    numericPrice: 345000,
    isPriceOnRequest: false,
    isUnique: true,
    status: 'sold_showroom',
    image: '/images/product_bangles.jpg',
    isSampleImage: true,
    sampleImageNote: 'Sample gallery asset',
    description: 'Heritage antique finish screw-type kadas with elephant head terminals (Gaja Mukha) studded with uncut kundan stones.',
    hallmarkDetails: '22K BIS Hallmarked',
    stockQty: 0,
    location: 'Sold in Showroom Counter 1 (Bill #VR-POS-9481)',
    lastUpdated: 'Today at 10:15 AM'
  },
  {
    id: 'VR-BRD-501',
    sku: 'VR-BRD-501',
    name: 'Grand Muhurtham Navaratna Bridal Choker Set',
    category: 'Bridal',
    subCategory: 'Bridal Sets',
    purity: '22K Gold & Semi-precious Gemstones',
    grossWeight: '92.40 g',
    netWeight: '81.10 g',
    price: 'Price on Request',
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
    location: 'VIP Bridal Lounge Suite',
    lastUpdated: '3 hours ago'
  },
  {
    id: 'VR-COIN-010',
    sku: 'VR-COIN-010',
    name: '24K Pure Gold Lakshmi Ganesha Coin (10 Grams)',
    category: 'Coins & Bars',
    subCategory: 'Gold Coins',
    purity: '999.9 Fine Gold (24 Karat)',
    grossWeight: '10.00 g',
    netWeight: '10.00 g',
    price: '₹ 82,400',
    numericPrice: 82400,
    isPriceOnRequest: false,
    isUnique: false, // Standard repeatable inventory
    status: 'available',
    image: '/images/col_gold.jpg',
    isSampleImage: false,
    sampleImageNote: 'Direct scan of certified tamper-proof blister pack',
    description: 'Swiss-grade minted pure gold coin with embossed Goddess Lakshmi and Lord Ganesha. Certified purity packaging.',
    hallmarkDetails: 'NABL Certified 999.9 Purity Barcode',
    stockQty: 18,
    location: 'Safe Vault 1',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'VR-SIL-089',
    sku: 'VR-SIL-089',
    name: 'Filigree Floral Silver Dining Tumbler Set',
    category: 'Silver',
    subCategory: 'Silverware',
    purity: '925 Silver',
    grossWeight: '210.00 g',
    netWeight: '210.00 g',
    price: '₹ 32,500',
    numericPrice: 32500,
    isPriceOnRequest: false,
    isUnique: false,
    status: 'available',
    image: '/images/col_handcrafted.jpg',
    isSampleImage: true,
    sampleImageNote: 'Standard catalog representation',
    description: 'Hand-spun 925 sterling silver dining tumblers with micro-engraved border motifs. Ideal for auspicious gifting.',
    hallmarkDetails: '925 Silver Touch Certified',
    stockQty: 4,
    location: 'Counter 4 - Silverware',
    lastUpdated: 'Yesterday'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'VR-RES-8821',
    orderNumber: '#RES-8821',
    customerName: 'Smt. Rajeshwari Sundaram',
    phone: '+91 98401 23894',
    email: 'rajeshwari.s@example.com',
    city: 'Madurai',
    pincode: '625001',
    deliveryAddress: 'No. 14, West Masi Street, Madurai, Tamil Nadu',
    productSku: 'VR-SIL-001',
    productName: 'Heritage Kolusu Antique Silver Anklet (Pair)',
    productPrice: '₹ 14,800',
    numericPrice: 14800,
    productImage: '/images/product_anklet.jpg',
    isUniqueItem: true,
    orderType: 'reservation', // 'reservation' | 'direct_order'
    fulfilmentType: 'showroom_pickup', // 'showroom_pickup' | 'home_delivery'
    status: 'awaiting_confirmation', // 'new' | 'awaiting_confirmation' | 'reserved' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled' | 'hold_expired' | 'return_requested'
    receivedAt: '2026-10-09T08:30:00',
    holdExpiresAt: '2026-10-10T12:00:00', // 24-hr hold demo
    nextAction: 'Confirm customer call & approve hold window',
    notes: 'Customer requested to view physical piece tomorrow morning at 11:00 AM in main showroom.',
    tracking: {
      carrier: 'Showroom Concierge Reserve',
      trackingId: 'N/A (In-Store Pickup)',
      dispatchedAt: null,
      deliveryStatus: 'Pending Customer Visit'
    },
    timeline: [
      { timestamp: 'Today 08:30 AM', event: 'Online reservation request submitted by customer', user: 'Online Storefront' },
      { timestamp: 'Today 08:31 AM', event: 'Inventory locked for 24h demo safeguard (VR-SIL-001)', user: 'System Safeguard' }
    ]
  },
  {
    id: 'VR-ORD-7740',
    orderNumber: '#ORD-7740',
    customerName: 'Karthik Subramanian',
    phone: '+91 94432 89012',
    email: 'karthik.subra@example.com',
    city: 'Chennai',
    pincode: '600028',
    deliveryAddress: 'Flat 4B, Emerald Apts, Greenways Road, R.A. Puram, Chennai, TN',
    productSku: 'VR-COIN-010',
    productName: '24K Pure Gold Lakshmi Ganesha Coin (10 Grams)',
    productPrice: '₹ 82,400',
    numericPrice: 82400,
    productImage: '/images/col_gold.jpg',
    isUniqueItem: false,
    orderType: 'direct_order',
    fulfilmentType: 'home_delivery',
    status: 'processing',
    receivedAt: '2026-10-08T16:20:00',
    holdExpiresAt: null,
    nextAction: 'Verify tamper-proof seal and pack with transit insurance',
    notes: 'Auspicious birthday gift. Requested tamper-proof gold gift box wrapping.',
    tracking: {
      carrier: 'Sequel Secure Logistics (Valuable Cargo)',
      trackingId: 'SEQL-TN-9920148',
      dispatchedAt: null,
      deliveryStatus: 'Awaiting Courier Pickup'
    },
    timeline: [
      { timestamp: 'Yesterday 04:20 PM', event: 'Online payment authorized (Demo simulated)', user: 'Payment Gateway' },
      { timestamp: 'Yesterday 05:10 PM', event: 'Order verified by Senior Manager', user: 'Staff (Thangaraj)' },
      { timestamp: 'Today 09:00 AM', event: 'Vault item moved to secure packing desk', user: 'Staff (Senthil)' }
    ]
  },
  {
    id: 'VR-RES-8819',
    orderNumber: '#RES-8819',
    customerName: 'Dr. Ananya Natarajan',
    phone: '+91 98840 55123',
    email: 'ananya.natarajan@example.com',
    city: 'Coimbatore',
    pincode: '641018',
    deliveryAddress: '12/4 Race Course Road, Coimbatore, Tamil Nadu',
    productSku: 'VR-BRD-501',
    productName: 'Grand Muhurtham Navaratna Bridal Choker Set',
    productPrice: 'Price on Request (₹ 6,80,000)',
    numericPrice: 680000,
    productImage: '/images/col_bridal.jpg',
    isUniqueItem: true,
    orderType: 'reservation',
    fulfilmentType: 'showroom_pickup',
    status: 'reserved',
    receivedAt: '2026-10-08T11:00:00',
    holdExpiresAt: '2026-10-09T18:00:00', // Expiring today in 8 hours!
    nextAction: 'Expiring hold: Follow up before release to showroom floor',
    notes: 'Family wedding on 15th Nov. Discussing custom gemstone matching.',
    tracking: {
      carrier: 'VIP Suite Counter Hold',
      trackingId: 'VIP-HOLD-04',
      dispatchedAt: null,
      deliveryStatus: 'Active Hold in VIP Suite'
    },
    timeline: [
      { timestamp: 'Yesterday 11:00 AM', event: 'VIP Reservation created online', user: 'Online Storefront' },
      { timestamp: 'Yesterday 11:15 AM', event: 'Hold approved for 36 hours with Owner clearance', user: 'Owner (Veda Radha)' },
      { timestamp: 'Today 09:30 AM', event: 'Reminder alert: Hold expires in 8 hours', user: 'System Watchdog' }
    ]
  },
  {
    id: 'VR-ORD-7712',
    orderNumber: '#ORD-7712',
    customerName: 'Meenakshi Sundar',
    phone: '+91 97909 33211',
    email: 'meenakshi.s@example.com',
    city: 'Tiruchirappalli',
    pincode: '620001',
    deliveryAddress: 'No. 29, Big Bazaar Street, Trichy, Tamil Nadu',
    productSku: 'VR-SIL-089',
    productName: 'Filigree Floral Silver Dining Tumbler Set',
    productPrice: '₹ 32,500',
    numericPrice: 32500,
    productImage: '/images/col_handcrafted.jpg',
    isUniqueItem: false,
    orderType: 'direct_order',
    fulfilmentType: 'home_delivery',
    status: 'dispatched',
    receivedAt: '2026-10-07T14:15:00',
    holdExpiresAt: null,
    nextAction: 'In transit — Monitor BlueDart checkpoint scans',
    notes: 'Insured parcel with signature-on-delivery mandate.',
    tracking: {
      carrier: 'BlueDart Apex Gold Secure',
      trackingId: 'BD-EXP-8891024',
      dispatchedAt: '2026-10-08T18:30:00',
      deliveryStatus: 'In Transit — Reached Trichy Hub'
    },
    timeline: [
      { timestamp: '07 Oct 02:15 PM', event: 'Order placed & payment verified', user: 'System' },
      { timestamp: '08 Oct 11:00 AM', event: 'Insured packaging completed', user: 'Staff (Senthil)' },
      { timestamp: '08 Oct 06:30 PM', event: 'Handed over to BlueDart courier agent', user: 'Logistics Desk' },
      { timestamp: 'Today 06:15 AM', event: 'Arrived at Tiruchirappalli Distribution Center', user: 'Carrier Scan' }
    ]
  },
  {
    id: 'VR-ORD-7690',
    orderNumber: '#ORD-7690',
    customerName: 'Venkatesh Raman',
    phone: '+91 98410 77654',
    email: 'v.raman@example.com',
    city: 'Chennai',
    pincode: '600004',
    deliveryAddress: '18, North Mada Street, Mylapore, Chennai, TN',
    productSku: 'VR-SIL-042',
    productName: 'Artisan Repoussé Silver Pooja Bowl (Kinnam)',
    productPrice: '₹ 18,200',
    numericPrice: 18200,
    productImage: '/images/col_silver.jpg',
    isUniqueItem: true,
    orderType: 'direct_order',
    fulfilmentType: 'home_delivery',
    status: 'delivered',
    receivedAt: '2026-10-06T10:00:00',
    holdExpiresAt: null,
    nextAction: 'Fulfilled — Post-delivery feedback pending',
    notes: 'Customer confirmed safe receipt via SMS OTP verification.',
    tracking: {
      carrier: 'Showroom Express Messenger',
      trackingId: 'VR-LOC-4402',
      dispatchedAt: '2026-10-06T14:00:00',
      deliveryStatus: 'Delivered Successfully on 06 Oct'
    },
    timeline: [
      { timestamp: '06 Oct 10:00 AM', event: 'Direct showroom order confirmed', user: 'Online Desk' },
      { timestamp: '06 Oct 02:00 PM', event: 'Dispatched via showroom courier', user: 'Staff' },
      { timestamp: '06 Oct 05:45 PM', event: 'Delivered & OTP signature verified by customer', user: 'Delivery Driver' }
    ]
  }
];

export const INITIAL_RETURNS_CASES = [
  {
    id: 'VR-RET-104',
    orderId: 'VR-ORD-7685',
    customerName: 'Deepa Ganesan',
    phone: '+91 99401 12345',
    productSku: 'VR-SIL-042',
    productName: 'Artisan Repoussé Silver Pooja Bowl (Kinnam)',
    productImage: '/images/col_silver.jpg',
    price: '₹ 18,200',
    type: 'return_post_delivery', // 'cancellation_pre_dispatch' | 'return_post_delivery'
    reason: 'Dimensions smaller than anticipated for intended home temple altar.',
    requestDate: '2026-10-08T15:00:00',
    shippingOrigin: 'Salem (Pincode: 636001)',
    currentStep: 'item_inspection', // 'request_received' | 'staff_review' | 'return_in_transit' | 'item_inspection' | 'resolved'
    inspectionStatus: 'Pending Bench Metal Purity & Weight Verification',
    weightVerification: 'Declared: 122.0g | Received: Pending Weighing',
    sealIntact: true,
    staffNotes: 'Item received at showroom reception today at 09:30 AM via return courier. Silversmith must verify touch and weight before restock.',
    timeline: [
      { timestamp: '08 Oct 03:00 PM', event: 'Customer initiated return request online', user: 'Customer' },
      { timestamp: '08 Oct 04:30 PM', event: 'Staff approved reverse pickup with BlueDart', user: 'Staff (Thangaraj)' },
      { timestamp: 'Today 09:30 AM', event: 'Return parcel delivered to showroom service desk', user: 'Courier Inward' }
    ]
  },
  {
    id: 'VR-CAN-102',
    orderId: 'VR-RES-8810',
    customerName: 'Manoj Krishnamurthy',
    phone: '+91 98841 87654',
    productSku: 'VR-SIL-089',
    productName: 'Filigree Floral Silver Dining Tumbler Set',
    productImage: '/images/col_handcrafted.jpg',
    price: '₹ 32,500',
    type: 'cancellation_pre_dispatch',
    reason: 'Customer opted for heavy silver dinner plate set in physical showroom instead.',
    requestDate: '2026-10-09T09:10:00',
    shippingOrigin: 'Coimbatore Showroom Counter',
    currentStep: 'resolved',
    inspectionStatus: 'Cancelled Pre-Dispatch — Inventory Released Immediately',
    weightVerification: 'Item never left vault',
    sealIntact: true,
    staffNotes: 'No physical transit occurred. Product returned to Available status automatically.',
    timeline: [
      { timestamp: 'Today 09:10 AM', event: 'Cancellation requested by customer at counter', user: 'Showroom Counter 1' },
      { timestamp: 'Today 09:12 AM', event: 'Reservation released — Stock returned to Available', user: 'System Safeguard' }
    ]
  }
];

export const INITIAL_SETTINGS = {
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

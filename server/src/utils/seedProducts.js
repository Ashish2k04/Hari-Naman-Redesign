const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}
const mongoose = require('mongoose');
const Product = require('../models/Product');
const CarouselSlide = require('../models/CarouselSlide');
const connectDB = require('../config/db');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const defaultProducts = [
  {
    name: 'Green Peas',
    nameLocal: 'વટાણા (Peas)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 50 },
      { label: '500g', price: 90 },
      { label: '1 Kg', price: 160 }
    ],
    isAvailable: true,
    specialDeal: false
  },
  {
    name: 'Fresh Tomatoes',
    nameLocal: 'ટામેટા (Tomatoes)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 15 },
      { label: '500g', price: 28 },
      { label: '1 Kg', price: 50 }
    ],
    isAvailable: true,
       specialDeal: false
  },
  {
    name: 'New Potatoes',
    nameLocal: 'બટાકા (Potatoes)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 12 },
      { label: '500g', price: 20 },
      { label: '1 Kg', price: 35 }
    ],
    isAvailable: true,
       specialDeal: false
  },
  {
    name: 'Fresh Coriander',
    nameLocal: 'કોથમીર (Coriander)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 15 },
      { label: '500g', price: 28 },
      { label: '1 Kg', price: 50 }
    ],
    isAvailable: true,
       specialDeal: false
  },
  {
    name: 'Lady Finger / Okra',
    nameLocal: 'ભીંડા (Bhindi)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 25 },
      { label: '500g', price: 45 },
      { label: '1 Kg', price: 80 }
    ],
    isAvailable: true,
       specialDeal: false
  },
  {
    name: 'Pure Cow Ghee',
    nameLocal: 'ગાયનું ઘી (Cow Ghee)',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '1 Kg', price: 1200 }
    ],
    isAvailable: true,
       specialDeal: false
  },
  {
    name: 'Fresh Paneer',
    nameLocal: 'તાજુ પનીર (Paneer)',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '1 Kg', price: 400 }
    ],
    isAvailable: true,
       specialDeal: false
  },
  {
    name: 'Local Garlic',
    nameLocal: 'લસણ (Garlic)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 50 },
      { label: '500g', price: 90 },
      { label: '1 Kg', price: 160 }
    ],
    isAvailable: false,
       specialDeal: false
  },
  {
    name: 'Fresh Ginger',
    nameLocal: 'આદુ (Ginger)',
    category: 'vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    variants: [
      { label: '250g', price: 30 },
      { label: '500g', price: 55 },
      { label: '1 Kg', price: 100 }
    ],
    isAvailable: true,
       specialDeal: false
  }
];

const defaultSlides = [
  {
    badge: 'Free Delivery Offer • ફ્રી હોમ ડિલિવરી ઓફર',
    headlineLocal: 'એક દિવસ પહેલા ઓર્ડર આપો અને મેળવો ફ્રી હોમ ડિલિવરી',
    description: 'Hari Naman Greens Delivers Fresh — from farms to your kitchen. Choose by weight, fill your basket, and order on WhatsApp.',
    highlight: 'Order a day ahead & enjoy completely free delivery in our neighborhood.',
    imageUrl: 'https://ik.imagekit.io/yedpkaps3/randy-fath-5aJVJvJ9rG8-unsplash.jpg',
    trustLabel: '100% Weighed Fresh',
    trustSub: 'ટોચની ગુણવત્તા',
    order: 0
  },
  {
    badge: 'Mandi Freshness Guarantee • તાજી મંડી ગેરંટી',
    headlineLocal: 'ખેતરોમાંથી સીધું તમારા રસોડા સુધી પહોંચાડેલી તાજી સબ્જી',
    description: 'Hand-picked local green vegetables, clean leafy produce, and essential roots weighed carefully to match your kitchen needs.',
    highlight: 'Dispatched fresh every evening to ensure maximum nutritional value.',
    imageUrl: 'https://ik.imagekit.io/yedpkaps3/photo-1610348725531-843dff563e2c.avif',
    trustLabel: '100% Farm Sourced',
    trustSub: 'ખેતરથી ઘર સુધી',
    order: 1
  },
  {
    badge: 'Pure Cow Ghee & Paneer • શુદ્ધ ડેરી પેદાશો',
    headlineLocal: 'ગાયનું શુદ્ધ ઓર્ગેનિક ઘી અને માખણ જેવું નરમ પનીર',
    description: 'Sourced from local Gujarati dairy farms, processed under hygienic standards to give you that authentic ghee-pot aroma.',
    highlight: 'No additives, no preservatives. Traditional taste guaranteed.',
    imageUrl: 'https://ik.imagekit.io/yedpkaps3/photo-1634121192012-16003b5c48e3.avif',
    trustLabel: '100% Pure & Hygienic',
    trustSub: 'ઉત્તમ ગુણવત્તા',
    order: 2
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products to force overwrite
    console.log('Clearing existing products from database...');
    await Product.deleteMany({});

    // Insert default products
    await Product.insertMany(defaultProducts);
    console.log(`Seeded ${defaultProducts.length} default products successfully!`);

    // Clear and seed carousel slides
    console.log('Clearing existing carousel slides...');
    await CarouselSlide.deleteMany({});
    await CarouselSlide.insertMany(defaultSlides);
    console.log(`Seeded ${defaultSlides.length} default carousel slides successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products and slides:', error.message);
    process.exit(1);
  }
};

seedProducts();



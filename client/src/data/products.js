// Fallback mock products database when the API server is offline or loading
export const defaultProducts = [
  {
    _id: 'mock_peas',
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
    _id: 'mock_tomatoes',
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
    _id: 'mock_potatoes',
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
    _id: 'mock_coriander',
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
    _id: 'mock_okra',
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
    _id: 'mock_ghee',
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
    _id: 'mock_paneer',
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
    _id: 'mock_garlic',
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
    _id: 'mock_ginger',
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



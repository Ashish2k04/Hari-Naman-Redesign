import React, { useEffect, useState, useRef } from 'react';
import { ShoppingBasket, PhoneCall, CheckCircle2, ChevronRight, Sun, Moon } from 'lucide-react';
import { Mosaic } from 'react-loading-indicators';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { defaultProducts } from '../data/products';

const defaultSlidesMock = [
  {
    badge: 'Free Delivery Offer • ફ્રી હોમ ડિલિવરી ઓફર',
    headlineLocal: 'એક દિવસ પહેલા ઓર્ડર આપો અને મેળવો ફ્રી હોમ ડિલિવરી',
    description: 'Hari Naman Greens Delivers Fresh — from farms to your kitchen. Choose by weight, fill your basket, and order on WhatsApp.',
    highlight: 'Order a day ahead & enjoy completely free delivery in our neighborhood.',
    imageUrl: 'https://ik.imagekit.io/yedpkaps3/randy-fath-5aJVJvJ9rG8-unsplash.jpg',
    trustLabel: '100% Weighed Fresh',
    trustSub: 'ટોચની ગુણવત્તા'
  },
  {
    badge: 'Mandi Freshness Guarantee • તાજી મંડી ગેરંટી',
    headlineLocal: 'ખેતરોમાંથી સીધું તમારા રસોડા સુધી પહોંચાડેલી તાજી સબ્જી',
    description: 'Hand-picked local green vegetables, clean leafy produce, and essential roots weighed carefully to match your kitchen needs.',
    highlight: 'Dispatched fresh every evening to ensure maximum nutritional value.',
    imageUrl: 'https://ik.imagekit.io/yedpkaps3/photo-1610348725531-843dff563e2c.avif',
    trustLabel: '100% Farm Sourced',
    trustSub: 'ખેતરથી ઘર સુધી'
  },
  {
    badge: 'Pure Cow Ghee & Paneer • શુદ્ધ ડેરી પેદાશો',
    headlineLocal: 'ગાયનું શુદ્ધ ઓર્ગેનિક ઘી અને માખણ જેવું નરમ પનીર',
    description: 'Sourced from local Gujarati dairy farms, processed under hygienic standards to give you that authentic ghee-pot aroma.',
    highlight: 'No additives, no preservatives. Traditional taste guaranteed.',
    imageUrl: 'https://ik.imagekit.io/yedpkaps3/photo-1634121192012-16003b5c48e3.avif',
    trustLabel: '100% Pure & Hygienic',
    trustSub: 'ઉત્તમ ગુણવત્તા'
  }
];

const LandingPage = ({ logoPath }) => {
  const { cartCount, cartTotal, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('hn_theme');
      return saved || 'light';
    } catch (e) {
      return 'light';
    }
  });
  const [slides, setSlides] = useState(defaultSlidesMock);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const touchStartXRef = useRef(null);
  const productGridRef = useRef(null);
  const isLoading = loading || slidesLoading;
 
  // Synchronize theme with class list
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('hn_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Fetch carousel slides from backend on mount
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/carousel');
        if (!response.ok) {
          throw new Error('Failed to fetch carousel slides');
        }
        const data = await response.json();
        if (data.success && data.slides && data.slides.length > 0) {
          setSlides(data.slides);
        }
      } catch (err) {
        console.warn('Could not fetch carousel slides, using fallback:', err.message);
      } finally {
        setSlidesLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto-play timer for hero carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch from API');
        }
        const data = await response.json();
        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          // Fallback if data format is unexpected
          setProducts(defaultProducts);
        }
      } catch (err) {
        console.warn('Could not load products from API, using fallback local mock products:', err.message);
        setProducts(defaultProducts);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Smooth scroll CTA handler
  const scrollToProducts = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX;
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0]?.clientX;
    if (touchStartXRef.current === null || touchEndX === undefined) return;

    const deltaX = touchEndX - touchStartXRef.current;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
  };
 
  // Filtered products list
  const filteredProducts = products
    .filter((product) => {
      if (activeCategory === 'all') return true;
      return product.category === activeCategory;
    })
    .slice()
    .sort((a, b) => {
      const aDeal = a.specialDeal ? 1 : 0;
      const bDeal = b.specialDeal ? 1 : 0;
      return bDeal - aDeal;
    });

  if (isLoading) {
    return (
     <div className="min-h-screen bg-warm-bg dark:bg-zinc-950 flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
         <Mosaic color="#32cd32" size="medium" text="" textColor="" />
         <p className="text-sm font-semibold text-text-slate dark:text-zinc-100">Checking secure session...</p>
       </div>
     </div>
    );
  }
 
  return (
    <div className="min-h-screen flex flex-col relative bg-warm-bg dark:bg-zinc-950 transition-colors duration-300">
      {/* Decorative top pattern */}
      <div className="absolute inset-0 crate-pattern pointer-events-none" />

      {/* 1. Header (Logo & Trust Highlights) */}
      <header className="relative bg-white/10 dark:bg-zinc-900/90 backdrop-blur-md border-b border-brand-green/5 dark:border-zinc-800/80 sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          
          {/* Logo container */}
          <div className="flex items-center gap-3">
            {logoPath ? (
              <img 
                src={logoPath} 
                alt="Hari Naman Greens Logo" 
                className="h-11 w-11 sm:h-12 sm:w-12 object-cover rounded-full shadow-md border-2 border-brand-green/20 dark:border-brand-mint/20"
              />
            ) : (
              // Beautiful inline SVG fallback logo
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm ring-4 ring-brand-mint dark:ring-brand-green/10">
                  <span className="font-display font-extrabold text-lg">HN</span>
                </div>
                <div>
                  <h1 className="font-display font-extrabold text-lg md:text-xl text-brand-green dark:text-brand-mint tracking-tight leading-none">
                    Hari Naman
                  </h1>
                  <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-wider block mt-0.5">
                    Greens • હરિ નમન ગ્રીન્સ
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick shop status / Contact (Large Tap Targets) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              type="button"
              className="w-10 h-10 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 hover:border-brand-green/20 rounded-xl flex items-center justify-center text-brand-green dark:text-brand-mint transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a 
              href="tel:+919550090590" 
              className="w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 hover:border-brand-green/20 rounded-xl flex items-center justify-center gap-2 text-brand-green dark:text-brand-mint font-bold text-sm transition-colors cursor-pointer"
              title="Call Shop"
            >
              <PhoneCall size={16} />
              <span className="hidden sm:inline">Call Shop</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (With Auto-Playing Banner Carousel) */}
      <section
        className="relative max-w-6xl mx-auto px-4 py-8 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-grow-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Left Content Column (Slider container with fixed mobile/desktop height range) */}
        <div className="min-h-[355px] sm:min-h-[310px] md:min-h-[380px] flex flex-col justify-center relative overflow-hidden order-2 md:order-1">
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={idx}
                className={`space-y-6 text-left absolute inset-x-0 ${
                  isActive 
                    ? 'opacity-100 translate-x-0 scale-100 z-10 relative' 
                    : 'opacity-0 translate-x-12 scale-95 -z-10 pointer-events-none'
                }`}
              >
                {/* Daily Promotion Stamp */}
                <div className="inline-flex items-center gap-2 bg-brand-gold-light border border-brand-gold/20 text-brand-gold px-3.5 py-1.5 rounded-2xl shadow-sm">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider">
                    {slide.badge}
                  </span>
                </div>

                {/* Tagline / Headline Pairings */}
                <div className="space-y-4">
                  <h2 className="font-display font-extrabold text-3xl md:text-5xl text-text-slate dark:text-zinc-50 leading-[1.2]">
                    {slide.headlineLocal.includes('ફ્રી હોમ ડિલિવરી') ? (
                      <>
                        એક દિવસ પહેલા ઓર્ડર આપો અને મેળવો{' '}
                        <span className="bg-yellow-200/80 dark:bg-yellow-300/30 text-brand-green dark:text-brand-mint rounded-sm px-1 py-0.5">
                          ફ્રી હોમ ડિલિવરી
                        </span>
                      </>
                    ) : (
                      slide.headlineLocal
                    )}
                  </h2>
                  
                  <p className="text-base md:text-lg text-gray-600 dark:text-zinc-300 leading-relaxed font-sans font-medium">
                    {slide.description}
                  </p>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100/80 dark:border-zinc-800 shadow-sm inline-block">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                      <span className="shrink-0">✅</span>
                      {slide.highlight}
                    </p>
                  </div>
                </div>

                {/* CTA Trigger (large click targets) */}
                <button
                  onClick={scrollToProducts}
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-brand-green/95 active:scale-95 text-white font-extrabold text-lg rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Order Now / ઓર્ડર કરો</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Media Column (Images Slide & Dots) */}
        <div className="relative order-1 md:order-2">
          <div className="absolute inset-0 bg-brand-green/5 dark:bg-brand-green/10 rounded-3xl transform rotate-3 scale-102 -z-10" />
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-brand-green/10 dark:border-zinc-800 relative bg-gray-100 dark:bg-zinc-800">
            {slides.map((slide, idx) => (
              <img 
                key={idx}
                src={slide.imageUrl} 
                alt={slide.trustLabel} 
                className={`absolute inset-0 w-full h-full object-cover ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
          </div>
          
          {/* Trust Badge overlay (Changes dynamically based on slide) */}
          <div className="absolute -bottom-4 -left-4 md:-left-6 bg-white dark:bg-zinc-900 border border-brand-green/15 dark:border-zinc-800 p-3 rounded-2xl shadow-lg flex items-center gap-2.5 z-20">
            <div className="w-10 h-10 rounded-full bg-brand-mint dark:bg-brand-green/20 flex items-center justify-center text-brand-green dark:text-brand-mint">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-slate dark:text-zinc-100 leading-none">
                {slides[currentSlide].trustLabel}
              </p>
              <span className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 block font-semibold">
                {slides[currentSlide].trustSub}
              </span>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="absolute -bottom-6 right-4 flex gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx 
                    ? 'bg-brand-green w-6' 
                    : 'bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Catalog section */}
      <main 
        ref={productGridRef}
        className="max-w-6xl mx-auto px-4 py-10 border-t border-brand-green/5 dark:border-zinc-800/80 relative w-full flex-grow"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-slate dark:text-zinc-50">
              Mandi Today / આજની તાજી શાકભાજી
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 font-bold mt-1">
              * Note: Availability updates every morning based on market arrival.
            </p>
          </div>

          {/* Category Tabs (strict exclusion of search bar) */}
          <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-gray-150 dark:border-zinc-800 shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-200'
              }`}
            >
              All / બધું
            </button>
            <button
              onClick={() => setActiveCategory('vegetable')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'vegetable'
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-200'
              }`}
            >
              Veg / શાકભાજી
            </button>
            <button
              onClick={() => setActiveCategory('dairy')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'dairy'
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-200'
              }`}
            >
              Dairy / ડેરી
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Mosaic color="#32cd32" size="medium" text="" textColor="" />
            <p className="text-sm font-bold text-gray-500">Loading today's fresh catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-bold">No products found in this category.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white mt-12 py-10 px-4 relative z-10 border-t-4 border-brand-green">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-white mb-2">Hari Naman Greens</h3>
            <p className="text-xs text-zinc-400 font-bold">હરિ નમન ગ્રીન્સ — તાજી શાકભાજી, તમારા ઘરે</p>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              We bring fresh, weighed-to-order produce and pure dairy straight to your doorstep in our neighborhood. Order a day ahead to avail free shipping.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-3 text-brand-gold">Order Rules / ઓર્ડર નિયમો</h4>
            <ul className="text-sm text-zinc-400 space-y-2 font-medium">
              <li>• Deliveries are dispatched daily in the morning.</li>
              <li>• Pre-orders must be sent at least 1 day in advance.</li>
              <li>• Payment: Cash on Delivery or UPI on receipt.</li>
              <li>• Weighed carefully with digital scales before packaging.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-3 text-brand-gold">Contact / સંપર્ક</h4>
            <p className="text-sm text-zinc-400">
              Dumad, Sama Savli Road,<br />
              Vadodara - 391740.
            </p>
            <p className="text-sm text-zinc-400 mt-3 font-semibold">
              Helpline: +91 97252 77872
            </p>
            <p className="text-sm text-zinc-400 mt-1 font-semibold">
              Call / WhatsApp: +91 95500 90590
            </p>
            <p className="text-sm text-zinc-400 mt-1 font-semibold">
              Email: harinaman.greens@gmail.com
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-xs text-zinc-500 font-bold">
          <span>&copy; {new Date().getFullYear()} Hari Naman Greens. All Rights Reserved.</span>
          <span className="mt-2 sm:mt-0">Local Freshness Guaranteed • શુદ્ધ અને તાજુ</span>
        </div>
      </footer>

      {/* 4. Sticky Cart Bar (only visible when cart has items) */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto w-full bg-brand-green text-white p-3 rounded-2xl shadow-xl border border-brand-green/20 pointer-events-auto flex items-center justify-between animate-slide-up">
            
            {/* Cart summary preview */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShoppingBasket size={20} className="text-brand-gold animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80 leading-none">
                  {cartCount} item{cartCount > 1 ? 's' : ''} / {cartCount} વસ્તુઓ
                </p>
                <p className="text-lg font-black text-white mt-1">₹{cartTotal}</p>
              </div>
            </div>

            {/* Tap target Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="px-5 py-2.5 bg-brand-gold hover:bg-brand-gold/95 active:scale-95 text-white font-extrabold text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>View Basket / ઓર્ડર જુઓ</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Slide up Cart Drawer Details */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default LandingPage;

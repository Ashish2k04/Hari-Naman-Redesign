import React, { useState } from 'react';
import { ShoppingBasket, Scale, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAdd }) => {
  const { name, nameLocal, category, imageUrl, variants, isAvailable, specialDeal } = product;
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Default to first variant
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [added, setAdded] = useState(false);

  const cartKey = `${product._id || product.id}-${selectedVariant.label}`;
  const cartItem = cart.find((item) => item.cartKey === cartKey);
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleIncrement = () => {
    if (!isAvailable) return;
    if (itemQuantity > 0) {
      updateQuantity(cartKey, itemQuantity + 1);
    } else {
      addToCart(product, selectedVariant, 1);
    }
  };

  const handleDecrement = () => {
    if (itemQuantity <= 1) {
      removeFromCart(cartKey);
    } else {
      updateQuantity(cartKey, itemQuantity - 1);
    }
  };

  // Safe image display helper (falls back to local uploads prefix or Unsplash fallback if missing)
  const getProductImage = () => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=80';
    return imageUrl;
  };

  return (
    <div className={`relative bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-brand-green/5 dark:border-zinc-800/80 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full ${!isAvailable ? 'opacity-75' : ''}`}>
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-brand-mint/20 dark:bg-zinc-800 overflow-hidden">
        <img
          src={getProductImage()}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Product badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-start gap-2 z-10">
          <span className={`min-w-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm ${
            category === 'dairy'
              ? 'bg-sky-500 text-white dark:bg-sky-400 dark:text-white border border-sky-500'
              : 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white border border-emerald-600'
          }`}>
            {category === 'dairy' ? 'Dairy • ડેરી' : 'Veg • શાકભાજી'}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-red-600 text-white text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg border border-red-500">
              Not available today • આજે મળશે નહીં
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Title and local name */}
          <div className="mb-1.5">
            <h3 className="text-sm sm:text-base md:text-xl font-bold text-text-slate dark:text-zinc-100 leading-tight line-clamp-1">{name}</h3>
            {nameLocal && (
              <span className="text-[11px] sm:text-sm text-brand-green/80 dark:text-brand-mint/80 font-medium block mt-0.5 truncate">
                {nameLocal}
              </span>
            )}
            {specialDeal && (
              <div className="mt-2 w-full flex justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider rounded-full bg-yellow-500 text-white dark:bg-yellow-400 dark:text-white border border-yellow-500 shadow-sm shine-badge">
                  <Sparkles size={12} />
                  Special Deal
                </span>
              </div>
            )}
          </div>

          {/* Signature Weight Motif: Variant Selector */}
          <div className="my-2">
            <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              <Scale size={10} className="text-brand-gold shrink-0" />
              <span className="truncate">Choose Weight / વજન</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v) => {
                const isSelected = selectedVariant.label === v.label;
                return (
                  <button
                    key={v.label}
                    onClick={() => handleVariantSelect(v)}
                    disabled={!isAvailable}
                    type="button"
                    className={`flex-grow px-1.5 py-1 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl border flex items-center justify-between gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-gold-light dark:bg-brand-gold/20 text-brand-gold dark:text-brand-gold border-brand-gold dark:border-brand-gold shadow-sm ring-1 ring-brand-gold/30 dark:ring-brand-gold/40'
                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-650 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="truncate">{v.label}</span>
                    <span className={isSelected ? 'text-brand-gold' : 'text-gray-500 dark:text-zinc-400'}>
                      ₹{v.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Tray */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-zinc-800/80 flex flex-col gap-2">
          {/* Weight disclaimer */}
          <div className="flex items-center gap-1 text-[9px] text-gray-500 dark:text-zinc-455">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-green/60 dark:bg-brand-mint/60 shrink-0"></span>
            <span className="truncate">Weighed fresh at packing.</span>
          </div>

          {itemQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              type="button"
              className="w-full h-11 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm text-sm bg-brand-green hover:bg-brand-green/95 text-white active:scale-95 disabled:opacity-40 disabled:bg-gray-300 disabled:pointer-events-none"
            >
              <ShoppingBasket size={14} className="shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>
          ) : (
          <div className="w-full">
            <div className="flex items-center justify-between rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden w-full">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-20 h-12 flex items-center justify-center text-lg font-bold text-text-slate dark:text-zinc-100 bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                -
              </button>
              <div className="w-24 h-12 flex items-center justify-center text-sm font-bold text-text-slate dark:text-zinc-100">
                {itemQuantity}
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-20 h-12 flex items-center justify-center text-lg font-bold text-text-slate dark:text-zinc-100 bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { X, Trash2, ShoppingBasket, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

// WHATSAPP NUMBER - Configured here
const WHATSAPP_SELLER_NUMBER = '919550090590'; // Set your actual target phone number here

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [validated, setValidated] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setValidated(true);
      return;
    }

    // Format WhatsApp message
    let message = `*નવો ઓર્ડર - HARI NAMAN GREENS*\n`;
    message += `=============================\n\n`;
    message += `*ગ્રાહક વિગતો (Customer Info):*\n`;
    message += `👤 *નામ (Name):* ${formData.name.trim()}\n`;
    message += `📞 *ફોન (Phone):* ${formData.phone.trim()}\n`;
    message += `📍 *સરનામું (Address):* ${formData.address.trim()}\n`;
    if (formData.notes.trim()) {
      message += `📝 *નોંધ (Notes):* ${formData.notes.trim()}\n`;
    }
    
    message += `\n*ઓર્ડર આઇટમ્સ (Items Ordered):*\n`;
    message += `-----------------------------\n`;
    cart.forEach((item, index) => {
      const lineTotal = item.variant.price * item.quantity;
      const localNameStr = item.nameLocal ? ` (${item.nameLocal.split('(')[0].trim()})` : '';
      message += `${index + 1}. *${item.name}*${localNameStr}\n`;
      message += `   Weight: _${item.variant.label}_ | Qty: *${item.quantity}* | Price: ₹${lineTotal}\n`;
    });
    message += `-----------------------------\n`;
    message += `*કુલ રકમ (Total Amount): ₹${cartTotal}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_SELLER_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart and close drawer
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-warm-bg dark:bg-zinc-950 shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="text-brand-green dark:text-brand-mint" />
            <h2 className="text-xl font-bold text-text-slate dark:text-zinc-100">Your Basket / ઓર્ડર લીસ્ટ</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer text-gray-500 hover:text-text-slate dark:hover:text-zinc-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Contents */}
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-mint/50 dark:bg-brand-green/20 flex items-center justify-center text-brand-green dark:text-brand-mint mb-4">
              <ShoppingBasket size={36} />
            </div>
            <h3 className="text-lg font-bold text-text-slate dark:text-zinc-100 mb-1">Your Basket is Empty</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs mb-6">
              તમારી ટોપલી ખાલી છે. શાકભાજી અથવા ડેરી આઇટમ્સ ઉમેરો.
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-brand-green text-white font-bold rounded-xl shadow-sm hover:bg-brand-green/95 active:scale-95 cursor-pointer transition-all"
            >
              Start Shopping / ખરીદી શરૂ કરો
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Items list */}
            <div className="flex-grow overflow-y-auto px-5 py-4 space-y-3">
              <div className="text-[10px] font-bold text-brand-gold bg-brand-gold-light dark:bg-brand-gold/10 border border-brand-gold/10 dark:border-brand-gold/20 px-3 py-2 rounded-lg flex items-center gap-1.5 mb-2">
                <span>⚠️ Order 1 day ahead for free home delivery!</span>
              </div>

              {cart.map((item) => (
                <div 
                  key={item.cartKey}
                  className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 flex gap-3 shadow-sm"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-14 h-14 object-cover rounded-lg bg-gray-100 dark:bg-zinc-800"
                  />
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-sm font-bold text-text-slate dark:text-zinc-100 leading-tight">{item.name}</h4>
                        <span className="text-xs font-bold text-text-slate dark:text-zinc-100">₹{item.variant.price * item.quantity}</span>
                      </div>
                      <span className="text-xs text-brand-green/80 dark:text-brand-mint/80 font-medium block mt-0.5">{item.nameLocal}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50/50 dark:border-zinc-800/80">
                      <span className="text-[11px] font-bold bg-gray-100 dark:bg-zinc-850 text-gray-600 dark:text-zinc-350 px-2 py-0.5 rounded border border-transparent dark:border-zinc-700/60">
                        {item.variant.label} (₹{item.variant.price})
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {/* Item quantity adjustments */}
                        <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-100 dark:bg-zinc-800 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-black bg-white dark:bg-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-200 rounded cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-black dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-black bg-white dark:bg-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-200 rounded cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          className="p-1.5 text-gray-400 dark:text-zinc-550 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
                          aria-label="Remove Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total, Address, and WhatsApp Submit Form */}
            <div className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-5 py-4 space-y-4">
              {/* Grand Total */}
              <div className="flex justify-between items-center text-text-slate dark:text-zinc-100">
                <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Basket Total / કુલ કિંમત:</span>
                <span className="text-xl font-extrabold text-brand-green dark:text-brand-mint">₹{cartTotal}</span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-3">
                  <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MapPin size={12} className="text-brand-green dark:text-brand-mint" />
                    <span>Delivery Address / વિગતો ભરો</span>
                  </h3>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-450 mb-1" htmlFor="checkout-name">
                    Your Name * / તમારું નામ *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-850 border rounded-xl outline-none transition-all ${
                      validated && !formData.name.trim()
                        ? 'border-red-500 bg-red-50/10'
                        : 'border-gray-200 dark:border-zinc-750 focus:border-brand-green focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-brand-green/20 text-text-slate dark:text-zinc-100'
                    }`}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-450 mb-1" htmlFor="checkout-phone">
                    Phone Number * / ફોન નંબર *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-850 border rounded-xl outline-none transition-all ${
                      validated && !formData.phone.trim()
                        ? 'border-red-500 bg-red-50/10'
                        : 'border-gray-200 dark:border-zinc-750 focus:border-brand-green focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-brand-green/20 text-text-slate dark:text-zinc-100'
                    }`}
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-450 mb-1" htmlFor="checkout-address">
                    Delivery Address * / ઘરનું સરનામું *
                  </label>
                  <textarea
                    id="checkout-address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Society, Block, Area, Near landmark"
                    className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-850 border rounded-xl outline-none transition-all resize-none ${
                      validated && !formData.address.trim()
                        ? 'border-red-500 bg-red-50/10'
                        : 'border-gray-200 dark:border-zinc-750 focus:border-brand-green focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-brand-green/20 text-text-slate dark:text-zinc-100'
                    }`}
                  />
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-450 mb-1" htmlFor="checkout-notes">
                    Delivery Notes (Optional) / અન્ય વિગત
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Leave at gate, deliver in morning"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-850 border border-gray-200 dark:border-zinc-750 rounded-xl outline-none focus:border-brand-green focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-brand-green/20 text-text-slate dark:text-zinc-100 transition-all"
                  />
                </div>

                {/* Form Validations Alert */}
                {validated && (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) && (
                  <p className="text-xs text-red-500 font-semibold animate-pulse">
                    Please fill out all required (*) fields before ordering.
                  </p>
                )}

                {/* WhatsApp checkout CTA */}
                <button
                  type="submit"
                  className="w-full h-12 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.52 3.48A11.88 11.88 0 0 0 12.01.02C5.65.02.47 5.2.47 11.56c0 2.03.54 4.02 1.57 5.78L.12 23.05l5.85-1.54a11.46 11.46 0 0 0 6.03 1.56h.01c6.37 0 11.55-5.18 11.55-11.54 0-3.08-1.2-5.96-3.14-8.05Zm-8.52 17.04h-.01a9.78 9.78 0 0 1-5.01-1.36l-.36-.22-3.48.91.94-3.4-.24-.36A9.72 9.72 0 0 1 2.3 11.56c0-5.36 4.36-9.72 9.71-9.72 2.59 0 5.02 1.01 6.84 2.84a9.72 9.72 0 0 1 2.86 6.88c0 5.36-4.36 9.72-9.71 9.72Zm5.39-7.78c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.14-.67.14-.2.27-.77.98-.95 1.18-.17.2-.34.22-.63.08-.29-.14-1.21-.45-2.3-1.42-.85-.76-1.43-1.71-1.6-2-.17-.28-.02-.43.12-.57.12-.12.28-.33.42-.5.14-.17.19-.28.28-.47.09-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.59-.49-.51-.67-.52l-.57-.01c-.2 0-.52.07-.8.37-.28.3-1.08 1.06-1.08 2.58 0 1.51 1.11 2.97 1.27 3.18.16.2 2.2 3.35 5.34 4.69.75.32 1.34.51 1.8.65.76.22 1.45.19 1.99.12.61-.08 1.78-.73 2.03-1.45.24-.72.24-1.34.17-1.45-.07-.12-.27-.19-.56-.33Z"/>
                  </svg>
                  <span>Order on WhatsApp</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
export { WHATSAPP_SELLER_NUMBER };

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('hn_cart');
      if (!savedCart) return [];
      const parsedCart = JSON.parse(savedCart);
      if (!Array.isArray(parsedCart)) return [];
      return parsedCart.filter(
        (item) =>
          item &&
          typeof item.quantity === 'number' &&
          item.quantity > 0 &&
          typeof item.cartKey === 'string' &&
          item.cartKey.length > 0
      );
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });

  // Persist cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('hn_cart', JSON.stringify(cart));
  }, [cart]);

  // Unique key helper for items (productId + variantLabel)
  const getCartKey = (productId, variantLabel) => `${productId}-${variantLabel}`;

  // Add item to cart
  const addToCart = (product, variant, quantity = 1) => {
    if (quantity <= 0) return;
    setCart((prevCart) => {
      const cartKey = getCartKey(product._id || product.id, variant.label);
      const existingItemIndex = prevCart.findIndex((item) => item.cartKey === cartKey);

      if (existingItemIndex > -1) {
        // Update quantity of existing variant in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }

      // Add as a new item in the cart
      return [
        ...prevCart,
        {
          cartKey,
          id: product._id || product.id,
          name: product.name,
          nameLocal: product.nameLocal,
          category: product.category,
          imageUrl: product.imageUrl,
          variant: {
            label: variant.label,
            price: variant.price
          },
          quantity
        }
      ];
    });
  };

  // Remove item from cart completely
  const removeFromCart = (cartKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartKey !== cartKey));
  };

  // Update quantity of a specific item in cart
  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartKey);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart counts and totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.variant.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

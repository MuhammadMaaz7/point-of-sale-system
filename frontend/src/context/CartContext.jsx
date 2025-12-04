/**
 * CartContext
 * Shopping cart state management for sales
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS, BUSINESS_RULES } from '../config/constants';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Load cart from localStorage on init
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemId === item.itemId);
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity || 1)
        };
        return updated;
      }
      
      // Add new item
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((item) => item.itemId !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((i) => i.itemId === itemId);
      if (index >= 0) {
        updated[index] = { ...updated[index], quantity };
      }
      return updated;
    });
  }, [removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate subtotal
  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  // Calculate tax
  const getTax = useCallback(() => {
    return getSubtotal() * BUSINESS_RULES.TAX_RATE;
  }, [getSubtotal]);

  // Calculate total
  const getTotal = useCallback((discount = 0) => {
    return getSubtotal() + getTax() - discount;
  }, [getSubtotal, getTax]);

  // Get item count
  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;

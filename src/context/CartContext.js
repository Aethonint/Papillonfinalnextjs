"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 1. Load from Local Storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
  }, []);

  // 2. Save to Local Storage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- ADD TO CART ---
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      // Check if item exists (Same Product ID + Same Personalization)
      const existingIndex = prevItems.findIndex((item) => {
        const isSameProduct = item.product_id === newItem.product_id;
        // Compare personalization data deeply to differentiate "Safeer" vs "John" on same card
        const isSameCustom = JSON.stringify(item.custom_data) === JSON.stringify(newItem.custom_data);
        return isSameProduct && isSameCustom;
      });

      if (existingIndex > -1) {
        // If exact match, increase quantity
        const updated = [...prevItems];
        updated[existingIndex].qty += newItem.qty;
        return updated;
      }
      
      // Else add new item
      return [...prevItems, newItem];
    });
  };

  // --- UPDATE QUANTITY ---
  // This triggers the re-render that updates the Total Price automatically
  const updateQuantity = (productId, customData, newQty) => {
    if (newQty < 1) return; // Prevent going below 1

    setCartItems((prev) =>
      prev.map((item) => {
        const isMatch = item.product_id === productId && JSON.stringify(item.custom_data) === JSON.stringify(customData);
        return isMatch ? { ...item, qty: newQty } : item;
      })
    );
  };

  // --- REMOVE ITEM ---
  const removeFromCart = (productId, customData) => {
    setCartItems((prev) =>
      prev.filter((item) => 
        !(item.product_id === productId && JSON.stringify(item.custom_data) === JSON.stringify(customData))
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // --- AUTO-CALCULATE TOTALS ---
  // This runs automatically every time 'cartItems' changes
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * parseInt(item.qty || 1));
  }, 0);

  // You can add shipping logic here later if needed
  const total = subtotal; 

  return (
    <CartContext.Provider value={{ 
        cart: cartItems, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        subtotal, 
        total 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  
  // Stores: Name, Address, Phone, Label, AND Selected Delivery Speed
  const [shippingAddress, setShippingAddress] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false); // Fixes Hydration errors

  // 1. Load from Local Storage on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      const savedAddress = localStorage.getItem("shippingAddress");
      
      if (savedCart) {
        try { setCartItems(JSON.parse(savedCart)); } catch (e) { console.error("Cart Parse Error:", e); }
      }
      if (savedAddress) {
        try { setShippingAddress(JSON.parse(savedAddress)); } catch (e) { console.error("Address Parse Error:", e); }
      }
      setIsLoaded(true);
    }
  }, []);

  // 2. Save Cart to Local Storage
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // 3. Save Address to Local Storage
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
        if (shippingAddress) {
            localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
        } else {
            localStorage.removeItem("shippingAddress");
        }
    }
  }, [shippingAddress, isLoaded]);

  // --- CART FUNCTIONS ---

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return; 
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearCart = () => {
      setCartItems([]);
      setShippingAddress(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        localStorage.removeItem("shippingAddress");
      }
  };

  // Calculate Subtotal (Items only)
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty || 1)), 0);
  
  // NOTE: 'total' here is just Item Subtotal. 
  // Grand Total (with shipping) is calculated in Delivery/Checkout using shippingAddress.delivery_option.price
  const total = subtotal; 

  return (
    <CartContext.Provider value={{ 
        cart: cartItems, 
        addToCart,         
        updateQuantity,    
        removeFromCart,    
        clearCart, 
        subtotal, 
        total,
        shippingAddress,
        setShippingAddress
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
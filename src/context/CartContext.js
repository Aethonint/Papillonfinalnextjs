"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  
  // Stores: Name, Address, Phone, Label
  const [shippingAddress, setShippingAddress] = useState(null);

  // --- NEW: Store Shipping Cost separately ---
  const [shippingCost, setShippingCost] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false); 

  // 1. Load from Local Storage on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      const savedAddress = localStorage.getItem("shippingAddress");
      const savedShipping = localStorage.getItem("shippingCost"); // Load shipping cost
      
      if (savedCart) {
        try { setCartItems(JSON.parse(savedCart)); } catch (e) { console.error("Cart Parse Error:", e); }
      }
      if (savedAddress) {
        try { setShippingAddress(JSON.parse(savedAddress)); } catch (e) { console.error("Address Parse Error:", e); }
      }
      if (savedShipping) {
        try { setShippingCost(parseFloat(savedShipping)); } catch (e) { console.error("Shipping Parse Error:", e); }
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

  // 4. Save Shipping Cost to Local Storage
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("shippingCost", shippingCost);
    }
  }, [shippingCost, isLoaded]);

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
      setShippingCost(0); // Reset shipping cost
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("shippingCost");
      }
  };

  // Calculate Subtotal (Items only)
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty || 1)), 0);
  
  // --- UPDATED: Total now includes Shipping ---
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider value={{ 
        cart: cartItems, 
        addToCart,         
        updateQuantity,    
        removeFromCart,    
        clearCart, 
        subtotal, 
        total,             // This is now (Items + Shipping)
        shippingAddress,
        setShippingAddress,
        shippingCost,      // Expose this
        setShippingCost    // Expose this so Delivery page can update it
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
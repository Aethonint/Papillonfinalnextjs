"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
const addToCart = (item) => {
  setCart((prev) => {
    const exist = prev.find(
      (p) =>
        p.product_id === item.product_id &&
        p.personalization_id === item.personalization_id
    );

    if (exist) {
      return prev.map((p) =>
        p.product_id === item.product_id &&
        p.personalization_id === item.personalization_id
          ? { ...p, qty: p.qty + item.qty }
          : p
      );
    }

    return [...prev, item];
  });
};

const removeFromCart = (product_id, personalization_id = null) => {
  setCart((prev) =>
    prev.filter(
      (item) =>
        String(item.product_id) !== String(product_id) ||
        String(item.personalization_id || "") !== String(personalization_id || "")
    )
  );
};


const updateQuantity = (product_id, personalization_id, newQty) => {
  if (newQty < 1) return;
  setCart((prev) =>
    prev.map((item) =>
      item.product_id === product_id &&
      item.personalization_id === personalization_id
        ? { ...item, qty: newQty }
        : item
    )
  );
};

  // Calculate subtotal & total
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal; // add shipping/tax if needed

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

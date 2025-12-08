"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Using Next.js Image for better performance

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, total } = useCart();
  const router = useRouter();

  // Calculate total items for the header
  const totalItemsCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <div className="w-full p-6 max-w-7xl mx-auto min-h-screen bg-white">
      
      <h1 className="text-3xl font-bold mb-8 text-zinc-900">
        Your Cart {totalItemsCount > 0 && <span className="text-gray-400 font-medium text-2xl">({totalItemsCount} items)</span>}
      </h1>

      {/* Empty State */}
      {cart.length === 0 && (
        <div className="py-32 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your basket is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't personalized any cards yet.</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Cart Grid */}
      {cart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Products List */}
          <div className="col-span-2 space-y-8">
            {cart.map((item, index) => (
              <div
                key={`${item.product_id}-${index}`} 
                className="flex flex-col sm:flex-row items-start gap-6 border-b border-gray-100 pb-8 last:border-0"
              >
                {/* Product Image */}
                <div className="relative w-28 h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title || "Product"}
                    fill
                    className="object-cover"
                    unoptimized={true} // Allow external images
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title || item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3 font-mono">{item.sku}</p>
                      </div>
                      {/* Price on Mobile Top Right */}
                      <span className="sm:hidden text-lg font-bold text-gray-900">£{parseFloat(item.price).toFixed(2)}</span>
                  </div>
                  
                  {/* --- PERSONALIZATION DETAILS SECTION --- */}
                  {item.custom_data && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        
                        {/* 1. Envelope Choice */}
                        {item.custom_data.envelope && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">Envelope:</span>
                                <span className="font-medium text-gray-800">{item.custom_data.envelope}</span>
                            </div>
                        )}

                        {/* 2. Dynamic Inputs (Front, Back, etc.) */}
                        {item.custom_data.inputs && Array.isArray(item.custom_data.inputs) && 
                           item.custom_data.inputs.map((input, i) => (
                             <div key={i} className="border-t border-gray-200 pt-2 first:border-0 first:pt-0">
                                
                                {/* Label & Meta (Font Name) */}
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-[10px] uppercase tracking-widest text-[#66A3A3]">
                                        {input.label || "TEXT ZONE"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {input.fontFamily}
                                        </span>
                                        {/* Color Dot */}
                                        <span 
                                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" 
                                            style={{ backgroundColor: input.color }}
                                            title={input.color}
                                        ></span>
                                    </div>
                                </div>

                                {/* The Actual User Text (Styled) */}
                                <p 
                                    className="text-lg leading-snug break-words" 
                                    style={{ 
                                        fontFamily: input.fontFamily, 
                                        color: input.color 
                                    }}
                                >
                                    {input.value}
                                </p>
                             </div>
                           ))
                        }
                    </div>
                  )}
                </div>

                {/* Right Side Controls (Desktop) */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-4 sm:mt-0">
                    <span className="hidden sm:block text-xl font-bold text-gray-900">£{parseFloat(item.price).toFixed(2)}</span>
                    
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.custom_data, (item.qty || 1) - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition"
                      >-</button>
                      <span className="w-8 text-center font-semibold text-sm">{item.qty || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.custom_data, (item.qty || 1) + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition"
                      >+</button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id, item.custom_data)}
                      className="text-red-500 text-xs font-bold hover:text-red-700 hover:underline transition"
                    >
                      Remove Item
                    </button>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="h-fit sticky top-10">
            <div className="border border-gray-200 p-6 rounded-2xl bg-gray-50 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">Calculated at Checkout</span>
                    </div>
                </div>

                <div className="flex justify-between py-4 border-t border-gray-200 text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                </div>

                <button
                    onClick={() => router.push("/checkout")}
                    className="mt-4 w-full bg-[#66A3A3] hover:bg-[#588b8b] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-700/10 transition-all transform active:scale-95 flex justify-center items-center gap-2"
                >
                    Secure Checkout 🔒
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                    By checking out, you agree to our Terms & Conditions.
                </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;
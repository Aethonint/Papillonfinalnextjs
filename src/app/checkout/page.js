"use client";

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// Initialize Stripe (Check if key exists to prevent crash)
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function CheckoutPage() {
  const { cart, total, shippingAddress } = useCart(); // Get Real Address
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(""); 
  const router = useRouter();
  
  // --- LOCK: Prevents infinite API calls ---
  const hasFetched = useRef(false);

  useEffect(() => {
    // 1. Validation Checks
    if (cart.length === 0) return;
    if (total <= 0) {
        setError("Cart total cannot be 0.");
        return;
    }
    
    // Redirect if they skipped the Delivery Page
    if (!shippingAddress) {
        router.push('/delivery');
        return;
    }

    // --- STOP IF ALREADY FETCHED ---
    if (hasFetched.current || clientSecret) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
        setError("You are not logged in. Please login first.");
        return;
    }

    // Lock to prevent duplicate requests
    hasFetched.current = true;
    setError(""); 

    // 2. Fetch Payment Intent

    fetch("https://papillondashboard.devshop.site/api/create-payment-intent", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ amount: total }),
    })
      .then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            hasFetched.current = false;
            throw new Error(`Server Error: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            console.error("API Error:", data);
            setError("Failed to get payment key from server.");
            hasFetched.current = false;
          }
      })
      .catch((err) => {
          console.error("Stripe Fetch Error:", err);
          setError(err.message); 
          hasFetched.current = false;
      });
  }, [total, cart.length, clientSecret, shippingAddress]);

  // Handle empty cart
  if (cart.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
            <h2 className="text-xl font-bold mb-4 text-zinc-900">Your cart is empty</h2>
            <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">Return Home</button>
        </div>
      );
  }

  const options = {
    clientSecret,
    appearance: { theme: 'stripe' },
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: Summary & Address */}
        <div>
           <h1 className="text-3xl font-bold mb-6 text-zinc-900">Checkout</h1>
           
           {/* Price Summary */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-lg mb-4 text-zinc-800">Total to Pay</h3>
              <p className="text-4xl font-black text-gray-900">£{total.toFixed(2)}</p>
           </div>

           {/* Shipping Address Summary */}
           {shippingAddress && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 text-sm text-gray-600">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg text-zinc-800">Shipping To</h3>
                   <button onClick={() => router.push('/delivery')} className="text-[#66A3A3] font-bold hover:underline">Edit</button>
                </div>
                <p className="font-bold text-black">{shippingAddress.name}</p>
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                <p>{shippingAddress.city}, {shippingAddress.postcode}</p>
                <p>{shippingAddress.country}</p>
             </div>
           )}
           
           {/* Error Display */}
           {error && (
               <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-bold shadow-sm">
                   ⚠️ {error}
                   <button onClick={() => window.location.reload()} className="block mt-2 text-xs underline hover:text-red-800">Try Refreshing</button>
               </div>
           )}
        </div>

        {/* RIGHT: Stripe Form */}
        <div>
            {clientSecret && stripePromise ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm 
                    totalAmount={total} 
                    shippingDetails={shippingAddress} // Pass real address to form
                />
              </Elements>
            ) : (
                !error && (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#66A3A3] mb-4"></div>
                        <p className="text-gray-500 text-sm font-medium">Securely connecting to Stripe...</p>
                    </div>
                )
            )}
        </div>

      </div>
    </div>
  );
}
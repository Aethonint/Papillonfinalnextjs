"use client";

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// Initialize Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function CheckoutPage() {
  const { cart, total, shippingAddress } = useCart(); 
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(""); 
  const router = useRouter();
  
  // Lock to prevent double-fetching
  const hasFetched = useRef(false);

  // Reset lock if Total changes (e.g. user modified cart)
  useEffect(() => {
    hasFetched.current = false;
    setClientSecret("");
  }, [total]);

  useEffect(() => {
    // 1. Validation
    if (cart.length === 0) return;
    if (total <= 0) {
        setError("Cart total cannot be 0.");
        return;
    }
    
    // Redirect if missing address
    if (!shippingAddress) {
        router.push('/checkout/delivery');
        return;
    }

    // 2. Prevent Duplicate Calls
    if (hasFetched.current || clientSecret) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
        setError("You are not logged in. Please login first.");
        return;
    }

    // Lock it
    hasFetched.current = true;
    setError(""); 

    // 3. Create Payment Intent
    // ✅ URL kept as Localhost per your request
    fetch("https://papillondashboard.devshop.site/api/create-payment-intent", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ 
          amount: total,
          // Optional: Send metadata if needed
          metadata: { 
              customer_name: shippingAddress.name,
              customer_email: shippingAddress.email 
          }
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            hasFetched.current = false; // Unlock on error to allow retry
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
          setError(err.message || "Payment system is currently unavailable.");
          hasFetched.current = false;
      });
      
  // ✅ FIXED DEPENDENCIES: Removed 'shippingAddress' object to stop infinite loop
  }, [total, cart.length, clientSecret, shippingAddress?.postcode]);

  // Handle empty cart
  if (cart.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
            <h2 className="text-xl font-bold mb-4 text-zinc-900">Your cart is empty</h2>
            <button onClick={() => router.push('/')} className="text-[#66A3A3] font-bold hover:underline">Return Home</button>
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
                   
                   {/* ✅ EDIT BUTTON LINK */}
                   <button 
                       type="button" 
                       onClick={() => router.push('/checkout/delivery')} 
                       className="text-[#66A3A3] font-bold hover:underline"
                   >
                       Edit
                   </button>
                </div>
                
                <p className="font-bold text-black">{shippingAddress.name}</p>
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                
                {/* ✅ ADDED: COUNTY / STATE DISPLAY */}
                <p>
                    {shippingAddress.city}
                    {(shippingAddress.county || shippingAddress.state) ? `, ${shippingAddress.county || shippingAddress.state}` : ""}
                </p>
                
                <p>{shippingAddress.postcode}</p>
                <p>{shippingAddress.country}</p>
             </div>
           )}
           
           {/* Error Display */}
           {error && (
               <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-sm font-bold shadow-sm flex flex-col gap-2">
                   <p className="flex items-center gap-2">⚠️ {error}</p>
                   <button 
                    onClick={() => window.location.reload()} 
                    className="self-start px-4 py-2 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-gray-50 text-xs"
                   >
                    Try Refreshing Page
                   </button>
               </div>
           )}
        </div>

        {/* RIGHT: Stripe Form */}
        <div>
            {clientSecret && stripePromise ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm 
                    totalAmount={total} 
                    shippingDetails={shippingAddress} 
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
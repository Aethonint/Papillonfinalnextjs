"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // Import Auth Context
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; 

export default function CheckoutForm({ totalAmount, shippingDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const { token } = useAuth(); // Get token from Auth Context
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    // 1. Confirm Payment with Stripe
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // Important: Handle logic here, don't auto-redirect
    });

    if (result.error) {
      // HANDLE EDGE CASE: "PaymentIntent unexpected state"
      if (
        result.error.payment_intent &&
        result.error.payment_intent.status === "succeeded"
      ) {
        console.log("Payment was already successful. Saving order...");
        await saveOrderToBackend(result.error.payment_intent.id);
      } else {
        // Genuine Error
        toast.error(result.error.message || "Payment Failed");
        setIsLoading(false);
      }

    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      // Standard Success Path
      await saveOrderToBackend(result.paymentIntent.id);
    } else {
      toast.error("Payment processing issue.");
      setIsLoading(false);
    }
  };

  const saveOrderToBackend = async (transactionId) => {
    const loadingToastId = toast.loading("Finalizing Order...");

    try {
      // Get token from Context or Fallback to LocalStorage
      const authToken = token || localStorage.getItem('auth_token');

      // 2. Prepare Data for Laravel
      const orderPayload = {
        items: cart.map(item => ({
            id: item.product_id || item.id,
            title: item.title || item.name,
            sku: item.sku || 'SKU-PENDING',
            qty: item.qty || 1,
            price: item.price,
            size: item.size || "A5", 
            personalisation_inputs: item.custom_data || null
        })),

        shipping_address: {
            name: shippingDetails.name,
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            label: shippingDetails.label,
            line1: shippingDetails.line1,
            line2: shippingDetails.line2,
            city: shippingDetails.city,
            postcode: shippingDetails.postcode,
            country: 'United Kingdom'
        },

        delivery_type: shippingDetails.delivery_type,
        delivery_option: {
             name: shippingDetails.delivery_option?.name || "Standard",
             price: shippingDetails.delivery_option?.price || 0
        },

        subtotal: totalAmount - (shippingDetails.delivery_option?.price || 0),
        shipping_cost: shippingDetails.delivery_option?.price || 0,
        total: totalAmount,

        payment: {
            method: 'stripe',
            transaction_id: transactionId
        }
      };
      
      // 3. Send to Laravel API
      const res = await fetch("https://papillondashboard.devshop.site/api/orders", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json", 
            "Authorization": `Bearer ${authToken}` 
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend Validation Error:", errorData);
        throw new Error(errorData.message || "Failed to save order");
      }

      const data = await res.json();

      toast.dismiss(loadingToastId);

      if (data.success) {
        clearCart(); 
        
        // --- UPDATED SUCCESS LOGIC HERE ---
        toast.success(`Order Placed Successfully! Order #${data.order_number}`);
        router.push(`/account/orders`); 
        // ----------------------------------

      } else {
        toast.error("Payment received, but order saving failed.");
        console.error("Backend Error:", data);
      }

    } catch (err) {
      toast.dismiss(loadingToastId);
      console.error(err);
      toast.error(err.message || "Network error saving order.");
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-zinc-900">Payment Details</h2>
      
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg flex justify-center items-center gap-2"
      >
        {isLoading ? (
            <>Processing...</>
        ) : (
            <>Pay £{totalAmount.toFixed(2)}</>
        )}
      </button>
      
      <div className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
         🔒 Payments processed securely by Stripe
      </div>
    </form>
  );
}
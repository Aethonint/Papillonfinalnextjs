"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, total } = useCart();
  const router = useRouter();

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Empty Cart */}
      {cart.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="text-xl mb-4">Your cart is empty!</h2>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      )}

      {/* Cart Items */}
      {cart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Products */}
          <div className="col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={`${item.product_id}-${item.personalization_id || 0}`}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between border p-4 rounded-lg"
              >
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>

                    {/* Show personalization info if exists */}
                    {item.custom_data && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.custom_data.inputs &&
                          Object.entries(item.custom_data.inputs).map(([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {value}
                            </div>
                          ))}
                        {item.custom_data.envelope && (
                          <div>
                            <strong>Envelope:</strong> {item.custom_data.envelope}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-4 lg:mt-0">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product_id,
                        item.personalization_id,
                        item.qty - 1
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.qty}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product_id,
                        item.personalization_id,
                        item.qty + 1
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                 onClick={() => removeFromCart(item.product_id, item.personalization_id)}

                  className="text-red-500 font-semibold mt-4 lg:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="border p-6 rounded-lg h-fit sticky top-10">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between py-2 border-b">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>

            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full bg-black text-white py-3 rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

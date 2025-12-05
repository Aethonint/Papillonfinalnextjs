"use client";

import { useState } from "react";
import { FiMail } from "react-icons/fi";

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(process.env.NEXT_PUBLIC_API + "/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-[#66A3A3]">
          Forgot Password
        </h2>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
              <input
                required
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#66A3A3]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#66A3A3] text-white font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-700">
            Check your email for the password reset link.
          </p>
        )}
      </div>
    </div>
  );
}

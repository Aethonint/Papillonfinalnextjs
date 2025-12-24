"use client";

import { useState } from "react";
import { FiMail, FiLock, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ForgotPasswordModal({ open, onClose }) {
  const [step, setStep] = useState(1); // 1 = Email, 2 = Reset Form
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {



      const res = await fetch("https://papillondashboard.devshop.site/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast.success("OTP sent to your email!");
      setStep(2); // Move to next step
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: RESET PASSWORD ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {



      const res = await fetch("https://papillondashboard.devshop.site/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ 
            email, 
            otp, 
            password, 
            password_confirmation: confirmPassword 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      toast.success("Password reset successful! Please login.");
      onClose(); // Close modal
      setStep(1); // Reset modal state for next time
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-[#66A3A3]">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {step === 1 ? (
          // --- FORM STEP 1: EMAIL ---
          <form onSubmit={handleSendOtp} className="space-y-5">
            <p className="text-gray-600 text-sm">Enter your email address and we&apos;ll send you an OTP...</p>
            <div className="relative">
              <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
              <input
                required
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#66A3A3] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#66A3A3] text-white font-semibold disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // --- FORM STEP 2: OTP & NEW PASSWORD ---
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-gray-600 text-sm">An OTP has been sent to <strong>{email}</strong>.</p>
            
            {/* OTP Input */}
            <div className="relative">
              <FiKey className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
              <input
                required
                type="text"
                value={otp}
                placeholder="Enter OTP Code"
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#66A3A3] outline-none tracking-widest"
              />
            </div>

            {/* New Password */}
            <div className="relative">
              <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#66A3A3] outline-none"
              />
               <span className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
               </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#66A3A3] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#66A3A3] text-white font-semibold disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Change Password"}
            </button>
            
            <div className="text-center">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black hover:underline">
                    Wrong email? Go back
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import ForgotPasswordModal from "../forgot-password-modal"; // Ensure path is correct
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext"; // Import Context

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Context Login function

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {



      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle "Account not verified" specifically
        if (res.status === 403 && data.message.toLowerCase().includes("verify")) {
            toast.error("Account not verified. Please verify OTP.");
            router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
            return;
        }
        throw new Error(data.message || "Invalid credentials");
      }

      // Success
      toast.success("Welcome back!");
      login(data.user, data.access_token);
      router.push("/"); // Go to Home (or Cart)

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
          
          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white p-10 relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-72 h-72 bg-[#66A3A3]/10 rounded-full blur-3xl absolute -top-16 -left-20"></div>
              <div className="w-72 h-72 bg-[#66A3A3]/10 rounded-full blur-3xl absolute bottom-0 right-0"></div>
            </div>
            <div className="z-10 flex items-center mb-4">
              <Image 
              src="/logo/newlogo.png" 
              alt="Home Hero 1" 
              width={123} 
              height={111}
              className="flex  object-contain" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#66A3A3]">Welcome Back!</h1>
            <p className="text-gray-600 mt-2 text-center max-w-xs">Log in to continue exploring personalized gifts & surprises.</p>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-black mb-8">Sign In</h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full pl-12 py-3 rounded-2xl border border-gray-200 focus:border-[#66A3A3] outline-none shadow-sm transition" />
              </div>

              <div className="relative">
                <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 focus:border-[#66A3A3] outline-none shadow-sm transition" />
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}</span>
              </div>

              <div className="text-right">
                <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-[#66A3A3] hover:underline font-medium">Forgot Password?</button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl text-white font-semibold bg-[#66A3A3] shadow-lg hover:brightness-110 transition disabled:opacity-70">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-600 text-center">Don&apos;t have an account? <a href="/auth/Register" className="text-[#66A3A3] font-semibold hover:underline">Sign up</a></p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
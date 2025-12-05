"use client";

import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import ForgotPasswordModal from "../forgot-password-modal";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      // You can add your future API integration here
      console.log("Email:", email, "Password:", password);
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">

          {/* LEFT PANEL – Branding */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white p-10 relative">
            {/* Decorative shapes */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-72 h-72 bg-[#66A3A3]/10 rounded-full blur-3xl absolute -top-16 -left-20"></div>
              <div className="w-72 h-72 bg-[#66A3A3]/10 rounded-full blur-3xl absolute bottom-0 right-0"></div>
            </div>

            {/* Logo */}
            <div className="z-10 flex items-center mb-4">
              <Image
                src="/Logo/footerlogo.png"
                alt="Site Logo"
                width={100}
                height={100}
                className="mr-3"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-[#66A3A3]">
              Welcome Back!
            </h1>

            <p className="text-gray-600 mt-2 text-center max-w-xs">
              Log in to continue exploring personalized gifts & surprises.
            </p>
          </div>

          {/* RIGHT PANEL – Form */}
          <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">

            <h2 className="text-3xl font-bold text-black mb-8">Sign In</h2>

            {error && (
              <p className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
              </p>
            )}

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Email Input */}
              <div className="relative">
                <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 py-3 rounded-2xl transition shadow-sm"
                />
              </div>

              {/* Password Input with Show/Hide */}
              <div className="relative">
                <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 rounded-2xl transition shadow-sm"
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-sm text-[#66A3A3] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl text-white font-semibold bg-[#66A3A3] shadow-lg relative overflow-hidden group hover:brightness-110 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <a
                href="/auth/Register"
                className="text-[#66A3A3] font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}

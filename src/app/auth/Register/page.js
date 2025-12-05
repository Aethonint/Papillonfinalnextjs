
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    if (!form.password) return setPasswordStrength("");
    if (form.password.length < 6) setPasswordStrength("Weak");
    else if (form.password.match(/[0-9]/) && form.password.match(/[A-Z]/)) setPasswordStrength("Strong");
    else setPasswordStrength("Medium");
  }, [form.password]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Simulate registration delay
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/auth/login"), 2000);
      console.log("Registered user:", form);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">

      {/* Animated floating shapes */}
      <div className="absolute w-72 h-72 bg-[#66A3A3]/20 rounded-full blur-3xl top-10 left-10 animate-pulse-slow"></div>
      <div className="absolute w-72 h-72 bg-[#66A3A3]/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse-slow"></div>
      <div className="absolute w-60 h-60 bg-[#66A3A3]/10 rounded-full blur-2xl top-1/2 left-1/4 animate-spin-slow"></div>

      {/* Morphism Form Card */}
      <div className="relative z-10 w-full max-w-lg p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-[#66A3A3] mb-8 text-center">
          Join the Fun!
        </h2>

        {/* Error/Success messages */}
        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-center animate-fade">{errorMsg}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center animate-fade">{successMsg}</div>}

        <form onSubmit={handleRegister} className="space-y-6">

          {/* Name */}
          <div className="relative group">
           <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#66A3A3] text-xl z-10 transition" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full pl-12 py-4 rounded-2xl transition shadow-lg bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#66A3A3] text-xl transition z-10" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 py-4 rounded-2xl transition shadow-lg bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#66A3A3] text-xl transition z-10" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 py-4 rounded-2xl transition shadow-lg bg-white/50 backdrop-blur-sm"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer transition hover:text-[#66A3A3]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </span>

            {/* Password strength bar */}
            {form.password && (
              <div className="mt-1 h-1 w-full rounded-full overflow-hidden">
                <div
                  className={`h-1 ${
                    passwordStrength === "Weak"
                      ? "bg-red-500 w-1/3"
                      : passwordStrength === "Medium"
                      ? "bg-yellow-400 w-2/3"
                      : "bg-green-500 w-full"
                  } transition-all`}
                ></div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#66A3A3] text-xl transition z-10" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 py-4 rounded-2xl transition shadow-lg bg-white/50 backdrop-blur-sm"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer transition hover:text-[#66A3A3]"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-3xl font-bold text-white shadow-lg bg-[#66A3A3] hover:scale-105 hover:brightness-110 transition-transform relative overflow-hidden group"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#66A3A3] font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast"; // <--- Toast

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "", // Renamed to match Laravel
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Strength checker logic (kept same)
  useEffect(() => {
    if (!form.password) return setPasswordStrength("");
    if (form.password.length < 6) setPasswordStrength("Weak");
    else if (form.password.match(/[0-9]/) && form.password.match(/[A-Z]/)) setPasswordStrength("Strong");
    else setPasswordStrength("Medium");
  }, [form.password]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors (e.g., email taken)
        if(data.errors) {
            Object.values(data.errors).forEach(err => toast.error(err[0]));
        } else {
            toast.error(data.message || "Registration failed");
        }
        throw new Error("Failed");
      }

      toast.success("Account created! Check email for OTP.");
      // Redirect to OTP page with email query param
      router.push(`/auth/verify-otp?email=${encodeURIComponent(form.email)}`);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* ... (Kept your animated shapes & layout logic) ... */}
      <div className="relative z-10 w-full max-w-lg p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-[#66A3A3] mb-8 text-center">Join the Fun!</h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name */}
          <div className="relative group">
           <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
            <input type="text" name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} className="w-full pl-12 py-4 rounded-2xl bg-white/50 border border-transparent focus:border-[#66A3A3] outline-none shadow-lg transition" />
          </div>

          {/* Email */}
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
            <input type="email" name="email" placeholder="Email Address" required value={form.email} onChange={handleChange} className="w-full pl-12 py-4 rounded-2xl bg-white/50 border border-transparent focus:border-[#66A3A3] outline-none shadow-lg transition" />
          </div>

          {/* Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full pl-12 py-4 rounded-2xl bg-white/50 border border-transparent focus:border-[#66A3A3] outline-none shadow-lg transition" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}</span>
            
            {/* Strength Bar */}
            {form.password && (
              <div className="mt-1 h-1 w-full rounded-full overflow-hidden bg-gray-200">
                <div className={`h-1 transition-all duration-500 ${passwordStrength === "Weak" ? "bg-red-500 w-1/3" : passwordStrength === "Medium" ? "bg-yellow-400 w-2/3" : "bg-green-500 w-full"}`}></div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
            <input type={showConfirm ? "text" : "password"} name="password_confirmation" placeholder="Confirm Password" required value={form.password_confirmation} onChange={handleChange} className="w-full pl-12 py-4 rounded-2xl bg-white/50 border border-transparent focus:border-[#66A3A3] outline-none shadow-lg transition" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <FiEyeOff size={22} /> : <FiEye size={22} />}</span>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-3xl font-bold text-white shadow-lg bg-[#66A3A3] hover:scale-105 transition-transform disabled:opacity-70">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">Already have an account? <a href="/auth/login" className="text-[#66A3A3] font-semibold hover:underline">Login</a></p>
      </div>
    </div>
  );
}
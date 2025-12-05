"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://papillondashboard.devshop.site/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      toast.success("Verified! Logging you in...");
      login(data.user, data.access_token);
      router.push("/"); // Redirect to home

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-xl border">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: "#66A3A3" }}>Verify OTP</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Code sent to {email}</p>

        <form onSubmit={handleVerify} className="space-y-5">
          <input type="text" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full px-4 py-3 border rounded-xl text-center tracking-widest text-lg font-mono uppercase focus:border-[#66A3A3] outline-none" />
          <button disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-70" style={{ backgroundColor: "#66A3A3" }}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
    return <Suspense fallback={<div>Loading...</div>}><VerifyContent /></Suspense>;
}
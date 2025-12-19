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
  
  // New state for resend button
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  // --- 1. VERIFY LOGIC ---
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
      router.push("/"); 

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. RESEND LOGIC (NEW) ---
  const handleResend = async () => {
    if(!email) return toast.error("Email is missing.");
    
    setResending(true);
    try {
      const res = await fetch("https://papillondashboard.devshop.site/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email }),
      });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to resend");

        toast.success("New OTP sent to your email!");
    } catch (err) {
        toast.error(err.message);
    } finally {
        setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-xl border">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: "#66A3A3" }}>Verify OTP</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Code sent to {email}</p>

        <form onSubmit={handleVerify} className="space-y-5">
          <input 
            type="text" 
            maxLength={6} 
            required 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="Enter OTP" 
            className="w-full px-4 py-3 border rounded-xl text-center tracking-widest text-lg font-mono uppercase focus:border-[#66A3A3] outline-none" 
          />
          
          <button 
            disabled={loading} 
            className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-70" 
            style={{ backgroundColor: "#66A3A3" }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* --- RESEND LINK --- */}
        <div className="text-center mt-6">
           
              <p className="text-sm text-gray-500">
    Didn&apos;t receive the code?{" "}
                <button 
                    onClick={handleResend} 
                    disabled={resending}
                    className="text-[#66A3A3] font-semibold hover:underline disabled:opacity-50"
                >
                    {resending ? "Sending..." : "Resend"}
                </button>
            </p>
        </div>

      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
    return <Suspense fallback={<div>Loading...</div>}><VerifyContent /></Suspense>;
}
"use client";

import { useState } from "react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMsg("");

    // Simulate OTP verification
    setTimeout(() => {
      if (otp.length === 6) {
        setMsg("OTP verified successfully!");
        console.log("Verified OTP:", otp);
      } else {
        setErrorMsg("Invalid OTP");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-xl border">

        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: "#66A3A3" }}>
          Verify OTP
        </h2>

        {msg && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{msg}</div>}
        {errorMsg && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</div>}

        <form onSubmit={handleVerify} className="space-y-5">

          <input
            type="text"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border rounded-xl text-center tracking-widest text-lg"
          />

          <button
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ backgroundColor: "#66A3A3" }}
          >
            Verify OTP
          </button>

        </form>

      </div>
    </div>
  );
}

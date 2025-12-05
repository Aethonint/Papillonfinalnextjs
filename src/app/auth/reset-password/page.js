"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    setErrorMsg("");

    if (form.new_password !== form.confirm_password) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Simulate password reset
    setTimeout(() => {
      setMsg("Password reset successfully!");
      console.log("Password reset data:", form);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border">

        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: "#66A3A3" }}>
          Reset Password
        </h2>

        {msg && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{msg}</div>}
        {errorMsg && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            required
            className="w-full px-4 py-3 border rounded-xl"
            value={form.otp}
            onChange={handleChange}
          />

          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            required
            className="w-full px-4 py-3 border rounded-xl"
            value={form.new_password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 border rounded-xl"
            value={form.confirm_password}
            onChange={handleChange}
          />

          <button
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ backgroundColor: "#66A3A3" }}
          >
            Reset Password
          </button>
        </form>

      </div>
    </div>
  );
}

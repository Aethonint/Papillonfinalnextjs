"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, X, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import AccountSidebar from "@/components/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; 

export default function EditProfile() {
  const router = useRouter();
  const { user, token, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Main Form Data
  const [name, setName] = useState("");

  // Modal State
  const [modalType, setModalType] = useState(null); 
  const [modalStep, setModalStep] = useState(1); // 1 = Normal, 2 = Forgot/OTP Flow

  // Inputs
  const [newEmail, setNewEmail] = useState("");
  const [currentPassForEmail, setCurrentPassForEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  // Password Inputs
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  // --- 1. UPDATE NAME ---
  const handleNameUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Name updated successfully!");
      await refreshUser(); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. EMAIL FLOW ---
  const openEmailModal = () => {
    setModalType("email");
    setModalStep(1);
    setNewEmail("");
    setCurrentPassForEmail("");
    setOtp("");
  };

  const initiateEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail, current_password: currentPassForEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.email_change_pending) {
        toast.success("OTP sent to your new email!");
        setModalStep(2); 
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/profile/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Email verified & updated!");
      await refreshUser();
      setModalType(null);
      setTimeout(() => router.push("/account"), 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. PASSWORD FLOW ---
  const openPasswordModal = () => {
    setModalType("password");
    setModalStep(1); // Default to standard change
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
  };

  // A. Standard Change (Knows Current Password)
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    setLoading(true);
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/profile/password/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
            current_password: currentPassword, 
            password: newPassword, 
            password_confirmation: confirmPassword 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Password updated successfully!");
      setModalType(null); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // B. Forgot Password Trigger (Sends OTP)
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/profile/password/forgot-initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success("OTP sent to your email!");
      setModalStep(2); // Switch to Reset UI
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // C. Reset Password with OTP
  const submitPasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    setLoading(true);
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/profile/password/forgot-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
            otp, 
            password: newPassword, 
            password_confirmation: confirmPassword 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success("Password reset successfully!");
      setModalType(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <Toaster position="top-center" />
      <AccountSidebar active="edit" />

      <main className="col-span-3">
        {/* ... (Header and Main Form same as before) ... */}
        <div className="bg-gradient-to-r from-[#66A3A3] to-[#4c8d8d] text-white p-8 rounded-3xl shadow mb-10">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="opacity-90">Manage your profile details and security.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
          {/* NAME */}
          <div>
            <label className="font-bold text-gray-800 mb-2 block">Full Name</label>
            <div className="flex items-center gap-3 border px-4 py-3 rounded-xl bg-gray-50 focus-within:ring-2 ring-[#66A3A3]">
                <User className="text-gray-400" size={20}/>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent w-full outline-none text-gray-700 font-medium" />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-bold text-gray-800 mb-2 block">Email Address</label>
            <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-3 border px-4 py-3 rounded-xl bg-gray-100 cursor-not-allowed">
                    <Mail className="text-gray-400" size={20}/>
                    <span className="text-gray-500 font-medium">{user?.email}</span>
                </div>
                <button onClick={openEmailModal} className="bg-[#66A3A3] hover:bg-[#558b8b] text-white px-6 rounded-xl font-bold transition shadow-md">Edit</button>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-bold text-gray-800 mb-2 block">Password</label>
            <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-3 border px-4 py-3 rounded-xl bg-gray-100 cursor-not-allowed">
                    <Lock className="text-gray-400" size={20}/>
                    <span className="text-gray-500 font-bold text-lg">••••••••••••</span>
                </div>
                <button onClick={openPasswordModal} className="bg-[#66A3A3] hover:bg-[#558b8b] text-white px-6 rounded-xl font-bold transition shadow-md">Edit</button>
            </div>
          </div>

          <button onClick={handleNameUpdate} disabled={loading} className="w-full bg-black hover:bg-zinc-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition mt-4">
            {loading ? "Updating..." : "Update Name"}
          </button>
        </div>
      </main>

      {/* ================= MODALS ================= */}

      {/* EMAIL MODAL */}
      {modalType === "email" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-fade-in-up">
                <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
                <h2 className="text-2xl font-bold mb-1 text-gray-800">Change Email</h2>
                <p className="text-sm text-gray-500 mb-6">Step {modalStep} of 2</p>

                {modalStep === 1 ? (
                    <form onSubmit={initiateEmailChange} className="space-y-4">
                        <input type="email" placeholder="New Email Address" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" />
                        <input type="password" placeholder="Current Password" required value={currentPassForEmail} onChange={e => setCurrentPassForEmail(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" />
                        <button type="submit" disabled={loading} className="w-full bg-[#66A3A3] text-white py-3 rounded-xl font-bold">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyEmailOtp} className="space-y-4">
                        <div className="bg-[#E0F2F2] p-4 rounded-xl text-center mb-4"><p className="text-sm text-[#4c8d8d]">OTP sent to <strong>{newEmail}</strong></p></div>
                        <input type="text" placeholder="Enter OTP" required value={otp} onChange={e => setOtp(e.target.value.toUpperCase())} className="w-full border p-3 rounded-xl text-center text-2xl font-bold tracking-widest uppercase" maxLength={6} />
                        <button type="submit" disabled={loading} className="w-full bg-[#66A3A3] text-white py-3 rounded-xl font-bold">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Verify & Change"}
                        </button>
                    </form>
                )}
            </div>
        </div>
      )}

      {/* PASSWORD MODAL (Standard & Forgot Flow) */}
      {modalType === "password" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-fade-in-up">
                <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
                
                {/* HEADLINE */}
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {modalStep === 1 ? "Change Password" : "Reset Password"}
                </h2>
                
                {/* STEP 1: Standard Change (Knows Password) */}
                {modalStep === 1 ? (
                    <form onSubmit={submitPasswordChange} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
                            <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 ring-[#66A3A3] outline-none" />
                            
                            {/* --- THE FORGOT PASSWORD LINK --- */}
                            <div className="text-right">
                                <button 
                                    type="button" 
                                    onClick={handleForgotPassword}
                                    className="text-xs text-[#66A3A3] hover:underline font-medium"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                        
                        <div className="h-px bg-gray-100 my-2"></div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 ring-[#66A3A3] outline-none" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New Password</label>
                            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 ring-[#66A3A3] outline-none" />
                        </div>
                        
                        <button type="submit" disabled={loading} className="w-full bg-[#66A3A3] text-white py-3.5 rounded-xl font-bold mt-2 flex justify-center items-center gap-2">
                            {loading && <Loader2 className="animate-spin" size={20} />} Update Password
                        </button>
                    </form>
                ) : (
                    // STEP 2: Forgot Flow (OTP)
                    <form onSubmit={submitPasswordReset} className="space-y-4">
                        <div className="bg-[#E0F2F2] p-4 rounded-xl text-center mb-4">
                            <p className="text-sm text-[#4c8d8d]">OTP sent to <strong>{user?.email}</strong></p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">OTP Code</label>
                            <input type="text" placeholder="XXXXXX" required value={otp} onChange={e => setOtp(e.target.value.toUpperCase())} className="w-full border p-3 rounded-xl text-center text-xl font-bold tracking-widest uppercase" maxLength={6} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New Password</label>
                            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={() => setModalStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Back</button>
                            <button type="submit" disabled={loading} className="flex-[2] bg-[#66A3A3] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                                {loading && <Loader2 className="animate-spin" size={20} />} Reset Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
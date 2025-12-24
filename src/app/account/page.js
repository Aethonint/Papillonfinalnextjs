"use client";

import { useEffect, useState } from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // <--- 1. Import useRouter
import { ShoppingBag, AlertTriangle, Truck, CheckCircle } from "lucide-react";

export default function AccountPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_shipments: 0, // This represents 'Processing'
    delivered_orders: 0,
    refund_requests: 0
  });
  const [loading, setLoading] = useState(true);
  // --- AUTH PROTECTION START ---
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check directly in LocalStorage for speed
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;

    if (!storedToken) {
      router.replace("/auth/login"); // Redirect if no token
    } else {
      setIsAuthorized(true); // Allow access
    }
  }, [router]);
  // --- AUTH PROTECTION END ---

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {

        const res = await fetch("https://papillondashboard.devshop.site/api/profile/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  // SEQUENCE: Total -> Process -> Delivered -> Refunded
  const statCards = [
    { 
      label: "Total Orders", 
      value: stats.total_orders, 
      icon: ShoppingBag, 
      bg: "bg-[#FFF4E8]",
      text: "text-orange-600"
    },
    { 
      label: "Processing", 
      value: stats.pending_shipments, 
      icon: Truck, 
      bg: "bg-[#E7F5F5]",
      text: "text-[#66A3A3]"
    },
    { 
      label: "Delivered", 
      value: stats.delivered_orders, 
      icon: CheckCircle, 
      bg: "bg-[#E8F5E9]", 
      text: "text-green-600"
    },
    { 
      label: "Refunded", 
      value: stats.refund_requests, 
      icon: AlertTriangle, 
      bg: "bg-[#FFE5E5]",
      text: "text-red-500"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <AccountSidebar active="profile" />

      <main className="col-span-3 space-y-10">
        {/* PROFILE HEADER */}
        <div className="bg-gradient-to-r from-[#66A3A3] to-[#4C7E7E] text-white rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-extrabold shadow-inner border border-white/30">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="opacity-90 mt-1 text-sm font-medium tracking-wide">{user.email}</p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${s.bg} ${s.text}`}>
                <s.icon size={28} />
              </div>
              <h3 className="font-extrabold text-3xl text-gray-800">
                {loading ? "..." : s.value}
              </h3>
              <p className="text-gray-500 font-medium text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SUPPORT CTA */}
        <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
                <h3 className="font-bold text-blue-900 text-lg">Need help with an order?</h3>
                <p className="text-blue-700 text-sm mt-1">Our support team is available 24/7.</p>
             </div>
             <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition w-full sm:w-auto">
                Contact Support
             </button>
        </div>
      </main>
    </div>
  );
}
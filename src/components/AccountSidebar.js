"use client";

import Link from "next/link";
import {
  Edit3,
  ShoppingBag,
  MapPin,
  CreditCard,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import Context

export default function AccountSidebar({ active }) {
  // Use Context instead of LocalStorage directly
  // This ensures updates happen instantly without reload
  const { user, logout } = useAuth(); 

  const menu = [
    { label: "Profile", icon: User, href: "/account", key: "profile" },
    { label: "Edit Profile", icon: Edit3, href: "/account/edit", key: "edit" },
    { label: "My Orders", icon: ShoppingBag, href: "/account/orders", key: "orders" },
    { label: "Address Book", icon: MapPin, href: "/account/address", key: "address" },
    { label: "Payment Methods", icon: CreditCard, href: "/account/payment", key: "payment" },
  ];

  return (
    <aside className="col-span-1 bg-white shadow-lg rounded-3xl p-6 sticky top-8 h-fit border border-gray-100">

      {/* USER NAME (Updates Instantly Now) */}
      {user && (
        <div className="mb-6">
          <p className="font-bold text-lg text-gray-700">{user.name}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            href={item.href}
            key={item.key}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${
              active === item.key
                ? "bg-[#66A3A3] text-white shadow-lg"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                active === item.key ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              <item.icon size={20} />
            </div>
            {item.label}
          </Link>
        ))}

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition w-full text-red-600 font-medium"
        >
          <LogOut size={22} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
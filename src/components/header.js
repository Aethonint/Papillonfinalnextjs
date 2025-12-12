"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <--- 1. Import Router
import { ShoppingCart, Heart, User, Search } from "lucide-react"; // Added Search Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/context/AuthContext"; 
import {
  faGift,
  faBirthdayCake,
  faBoxOpen,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { User as UserIcon, ShoppingBag, Edit3, LogOut as LogoutIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, logout } = useAuth(); 
  const { cart } = useCart();
  const router = useRouter(); // <--- 2. Initialize Router

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  const [openMenu, setOpenMenu] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // <--- 3. Search State

  // --- Search Handler ---
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
       router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("http://localhost:8000/api/header-menu");
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = await res.json();
        setNavItems(data);
      } catch (error) {
        console.error("Menu fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  return (
   <header className="w-full relative z-[1000] bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-center gap-8 px-6 py-4 border-b border-gray-100 container mx-auto">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo/newlogo.png" alt="Papillon Cards" width={100} height={70} className="object-contain" />
        </Link>

        {/* --- SEARCH BAR SECTION --- */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch} // <--- Triggers on Enter Key
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 px-4 pl-10 focus:border-[#66A3A3] focus:ring-1 focus:ring-[#66A3A3] focus:bg-white focus:outline-none transition-all"
            />
            {/* Search Icon inside Input */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
               <Search size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
           
          {/* --- AUTHENTICATION LOGIC --- */}
          {user ? (
            <div className="relative group flex flex-col items-center cursor-pointer">

              {/* TOP ICON + NAME */}
              <div className="flex flex-col items-center gap-1 transition-all duration-200 hover:text-[#66A3A3]">
                <User size={20} />
                <span className="hidden md:inline text-xs font-semibold text-[#66A3A3]">
                  {user.name || "My Account"}
                </span>
              </div>

              {/* DROPDOWN MENU */}
              <div className="absolute right-0 top-8 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">

                <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden">

                  {/* USER INFO HEADER */}
                  <div className="px-5 py-4 bg-gradient-to-r from-[#66A3A3] to-[#4f8383] text-white">
                    <p className="text-[11px] uppercase tracking-wide opacity-90">Signed in as</p>
                    <p className="font-semibold truncate">{user.email}</p>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="py-2">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <UserIcon size={16} className="text-[#66A3A3]" />
                      My Profile
                    </Link>

                    <Link
                      href="/account/orders"
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <ShoppingBag size={16} className="text-[#66A3A3]" />
                      Order History
                    </Link>

                    <Link
                      href="/account/edit"
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Edit3 size={16} className="text-[#66A3A3]" />
                      Edit Profile
                    </Link>
                  </div>

                  {/* LOGOUT BUTTON */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                  >
                    <LogoutIcon size={16} />
                    Sign Out
                  </button>

                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex flex-col items-center gap-1 hover:text-[#66A3A3] transition"
            >
              <User size={20} />
              <span className="hidden md:inline text-xs">Sign In</span>
            </Link>
          )}

           <Link href="/cart" className="relative flex flex-col items-center gap-1 hover:text-[#66A3A3] transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#66A3A3] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:inline text-xs">Cart</span>
           </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="container mx-auto flex items-center justify-center gap-8 min-h-[55px]">
          {loading ? (
            <div className="flex gap-8 animate-pulse">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ) : (
            navItems.map((item) => (
              <div
                key={item.title}
                className="group static"
                onMouseEnter={() => setOpenMenu(item.title)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link 
                  href={`/category/${item.slug}`} 
                  className={`py-4 text-sm font-semibold tracking-wide transition-colors border-b-2 border-transparent hover:text-[#66A3A3] inline-block ${openMenu === item.title ? 'text-[#66A3A3] border-[#66A3A3]' : 'text-gray-700'}`}
                >
                  {item.title}
                </Link>

                {/* Mega Menu Dropdown */}
                {openMenu === item.title && item.submenu && (
                  <div className="absolute left-0 top-44 w-full bg-white shadow-xl border-t border-gray-100 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto px-6 py-10">
                      <div className="grid grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: Popular */}
                        <div className="col-span-2 border-r border-gray-100 pr-6">
                          <h4 className="font-bold text-[#66A3A3] mb-6 text-xs uppercase tracking-wider">
                            Popular
                          </h4>
                          <ul className="space-y-4">
                           {[
                              // ✅ ADDED SLUGS HERE
                              { label: "Birthday Cards", slug: "birthday", icon: faBirthdayCake },
                              { label: "Birthday Gifts", slug: "gifts-gift-occasions-birthday", icon: faGift },
                              { label: "Birthday Balloons", slug: "gifts-browse-by-category-balloons", icon: faStar },
                            ].map((c) => (
                              <li key={c.label}>
                                <Link
                                  href={`/category/${c.slug}`} // ✅ UPDATED LINK
                                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#66A3A3] transition-colors group/link"
                                >
                                  <span className="flex-none w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover/link:bg-[#f0fcfc] transition-colors text-[#66A3A3]">
                                    <FontAwesomeIcon icon={c.icon} className="w-3.5 h-3.5" />
                                  </span>
                                  <span className="font-medium">{c.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* MIDDLE COLUMN: Dynamic Links */}
                        <div className="col-span-7 px-4">
                          <div className={`grid gap-x-6 gap-y-10 ${item.submenu.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                            {item.submenu.map((group) => (
                              <div key={group.heading} className="space-y-4">
                                <Link 
                                  href={`/category/${group.slug}`}
                                  className="block font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 mb-3 hover:text-[#66A3A3] transition-colors line-clamp-1"
                                >
                                  {group.heading}
                                </Link>
                                <ul className="space-y-2.5">
                                  {Array.isArray(group.links) && group.links.map((linkName, idx) => {
                                    const correctSlug = group.slugs && group.slugs[idx] ? group.slugs[idx] : '#';
                                    return (
                                      <li key={idx}>
                                        <Link
                                          href={`/category/${correctSlug}`}
                                          className="text-[13px] text-gray-500 hover:text-[#66A3A3] hover:translate-x-1 transition-all flex items-center gap-2"
                                        >
                                           <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                           <span className="line-clamp-1">{linkName}</span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Promo Images */}
                        <div className="col-span-3 pl-6 border-l border-gray-100">
                          <div className="space-y-6">
                            {item.images?.map((imgGroup, i) => (
                              <div
                                key={i}
                                className={`rounded-xl p-5 text-center ${imgGroup.bg || 'bg-gray-50'}`}
                              >
                                {imgGroup.items ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    {imgGroup.items.map((img, idx) => (
                                      <div key={idx} className="flex flex-col items-center">
                                        <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-lg">
                                           <Image
                                            src={img.src}
                                            alt={img.title}
                                            fill
                                            unoptimized={true}
                                            className="object-contain hover:scale-105 transition-transform"
                                          />
                                        </div>
                                        <h5 className="font-semibold text-gray-800 text-xs mb-2">{img.title}</h5>
                                        <button className="text-[10px] font-bold uppercase tracking-wide text-[#66A3A3] hover:underline">
                                          {img.button}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div className="relative w-full h-32 mb-4 overflow-hidden rounded-lg">
                                       <Image
                                          src={imgGroup.src}
                                          alt={imgGroup.title}
                                          fill
                                          unoptimized={true}
                                          className="object-contain hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h5 className="font-bold text-gray-800 text-sm mb-2">{imgGroup.title}</h5>
                                    <button className="px-5 py-2 bg-[#66A3A3] text-white rounded-full text-xs font-bold hover:bg-[#558b8b] transition-colors shadow-sm">
                                      {imgGroup.button}
                                    </button>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </nav>
      {/* Blue line at bottom of header */}
      <div className="bg-thirdcolor text-white text-center py-2 text-base font-medium">
        Same day dispatch on all orders before 12pm
      </div>
    </header>
  );
}
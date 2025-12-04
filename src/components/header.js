"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, User } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGift,
  faBirthdayCake,
  faBoxOpen,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/context/CartContext";



export default function Header() {

const { cart } = useCart();
const cartCount = cart.reduce((a, b) => a + b.qty, 0);


  const [openMenu, setOpenMenu] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("https://papillondashboard.devshop.site/api/header-menu");
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
      <div className="flex items-center justify-between gap-8 px-6 py-4 border-b border-gray-100 container mx-auto">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo/headerlogo.png" alt="Papillon Cards" width={100} height={70} className="object-contain" />
        </Link>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Cards"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 px-4 pl-10 focus:border-[#66A3A3] focus:ring-1 focus:ring-[#66A3A3] focus:bg-white focus:outline-none transition-all"
            />
            <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <button className="flex flex-col items-center gap-1 hover:text-[#66A3A3] transition-colors">
            <User size={20} /> <span className="hidden md:inline text-xs">Sign in</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-[#66A3A3] transition-colors">
            <Heart size={20} /> <span className="hidden md:inline text-xs">Saved</span>
          </button>
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
                {/* --- LEVEL 1 LINK (Main Menu) --- */}
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
                              { label: "Birthday Cards", icon: faBirthdayCake },
                              { label: "Birthday Gifts", icon: faGift },
                              { label: "Birthday Balloons", icon: faStar },
                            ].map((c) => (
                              <li key={c.label}>
                                <Link
                                  href="#"
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
                          
                          {/* FIX: Dynamic Grid Columns 
                              If we have 4+ groups (like Gifts), use 4 columns.
                              Otherwise use 3 columns (like Birthday).
                          */}
                          <div className={`grid gap-x-6 gap-y-10 ${item.submenu.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                            
                            {item.submenu.map((group) => (
                              <div key={group.heading} className="space-y-4">
                                
                                {/* --- LEVEL 2 LINK (Headings like 'For Him') --- */}
                                <Link 
                                  href={`/category/${group.slug}`}
                                  className="block font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 mb-3 hover:text-[#66A3A3] transition-colors line-clamp-1"
                                >
                                  {group.heading}
                                </Link>

                                <ul className="space-y-2.5">
                                  {/* --- LEVEL 3 LINKS (Items like 'Brother') --- */}
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
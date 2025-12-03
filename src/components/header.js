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

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/header-menu");
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
          <button className="relative flex flex-col items-center gap-1 hover:text-[#66A3A3] transition-colors">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-[#66A3A3] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
            <span className="hidden md:inline text-xs">Cart</span>
          </button>
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
                className="group static" // 'static' is needed for the full-width dropdown
                onMouseEnter={() => setOpenMenu(item.title)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className={`py-4 text-sm font-semibold tracking-wide transition-colors border-b-2 border-transparent hover:text-[#66A3A3] ${openMenu === item.title ? 'text-[#66A3A3] border-[#66A3A3]' : 'text-gray-700'}`}>
                  {item.title}
                </button>

                {/* Mega Menu Dropdown */}
                {openMenu === item.title && item.submenu && (
                  <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto px-6 py-10">
                      <div className="grid grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: Popular (Fixed width: 2 cols) */}
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

                        {/* MIDDLE COLUMN: Dynamic Links (Flexible width: 7 cols) */}
                        <div className="col-span-7 px-4">
                          <div className="grid grid-cols-3 gap-x-8 gap-y-10">
                            {item.submenu.map((group) => (
                              <div key={group.heading} className="space-y-4">
                                <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 mb-3">
                                  {group.heading}
                                </h4>
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
                                          {linkName}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Promo Images (Fixed width: 3 cols) */}
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
    </header>
  );
}
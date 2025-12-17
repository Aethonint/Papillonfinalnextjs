"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import DynamicThumbnail from "@/components/DynamicThumbnail";

export default function ProductGrid({ initialProducts, categorySlug }) {
  // 1. STATE
  // Load the first 12 items passed from the server
  const [products, setProducts] = useState(initialProducts.data || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!initialProducts.next_page_url);
  const [loading, setLoading] = useState(false);

  // 2. INFINITE SCROLL OBSERVER
  const observer = useRef();
  
  // This callback attaches to the LAST element in the list
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      // If last element is visible AND we have more pages...
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // Increment page count
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // 3. FETCH NEXT PAGE
  useEffect(() => {
    if (page === 1) return; // Skip first load (server handled it)

    const fetchMore = async () => {
      setLoading(true);
      try {
        // ✅ Make sure this URL matches your API environment (localhost vs production)

        const res = await fetch(`https://papillondashboard.devshop.site/api/products/category/${categorySlug}?page=${page}`);
        const data = await res.json();
        
        const newProducts = data.products.data;
        const nextPageUrl = data.products.next_page_url;

        // Append new products to the existing list
        setProducts(prev => [...prev, ...newProducts]);
        setHasMore(!!nextPageUrl);
      } catch (err) {
        console.error("Error fetching more products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMore();
  }, [page, categorySlug]);

  // 4. RENDER GRID
  if (products.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <h3 className="text-xl font-bold text-gray-400 mt-4">No products found here yet.</h3>
             <p className="text-gray-400">We are adding new designs soon!</p>
          </div>
      );
  }

  return (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => {
              
              // --- LOGIC MOVED FROM PAGE.JS ---
              const frontSlide = product.design_data?.slides?.front;
              
              // ✅ MERGE ZONES LOGIC
              const staticZones = frontSlide?.static_zones || [];
              const dynamicZones = frontSlide?.dynamic_zones || [];
              const allZones = [...staticZones, ...dynamicZones];

              const thumbnailProps = {
                  id: product.id,
                  sku: product.sku,
                  title: product.title,
                  thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
                  canvas_settings: product.canvas_settings,
                  preview_zones: allZones 
              };

              // Check if this is the last element to attach the Scroll Observer
              const isLastElement = products.length === index + 1;

              return (
                <Link 
                  ref={isLastElement ? lastElementRef : null} // ⚡️ Trigger fetch when visible
                  href={`/product/${product.sku}`} 
                  key={`${product.id}-${index}`} // Composite key for safety
                  className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD]"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                       <DynamicThumbnail product={thumbnailProps} />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
                      <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        {product.type === 'fixed' ? 'View Details' : 'Personalize'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#66A3A3] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-500 mt-1">From £{product.price}</p>
                  </div>
                </Link>
              );
            })}
        </div>
        
        {/* LOADING SPINNER FOR NEXT PAGE */}
        {loading && (
            <div className="py-12 flex justify-center w-full">
               <div className="w-10 h-10 border-4 border-[#9DCDCD] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
        
        {/* END OF LIST MESSAGE */}
        {!hasMore && products.length > 0 && (
             <div className="py-12 text-center text-zinc-400 text-sm font-medium tracking-wide uppercase">
                — End of Collection —
             </div>
        )}
    </div>
  );
}
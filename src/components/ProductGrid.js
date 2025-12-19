"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import DynamicThumbnail from "@/components/DynamicThumbnail";

export default function ProductGrid({ initialProducts, apiEndpoint, subCategories }) {
  // --- STATE ---
  const [products, setProducts] = useState(initialProducts.data || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!initialProducts.next_page_url);
  const [loading, setLoading] = useState(false);
  
  // ✅ NEW: Filter State
  const [activeFilter, setActiveFilter] = useState(null); // null means "All"
  const [currentEndpoint, setCurrentEndpoint] = useState(apiEndpoint);

  // --- FILTER CLICK HANDLER ---
  const handleFilterClick = async (subCatSlug) => {
      // 1. If user clicks the active filter again, turn it OFF (go back to All)
      if (activeFilter === subCatSlug) {
          setActiveFilter(null);
          setCurrentEndpoint(apiEndpoint); // Reset URL to parent category
          await reloadProducts(apiEndpoint);
      } 
      // 2. If user clicks a new filter, turn it ON
      else {
          setActiveFilter(subCatSlug);
          // Build the new URL for the sub-category


          const newUrl = `https://papillondashboard.devshop.site/api/products/category/${subCatSlug}`;
          setCurrentEndpoint(newUrl);
          await reloadProducts(newUrl);
      }
  };

  // Helper function: Wipes the current list and fetches Page 1 of the new category
  const reloadProducts = async (url) => {
      setLoading(true);
      setProducts([]); // Clear list instantly for better UX
      setPage(1); // Reset page count
      try {
          // Fetch Page 1 of the new filter
          const res = await fetch(`${url}?page=1`);
          const data = await res.json();
          const productData = data.products ? data.products : data; 
          
          setProducts(productData.data);
          setHasMore(!!productData.next_page_url);
      } catch (e) {
          console.error("Filter fetch failed", e);
      } finally {
          setLoading(false);
      }
  };

  // --- INFINITE SCROLL OBSERVER ---
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // --- FETCH NEXT PAGE (Infinite Scroll) ---
  useEffect(() => {
    if (page === 1) return; // Skip fetch on page 1 (already handled)

    const fetchMore = async () => {
      setLoading(true);
      try {
        const separator = currentEndpoint.includes('?') ? '&' : '?';
        const res = await fetch(`${currentEndpoint}${separator}page=${page}`);
        const data = await res.json();
        
        const productData = data.products ? data.products : data;
        
        setProducts(prev => [...prev, ...productData.data]);
        setHasMore(!!productData.next_page_url);
      } catch (err) {
        console.error("Error fetching more:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMore();
  }, [page, currentEndpoint]);

  return (
    <div>
        {/* ✅ FILTER BAR (Only shows if subCategories exist) */}
        {subCategories && subCategories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {/* "All" Button */}
                <button
                    onClick={() => handleFilterClick(activeFilter)} // Clicking active resets it
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                        activeFilter === null
                        ? "bg-zinc-800 text-white border-zinc-800"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                >
                    All
                </button>

                {/* Sub-Category Buttons */}
                {subCategories.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => handleFilterClick(sub.slug)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                            activeFilter === sub.slug
                            ? "bg-[#66A3A3] text-white border-[#66A3A3]"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-[#66A3A3]"
                        }`}
                    >
                        {sub.name}
                    </button>
                ))}
            </div>
        )}

        {/* ✅ PRODUCT GRID */}
        {products.length === 0 && !loading ? (
             <div className="py-20 text-center text-zinc-400">
                No products found in this category.
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => {
                  // Merge Zones for Thumbnail
                  const frontSlide = product.design_data?.slides?.front;
                  const allZones = [...(frontSlide?.static_zones || []), ...(frontSlide?.dynamic_zones || [])];
                  
                  const thumbnailProps = {
                      id: product.id,
                      sku: product.sku,
                      title: product.title,
                      thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
                      canvas_settings: product.canvas_settings,
                      preview_zones: allZones 
                  };

                  const isLastElement = products.length === index + 1;

                  return (
                    <Link 
                      ref={isLastElement ? lastElementRef : null}
                      href={`/product/${product.sku}`} 
                      key={`${product.id}-${index}`}
                      className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD]"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                        <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                           <DynamicThumbnail product={thumbnailProps} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#66A3A3] transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-gray-500 mt-1">From £{parseFloat(product.price).toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>
        )}
        
        {/* Loading Spinner */}
        {loading && (
            <div className="py-12 flex justify-center w-full">
               <div className="w-10 h-10 border-4 border-[#9DCDCD] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
    </div>
  );
}
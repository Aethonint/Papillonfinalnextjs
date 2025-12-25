// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
// import DynamicThumbnail from "@/components/DynamicThumbnail";

// export default function ProductGrid({ initialProducts, apiEndpoint, subCategories }) {
//   // --- STATE ---
//   const [products, setProducts] = useState(initialProducts.data || []);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(!!initialProducts.next_page_url);
//   const [loading, setLoading] = useState(false);
  
//   // ✅ NEW: Filter State
//   const [activeFilter, setActiveFilter] = useState(null); // null means "All"
//   const [currentEndpoint, setCurrentEndpoint] = useState(apiEndpoint);

//   // --- FILTER CLICK HANDLER ---
//   const handleFilterClick = async (subCatSlug) => {
//       // 1. If user clicks the active filter again, turn it OFF (go back to All)
//       if (activeFilter === subCatSlug) {
//           setActiveFilter(null);
//           setCurrentEndpoint(apiEndpoint); // Reset URL to parent category
//           await reloadProducts(apiEndpoint);
//       } 
//       // 2. If user clicks a new filter, turn it ON
//       else {
//           setActiveFilter(subCatSlug);
//           // Build the new URL for the sub-category


//           const newUrl = `http://localhost:8000/api/products/category/${subCatSlug}`;
//           setCurrentEndpoint(newUrl);
//           await reloadProducts(newUrl);
//       }
//   };

//   // Helper function: Wipes the current list and fetches Page 1 of the new category
//   const reloadProducts = async (url) => {
//       setLoading(true);
//       setProducts([]); // Clear list instantly for better UX
//       setPage(1); // Reset page count
//       try {
//           // Fetch Page 1 of the new filter
//           const res = await fetch(`${url}?page=1`);
//           const data = await res.json();
//           const productData = data.products ? data.products : data; 
          
//           setProducts(productData.data);
//           setHasMore(!!productData.next_page_url);
//       } catch (e) {
//           console.error("Filter fetch failed", e);
//       } finally {
//           setLoading(false);
//       }
//   };

//   // --- INFINITE SCROLL OBSERVER ---
//   const observer = useRef();
//   const lastElementRef = useCallback(node => {
//     if (loading) return;
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prevPage => prevPage + 1);
//       }
//     });
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore]);

//   // --- FETCH NEXT PAGE (Infinite Scroll) ---
//   useEffect(() => {
//     if (page === 1) return; // Skip fetch on page 1 (already handled)

//     const fetchMore = async () => {
//       setLoading(true);
//       try {
//         const separator = currentEndpoint.includes('?') ? '&' : '?';
//         const res = await fetch(`${currentEndpoint}${separator}page=${page}`);
//         const data = await res.json();
        
//         const productData = data.products ? data.products : data;
        
//         setProducts(prev => [...prev, ...productData.data]);
//         setHasMore(!!productData.next_page_url);
//       } catch (err) {
//         console.error("Error fetching more:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMore();
//   }, [page, currentEndpoint]);

//   return (
//     <div>
//         {/* ✅ FILTER BAR (Only shows if subCategories exist) */}
//         {subCategories && subCategories.length > 0 && (
//             <div className="flex flex-wrap gap-3 mb-8 justify-center">
//                 {/* "All" Button */}
//                 <button
//                     onClick={() => handleFilterClick(activeFilter)} // Clicking active resets it
//                     className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
//                         activeFilter === null
//                         ? "bg-zinc-800 text-white border-zinc-800"
//                         : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
//                     }`}
//                 >
//                     All
//                 </button>

//                 {/* Sub-Category Buttons */}
//                 {subCategories.map((sub) => (
//                     <button
//                         key={sub.id}
//                         onClick={() => handleFilterClick(sub.slug)}
//                         className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
//                             activeFilter === sub.slug
//                             ? "bg-[#66A3A3] text-white border-[#66A3A3]"
//                             : "bg-white text-zinc-600 border-zinc-200 hover:border-[#66A3A3]"
//                         }`}
//                     >
//                         {sub.name}
//                     </button>
//                 ))}
//             </div>
//         )}

//         {/* ✅ PRODUCT GRID */}
//         {products.length === 0 && !loading ? (
//              <div className="py-20 text-center text-zinc-400">
//                 No products found in this category.
//              </div>
//         ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {products.map((product, index) => {
//                   // Merge Zones for Thumbnail
//                   const frontSlide = product.design_data?.slides?.front;
//                   const allZones = [...(frontSlide?.static_zones || []), ...(frontSlide?.dynamic_zones || [])];
                  
//                   const thumbnailProps = {
//                       id: product.id,
//                       sku: product.sku,
//                       title: product.title,
//                       thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
//                       canvas_settings: product.canvas_settings,
//                       preview_zones: allZones 
//                   };

//                   const isLastElement = products.length === index + 1;

//                   return (
//                     <Link 
//                       ref={isLastElement ? lastElementRef : null}
//                       href={`/product/${product.sku}`} 
//                       key={`${product.id}-${index}`}
//                       className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD]"
//                     >
//                       <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
//                         <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
//                            <DynamicThumbnail product={thumbnailProps} />
//                         </div>
//                       </div>
//                       <div className="text-center">
//                         <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#66A3A3] transition-colors line-clamp-1">
//                           {product.title}
//                         </h3>
//                         <p className="text-gray-500 mt-1">From £{parseFloat(product.price).toFixed(2)}</p>
//                       </div>
//                     </Link>
//                   );
//                 })}
//             </div>
//         )}
        
//         {/* Loading Spinner */}
//         {loading && (
//             <div className="py-12 flex justify-center w-full">
//                <div className="w-10 h-10 border-4 border-[#9DCDCD] border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import DynamicThumbnail from "@/components/DynamicThumbnail";

export default function ProductGrid({ initialProducts, apiEndpoint, subCategories }) {
  const [products, setProducts] = useState(initialProducts.data || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!initialProducts.next_page_url);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); 
  const [currentEndpoint, setCurrentEndpoint] = useState(apiEndpoint);

  const handleFilterClick = async (subCatSlug) => {
      if (activeFilter === subCatSlug) {
          setActiveFilter(null);
          setCurrentEndpoint(apiEndpoint);
          await reloadProducts(apiEndpoint);
      } else {
          setActiveFilter(subCatSlug);
          const newUrl = `http://localhost:8000/api/products/category/${subCatSlug}`;
          setCurrentEndpoint(newUrl);
          await reloadProducts(newUrl);
      }
  };

  const reloadProducts = async (url) => {
      setLoading(true);
      setProducts([]); 
      setPage(1);
      try {
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

  useEffect(() => {
    if (page === 1) return;
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
    <div className="w-full max-w-[1600px] mx-auto">
{/* --- LUXURY SEGMENTED FILTER BAR (SINGLE ROW) --- */}
{/* --- ULTRA-PREMIUM HORIZONTAL FILTER NAVIGATION --- */}
{/* --- ELITE MINIMALIST NAVIGATION (BETTER THAN MOONPIG) --- */}
{subCategories && subCategories.length > 0 && (
  <div className="w-full mb-12 mt-4 px-[5px]">
    <div className="flex flex-col items-start">
   

      {/* The Navigation Container */}
      <div className="w-full relative border-b border-zinc-100">
        <div className="flex flex-nowrap items-center gap-x-10 overflow-x-auto no-scrollbar scroll-smooth pb-4">
          
          {/* "All" Design Tab */}
          <button
            onClick={() => handleFilterClick(activeFilter)}
            className="group relative flex-shrink-0 transition-all duration-300"
          >
            <span className={`block text-[12px] font-bold uppercase tracking-[0.2em] mb-2 transition-colors duration-300 ${
              activeFilter === null ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
            }`}>
              All Designs
            </span>
            {/* The Animated Indicator Line */}
            <div className={`absolute bottom-[-1px] left-0 h-[2px] bg-zinc-900 transition-all duration-500 ease-in-out ${
              activeFilter === null ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50"
            }`} />
          </button>

          {/* Sub-Category Tabs */}
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => handleFilterClick(sub.slug)}
              className="group relative flex-shrink-0 transition-all duration-300"
            >
              <span className={`block text-[12px] font-bold uppercase tracking-[0.2em] mb-2 transition-colors duration-300 ${
                activeFilter === sub.slug ? "text-[#66A3A3]" : "text-zinc-400 group-hover:text-zinc-600"
              }`}>
                {sub.name}
              </span>
              {/* The Animated Indicator Line */}
              <div className={`absolute bottom-[-1px] left-0 h-[2px] bg-[#66A3A3] transition-all duration-500 ease-in-out ${
                activeFilter === sub.slug ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50"
              }`} />
            </button>
          ))}
        </div>
      </div>

   
    </div>
  </div>
)}

{/* Optional: Add this to your global CSS or inside a <style> tag to hide scrollbars */}
<style jsx>{`
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>


      {/* --- LUXURY PRODUCT GRID --- */}
  
<div className="w-full" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
  {products.length === 0 && !loading ? (
    <div className="py-40 text-center">
      <p className="text-zinc-400 font-light text-xl tracking-wide italic">Our collection is being curated...</p>
    </div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-5 gap-y-16">
      {products.map((product, index) => {
        const frontSlide = product.design_data?.slides?.front;
        const allZones = [...(frontSlide?.static_zones || []), ...(frontSlide?.dynamic_zones || [])];
        const thumbnailProps = {
          id: product.id, sku: product.sku, title: product.title,
          thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
          canvas_settings: product.canvas_settings,
          preview_zones: allZones
        };
        const isLastElement = products.length === index + 1;

        return (
          <div
            key={`${product.id}-${index}`}
            ref={isLastElement ? lastElementRef : null}
            className="group relative flex flex-col"
          >
            {/* LARGE IMAGE AREA */}
            <Link
              href={`/product/${product.sku}`}
              className="relative w-full aspect-[2/3] bg-white overflow-hidden"
            >
              {/* The "Floating" Product Container */}
             <div className="w-full h-full transition-transform duration-[1.5s] cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110">
                <DynamicThumbnail product={thumbnailProps} />
              </div>


              {/* Sophisticated Hover: Soft Vignette + Minimal Branding */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              
              {/* Top-Right "New" or "Premium" Tag - very small and chic */}
              <div className="absolute top-3 right-3 overflow-hidden">
                 <span className="block text-[8px] font-black tracking-[0.2em] text-zinc-400 uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    Premium Quality
                 </span>
              </div>

              {/* Bottom Action: Floating White Card */}
              <div className="absolute inset-x-4 bottom-4 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <div className="bg-white/95 backdrop-blur-sm py-3 text-center shadow-2xl border border-zinc-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-900">
                    Personalise Now
                  </span>
                </div>
              </div>
            </Link>

            {/* PRODUCT INFO - CLEAN & EDITORIAL */}
            {/* <div className="mt-6 flex flex-col px-1">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[13px] font-bold text-zinc-900 uppercase tracking-tighter leading-tight line-clamp-1 flex-1">
                  {product.title}
                </h3>
                <span className="text-[13px] font-medium text-zinc-900">
                  £{parseFloat(product.price).toFixed(2)}
                </span>
              </div>
              
            
              <div className="mt-2 flex items-center gap-2">
                <span className="h-[1px] w-3 bg-[#66A3A3]" />
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                   Bespoke Design
                </span>
              </div>
            </div> */}
          </div>
        );
      })}
    </div>
  )}
</div>

      
      {/* Infinite Scroll Loader */}
      {loading && (
        <div className="py-24 flex justify-center w-full">
           <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-bounce" />
           </div>
        </div>
      )}
    </div>
  );
}
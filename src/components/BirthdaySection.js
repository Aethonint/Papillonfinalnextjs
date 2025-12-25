// "use client";

// import { useState } from 'react';
// import Link from 'next/link';
// import DynamicThumbnail from '@/components/DynamicThumbnail';

// export default function BirthdaySection({ initialProducts }) {
//   const [products, setProducts] = useState(initialProducts);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [loading, setLoading] = useState(false);

//   // ✅ REMOVED "For Kids" from this list
//   const filters = [
//     { name: "All", slug: "all" },
//     { name: "For Her", slug: "birthday-for-her" },
//     { name: "For Him", slug: "birthday-for-him" },
//     { name: "Special Age", slug: "birthday-milestones" }
//   ];

//   const handleFilterClick = async (slug) => {
//     setActiveFilter(slug);
//     setLoading(true);

//     try {
//       let url = 'https://papillondashboard.devshop.site/api/products/category/birthday';
      
//       // If a specific filter is selected (not 'all'), fetch that sub-category
//       if (slug !== 'all') {
//         url = `https://papillondashboard.devshop.site/api/products/category/${slug}`;
//       }

//       const res = await fetch(url);
//       const data = await res.json();
      
//       // Update the product list (slice to 5 to keep the layout consistent)
//       setProducts(data?.products?.data?.slice(0, 5) || []);
//     } catch (error) {
//       console.error("Error fetching filtered products:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="flex justify-center items-center py-20 bg-white">
//       <div className='flex flex-col justify-start items-center w-full max-w-[1428px] px-4'>
        
//         {/* Header & View All Link */}
//         <div className="w-full flex justify-between items-end mb-6">
//            <h2 className="text-4xl font-black text-black">Cards For Birthday</h2>
//            <Link href="/category/birthday" className="text-[#66A3A3] font-bold hover:underline">View All</Link>
//         </div>

//         {/* Filter Buttons */}
//         <div className="w-full flex flex-wrap gap-3 mb-8">
//            {filters.map((btn, i) => (
//               <button 
//                  key={i} 
//                  onClick={() => handleFilterClick(btn.slug)}
//                  className={`px-6 py-2 rounded-full border font-bold text-sm transition-all ${
//                    activeFilter === btn.slug 
//                    ? "bg-[#66A3A3] text-white border-[#66A3A3] shadow-md" 
//                    : "bg-white text-zinc-700 border-zinc-300 hover:border-[#66A3A3] hover:text-[#66A3A3]"
//                  }`}
//               >
//                  {btn.name}
//               </button>
//            ))}
//         </div>

//         {/* Product Grid */}
//         {loading ? (
//             <div className="py-20 w-full flex justify-center">
//                 <div className="w-10 h-10 border-4 border-[#9DCDCD] border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         ) : (
//           <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full'>
//             {products.length > 0 ? (
//               products.map((product) => {
//                 const frontSlide = product.design_data?.slides?.front;
//                 const thumbnailProps = {
//                     id: product.id, sku: product.sku, title: product.title,
//                     thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
//                     canvas_settings: product.canvas_settings,
//                     preview_zones: frontSlide?.dynamic_zones || [] 
//                 };
//                 const isFixed = product.type === 'fixed';

//                 return (
//                   <Link 
//                     href={`/product/${product.sku}`} 
//                     key={product.id} 
//                     className="group bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD] flex flex-col"
//                   >
//                     <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
//                        <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
//                           <DynamicThumbnail product={thumbnailProps} />
//                        </div>
//                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
//                           <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${isFixed ? "bg-zinc-800 text-white" : "bg-white text-black"}`}>
//                             {isFixed ? "View Details" : "Personalize"}
//                           </span>
//                        </div>
//                     </div>
//                     <div className="text-center mt-auto">
//                        <h3 className="font-bold text-base text-gray-800 line-clamp-1">{product.title}</h3>
//                        <p className="text-sm text-gray-500 mt-1 font-medium">From £{product.price}</p>
//                     </div>
//                   </Link>
//                 );
//               })
//             ) : (
//               <div className="col-span-full text-center py-10 text-gray-400">
//                  No products found.
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }




"use client";

import { useState } from 'react';
import Link from 'next/link';
import DynamicThumbnail from '@/components/DynamicThumbnail';

export default function BirthdaySection({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filters = [
    { name: "All Cards", slug: "all",  },
    { name: "For Her", slug: "birthday-for-her",  },
    { name: "For Him", slug: "birthday-for-him",  },
    { name: "Special Age", slug: "birthday-milestones", }
  ];

  const handleFilterClick = async (slug) => {
    setActiveFilter(slug);
    setLoading(true);

    try {
      let url = 'http://localhost:8000/api/products/category/birthday';
      if (slug !== 'all') {
        url = `http://localhost:8000/api/products/category/${slug}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data?.products?.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center py-16">
      <div className='flex flex-col justify-start items-center w-full max-w-[1428px] px-4'>
        
        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
           <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Cards For Birthday</h2>
           </div>
           <Link 
              href="/category/birthday" 
              className="group flex items-center gap-2 text-white font-bold bg-[#fca1a8] px-5 py-3 shadow-sm transition-all rounded-lg"
            >
              View All 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
           </Link>
        </div>

        {/* Enhanced Filter Bar */}
        <div className="w-full mb-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 p-1.5 bg-zinc-100/80 backdrop-blur-sm rounded-2xl w-fit mx-auto md:mx-0 border border-zinc-200">
            {filters.map((btn, i) => (
              <button 
                key={i} 
                onClick={() => handleFilterClick(btn.slug)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeFilter === btn.slug 
                  ? "bg-white text-[#66A3A3] shadow-sm scale-100" 
                  : "bg-transparent text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
                }`}
              >
                <span>{btn.emoji}</span>
                {btn.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 w-full flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#9DCDCD]/20 border-t-[#66A3A3] rounded-full animate-spin"></div>
              <p className="text-zinc-400 font-medium animate-pulse">Refreshing collection...</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full'>
            {products.length > 0 ? (
              products.map((product) => {
                const frontSlide = product.design_data?.slides?.front;
                const thumbnailProps = {
                    id: product.id, sku: product.sku, title: product.title,
                    thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
                    canvas_settings: product.canvas_settings,
                    preview_zones: frontSlide?.dynamic_zones || [] 
                };
                const isFixed = product.type === 'fixed';

                return (
                  <Link 
                    href={`/product/${product.sku}`} 
                    key={product.id} 
                    className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-zinc-100 flex flex-col"
                  >
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-zinc-50 mb-4">
                       <div className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out">
                          <DynamicThumbnail product={thumbnailProps} />
                       </div>
                       
                       {/* Floating Label */}
                       {!isFixed && (
                         <div className="absolute top-2 right-2">
                            <span className="bg-[#66A3A3] text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-md shadow-lg">Editable</span>
                         </div>
                       )}

                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                          <span className={`text-xs font-bold px-5 py-2 rounded-full shadow-2xl backdrop-blur-md ${isFixed ? "bg-zinc-900/90 text-white" : "bg-white/90 text-black"}`}>
                            {isFixed ? "View Details" : "Personalize Now"}
                          </span>
                       </div>
                    </div>

                    <div className="text-center mt-auto px-1 pb-2">
                       <h3 className="font-bold text-zinc-800 text-sm md:text-base line-clamp-1 group-hover:text-[#66A3A3] transition-colors">{product.title}</h3>
                       <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="text-sm font-bold text-zinc-900">£{product.price}</span>
                       </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                  <p className="text-zinc-400 font-medium italic">No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
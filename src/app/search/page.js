import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// 1. IMPORT YOUR COMPONENT (Same as Category Page)
import DynamicThumbnail from "@/components/DynamicThumbnail"; 

// Function to fetch search results from your Laravel API
async function getSearchResults(query) {
  try {
    // We use the same API endpoint we fixed earlier



    const res = await fetch(`http://localhost:8000/api/products?search=${query}`, {
      cache: "no-store", 
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching search results:", error);
    return null;
  }
}

export default async function SearchPage({ searchParams }) {
  // Fix for Next.js 15: Await searchParams
  const { q } = await searchParams;
  
  // If no query, just return empty
  if (!q) return null;

  const data = await getSearchResults(q);
  
  // Handle Laravel Pagination (data.data) or simple array
  const productList = data?.data || [];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800 pb-20">
      
      {/* 1. Search Header (Styled like Category Header) */}
      <div className="bg-[#9DCDCD] text-white py-12 md:py-16 relative overflow-hidden shadow-md">
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black capitalize tracking-tight mb-2">
               Search Results
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Showing results for <span className="font-bold underline">&quot;{q}&quot;</span>
            </p>
        </div>
        
        {/* Decorative Background Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#66A3A3] opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      </div>

      {/* 2. Breadcrumb / Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#66A3A3] transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>

      {/* 3. Product Grid (EXACT COPY OF CATEGORY LOGIC) */}
      <div className="container mx-auto px-4">
        {productList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productList.map((product) => {
              
              // 2. PREPARE PROPS FOR DYNAMIC THUMBNAIL
              const frontSlide = product.design_data?.slides?.front;
              
              // ✅ Merge Static + Dynamic Zones (Same as Category Page)
              const staticZones = frontSlide?.static_zones || [];
              const dynamicZones = frontSlide?.dynamic_zones || [];
              const allZones = [...staticZones, ...dynamicZones];

              const thumbnailProps = {
                  id: product.id,
                  sku: product.sku,
                  title: product.title, // or product.name depending on API
                  // Use front background if available, else thumbnail, else placeholder
                  thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
                  canvas_settings: product.canvas_settings,
                  
                  // ✅ PASS THE MERGED ZONES HERE
                  preview_zones: allZones 
              };

              return (
                <Link 
                  href={`/product/${product.sku}`} 
                  key={product.id}
                  className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD]"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                    
                    {/* 3. REPLACE STATIC IMAGE WITH DYNAMIC THUMBNAIL */}
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                       <DynamicThumbnail product={thumbnailProps} />
                    </div>
                    
                    {/* Quick Action Button */}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <ArrowLeft size={24} />
             </div>
            <h3 className="text-xl font-bold text-gray-400">No cards found for &quot;{q}&quot;</h3>
             <p className="text-gray-400 mb-6">Try checking your spelling or use a different keyword.</p>
             <Link href="/" className="px-6 py-2 bg-[#66A3A3] text-white rounded-full font-bold hover:bg-[#558b8b] transition-colors">
               Browse All Categories
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
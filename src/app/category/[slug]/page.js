import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// 1. IMPORT YOUR COMPONENT
import DynamicThumbnail from "@/components/DynamicThumbnail"; 

// Function to fetch data from your Laravel API
async function getCategoryProducts(slug) {
  try {
    const res = await fetch(`https://papillondashboard.devshop.site/api/products/category/${slug}`, {
      cache: "no-store", 
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export default async function CategoryPage({ params }) {
  // Fix for Next.js 15: Await params
  const { slug } = await params;

  const data = await getCategoryProducts(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <h1 className="text-2xl font-bold text-gray-800">Category Not Found</h1>
        <Link href="/" className="text-[#66A3A3] hover:underline mt-4">
          Return Home
        </Link>
      </div>
    );
  }

  const { category, products } = data;
  const productList = products.data || []; 

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800 pb-20">
      
      {/* 1. Category Header */}
      <div className="bg-[#9DCDCD] text-white py-12 md:py-20 relative overflow-hidden shadow-md">
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black capitalize tracking-tight mb-4">
            {category.name}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {category.description || `Discover our unique collection of ${category.name} cards.`}
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

      {/* 3. Product Grid */}
      <div className="container mx-auto px-4">
        {productList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productList.map((product) => {
              
              // 2. PREPARE PROPS FOR DYNAMIC THUMBNAIL
              const frontSlide = product.design_data?.slides?.front;
              
              // ✅ CRITICAL UPDATE: Merge Static + Dynamic Zones
              // This grabs the static text (like "Merry Christmas") AND dynamic placeholders
              const staticZones = frontSlide?.static_zones || [];
              const dynamicZones = frontSlide?.dynamic_zones || [];
              const allZones = [...staticZones, ...dynamicZones];

              const thumbnailProps = {
                  id: product.id,
                  sku: product.sku,
                  title: product.title,
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
             <h3 className="text-xl font-bold text-gray-400 mt-4">No products found here yet.</h3>
             <p className="text-gray-400">We are adding new designs to {category.name} soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
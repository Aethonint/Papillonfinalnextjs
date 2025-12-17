import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// ✅ IMPORT THE NEW GRID COMPONENT
import ProductGrid from "@/components/ProductGrid"; 

// Function to fetch data from your Laravel API (Server Side)
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

  // 1. Fetch initial data (Page 1 only)
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

      {/* 3. Product Grid (Client Component for Lazy Loading) */}
      <div className="container mx-auto px-4">
          <ProductGrid 
            initialProducts={products} 
            categorySlug={slug} 
          />
      </div>
    </div>
  );
}
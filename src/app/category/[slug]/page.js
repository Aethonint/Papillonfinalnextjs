// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import ProductGrid from "@/components/ProductGrid"; 

// // Function to fetch data from your Laravel API
// async function getCategoryProducts(slug) {
//   try {


//     const res = await fetch(`https://papillondashboard.devshop.site/api/products/category/${slug}`, {
//       cache: "no-store", 
//     });

//     if (!res.ok) return null;

//     return res.json();
//   } catch (error) {
//     console.error("Error fetching category:", error);
//     return null;
//   }
// }

// export default async function CategoryPage({ params }) {
//   const { slug } = await params;
//   const data = await getCategoryProducts(slug);

//   if (!data) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
//         <h1 className="text-2xl font-bold text-gray-800">Category Not Found</h1>
//         <Link href="/" className="text-[#66A3A3] hover:underline mt-4">
//           Return Home
//         </Link>
//       </div>
//     );
//   }

//   // ✅ Extract sub_categories from the API response
//   const { category, products, sub_categories } = data; 

//   return (
//     <div className="min-h-screen bg-stone-50 font-sans text-slate-800 pb-20">
      
//       {/* 1. Category Header */}
//       <div className="bg-[#9DCDCD] text-white py-12 md:py-20 relative overflow-hidden shadow-md">
//         <div className="container mx-auto px-4 relative z-10 text-center">
//             <h1 className="text-4xl md:text-6xl font-black capitalize tracking-tight mb-4">
//             {category.name}
//             </h1>
//             <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
//             {category.description || `Discover our unique collection of ${category.name} cards.`}
//             </p>
//         </div>
//         <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#66A3A3] opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
//       </div>

//       {/* 2. Breadcrumb */}
//       <div className="container mx-auto px-4 py-6">
//         <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#66A3A3] transition-colors">
//           <ArrowLeft size={16} className="mr-2" /> Back to Home
//         </Link>
//       </div>

//       {/* 3. Product Grid */}
//       <div className="container mx-auto px-4">
//           <ProductGrid 
//             initialProducts={products} 
//             // ✅ Pass the default endpoint for the parent category


//             apiEndpoint={`https://papillondashboard.devshop.site/api/products/category/${slug}`}
//             // ✅ Pass the filters (sub-categories) we got from the API
//             subCategories={sub_categories || []} 
//           />
//       </div>
//     </div>
//   );
// }



import Link from "next/link";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

async function getCategoryProducts(slug) {
  try {
    const res = await fetch(`http://localhost:8000/api/products/category/${slug}`, {
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
  const { slug } = await params;
  const data = await getCategoryProducts(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
          <ArrowLeft className="text-zinc-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Category Not Found</h1>
        <Link href="/" className="bg-[#66A3A3] text-white px-8 py-3 rounded-full mt-6 shadow-lg hover:bg-[#558a8a] transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  const { category, products, sub_categories } = data;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 pb-20">
      
      {/* 1. Premium Hero Header */}
      <div className="relative bg-[#9DCDCD] overflow-hidden border-b border-[#8bbdbd]">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#66A3A3]/20 rotate-12 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
              Exclusive Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white capitalize tracking-tighter mb-6 drop-shadow-sm">
              {category.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
              {category.description || `Browse our handpicked selection of premium ${category.name} cards, designed to make every moment memorable.`}
            </p>
          </div>
        </div>

        {/* Wave or Curve bottom effect (Optional) */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#FDFDFD] to-transparent opacity-40"></div>
      </div>

      {/* 2. Sleek Navigation Bar (Breadcrumbs) */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm font-bold">
            <Link href="/" className="text-zinc-400 hover:text-[#66A3A3] transition-colors p-1">
              <Home size={18} />
            </Link>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-[#66A3A3] capitalize tracking-wide">{category.name}</span>
          </nav>
          
          <div className="hidden md:flex items-center gap-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
            <span>{products?.data?.length || 0} Products Found</span>
          </div>
        </div>
      </div>

      {/* 3. Product Content Area */}
      <main className="container mx-auto px-6 mt-12">
     

        <div className="relative">
          <ProductGrid 
            initialProducts={products} 
            apiEndpoint={`http://localhost:8000/api/products/category/${slug}`}
            subCategories={sub_categories || []} 
          />
        </div>
      </main>

    </div>
  );
}
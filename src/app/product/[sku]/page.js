"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DynamicThumbnail from "@/components/DynamicThumbnail";
import { useCart } from "@/context/CartContext"; 

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery State
  const [activeView, setActiveView] = useState("front");
  
  // Quantity State (Default 1)
  const [quantity, setQuantity] = useState(1);
  
  // Cart Hook
  const { addToCart } = useCart();

  useEffect(() => {
    const sku = params.sku;
    if (!sku) return;




    fetch(`http://localhost:8000/api/product/${sku}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [params.sku]);

  // --- HANDLER: Add Fixed Product Directly to Cart ---
  const handleAddFixedProduct = () => {
    if (!product) return;

    const frontSlide = product.design_data?.slides?.front;
    const itemImage = frontSlide?.background_url || product.thumbnail_url || '/placeholder.png';

    const cartItem = {
      product_id: product.id,
      sku: product.sku,
      name: product.title, 
      price: parseFloat(product.price),
      qty: quantity,
      image: itemImage,
      personalization_id: null, 
      custom_data: null, 
    };

    addToCart(cartItem);
    alert("Added to cart!"); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66A3A3]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-[#66A3A3] underline">Return Home</Link>
      </div>
    );
  }

  // --- PREPARE THUMBNAIL PROPS ---
  const frontSlide = product.design_data?.slides?.front;
  
  // ✅ FIX: Merge Static + Dynamic Zones so ALL text shows up
  const staticZones = frontSlide?.static_zones || [];
  const dynamicZones = frontSlide?.dynamic_zones || [];
  const allZones = [...staticZones, ...dynamicZones];

  const thumbnailProps = {
      id: product.id,
      sku: product.sku,
      title: product.title,
      thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
      canvas_settings: product.canvas_settings,
      // Pass merged zones
      preview_zones: allZones 
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="bg-[#F0F7F7] p-8 lg:p-10 flex flex-col items-center justify-center min-h-[600px] relative">
             <Link 
                href="/" 
                className="absolute top-6 left-6 text-zinc-500 hover:text-black bg-white/60 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition z-20"
             >
                ← Back
             </Link>

            {/* Main Preview */}
            <div className="relative w-full max-w-[450px] aspect-[3/4] shadow-2xl rounded-lg overflow-hidden bg-white mb-8 transition-all duration-300">
               {activeView === "front" ? (
                 <DynamicThumbnail product={thumbnailProps} />
               ) : (
                 <Image 
                   src={activeView} 
                   alt="Gallery View" 
                   fill 
                   className="object-cover"
                   unoptimized={true}
                 />
               )}
            </div>

            {/* Mini Gallery Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-[450px] justify-center">
                <button
                  onClick={() => setActiveView("front")}
                  className={`relative w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    activeView === "front" ? "border-[#66A3A3] ring-2 ring-[#66A3A3]/20" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                   {/* Mini Thumbnail */}
                   <DynamicThumbnail product={thumbnailProps} />
                   <span className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-[10px] py-1 text-center font-bold">Front</span>
                </button>

                {product.gallery_urls?.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveView(url)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      activeView === url ? "border-[#66A3A3] ring-2 ring-[#66A3A3]/20" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={url} alt={`Gallery ${index}`} fill className="object-cover" unoptimized={true} />
                  </button>
                ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Actions */}
          <div className="p-10 md:p-16 flex flex-col justify-center bg-white relative z-10">
            
            <div className="mb-6">
               <span className={`inline-block px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full ${
                  product.type === 'fixed' ? 'bg-orange-100 text-orange-600' : 'bg-[#E0F2F2] text-[#4A8E8E]'
               }`}>
                  {product.type === 'fixed' ? 'Ready to Ship' : 'Personalised Card'}
               </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-stone-100">
               <span className="text-3xl font-bold text-[#66A3A3]">
                  £{parseFloat(product.price).toFixed(2)}
               </span>
               <span className="text-sm text-zinc-400 font-medium">Includes Envelope</span>
            </div>

            <div className="mb-10 text-zinc-600 leading-relaxed">
              <p>{product.description || "A beautiful high-quality product."}</p>
            </div>

            {/* --- CONDITIONAL ACTION AREA --- */}
            <div className="mt-auto">
                
                {product.type === 'fixed' ? (
                  // === FIXED PRODUCT (Quantity + Add to Cart) ===
                  <div className="flex flex-col gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-700">Quantity:</span>
                        <div className="flex items-center border border-zinc-300 rounded-lg">
                            <button 
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-lg"
                            >-</button>
                            <span className="w-10 text-center font-bold">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-lg"
                            >+</button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddFixedProduct}
                      className="w-full py-5 px-6 bg-black hover:bg-zinc-800 text-white font-bold text-lg rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                      <span>🛒</span> Add to Cart - £{(parseFloat(product.price) * quantity).toFixed(2)}
                    </button>
                  </div>

                ) : (
                  // === CUSTOMIZABLE PRODUCT (Personalize Button) ===
                  <button
                    onClick={() => router.push(`/editor/${product.sku}`)}
                    className="w-full py-5 px-6 bg-[#66A3A3] hover:bg-[#558b8b] text-white font-bold text-lg rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <span></span> Personalize This Card
                  </button>
                )}

                <div className="flex items-center justify-center gap-6 pt-6 text-xs text-zinc-400">
                   <span> Fast Delivery</span>
                   <span> Secure Payment</span>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
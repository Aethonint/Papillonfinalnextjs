"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReadOnlyCard from "@/components/ReadOnlyCard";
import { useCart } from "@/context/CartContext"; 

export default function PreviewPage() {
  const { addToCart } = useCart(); 
  const params = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [userStyles, setUserStyles] = useState({});
  const [viewState, setViewState] = useState('front');
  
  const [checks, setChecks] = useState({ spelling: false, layout: false });
  const [envelope, setEnvelope] = useState('white'); 

  useEffect(() => {
    if (!params.sku) return;
    
    // Fetch product details
    fetch(`http://localhost:8000/api/product/${params.sku}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(err => console.error("Failed to load product", err));

    // Load draft
    const savedDraft = localStorage.getItem(`draft_${params.sku}`);
    if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setUserInputs(parsed.inputs || {});
        setUserStyles(parsed.styles || {});
    }
  }, [params.sku]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66A3A3]"></div>
    </div>
  );

  const canCheckout = checks.spelling && checks.layout;

  const handleAddToBasket = () => {
      if (!product) return;

      const basePrice = parseFloat(product.price || "0");
      const envelopePrice = envelope === 'red' ? 0.50 : 0.00;
      const finalPrice = basePrice + envelopePrice;

      const frontSlide = product.design_data?.slides?.front;
      const thumbUrl = frontSlide?.background_url || product.thumbnail_url || '/placeholder.png';

      const cartItem = {
        id: Date.now().toString(),
        product_id: product.id,
        personalization_id: Date.now().toString(),
        sku: product.sku,
        name: product.title,
        price: finalPrice,
        image: thumbUrl,
        qty: 1,
        custom_data: {     
            inputs: userInputs,
            styles: userStyles,
            envelope: envelope
        }
      };

      addToCart(cartItem); 
      localStorage.removeItem(`draft_${params.sku}`);
      router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-zinc-5 py-8 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold text-zinc-900">Review Your Card</h1>
         <button onClick={() => router.back()} className="text-black hover:text-thirdcolor">← Go Back & Edit</button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* INTERACTIVE PREVIEW */}
          <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 flex flex-col items-center">
                  
                  <div className="w-full relative flex justify-center items-center" style={{ minHeight: '500px' }}>
                      <ReadOnlyCard 
                          product={product} 
                          viewState={viewState} 
                          userInputs={userInputs} 
                          userStyles={userStyles} 
                      />
                  </div>

                  <div className="flex gap-4 mt-8">
                      <button onClick={() => setViewState('front')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewState==='front' ? 'bg-thirdcolor text-white' : 'bg-zinc-100 text-zinc-600'}`}>Front</button>
                      <button onClick={() => setViewState('inner')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewState==='inner' ? 'bg-thirdcolor text-white' : 'bg-zinc-100 text-zinc-600'}`}>Inside</button>
                      <button onClick={() => setViewState('back')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewState==='back' ? 'bg-thirdcolor text-white' : 'bg-zinc-100 text-zinc-600'}`}>Back</button>
                  </div>
              </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                  <h3 className="font-bold text-lg mb-4">Please Check Carefully</h3>
                  <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-thirdcolor focus:ring-thirdcolor" 
                                 checked={checks.spelling} onChange={(e) => setChecks(prev => ({...prev, spelling: e.target.checked}))} />
                          <span className="text-sm text-zinc-600">I have checked spelling and grammar.</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-thirdcolor focus:ring-thirdcolor" 
                                 checked={checks.layout} onChange={(e) => setChecks(prev => ({...prev, layout: e.target.checked}))} />
                          <span className="text-sm text-zinc-600">I am happy with the photo layout.</span>
                      </label>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 ">
                  <h3 className="font-bold text-lg mb-4">Choose Envelope</h3>
                  <div className="space-y-3">
                      <label className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition ${envelope === 'white' ? 'border-blue-600 bg-blue-50' : 'border-zinc-200'}`}>
                          <div className="flex items-center gap-3">
                              <input type="radio" name="env" checked={envelope === 'white'} onChange={() => setEnvelope('white')} />
                              <span className="text-sm font-medium">Standard White</span>
                          </div>
                          <span className="text-xs font-bold text-green-600">FREE</span>
                      </label>

                      <label className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition ${envelope === 'red' ? 'border-blue-600 bg-blue-50' : 'border-zinc-200'}`}>
                          <div className="flex items-center gap-3">
                              <input type="radio" name="env" checked={envelope === 'red'} onChange={() => setEnvelope('red')} />
                              <div className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full bg-red-600 border border-black/10"></span>
                                  <span className="text-sm font-medium">Premium Red</span>
                              </div>
                          </div>
                          <span className="text-xs font-bold">+ £0.50</span>
                      </label>
                  </div>
              </div>

              <button 
                  disabled={!canCheckout}
                  onClick={handleAddToBasket}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
                      canCheckout 
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20" 
                      : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                  }`}
              >
                  {canCheckout ? "Approve & Add to Basket" : "Approve above to continue"}
              </button>

          </div>
      </div>
    </div>
  );
}
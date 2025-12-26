"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaTruck, FaUser, FaHome, FaBriefcase, FaMobileAlt, FaCheckCircle, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Royal Mail 2nd Class', time: '2–3 Working Days', price: 0 },
  { id: 'express', name: 'Royal Mail 1st Class', time: '1–2 Working Days', price: 1.70 },
  { id: 'next_day', name: 'Royal Mail Special Delivery', time: 'Guaranteed Next Day', price: 5.99 },
];

// --- INTERNAL COMPONENT: Floating Label Input ---
const FloatingInput = ({ label, id, className = "", required = false, ...props }) => {
  return (
    <div className={`relative border-2 border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#66A3A3] focus-within:bg-white transition-colors ${className}`}>
      <label
        htmlFor={id}
        className="absolute top-2 left-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider z-10 pointer-events-none"
      >
        {label} {required && "*"}
      </label>
      <input
        id={id}
        required={required} // ✅ Added required attribute to native input
        {...props}
        className="w-full rounded-xl bg-transparent px-4 pb-3 pt-7 text-gray-900 font-medium outline-none placeholder-transparent"
      />
    </div>
  );
};

export default function DeliveryPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { setShippingAddress, setShippingCost, cart, subtotal } = useCart();

  const [mode, setMode] = useState("self");
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMyDetails, setUseMyDetails] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    country_code: "+44",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    county: "", 
    postcode: "",
    country: "United Kingdom",
    label: "Home"
  });

  const finalTotal = subtotal + selectedDelivery.price;

  // 1. Fetch Saved Addresses
  useEffect(() => {
    async function fetchAddresses() {
      if (!token) return;
      try {
        const res = await fetch("https://papillondashboard.devshop.site/api/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedAddresses(data);
        }
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      } finally {
        setLoadingAddresses(false);
      }
    }
    fetchAddresses();
  }, [token]);

  // 2. Pre-fill Form Logic
  useEffect(() => {
    if (!user) return;

    if (mode === "self") {
      setForm(prev => {
        if (prev.name === (user.name || "") && prev.email === (user.email || "")) {
            return prev;
        }
        return {
            ...prev,
            name: user.name || "",
            email: user.email || "",
        };
      });
      setUseMyDetails(true);
    } else if (mode === "direct") {
      setForm(prev => {
        if (prev.name === "" && prev.email === (user.email || "")) {
            return prev;
        }
        return { 
            ...prev, 
            name: "", 
            email: user.email || "", 
        };
      });
      setUseMyDetails(true);
    }
  }, [mode, user?.name, user?.email]); 

  // Toggle "Use My Email"
  const handleUseMyDetailsChange = (e) => {
    const isChecked = e.target.checked;
    setUseMyDetails(isChecked);

    if (isChecked && user) {
        setForm(prev => ({
            ...prev,
            email: user.email || ""
        }));
    } else {
        setForm(prev => ({
            ...prev,
            email: ""
        }));
    }
  };

  // 3. Auto-Fill Function
  const applySavedAddress = (addr) => {
    setUseMyDetails(false); // Uncheck "Use my details" so we use the saved address info
    
    setForm(prev => ({
      ...prev,
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      // ✅ ROBUST CHECK: Checks county, state, or province
      county: addr.county || addr.state || addr.province || "", 
      postcode: addr.postcode || "",
      name: addr.full_name || prev.name,
      phone: addr.phone || prev.phone,
      email: addr.email || prev.email
    }));
    toast.success("Address applied!");
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 5) value = `${value.slice(0, 5)} ${value.slice(5)}`;
    setForm({ ...form, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ STRICT VALIDATION: Explicitly checking form.county
    if (!form.name || !form.email || !form.line1 || !form.city || !form.postcode || !form.county || !form.phone) {
      toast.error("Please fill in all required fields (including County).");
      setIsSubmitting(false);
      return;
    }

    const dataToSave = {
      ...form,
      delivery_type: mode === "self" ? "to_self" : "direct",
      delivery_option: {
        name: selectedDelivery.name,
        price: selectedDelivery.price
      }
    };

    setShippingAddress(dataToSave);
    setShippingCost(selectedDelivery.price);

    toast.loading("Processing delivery details...", { duration: 1500 });

    setTimeout(() => {
      toast.dismiss();
      toast.success("Proceeding to Payment");
      router.push("/checkout");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- LEFT COLUMN: FORM --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold mb-6 text-zinc-900">Delivery Details</h1>

            {/* Who to send to? */}
            <div className="flex flex-col gap-4 mb-8">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${mode === "self" ? "border-[#66A3A3] bg-[#E0F2F2]" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" name="mode" className="hidden" checked={mode === "self"} onChange={() => setMode("self")} />
                <div className="p-3 bg-white rounded-full shadow-sm text-[#66A3A3]"><FaUser size={20} /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Send it to Yourself</h3>
                  <p className="text-sm text-gray-500">Sent to you so you can add a handwritten touch.</p>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === "self" ? "border-[#66A3A3]" : "border-gray-300"}`}>
                  {mode === "self" && <div className="w-2.5 h-2.5 bg-[#66A3A3] rounded-full"></div>}
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${mode === "direct" ? "border-[#66A3A3] bg-[#E0F2F2]" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" name="mode" className="hidden" checked={mode === "direct"} onChange={() => setMode("direct")} />
                <div className="p-3 bg-white rounded-full shadow-sm text-[#66A3A3]"><FaTruck size={20} /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Send it Directly to Them</h3>
              <p className="text-sm text-gray-500">We&apos;ll get it sorted and posted right to their door.</p>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === "direct" ? "border-[#66A3A3]" : "border-gray-300"}`}>
                  {mode === "direct" && <div className="w-2.5 h-2.5 bg-[#66A3A3] rounded-full"></div>}
                </div>
              </label>
            </div>

            {/* Delivery Speed */}
            <h3 className="font-bold text-lg mb-4">Choose Delivery Speed</h3>
            <div className="flex flex-col gap-3 mb-8">
              {DELIVERY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDelivery.id === option.id ? "border-[#66A3A3] bg-[#E0F2F2]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input type="radio" name="delivery_option" className="hidden" checked={selectedDelivery.id === option.id} onChange={() => setSelectedDelivery(option)} />
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedDelivery.id === option.id ? "border-[#66A3A3]" : "border-gray-300"}`}>
                      {selectedDelivery.id === option.id && <div className="w-2.5 h-2.5 bg-[#66A3A3] rounded-full"></div>}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">{option.name}</h4>
                      <p className="text-xs text-gray-500">{option.time}</p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900">
                    {option.price === 0 ? "FREE" : `£${option.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>

            {/* Saved Addresses */}
            {loadingAddresses && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" size={20} /> Loading saved addresses...
                </div>
            )}
            
            {!loadingAddresses && savedAddresses.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#66A3A3]" /> Select a Saved Address
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => applySavedAddress(addr)}
                      className="min-w-[200px] p-4 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:border-[#66A3A3] hover:bg-[#E0F2F2] transition-all group relative"
                    >
                      <p className="font-bold text-sm text-gray-800 group-hover:text-[#66A3A3] mb-1">{addr.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{addr.line1}</p>
                      <p className="text-xs text-gray-500 mb-1">{addr.city}, {addr.postcode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- ADDRESS FORM --- */}
            <form id="delivery-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="font-bold text-lg">Address Details</h3>
                 {/* Label Icons */}
                 <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map(lbl => (
                        <button key={lbl} type="button" onClick={() => setForm({...form, label: lbl})} className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${form.label === lbl ? "border-[#66A3A3] bg-[#E0F2F2] text-[#66A3A3]" : "border-gray-200 text-gray-400 hover:border-gray-300"}`} title={lbl}>
                            {lbl === 'Home' && <FaHome size={16} />}
                            {lbl === 'Work' && <FaBriefcase size={16} />}
                            {lbl === 'Other' && <FaUser size={16} />}
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Country (Read-only) */}
                <div className="md:col-span-2 relative border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed">
                   <label className="absolute top-2 left-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider z-10 pointer-events-none">Country or Region</label>
                   <div className="w-full rounded-xl bg-transparent px-4 pb-3 pt-7 text-gray-700 font-bold flex justify-between items-center">
                      United Kingdom
                      <FaChevronDown size={12} className="text-gray-400"/>
                   </div>
                </div>

                {/* Full Name */}
                <FloatingInput label="Full Name" id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="md:col-span-2" />

                {/* Address Lines */}
                <FloatingInput label="Street address" id="line1" required value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
                <FloatingInput label="Street address 2 (optional)" id="line2" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} />

                {/* City / County / Postcode Row */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FloatingInput label="City" id="city" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                    
                    {/* ✅ COUNTY FIELD IS REQUIRED HERE */}
                    <FloatingInput label="County" id="county" required value={form.county} onChange={e => setForm({ ...form, county: e.target.value })} />
                    
                    <FloatingInput label="Postcode" id="postcode" required value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
                </div>

                {/* CHECKBOX: USE MY EMAIL */}
                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                    <input 
                        type="checkbox" 
                        id="useMyDetails" 
                        checked={useMyDetails}
                        onChange={handleUseMyDetailsChange}
                        className="w-4 h-4 text-[#66A3A3] focus:ring-[#66A3A3] border-gray-300 rounded cursor-pointer accent-[#66A3A3]"
                    />
                    <label htmlFor="useMyDetails" className="text-sm text-gray-700 cursor-pointer font-medium">
                        Use my contact details (Email)
                    </label>
                </div>

                {/* Email Row */}
                <FloatingInput label="Email address" id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="md:col-span-2" />
                
                {/* Phone Row */}
                <div className="md:col-span-2 relative border-2 border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#66A3A3] focus-within:bg-white transition-colors flex overflow-hidden">
                  <label className="absolute top-2 left-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider z-10 pointer-events-none">
                    Phone number (required)
                  </label>
                  {/* Country Code */}
                  <div className="flex items-center justify-center pl-4 pr-2 pt-7 pb-3 bg-gray-50 border-r border-gray-200">
                    <span className="text-lg mr-2">🇬🇧</span>
                    <span className="text-gray-700 font-bold text-sm">+44</span>
                  </div>
                  {/* Phone Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="07..."
                      required
                      value={form.phone}
                      onChange={handlePhoneChange}
                      className="w-full h-full bg-transparent px-4 pt-7 pb-3 text-gray-900 font-medium outline-none"
                    />
                  </div>
                </div>

              </div>
          <p className="text-xs text-gray-500 mt-2">
  We only use this number if there&apos;s an issue with delivery.
</p>


            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-4">
                <h2 className="text-xl font-bold mb-4 text-zinc-900">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start">
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                {item.image ? ( <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> ) : ( <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div> )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-zinc-800 line-clamp-1">{item.name}</h4>
                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                <p className="text-sm font-medium text-[#66A3A3]">£{item.price}</p>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-gray-500 text-sm">Your cart is empty.</p>}
                </div>

                <div className="h-px bg-gray-100 my-4"></div>

                <div className="space-y-2 text-sm text-zinc-600">
                    <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">Delivery <span className="text-[10px] bg-gray-100 px-1 rounded border border-gray-200">{selectedDelivery.id === 'next_day' ? 'Next Day' : 'Standard'}</span></span>
                        <span className={selectedDelivery.price === 0 ? "text-green-600 font-medium" : "text-zinc-800"}>{selectedDelivery.price === 0 ? "Free" : `£${selectedDelivery.price.toFixed(2)}`}</span>
                    </div>
                </div>

                <div className="h-px bg-gray-100 my-4"></div>

                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-lg text-zinc-900">Total</span>
                    <span className="font-bold text-xl text-[#66A3A3]">£{finalTotal.toFixed(2)}</span>
                </div>

                <button 
                    type="submit" 
                    form="delivery-form" 
                    disabled={isSubmitting} 
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-lg flex justify-between px-6 items-center group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center w-full gap-2">
                            <Loader2 className="animate-spin" /> Processing...
                        </div>
                    ) : (
                        <>
                            <span>Proceed to Pay</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                    )}
                </button>
                
                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                     <FaCheckCircle className="text-green-500"/> Secure Checkout powered by Stripe
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
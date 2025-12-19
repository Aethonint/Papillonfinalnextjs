"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; 
import { FaTruck, FaUser, FaHome, FaBriefcase, FaMobileAlt, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react"; // Import Loader
import toast, { Toaster } from "react-hot-toast"; // Import Toast

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Royal Mail 2nd Class', time: '2–3 Working Days', price: 0 },
  { id: 'express', name: 'Royal Mail 1st Class', time: '1–2 Working Days', price: 1.70 },
  { id: 'next_day', name: 'Royal Mail Special Delivery', time: 'Guaranteed Next Day', price: 5.99 },
];

export default function DeliveryPage() {
  const router = useRouter();
  const { user, token } = useAuth(); 
 const { setShippingAddress, setShippingCost, cart, subtotal } = useCart();
  
  const [mode, setMode] = useState("self"); 
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading State
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
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
        }
    }
    fetchAddresses();
  }, [token]);

  // 2. Pre-fill Form Logic
  useEffect(() => {
    if (mode === "self" && user) {
        setForm(prev => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || user.phone_number || "" 
        }));
    } else if (mode === "direct") {
        setForm(prev => ({ ...prev, name: "", email: "", phone: "" })); 
    }
  }, [mode, user]);

  // 3. Auto-Fill Function
  const applySavedAddress = (addr) => {
    setForm(prev => ({
        ...prev,
        line1: addr.line1,
        line2: addr.line2 || "",
        city: addr.city,
        postcode: addr.postcode,
        name: addr.full_name || prev.name,
        phone: addr.phone || prev.phone, // Auto-fill Phone
        email: addr.email || prev.email   // Auto-fill Email
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

    // Basic Validation
    if (!form.name || !form.email || !form.line1 || !form.city || !form.postcode) {
        toast.error("Please fill in all required fields.");
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

  // Save to Context
    setShippingAddress(dataToSave);
    setShippingCost(selectedDelivery.price); // <--- ADD THIS LINE HERE

    // UX Feedback
    toast.loading("Processing delivery details...", { duration: 1500 });

    // Slight delay to show the loading state, then redirect
    setTimeout(() => {
        toast.dismiss();
        toast.success("Proceeding to Payment");
        router.push("/checkout");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      {/* Toast Notification Container */}
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
                        <div className="p-3 bg-white rounded-full shadow-sm text-[#66A3A3]"><FaUser size={20}/></div>
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
                        <div className="p-3 bg-white rounded-full shadow-sm text-[#66A3A3]"><FaTruck size={20}/></div>
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

                {/* --- SAVED ADDRESSES SECTION --- */}
                {savedAddresses.length > 0 && (
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
                                    
                                    {/* Display Phone on Card */}
                                    {addr.phone && (
                                        <p className="text-[10px] text-[#66A3A3] font-medium flex items-center gap-1">
                                            <FaMobileAlt /> {addr.phone}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Address Form */}
                <form id="delivery-form" onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Address Details</h3>
                    
                    <div className="flex gap-4 mb-4">
                        {['Home', 'Work', 'Other'].map(lbl => (
                            <button key={lbl} type="button" onClick={() => setForm({...form, label: lbl})} className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 transition-all ${form.label === lbl ? "border-[#66A3A3] bg-[#E0F2F2] text-[#66A3A3]" : "border-gray-200 text-gray-500"}`}>
                                {lbl === 'Home' && <FaHome size={20} />}
                                {lbl === 'Work' && <FaBriefcase size={20} />}
                                {lbl === 'Other' && <FaUser size={20} />}
                                <span className="text-xs font-bold mt-1">{lbl}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="col-span-2 p-3 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                        
                        <div className="col-span-2 relative">
                            <input type="text" placeholder="UK Mobile Number (07...)" required value={form.phone} onChange={handlePhoneChange} className="w-full p-3 pl-10 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                            <FaMobileAlt className="absolute left-3 top-3.5 text-gray-400" />
                        </div>

                        <input type="text" placeholder="Address Line 1" required value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} className="col-span-2 p-3 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                        <input type="text" placeholder="Address Line 2 (Optional)" value={form.line2} onChange={e => setForm({...form, line2: e.target.value})} className="col-span-2 p-3 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                        <input type="text" placeholder="City" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="p-3 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                        <input type="text" placeholder="Postcode" required value={form.postcode} onChange={e => setForm({...form, postcode: e.target.value})} className="p-3 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                        <input type="text" value="United Kingdom" readOnly className="col-span-2 p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
                        <input type="email" placeholder="Email for Receipt" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="col-span-2 p-3 border rounded-lg focus:ring-2 ring-[#66A3A3] outline-none" />
                    </div>
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
                    disabled={isSubmitting} // Disable when submitting
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
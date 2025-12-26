"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, Mail, ChevronDown } from "lucide-react";
import { FaMobileAlt } from "react-icons/fa"; 
import AccountSidebar from "@/components/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

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
        {...props}
        className="w-full rounded-xl bg-transparent px-4 pb-3 pt-7 text-gray-900 font-medium outline-none placeholder-transparent"
      />
    </div>
  );
};

export default function AddressBook() {
  // --- AUTH PROTECTION ---
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
    if (!storedToken) {
      router.replace("/auth/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- FORM STATE (Removed 'state') ---
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    country_code: "+44",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    county: "", 
    postcode: "",
    country: "United Kingdom"
  });

  // Fetch Addresses
  useEffect(() => {
    if (!isAuthorized || !token) return;

    const fetchAddresses = async () => {
      try {
        const res = await fetch("https://papillondashboard.devshop.site/api/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setAddresses(await res.json());
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token, isAuthorized]);

  const fetchAddressesManual = async () => {
     try {
        const res = await fetch("https://papillondashboard.devshop.site/api/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setAddresses(await res.json());
      } catch (error) { console.error(error); }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 5) value = `${value.slice(0, 5)} ${value.slice(5)}`;
    setForm({ ...form, phone: value });
  };

  const handleSave = async () => {
    // Validation
    if (!form.full_name || !form.email || !form.line1 || !form.city || !form.postcode) {
      return toast.error("Please fill in all required fields.");
    }

    setSaving(true);
    try {
      const res = await fetch("https://papillondashboard.devshop.site/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to save address");

      toast.success("Address saved successfully!");
      fetchAddressesManual();
      
      // Reset Form
      setForm({ 
        full_name: "", email: "", country_code: "+44", phone: "", 
        line1: "", line2: "", city: "", county: "", postcode: "", 
        country: "United Kingdom" 
      });
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://papillondashboard.devshop.site/api/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Address removed");
        setAddresses(addresses.filter((a) => a.id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="animate-spin text-[#66A3A3]" size={40}/>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <Toaster position="top-center" />
      <AccountSidebar active="address" />

      <main className="col-span-3">
        <div className="bg-gradient-to-r from-[#66A3A3] to-[#4c8d8d] text-white p-8 rounded-3xl shadow mb-10">
          <h1 className="text-3xl font-bold">Address Book</h1>
        </div>

        {/* --- ADD NEW FORM --- */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
            <Plus className="bg-[#E0F2F2] text-[#66A3A3] p-1 rounded-full" size={28} />
            Add New Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Country (Read-only) */}
            <div className="md:col-span-2 relative border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed">
                <label className="absolute top-2 left-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider z-10 pointer-events-none">Country or Region</label>
                <div className="w-full rounded-xl bg-transparent px-4 pb-3 pt-7 text-gray-700 font-bold flex justify-between items-center">
                    United Kingdom
                    <ChevronDown size={14} className="text-gray-400"/>
                </div>
            </div>

            {/* Full Name */}
            <FloatingInput 
                label="Full Name" 
                id="full_name" 
                required 
                value={form.full_name} 
                onChange={(e) => setForm({...form, full_name: e.target.value})} 
                className="md:col-span-2"
            />

            {/* Address Lines */}
            <FloatingInput label="Address Line 1" id="line1" required value={form.line1} onChange={(e) => setForm({...form, line1: e.target.value})} />
            <FloatingInput label="Address Line 2 (Optional)" id="line2" value={form.line2} onChange={(e) => setForm({...form, line2: e.target.value})} />

            {/* City / County / Postcode Grid (3 Columns now) */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingInput label="City" id="city" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
                <FloatingInput label="County" id="county" value={form.county} onChange={(e) => setForm({...form, county: e.target.value})} />
                <FloatingInput label="Postcode" id="postcode" required value={form.postcode} onChange={(e) => setForm({...form, postcode: e.target.value})} />
            </div>

            {/* Email (Full Width) */}
            <FloatingInput 
                label="Email Address" 
                id="email" 
                required 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
                className="md:col-span-2"
            />

            {/* Phone Row */}
            <div className="md:col-span-2 relative border-2 border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#66A3A3] focus-within:bg-white transition-colors flex overflow-hidden">
                <label className="absolute top-2 left-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider z-10 pointer-events-none">
                Phone number
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
                    placeholder="UK Mobile (07...)"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    className="w-full h-full bg-transparent px-4 pt-7 pb-3 text-gray-900 font-medium outline-none"
                />
                </div>
            </div>

            <div className="md:col-span-2 mt-4">
                <button onClick={handleSave} disabled={saving} className="w-full bg-[#66A3A3] text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 hover:bg-[#558b8b] shadow-lg">
                {saving ? <Loader2 className="animate-spin" /> : "Save Address"}
                </button>
            </div>
          </div>
        </div>

        {/* --- SAVED LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
                 <div className="col-span-2 flex justify-center py-10"><Loader2 className="animate-spin text-[#66A3A3]"/></div>
            ) : addresses.map((a) => (
              <div key={a.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start group">
                <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{a.full_name}</h4>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                        <p>{a.line1}</p>
                        {a.line2 && <p>{a.line2}</p>}
                        <p>{a.city}{a.county ? `, ${a.county}` : ""}</p>
                        <p className="font-medium text-gray-800">{a.postcode}</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{a.country}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                        <p className="text-xs text-[#66A3A3] font-medium flex items-center gap-1"><Mail size={12}/> {a.email}</p>
                        {a.phone && <p className="text-xs text-gray-400 flex items-center gap-1"><FaMobileAlt size={12}/> {a.phone}</p>}
                    </div>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"><Trash2 size={20} /></button>
              </div>
            ))}
        </div>

      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Home, Trash2, Plus, MapPin, Loader2, Phone, Mail } from "lucide-react";
import AccountSidebar from "@/components/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function AddressBook() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State (Added email)
  const [form, setForm] = useState({
    full_name: "",
    email: "", // <--- NEW FIELD
    phone: "", 
    line1: "",
    line2: "",
    city: "",
    postcode: ""
  });

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);



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

  const handleSave = async () => {
    // Validate
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
      fetchAddresses();
      
      // Reset Form
      setForm({ full_name: "", email: "", phone: "", line1: "", line2: "", city: "", postcode: "" });
      
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
            
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" placeholder="Name"
                    value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} />
            </div>

            {/* EMAIL FIELD */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" placeholder="email@example.com"
                    value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" placeholder="Optional"
                    value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
            </div>

            {/* ... Address Fields (same as before) ... */}
            <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Address Line 1</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" value={form.line1} onChange={(e) => setForm({...form, line1: e.target.value})} />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Line 2</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" value={form.line2} onChange={(e) => setForm({...form, line2: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">City</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Postcode</label>
                <input className="w-full border p-3 rounded-xl bg-gray-50 outline-none" value={form.postcode} onChange={(e) => setForm({...form, postcode: e.target.value})} />
            </div>

            <div className="col-span-2 mt-4">
                <button onClick={handleSave} disabled={saving} className="w-full bg-[#66A3A3] text-white py-4 rounded-xl font-bold transition">
                {saving ? <Loader2 className="animate-spin mx-auto" /> : "Save Address"}
                </button>
            </div>
          </div>
        </div>

        {/* --- SAVED LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start group">
                <div>
                    <h4 className="font-bold text-gray-900">{a.full_name}</h4>
                    <p className="text-xs text-[#66A3A3] font-medium flex items-center gap-1 mt-1"><Mail size={12}/> {a.email}</p>
                    {a.phone && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Phone size={12}/> {a.phone}</p>}
                    <p className="text-gray-500 text-sm mt-2">{a.line1}, {a.city}, {a.postcode}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
              </div>
            ))}
        </div>

      </main>
    </div>
  );
}
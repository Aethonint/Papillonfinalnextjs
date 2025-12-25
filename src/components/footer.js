"use client";

import { useState } from "react"; // Import useState
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Added Spinner
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast"; // Assuming you have toast installed, otherwise use alert

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // To show success/error text below input

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {






      const res = await fetch("http://localhost:8000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Subscribed successfully!");
        setStatusMsg({ type: 'success', text: "Thanks for subscribing!" });
        setEmail(""); // Clear input
      } else {
        // Handle validation error (e.g. email already exists)
        const errorText = data.errors?.email?.[0] || "Subscription failed.";
        toast.error(errorText);
        setStatusMsg({ type: 'error', text: errorText });
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatusMsg({ type: 'error', text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-white overflow-hidden">

      {/* Top CTA Bar */}
      <div className="flex justify-center items-center bg-[#66A3A3] py-3 px-4">
        <p className="text-white font-semibold text-center text-sm sm:text-base rounded-full bg-white/20 px-6 py-1 shadow-md">
          Order by 2pm for same day dispatch via ROYAL MAIL 1st Class
        </p>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12 relative z-10">

        {/* Logo & About */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Image 
            src="/logo/newlogo.png" 
            alt="Papillon Cards Logo" 
            width={123} 
            height={111} 
            className="object-contain"
          />
          <p className="text-gray-600 text-center md:text-left sm:text-sm">
            Papillon Cards brings unique, personalized cards for every occasion. Discover, create and send happiness!
          </p>
        </div>

       {/* ✅ UPDATED POPULAR LINKS */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-[#66A3A3] text-lg font-bold uppercase">Popular</h3>
          <Link href="/category/birthday" className="hover:text-[#66A3A3] transition">Birthday Cards</Link>
          <Link href="/category/birthday-special-age" className="hover:text-[#66A3A3] transition">Kids Cards</Link>
          <Link href="/category/congratulations-new-home" className="hover:text-[#66A3A3] transition">New Home Cards</Link>
          <Link href="/category/gestural-cards-thank-you-cards" className="hover:text-[#66A3A3] transition">Thank You Cards</Link>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-[#66A3A3] text-lg font-bold uppercase">Useful Links</h3>
          <Link href="/contact-us" className="hover:text-[#66A3A3] transition">Contact</Link>
          <Link href="#" className="hover:text-[#66A3A3] transition">About</Link>
          <Link href="#" className="hover:text-[#66A3A3] transition">Cart</Link>
          <Link href="#" className="hover:text-[#66A3A3] transition">Blog</Link>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[#66A3A3] text-lg font-bold uppercase">Connect With Us</h3>
          {/* Email */}
          <Link href="mailto:hello@papillon.snapchec.com" className="flex items-center gap-3 hover:text-[#66A3A3] transition">
            <div className="w-10 h-10 bg-[#66A3A3]/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-[#66A3A3]" />
            </div>
            <span className="text-gray-700 text-sm sm:text-base break-all">hello@papillon.snapchec.com</span>
          </Link>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2">
            <Link href="#">
              <div className="w-10 h-10 bg-[#66A3A3]/20 rounded-full flex items-center justify-center hover:bg-[#66A3A3] hover:text-white transition">
                <FontAwesomeIcon icon={faFacebook} />
              </div>
            </Link>
            <Link href="#">
              <div className="w-10 h-10 bg-[#66A3A3]/20 rounded-full flex items-center justify-center hover:bg-[#66A3A3] hover:text-white transition">
                <FontAwesomeIcon icon={faInstagram} />
              </div>
            </Link>
          </div>

          {/* Newsletter Signup Form */}
          <div className="mt-4">
            <h4 className="text-[#66A3A3] font-semibold text-sm sm:text-base mb-2">Subscribe Newsletter</h4>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email" 
                className="px-3 py-2 rounded-lg border border-gray-300 hover:border-thirdcolor active:border-thirdcolor w-full transition outline-none focus:ring-1 focus:ring-[#66A3A3]"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#66A3A3] text-white font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? "..." : "Join"}
              </button>
            </form>

            {/* Status Message */}
            {statusMsg && (
                <p className={`text-xs mt-2 ${statusMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {statusMsg.text}
                </p>
            )}

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-thirdcolor text-white text-center py-4 mt-10 font-albert text-sm sm:text-base">
        © 2023 Papillon Cards. All Rights Reserved.
      </div>
    </footer>
  );
}
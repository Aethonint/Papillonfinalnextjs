
"use client";

import Image from "next/image";
import AccountSidebar from "@/components/AccountSidebar";
import { ShieldCheck, Lock, CreditCard, Info } from "lucide-react";

export default function PaymentMethods() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

      <AccountSidebar active="payment" />

      <main className="col-span-3">

        <div className="bg-gradient-to-r from-[#66A3A3] to-[#4c8d8d] text-white p-8 rounded-3xl shadow mb-10">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
        </div>

        <div className="bg-white rounded-3xl shadow p-8 border">
          <h2 className="text-xl font-bold mb-4 text-[#4c8d8d]">Supported Providers</h2>

         

          {/* Stripe */}
          <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border mt-4">
            <Image src="/stripe.png" width={80} height={80} alt="stripe" />
            <div>
              <h3 className="font-bold">Stripe</h3>
              <p className="text-gray-600 text-sm">Trusted worldwide.</p>
            </div>
          </div>

             {/* SECURITY BADGE SECTION */}
        <div className="p-6 bg-[#e9f7f7] rounded-3xl border border-[#66A3A3] shadow-sm flex items-start gap-4 mt-4">
          <ShieldCheck size={32} className="text-[#4c8d8d]" />
          <div>
            <h3 className="text-lg font-bold text-[#4c8d8d]">
              Your Payments Are 100% Protected
            </h3>
            <p className="text-gray-700 text-sm mt-1">
              We never store your payment information. All transactions are processed using highly secure encrypted gateways.
            </p>
          </div>
        </div>

        {/* ADDITIONAL INFO SECTION */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm flex items-start gap-4 mt-4">
          <Info size={28} className="text-[#66A3A3]" />
          <div>
            <h3 className="text-lg font-bold">Why Online Payments?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Online payments help us confirm orders faster and ensure smooth processing of your card purchases.
              
            </p>
          </div>
        </div>

         {/* SMALL ICON ROW */}
        <div className="flex items-center justify-center gap-12 mt-6 opacity-70">
          <Lock size={28} />
          <CreditCard size={28} />
          <ShieldCheck size={28} />
        </div>

        </div>
      </main>
    </div>
  );
}

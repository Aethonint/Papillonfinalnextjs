"use client";

import { useEffect, useState } from "react";
import { 
  Package, Calendar, Loader2, MapPin, CreditCard, Truck, ChevronLeft, ChevronRight 
} from "lucide-react";
import AccountSidebar from "@/components/AccountSidebar";
import { useAuth } from "@/context/AuthContext";

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Orders whenever currentPage changes
  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;
      setLoading(true);

      try {
        // Pass page parameter to API
        const res = await fetch(`http://localhost:8000/api/orders?page=${currentPage}&per_page=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Laravel paginate() returns { data: [...], current_page: 1, last_page: 10, ... }
          setOrders(data.data); 
          setTotalPages(data.last_page);
          setCurrentPage(data.current_page);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token, currentPage]); // dependency on currentPage triggers refetch

  // --- PAGE CHANGE HANDLER ---
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200"; 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <AccountSidebar active="orders" />

      <main className="col-span-3">
        <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold text-[#66A3A3]">My Orders</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#66A3A3]" size={40} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Package size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No orders yet</h3>
          <p className="text-gray-500 mt-2">Looks like you haven&apos;t bought anything yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* --- 1. ORDER HEADER --- */}
                  <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-gray-900">Order #{order.order_number}</span>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(order.status)}`}>
                              {order.status}
                          </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          Placed on {new Date(order.created_at).toLocaleDateString("en-GB", {
                              day: 'numeric', month: 'long', year: 'numeric'
                          })}
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Amount</p>
                      <span className="text-2xl font-bold text-[#66A3A3]">£{order.total_price}</span>
                    </div>
                  </div>

                  {/* --- 2. DETAILS GRID --- */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 text-sm text-gray-600 border-b border-gray-100">
                      <div className="flex gap-3">
                          <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                          <div>
                              <p className="font-bold text-gray-900 mb-1">Shipped To</p>
                              <p>{order.shipping_name}</p>
                              <p>{order.shipping_city}, {order.shipping_postcode}</p>
                              <p>{order.shipping_country}</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <Truck className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                          <div>
                              <p className="font-bold text-gray-900 mb-1">Delivery Method</p>
                              <p>{order.delivery_service_name || "Standard Delivery"}</p>
                              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{order.delivery_type === 'to_self' ? 'Sent to You' : 'Sent Direct'}</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <CreditCard className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                          <div>
                              <p className="font-bold text-gray-900 mb-1">Payment</p>
                              <p className="capitalize">{order.payment_method} • <span className={order.payment_status === 'paid' ? "text-green-600 font-bold" : "text-yellow-600"}>{order.payment_status}</span></p>
                          </div>
                      </div>
                  </div>

                  {/* --- 3. ITEMS LIST --- */}
                  <div className="p-6 space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 relative group">
                           <img 
                              src={item.product?.final_image_url || "/placeholder.png"} 
                              alt={item.product_title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                           />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base mb-1">{item.product_title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 text-lg">£{item.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* --- 4. PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${currentPage === 1 ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm font-medium text-gray-600 px-4">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${currentPage === totalPages ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
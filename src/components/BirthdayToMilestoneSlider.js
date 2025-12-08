"use client";

import React from 'react';
import Link from 'next/link';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import DynamicThumbnail from './DynamicThumbnail'; // Ensure path is correct

export default function BirthdayToMilestoneSlider({ products = [] }) {
  
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-400 py-10">Loading Milestones...</div>;
  }

  return (
    <div className="w-full max-w-[1428px] px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="pb-12"
      >
        {products.map((product) => {
           // Prepare Props for Dynamic Thumbnail
           const frontSlide = product.design_data?.slides?.front;
           const thumbnailProps = {
               id: product.id, sku: product.sku, title: product.title,
               thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
               canvas_settings: product.canvas_settings,
               preview_zones: frontSlide?.dynamic_zones || [] 
           };
           const isFixed = product.type === 'fixed';

           return (
            <SwiperSlide key={product.id}>
              <Link 
                href={`/product/${product.sku}`} 
                className="group block bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD]"
              >
                {/* Image Area */}
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
                   <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                      <DynamicThumbnail product={thumbnailProps} />
                   </div>
                   
                   {/* Overlay Button */}
                   <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${isFixed ? "bg-zinc-800 text-white" : "bg-white text-black"}`}>
                        {isFixed ? "View Details" : "Personalize"}
                      </span>
                   </div>
                </div>

                {/* Text Area */}
                <div className="text-center">
                   <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{product.title}</h3>
                   <p className="text-xs text-gray-500 mt-1 font-medium">From £{product.price}</p>
                </div>
              </Link>
            </SwiperSlide>
           );
        })}
      </Swiper>
    </div>
  );
}
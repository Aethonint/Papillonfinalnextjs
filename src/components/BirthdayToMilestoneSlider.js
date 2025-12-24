// "use client";

// import React from 'react';
// import Link from 'next/link';
// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// import DynamicThumbnail from './DynamicThumbnail'; // Ensure path is correct

// export default function BirthdayToMilestoneSlider({ products = [] }) {
  
//   if (!products || products.length === 0) {
//     return <div className="text-center text-gray-400 py-10">Loading Milestones...</div>;
//   }

//   return (
//     <div className="w-full max-w-[1428px] px-4">
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         spaceBetween={20}
//         slidesPerView={1}
//         navigation
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         breakpoints={{
//           640: { slidesPerView: 2 },
//           768: { slidesPerView: 3 },
//           1024: { slidesPerView: 4 },
//           1280: { slidesPerView: 5 },
//         }}
//         className="pb-12"
//       >
//         {products.map((product) => {
//            // Prepare Props for Dynamic Thumbnail
//            const frontSlide = product.design_data?.slides?.front;
//            const thumbnailProps = {
//                id: product.id, sku: product.sku, title: product.title,
//                thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
//                canvas_settings: product.canvas_settings,
//                preview_zones: frontSlide?.dynamic_zones || [] 
//            };
//            const isFixed = product.type === 'fixed';

//            return (
//             <SwiperSlide key={product.id}>
//               <Link 
//                 href={`/product/${product.sku}`} 
//                 className="group block bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD]"
//               >
//                 {/* Image Area */}
//                 <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
//                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
//                       <DynamicThumbnail product={thumbnailProps} />
//                    </div>
                   
//                    {/* Overlay Button */}
//                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
//                       <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${isFixed ? "bg-zinc-800 text-white" : "bg-white text-black"}`}>
//                         {isFixed ? "View Details" : "Personalize"}
//                       </span>
//                    </div>
//                 </div>

//                 {/* Text Area */}
//                 <div className="text-center">
//                    <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{product.title}</h3>
//                    <p className="text-xs text-gray-500 mt-1 font-medium">From £{product.price}</p>
//                 </div>
//               </Link>
//             </SwiperSlide>
//            );
//         })}
//       </Swiper>
//     </div>
//   );
// }



"use client";

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import DynamicThumbnail from './DynamicThumbnail'; 

export default function BirthdayToMilestoneSlider({ products = [] }) {
  
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-400 py-10 italic">Loading Milestones...</div>;
  }

  return (
    /* Added a subtle container padding to ensure shadow doesn't get cut off */
    <div className="relative w-full max-w-[1428px] mx-auto py-8 px-4">
      
    <style jsx global>{`
        /* 1. Move Swiper content up to make room for pagination dots below */
        .custom-swiper {
          padding-bottom: 50px !important;
          position: static !important; 
        }

        /* 2. Smaller Arrows Styling */
        .custom-swiper .swiper-button-prev,
        .custom-swiper .swiper-button-next {
          color: #9DCDCD !important;
          width: 32px !important;      /* Smaller container width */
          height: 32px !important;     /* Smaller container height */
          top: 45% !important;         /* Align with the middle of the images */
          transition: all 0.2s ease;
        }

        /* Adjusting the actual icon size inside the arrow */
        .custom-swiper .swiper-button-prev:after,
        .custom-swiper .swiper-button-next:after {
          font-size: 16px !important;  /* Reduced from default 44px */
          font-weight: 800;
        }

        /* Positioning arrows in the side gutters */
        .custom-swiper .swiper-button-prev {
          left: -50px !important;
        }
        
        .custom-swiper .swiper-button-next {
          right: -50px !important;
        }

        /* 3. Pagination (Dots) styling */
        .custom-swiper .swiper-pagination-bullet {
          background: #d1d5db; /* Light gray for inactive */
          opacity: 1;
        }

        .custom-swiper .swiper-pagination-bullet-active {
          background: #9DCDCD !important; /* Brand color for active */
          width: 20px;                   /* Optional: makes the active dot a pill shape */
          border-radius: 4px;
        }
        
        .custom-swiper .swiper-pagination {
          bottom: 0px !important;
        }

        /* Hover effect for arrows */
        .custom-swiper .swiper-button-prev:hover,
        .custom-swiper .swiper-button-next:hover {
          transform: scale(1.2);
          color: #7ab8b8 !important; /* Slightly darker on hover */
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="custom-swiper"
      >
        {products.map((product) => {
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
                className="group block bg-white rounded-[24px] p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 border border-zinc-100/80 hover:border-[#9DCDCD]/50"
              >
                {/* Image Container with inner shadow */}
                <div className="relative w-full aspect-[3/4] rounded-[18px] overflow-hidden bg-zinc-50 mb-4 shadow-inner">
                    <div className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out">
                       <DynamicThumbnail product={thumbnailProps} />
                    </div>
                    
                    {/* Premium Glass Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <span className={`text-[11px] uppercase tracking-wider font-bold px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md transition-transform duration-500 translate-y-4 group-hover:translate-y-0 ${
                        isFixed ? "bg-zinc-900/90 text-white" : "bg-white/90 text-zinc-900"
                      }`}>
                        {isFixed ? "View Details" : "Personalize Now"}
                      </span>
                    </div>

                    {/* Badge for Personalization */}
                    {!isFixed && (
                      <div className="absolute top-3 left-3">
                         <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20 shadow-sm">
                            <p className="text-[10px] font-bold text-[#66A3A3]">EDITABLE</p>
                         </div>
                      </div>
                    )}
                </div>

                {/* Typography Area */}
                <div className="text-center pb-3 px-1">
                   <h3 className="font-bold text-sm text-zinc-800 line-clamp-1 group-hover:text-[#66A3A3] transition-colors duration-300">
                     {product.title}
                   </h3>
                   <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      <span className="text-xs font-medium text-zinc-400">From</span>
                      <span className="text-sm font-black text-zinc-900">£{product.price}</span>
                   </div>
                </div>
              </Link>
            </SwiperSlide>
           );
        })}
      </Swiper>
    </div>
  );
}



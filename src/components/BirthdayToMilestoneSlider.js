"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const images = [
  "/home/birdthdaytomilestone/11.png",
  "/home/birdthdaytomilestone/12.png",
  "/home/birdthdaytomilestone/13.png",
  "/home/birdthdaytomilestone/14.png",
  "/home/birdthdaytomilestone/15.png",
  "/home/birdthdaytomilestone/16.png",
  "/home/birdthdaytomilestone/17.png",
  "/home/birdthdaytomilestone/18.png",
  "/home/birdthdaytomilestone/19.png",
];

export default function BirthdayToMilestoneSlider() {
  return (
    <div className="w-full flex flex-col items-center bg-backgroundcolor py-5">
      <h2 className="text-3xl font-bold text-white mb-6">Inside Aethon,</h2>

      <div className="relative w-[100%] max-w-[1500px]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3000 }}
          loop={true}
          spaceBetween={20}
          slidesPerView={5}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          className="w-full"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`Slide ${i}`}
                className="object-cover w-full h-[420px] shadow-md shadow-black/40 "
              />
            </SwiperSlide>
          ))}
        </Swiper>

     
        <button className="custom-prev absolute top-1/2 -left-20 -translate-y-1/2 w-[50px] h-[50px] bg-[#9DCDCD] text-black p-3 rounded-full">
          ◀
        </button>
        <button className=" custom-next absolute top-1/2 -right-20 -translate-y-1/2  w-[50px] h-[50px] bg-[#9DCDCD] text-black p-3 rounded-full">
          ▶
        </button>


        <div className="custom-pagination flex justify-center mt-6" />
      </div>
    </div>
  );
}

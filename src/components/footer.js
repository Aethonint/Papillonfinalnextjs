"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";



export default function Footer() {

  return (
    <footer className="w-full flex flex-col justify-center items-center pt-6">
   <div className="flex justify-center items-center bg-thirdcolor h-[55px] w-full">
<h2 className="bg-white px-64 py-1 rounded-sm">Order by 2pm for same day dispatch via ROYAL MAIL 1st Class</h2>
   </div>
   <div className="flex justify-start items-start gap-20 py-10">
      <div className="flex flex-col items-center xl:items-start sm:max-w-[800px]  xl:max-w-[480px]">
  <Image 
  src="/logo/footerlogo.png" 
  alt="Home Hero 1" 
  width={123} 
  height={111}
  className="flex  object-contain" />
          
          </div>


           <div className="flex flex-col items-start font-albert">
            <p className="text-thirdcolor text-[18px] sm:text-[20px] font-[700] capitalize">popular</p>
            <Link href="#" className="text-black  pt-4 capitalize">birthday cards</Link>
            <Link href="#" className="text-black  pt-2 capitalize">kids cards</Link>
            <Link href="#" className="text-black  pt-2 capitalize">New Home Cards</Link>
            <Link href="#" className="text-black  pt-2 capitalize">Thankyou Cards</Link>
          </div>


           <div className="flex flex-col items-start font-albert">
            <p className="text-[#66A3A3] text-[18px] sm:text-[20px] font-[700] capitalize">useful links</p>
            <Link href="/contact-us" className="text-black pt-4 capitalize">contact</Link>
            <Link href="#" className="text-black pt-2 capitalize">About</Link>
            <Link href="#" className="text-black pt-2 capitalize">Cart</Link>
            <Link href="#" className="text-black pt-2 capitalize">Blog</Link>
          </div>


         <div className="flex flex-col items-start pt-7 md:pt-0 font-albert">
            <p className="text-[#66A3A3] text-[18px] sm:text-[20px] font-[700] capitalize ">connect with us</p>
 
     <Link href="#">
      <div className="flex text-black gap-3 items-center pt-4">
             
          
    <div className="flex items-center justify-center">
      <FontAwesomeIcon icon={faEnvelope} className="text-lg text-[#66A3A3]" />
    </div>
    <p>hello@papillon.snapchec.com</p>

    </div>
              </Link>
          <div className="flex text-white pt-3 gap-3">
  <Link href="#">
    <div className="w-8 h-8 bg-[#66A3A3] rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={faFacebook} className="text-sm" />
    </div>
  </Link>

  <Link href="#">
    <div className="w-8 h-8 bg-[#66A3A3] rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={faInstagram} className="text-sm" />
    </div>
  </Link>
</div>
          </div>
   </div>

      <section className="bg-[#66A3A3] w-full px-4 py-4 text-center font-albert">
  <p className="text-[12px] sm:text-[14px] text-white leading-tight">
   © Copyrights 2023 Papillon Cards, All Rights Reserved.
  </p>
</section>

    </footer>
  );
}

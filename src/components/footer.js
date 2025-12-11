// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import { faFacebook } from "@fortawesome/free-brands-svg-icons";
// import { faInstagram } from "@fortawesome/free-brands-svg-icons";



// export default function Footer() {

//   return (
//     <footer className="w-full flex flex-col justify-center items-center pt-6">
//    <div className="flex justify-center items-center bg-thirdcolor h-[55px] w-full">
// <h2 className="bg-white px-64 py-1 rounded-sm">Order by 2pm for same day dispatch via ROYAL MAIL 1st Class</h2>
//    </div>
//    <div className="flex justify-start items-start gap-20 py-10">
//       <div className="flex flex-col items-center xl:items-start sm:max-w-[800px]  xl:max-w-[480px]">
//   <Image 
//   src="/logo/newlogo.png" 
//   alt="Home Hero 1" 
//   width={123} 
//   height={111}
//   className="flex  object-contain" />
          
//           </div>


//            <div className="flex flex-col items-start font-albert">
//             <p className="text-thirdcolor text-[18px] sm:text-[20px] font-[700] capitalize">popular</p>
//             <Link href="#" className="text-black  pt-4 capitalize">birthday cards</Link>
//             <Link href="#" className="text-black  pt-2 capitalize">kids cards</Link>
//             <Link href="#" className="text-black  pt-2 capitalize">New Home Cards</Link>
//             <Link href="#" className="text-black  pt-2 capitalize">Thankyou Cards</Link>
//           </div>


//            <div className="flex flex-col items-start font-albert">
//             <p className="text-[#66A3A3] text-[18px] sm:text-[20px] font-[700] capitalize">useful links</p>
//             <Link href="/contact-us" className="text-black pt-4 capitalize">contact</Link>
//             <Link href="#" className="text-black pt-2 capitalize">About</Link>
//             <Link href="#" className="text-black pt-2 capitalize">Cart</Link>
//             <Link href="#" className="text-black pt-2 capitalize">Blog</Link>
//           </div>


//          <div className="flex flex-col items-start pt-7 md:pt-0 font-albert">
//             <p className="text-[#66A3A3] text-[18px] sm:text-[20px] font-[700] capitalize ">connect with us</p>
 
//      <Link href="#">
//       <div className="flex text-black gap-3 items-center pt-4">
             
          
//     <div className="flex items-center justify-center">
//       <FontAwesomeIcon icon={faEnvelope} className="text-lg text-[#66A3A3]" />
//     </div>
//     <p>hello@papillon.snapchec.com</p>

//     </div>
//               </Link>
//           <div className="flex text-white pt-3 gap-3">
//   <Link href="#">
//     <div className="w-8 h-8 bg-[#66A3A3] rounded-full flex items-center justify-center">
//       <FontAwesomeIcon icon={faFacebook} className="text-sm" />
//     </div>
//   </Link>

//   <Link href="#">
//     <div className="w-8 h-8 bg-[#66A3A3] rounded-full flex items-center justify-center">
//       <FontAwesomeIcon icon={faInstagram} className="text-sm" />
//     </div>
//   </Link>
// </div>
//           </div>
//    </div>

//       <section className="bg-[#66A3A3] w-full px-4 py-4 text-center font-albert">
//   <p className="text-[12px] sm:text-[14px] text-white leading-tight">
//    © Copyrights 2023 Papillon Cards, All Rights Reserved.
//   </p>
// </section>

//     </footer>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
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

        {/* Popular Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-[#66A3A3] text-lg font-bold uppercase">Popular</h3>
          <Link href="#" className="hover:text-[#66A3A3] transition">Birthday Cards</Link>
          <Link href="#" className="hover:text-[#66A3A3] transition">Kids Cards</Link>
          <Link href="#" className="hover:text-[#66A3A3] transition">New Home Cards</Link>
          <Link href="#" className="hover:text-[#66A3A3] transition">Thank You Cards</Link>
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

          {/* Newsletter Signup */}
          <div className="mt-4">
            <h4 className="text-[#66A3A3] font-semibold text-sm sm:text-base mb-2">Subscribe Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 rounded-lg border border-gray-300 hover:border-thirdcolor active:border-thirdcolor w-full  transition"
              />
              <button className="px-4 py-2 rounded-lg bg-[#66A3A3] text-white font-semibold hover:brightness-110 transition">
                Subscribe
              </button>
            </div>
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

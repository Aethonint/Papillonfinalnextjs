
import Image from 'next/image'
import BirthdayToMilestoneSlider from '@/components/BirthdayToMilestoneSlider'

import { 
  FaBirthdayCake, 
  FaHeart, 
  FaBaby, 
  FaCamera, 
  FaRegSmileBeam, 
  FaGift, 
  FaHandsHelping 
} from 'react-icons/fa';
import { GiRing } from 'react-icons/gi'; // For Wedding Ring, use Game Icons library

async function PageHome() {

  return (

  // start section 1
  <div className="nc-PageHome relative overflow-hidden">

<section>
  <div className="flex justify-center items-center px-20 mt-10">
    <div className="grid grid-cols-2 gap-10 bg-[#9DCDCD] text-white w-[85%] h-[500px] rounded-xl">
      <div className="flex justify-center items-center px-5">
        <Image
          src="/home/birdthdaytomilestone/15.png"
          alt="Rotated left"
          width={200}
          height={280}
          className="z-10 rotate-[-10deg] shadow-md shadow-black/40"
        />
        <Image
          src="/home/birdthdaytomilestone/17.png"
          alt="Birthday Cake"
          width={200}
          height={280}
          className="z-20 shadow-md shadow-black/40"
        />
        <Image
          src="/images/46.png"
          alt="Birthday Cake"
          width={200}
          height={280}
          className="z-30 rotate-[-10deg] shadow-md shadow-black/40"
        />
      </div>
      <div className="flex flex-col justify-center items-start gap-y-4">
        <h1 className='font-extrabold text-5xl leading-tight'>
        Make it personal make it unforgetable
        </h1>
        <p className='text-2xl italic text-white/90'>
         Because some messages deserve more than just a text
        </p>
        <button className='bg-[#66A3A3] hover:bg-[#5b8c8c] transition-all duration-300 text-white px-6 py-3 rounded-lg font-semibold'>
         From £2.99
        </button>
      
      </div>
    </div>
  </div>
</section>





{/* start section 2 */}

<section className="py-10">
  <div className="max-w-max mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-3xl font-extrabold text-black mb-16">
      Our Top Picks
    </h2>

    {/* Single row grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
      {[
        { title: "Birthday Cards", icon: <FaBirthdayCake className="text-[#66A3A3]" /> },
        { title: "Anniversary Cards", icon: <FaHeart className="text-[#FF6B6B]" /> },
        { title: "Children Cards", icon: <FaBaby className="text-[#6BCBFF]" /> },
        { title: "Photo Upload", icon: <FaCamera className="text-[#FFD93D]" /> },
        { title: "Baby Cards", icon: <FaBaby className="text-[#66A3A3]" /> },
        { title: "Wedding Cards", icon: <GiRing className="text-[#9B5DE5]" /> },
        { title: "Get Well Soon", icon: <FaRegSmileBeam className="text-[#3BC9DB]" /> },
        { title: "Thank You Cards", icon: <FaHandsHelping className="text-[#FF9F1C]" /> },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col justify-center items-center bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer w-full max-w-[150px]"
        >
          {/* Icon with circular background */}
          <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[#66A3A3]/20 to-[#66A3A3]/10 rounded-full mb-4 shadow-inner">
            {item.icon}
          </div>
          <h3 className="text-sm md:text-base font-semibold text-gray-800 text-center">
            {item.title}
          </h3>
        </div>
      ))}
    </div>
  </div>
</section>
{/* end Top Picks section */}


{/*  START  Section 3 */}
<section className="py-10 px-6">
  <div className="max-w-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* LEFT CARD */}
    <div className="bg-gradient-to-br from-[#FFAFB5] to-[#FFCED4] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
      
      <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 text-center mb-8">
        Say it your way — for any occasion
      </h2>

      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {["/images/50.png", "/images/51.png", "/images/52.png", "/images/55.png"].map((src, i) => (
          <div key={i} className="hover:-translate-y-2 transition-all duration-300">
            <Image
              src={src}
              alt="Card"
              width={146}
              height={208}
              className="rounded-xl shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT CARD */}
    <div className="bg-gradient-to-br from-[#90CCCC] to-[#AEE8E8] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
      
      <div className="grid grid-cols-4 gap-4 justify-items-center mb-8">
        {["/home/a1.png", "/home/a5.png", "/home/a8.png", "/home/a9.png"].map((src, i) => (
          <div key={i} className="hover:-translate-y-2 transition-all duration-300">
            <Image
              src={src}
              alt="Card"
              width={146}
              height={208}
              className="rounded-xl shadow-lg"
            />
          </div>
        ))}
      </div>

      <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 text-center">
        Make it personal — make it unforgettable
      </h2>
    </div>

  </div>
</section>
{/* END  Section 3 */}


{/* start section 4 */}
<section className="flex justify-center items-center py-20">
  <div className='flex flex-col justify-start items-start'>
    <h2 className="text-4xl font-black text-black">Cards For Birthday</h2>
<div className='flex justify-center items-center gap-5 pt-5'>
  <Image
  src="/home/a6.png"
  alt="Birthday Cake"
  width={265}
  height={372}
  className="shadow-md shadow-black/40"
/>
  <Image
  src="/home/a10.png"
  alt="Birthday Cake"
  width={265}
  height={372}
  className="shadow-md shadow-black/40"
/>
  <Image
  src="/home/a11.png"
  alt="Birthday Cake"
  width={265}
  height={372}
  className="shadow-md shadow-black/40"
/>
  <Image
  src="/home/a12.png"
  alt="Birthday Cake"
  width={265}
  height={372}
  className="shadow-md shadow-black/40"
/>
  <Image
  src="/home/a13.png"
  alt="Birthday Cake"
  width={265}
  height={372}
  className="shadow-md shadow-black/40"
/>
  </div>


  </div>

  
</section>

{/* end section 4 */}


{/* start section 5 */}
<section className='flex flex-col justify-center items-center py-20'>
  <div className='w-[1428px] pt-5'>
      <h2 className="text-4xl font-black text-black">From Birthday to Milestones</h2>
<p className='text-xl'>Celebrate life’s special moments with cards for every occasion — from welcoming new babies to marking milestone birthdays. Create a card that makes every moment unforgettable.</p>
  </div>
  <BirthdayToMilestoneSlider/>
</section>


{/* end section 5 */}



{/* start section 6 */}
<section className="flex justify-center items-center py-14">
  <div className="grid grid-cols-2 bg-[#FFAFB5] pt-10 px-28 py-12 overflow-hidden rounded-2xl">
    <div className="flex flex-col justify-start items-start gap-y-4">
      <h2 className="text-6xl font-bold text-black w-[600px]">
        Birthday Fun, Made Just for Them
      </h2>
      <p className="text-xl w-[500px]">
        Big birthdays, bigger smiles, discover cards kids can’t wait to open.
      </p>

  <div className="flex justify-center items-center px-5">
        <Image
          src="/home/birdthdaytomilestone/16.png"
          alt="Rotated left"
          width={200}
          height={280}
          className="z-10 rotate-[-10deg] shadow-md shadow-black/40"
        />
        <Image
          src="/home/birdthdaytomilestone/13.png"
          alt="Birthday Cake"
          width={200}
          height={280}
          className="z-20 shadow-md shadow-black/40"
        />
        <Image
          src="/home/birdthdaytomilestone/18.png"
          alt="Birthday Cake"
          width={200}
          height={280}
          className="z-30 rotate-[-10deg] shadow-md shadow-black/40"
        />
      </div>
    
    </div>

    <div className='flex justify-end items-end'>
         <Image
          src="/home/last.png"
          alt="Birthday Cake"
          width={600}
          height={500}
          className=""
        />
    </div>
  </div>
</section>

{/* end section 6 */}
    </div>
  )
}

export default PageHome

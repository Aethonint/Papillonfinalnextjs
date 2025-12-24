import Image from 'next/image'
import Link from 'next/link'
import BirthdayToMilestoneSlider from '@/components/BirthdayToMilestoneSlider'
import DynamicThumbnail from '@/components/DynamicThumbnail'
import BirthdaySection from '@/components/BirthdaySection'

// Added new icons for the new categories
import { 
  FaBirthdayCake, FaHeart, FaBaby, FaRegSmileBeam, FaHandsHelping, FaUserTie, FaUser
} from 'react-icons/fa';
import { GiRing } from 'react-icons/gi';

// 1. FETCH BIRTHDAY CARDS (Section 4)
async function getBirthdayCards() {
  try {



    const res = await fetch('https://papillondashboard.devshop.site/api/products/category/birthday', {
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// 2. FETCH LATEST PRODUCTS (Section 5 - Slider)
async function getLatestProducts() {
  try {



    const res = await fetch('https://papillondashboard.devshop.site/api/products', {
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Latest fetch error:", error);
    return null;
  }
}

async function PageHome() {
  const [birthdayData, latestData] = await Promise.all([getBirthdayCards(), getLatestProducts()]);

// :white_check_mark: FIXED: Variable name matches what is passed to the component below
  const initialBirthdayProducts = birthdayData?.products?.data?.slice(0, 5) || [];
  
  // Section 5 Data (Latest 10 - Customizable Only)
  // KEEPING THIS LOGIC AS YOU REQUESTED TO KEEP SLIDER WORKING
  const allLatest = latestData?.data || [];
  const customizableOnly = allLatest.filter(product => product.type !== 'fixed');
  const sliderProducts = customizableOnly.slice(0, 10);

  
const topPicks = [
  { title: "Birthday", image: "/home/birthday.png", link: "birthday" },
  { title: "Anniversary", image: "/home/anniversary.png", link: "anniversary", badge: "50% Off" },
  { title: "For Him", image: "/home/he.png", link: "birthday-for-him" },
  { title: "For Her", image: "/home/she.png", link: "birthday-for-her", badge: "50% Off" },
  { title: "New Baby", image: "/home/baby.png", link: "congratulations-new-born", badge: "50% Off" },
  { title: "Wedding", image: "/home/jewelry.png", link: "congratulations-wedding-congratulations" },
  { title: "Get Well", image: "/home/hospital.png", link: "gestural-cards-get-well-soon", badge: "50% Off" },
  { title: "Thank You", image: "/home/signboard.png", link: "gestural-cards-thank-you-cards" },
];


  return (
    <div className="nc-PageHome relative overflow-hidden bg-white">

      {/* --- SECTION 1: HERO --- */}
     {/* --- SECTION 1: HERO --- */}
      <section>
        <div className="flex justify-center items-center px-4 lg:px-20 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#9DCDCD] text-white w-full lg:w-[85%] min-h-[500px] rounded-xl p-8 lg:p-0">
            <div className="flex justify-center items-center px-5 relative h-[300px] lg:h-auto">
              <Image 
                src="/home/birdthdaytomilestone/15.png" 
                alt="Rotated left" 
                width={200} height={280} 
                className="absolute left-10 lg:left-20 z-10 rotate-[-10deg] shadow-md shadow-black/40" 
                unoptimized // <--- ADDED
              />
              <Image 
                src="/home/birdthdaytomilestone/17.png" 
                alt="Birthday Cake" 
                width={200} height={280} 
                className="absolute z-20 shadow-md shadow-black/40" 
                unoptimized // <--- ADDED
              />
              <Image 
                src="/images/46.png" 
                alt="Birthday Cake" 
                width={200} height={280} 
                className="absolute right-10 lg:right-20 z-30 rotate-[10deg] shadow-md shadow-black/40" 
                unoptimized // <--- ADDED
              />
            </div>
            <div className="flex flex-col justify-center items-center lg:items-start gap-y-4 text-center lg:text-left">
              <h1 className='font-extrabold text-4xl lg:text-5xl leading-tight'>
                Make it personal make it unforgettable
              </h1>
              <p className='text-xl italic text-white/90'>
                Because some messages deserve more than just a text
              </p>
              <button className='bg-[#fca1a8] hover:bg-[#5b8c8c] transition-all duration-300 text-white px-6 py-3 rounded-lg font-semibold shadow-lg'>
                From £2.99
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: TOP PICKS --- */}

<section className="py-24 bg-[#FCFDFD]">
      <div className="container mx-auto px-6 max-w-[1428px]">
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 md:gap-6">
          {topPicks.map((item, index) => (
            <Link key={index} href={`/category/${item.link}`} className="group relative">
              
              <div className="flex flex-col items-center">
                
                {/* Image Container with Floating Effect */}
                <div className="relative mb-4">
                  {/* Outer Glow / Soft Background */}
                  <div className="absolute inset-0 bg-[#66A3A3]/5 rounded-full blur-2xl group-hover:bg-[#66A3A3]/15 transition-all duration-500"></div>
                  
                  {/* Main Circle */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border border-zinc-100 
                                  flex items-center justify-center overflow-hidden
                                  shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                                  group-hover:shadow-[0_15px_45px_rgba(102,163,163,0.15)]
                                  group-hover:-translate-y-2 transition-all duration-500 ease-out">
                    
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Enhanced Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 z-20">
                      <span className="flex items-center justify-center bg-[#66A3A3] text-white text-[10px] font-black
                                       px-2.5 py-1 rounded-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title with Underline Effect */}
                <div className="text-center relative">
                  <h3 className="text-sm md:text-base font-bold text-zinc-800 transition-colors group-hover:text-[#66A3A3]">
                    {item.title}
                  </h3>
                  {/* Tiny indicator line */}
                  <span className="block h-0.5 w-0 bg-[#66A3A3] mx-auto group-hover:w-full transition-all duration-300 mt-1"></span>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>

{/* <section className="py-20 bg-white">
  <div className="container mx-auto px-4">

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
      {topPicks.map((item, index) => (
        <Link key={index} href={`/category/${item.link}`} className="group">
          
          <div className="relative bg-white rounded-2xl border border-gray-200
                          hover:border-[#66A3A3]
                          hover:shadow-md transition">

         
            {item.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2
                               bg-[#66A3A3] text-white text-xs font-semibold
                               px-3 py-1 rounded-full z-10">
                {item.badge}
              </span>
            )}

    
            <div className="flex justify-center pt-6">
              <div className="w-20 h-20 rounded-full bg-[#66A3A3]/15
                              flex items-center justify-center
                              overflow-hidden
                              group-hover:scale-105 transition">

                <Image
                  src={item.image}
                  alt={item.title}
                  width={50}
                  height={50}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

          
            <div className="pt-4 pb-5 text-center">
              <h3 className="text-sm font-semibold text-gray-800
                             group-hover:text-[#66A3A3] transition">
                {item.title}
              </h3>
            </div>

          </div>
        </Link>
      ))}
    </div>

  </div>
</section> */}





{/* <section className="py-20 bg-white">
  <div className="container mx-auto px-4">

    
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
      {topPicks.map((item, index) => (
        <Link
          key={index}
          href={`/category/${item.link}`}
          className="group"
        >
          <div className="relative h-full bg-white rounded-2xl border 
                          border-gray-200 hover:border-[#66A3A3]
                          transition-all duration-300
                          hover:shadow-lg">

         
            {item.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2
                               bg-[#66A3A3] text-white text-xs font-semibold
                               px-3 py-1 rounded-full z-10">
                {item.badge}
              </span>
            )}

            <div className="flex justify-center pt-6">
              <div className="w-20 h-20 rounded-full 
                              bg-[#66A3A3]/15
                              flex items-center justify-center
                              transition group-hover:scale-105">
                {item.icon}
              </div>
            </div>

      
            <div className="px-3 pb-5 pt-4 text-center">
              <h3 className="text-sm font-semibold text-gray-800 
                             group-hover:text-[#66A3A3]">
                {item.title}
              </h3>
            </div>

          </div>
        </Link>
      ))}
    </div>
  </div>
</section> */}

      
      {/* <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-3xl font-extrabold text-black mb-16">
            Our Top Picks
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
            {topPicks.map((item, index) => (
              <Link 
                href={`/category/${item.link}`} 
                key={index} 
                className="w-full flex justify-center"
              >
                <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer w-full max-w-[150px]">
                  <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[#66A3A3]/20 to-[#66A3A3]/10 rounded-full mb-4 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 text-center">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

    {/* --- SECTION 3: PROMO SPLIT --- */}
      <section className="py-10 px-6">
        <div className="max-w-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Card (Pink) */}
          <div className="bg-gradient-to-br from-[#FFAFB5] to-[#FFCED4] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 text-center mb-8">Say it your way — for any occasion</h2>
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {["/images/50.png", "/images/51.png", "/images/52.png", "/images/55.png"].map((src, i) => (
                <div key={i} className="hover:-translate-y-2 transition-all duration-300">
                  <Image 
                    src={src} 
                    alt="Card" 
                    width={146} 
                    height={208} 
                    className="rounded-xl shadow-lg" 
                    unoptimized // <--- FIXED (Already present)
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Card (Teal) */}
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
                    unoptimized // <--- ADDED FIX HERE
                  />
                </div>
              ))}
            </div>
            <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 text-center">Make it personal — make it unforgettable</h2>
          </div>

        </div>
      </section>


      {/* --- SECTION 4: DYNAMIC BIRTHDAY CARDS (Replaced with new component) --- */}
      <BirthdaySection initialProducts={initialBirthdayProducts} />

      {/* --- SECTION 5: MILESTONES (Working Slider) --- */}
      <section className='flex flex-col justify-center items-center py-20'>
        <div className='max-w-[1428px] w-full px-4 pt-5 text-start mb-10'>
            <h2 className="text-4xl font-black text-black mb-4">From Birthday to Milestones</h2>
            <p className='text-xl text-gray-600 max-w-3xl'>Celebrate life’s special moments with cards for every occasion.</p>
        </div>
        <BirthdayToMilestoneSlider products={sliderProducts} />
      </section>

      {/* --- SECTION 6: BOTTOM PROMO --- */}
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

    </div>
  )
}

export default PageHome
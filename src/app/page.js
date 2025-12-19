import Image from 'next/image'
import Link from 'next/link'
import BirthdayToMilestoneSlider from '@/components/BirthdayToMilestoneSlider'
import DynamicThumbnail from '@/components/DynamicThumbnail'

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

  // Section 4 Data (First 5 Birthday Cards)
  const birthdayProducts = birthdayData?.products?.data?.slice(0, 5) || [];
  
  // Section 5 Data (Latest 10 - Customizable Only)
  // KEEPING THIS LOGIC AS YOU REQUESTED TO KEEP SLIDER WORKING
  const allLatest = latestData?.data || [];
  const customizableOnly = allLatest.filter(product => product.type !== 'fixed');
  const sliderProducts = customizableOnly.slice(0, 10);

  // --- UPDATED TOP PICKS (Strictly matching your Seeder Slugs) ---
  const topPicks = [
    // 1. Birthday
    { title: "Birthday", icon: <FaBirthdayCake className="text-[#66A3A3]" />, link: "birthday" },
    
    // 2. Anniversary
    { title: "Anniversary", icon: <FaHeart className="text-[#FF6B6B]" />, link: "anniversary" },
    
    // 3. For Him
    { title: "For Him", icon: <FaUserTie className="text-[#6BCBFF]" />, link: "birthday-for-him" },
    
    // 4. For Her
    { title: "For Her", icon: <FaUser className="text-[#FFD93D]" />, link: "birthday-for-her" },
    
    // 5. New Baby (Seeder: New Born)
    { title: "New Baby", icon: <FaBaby className="text-[#66A3A3]" />, link: "congratulations-new-born" },
    
    // 6. Wedding
    { title: "Wedding", icon: <GiRing className="text-[#9B5DE5]" />, link: "congratulations-wedding-congratulations" },
    
    // 7. Get Well Soon
    { title: "Get Well", icon: <FaRegSmileBeam className="text-[#3BC9DB]" />, link: "gestural-cards-get-well-soon" },
    
    // 8. Thank You
    { title: "Thank You", icon: <FaHandsHelping className="text-[#FF9F1C]" />, link: "gestural-cards-thank-you-cards" },
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
              <button className='bg-[#66A3A3] hover:bg-[#5b8c8c] transition-all duration-300 text-white px-6 py-3 rounded-lg font-semibold border-2 border-white shadow-lg'>
                From £2.99
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: TOP PICKS (RESTORED) --- */}
      <section className="py-20">
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
      </section>

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

      {/* --- SECTION 4: DYNAMIC BIRTHDAY CARDS --- */}
      <section className="flex justify-center items-center py-20 bg-stone-50">
        <div className='flex flex-col justify-start items-center w-full max-w-[1428px] px-4'>
          <div className="w-full flex justify-between items-end mb-8">
             <h2 className="text-4xl font-black text-black">Cards For Birthday</h2>
             <Link href="/category/birthday" className="text-[#66A3A3] font-bold hover:underline">View All</Link>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full'>
            {birthdayProducts.length > 0 ? (
              birthdayProducts.map((product) => {
                const frontSlide = product.design_data?.slides?.front;
                const thumbnailProps = {
                    id: product.id, sku: product.sku, title: product.title,
                    thumbnail_url: frontSlide?.background_url || product.thumbnail_url || "/placeholder.png",
                    canvas_settings: product.canvas_settings,
                    preview_zones: frontSlide?.dynamic_zones || [] 
                };
                const isFixed = product.type === 'fixed';

                return (
                  <Link 
                    href={`/product/${product.sku}`} 
                    key={product.id} 
                    className="group bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#9DCDCD] flex flex-col"
                  >
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
                       <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                          <DynamicThumbnail product={thumbnailProps} />
                       </div>
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${isFixed ? "bg-zinc-800 text-white" : "bg-white text-black"}`}>
                            {isFixed ? "View Details" : "Personalize"}
                          </span>
                       </div>
                    </div>
                    <div className="text-center mt-auto">
                       <h3 className="font-bold text-base text-gray-800 line-clamp-1">{product.title}</h3>
                       <p className="text-sm text-gray-500 mt-1 font-medium">From £{product.price}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                 Loading Products...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: MILESTONES (Working Slider) --- */}
      <section className='flex flex-col justify-center items-center py-20'>
        <div className='max-w-[1428px] w-full px-4 pt-5 text-center mb-10'>
            <h2 className="text-4xl font-black text-black mb-4">From Birthday to Milestones</h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>Celebrate life’s special moments with cards for every occasion.</p>
        </div>
        <BirthdayToMilestoneSlider products={sliderProducts} />
      </section>

      {/* --- SECTION 6: BOTTOM PROMO --- */}
      <section className="flex justify-center items-center py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#FFAFB5] p-10 lg:px-28 lg:py-12 overflow-hidden rounded-3xl w-full max-w-[1428px]">
          <div className="flex flex-col justify-center items-start gap-y-6 relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
              Birthday Fun, <br/> Made Just for Them
            </h2>
            <p className="text-xl lg:text-2xl font-medium text-black/80 max-w-lg">
              Big birthdays, bigger smiles, discover cards kids can’t wait to open.
            </p>
            <div className="flex gap-4 mt-4">
               <Image src="/home/birdthdaytomilestone/16.png" alt="Card" width={120} height={160} className="rotate-[-10deg] shadow-md border-4 border-white rounded-lg" />
               <Image src="/home/birdthdaytomilestone/13.png" alt="Card" width={120} height={160} className="shadow-md border-4 border-white rounded-lg -mt-4" />
               <Image src="/home/birdthdaytomilestone/18.png" alt="Card" width={120} height={160} className="rotate-[10deg] shadow-md border-4 border-white rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end items-end mt-10 lg:mt-0 relative">
               <Image src="/home/last.png" alt="Happy Kid" width={600} height={500} className="object-contain" />
          </div>
        </div>
      </section>

    </div>
  )
}

export default PageHome
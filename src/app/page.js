
import Image from 'next/image'
import BirthdayToMilestoneSlider from '@/components/BirthdayToMilestoneSlider'


async function PageHome() {

  return (

  // start section 1
  <div className="nc-PageHome relative overflow-hidden">

 <section>
<div className="flex justify-center items-center">
  <div className="grid grid-cols-2 bg-[#9DCDCD] text-white w-[75%] h-[500px] rounded-xl">
    <div className="flex justify-center items-center px-5">
   <Image
  src="/images/55.png"
  alt="Rotated left"
  width={200}
  height={280}
  className="z-10 rotate-[-10deg] shadow-md shadow-black/40"
/>
  <Image
  src="/images/28.png"
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
      <h1 className='font-bold text-6xl'>Make it personal, make it unforgetable</h1>
      <p className='text-xl italic'>Because some messages deserve more than just a text</p>
      <button className='bg-[#66A3A3] text-white px-5 py-3 rounded-lg'>From £2.99</button>
    </div>
  </div>
</div>
</section>
{/* end section 1 */}




{/* start section 2 */}


<section className='flex flex-col justify-center items-center text-black py-20'>
<h1 className='text-3xl font-bold'>
  Our Top Picks
</h1>
<div className='flex justify-center items-center gap-5 pt-10'>

<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Happy-3rd-Birthday-Personalised-Birthday-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>birthday cards for him</h3>
</div>

<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Among-Us-Personalised-Christmas-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Anniversary Cards</h3>
</div>


<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Bunny-birthday-with-cake-Personalised-Birthday-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Childern Birthday</h3>
</div>



<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Hope-your-Birthday-is-out-of-this-world-Personalised-Birthday-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Photo <br/> Upload</h3>
</div>


<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Special-5th-Birthday-cute-Pikachu-Personalised-Birthday-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Baby<br/> Cards</h3>
</div>


<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Teddy-bear-with-cake-Personalised-Birthday-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Wedding <br/> Cards</h3>
</div>


<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/Wishing-a-very-merry-Christmas-to-someone-special-Personalised-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Get Well Soon Cards</h3>
</div>


<div className='flex flex-col justify-center items-center gap-y-2 w-[158px] h-[175px] border border-[#C0C0B0] rounded-2xl p-4 '>
<Image
  src="/home/toppicks/With-lots-of-love-Personalised-Birthday-Card.webp"
  alt="Birthday Cake"
  width={85}
  height={85}
  className=""
/>
<h3 className='text-sm font-bold capitalize text-center'>Thankyou <br/> Cards</h3>
</div>

</div>
</section> 

 {/* end section 2 */}


 {/* start section 3 */}

<section className='flex justify-center items-center gap-5 '>
<div className='flex flex-col justify-center items-center w-[680px] h-[310px] bg-[#FFAFB5] rounded-2xl gap-y-5'>
  <div>
  <h2 className='font-bold text-3xl text-black capitalize'>say it your way, for any occasion</h2>
</div>
<div className='flex justify-center items-cover gap-4'>
<Image
  src="/images/50.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>
<Image
  src="/images/51.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>
<Image
  src="/images/52.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>
<Image
  src="/images/55.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>

</div>

</div>




<div className='flex flex-col justify-center items-center w-[680px] h-[310px] bg-[#90CCCC] rounded-2xl gap-y-5'>
<div className='flex justify-center items-cover gap-4'>
<Image
  src="/home/a1.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>
<Image
  src="/home/a5.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>
<Image
  src="/home/a8.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>
<Image
  src="/home/a9.png"
  alt="Birthday Cake"
  width={146}
  height={208}
  className="shadow-md shadow-black/40"
/>

</div>
<div>
  <h2 className='font-bold text-3xl text-black'>Make it personal make it unforgetable</h2>
</div>
</div>
</section>

 {/* end section 3 */}


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
<section className="flex justify-center items-center py-10">
  <div className="grid grid-cols-2 bg-[#FFAFB5] pt-10 px-28 overflow-hidden rounded-2xl">
    <div className="flex flex-col justify-start items-start gap-y-4">
      <h2 className="text-6xl font-bold text-black w-[600px]">
        Birthday Fun, Made Just for Them
      </h2>
      <p className="text-xl w-[500px]">
        Big birthdays, bigger smiles, discover cards kids can’t wait to open.
      </p>
      <button className="bg-[#66A3A3] text-white px-5 py-3 rounded-lg">
        Explore Kids Cards
      </button>

      <div className="relative flex justify-center items-center px-5 w-[500px] h-[200px] translate-y-10">
        <Image
          src="/home/a5.png"
          alt="Rotated left"
          width={150}
          height={200}
          className="left-1 absolute z-40 rotate-[10deg] shadow-md shadow-black/40"
        />
        <Image
          src="/home/a11.png"
          alt="Birthday Cake"
          width={150}
          height={200}
          className="absolute left-32 z-30 rotate-[-10deg] shadow-md shadow-black/40"
        />
        <Image
          src="/home/a13.png"
          alt="Birthday Cake"
          width={150}
          height={200}
          className="absolute z-20 left-64 rotate-[0deg] shadow-md shadow-black/40"
        />
        <Image
          src="/home/a8.png"
          alt="Birthday Cake"
          width={150}
          height={200}
          className="absolute z-10 -right-10 rotate-[-10deg] shadow-md shadow-black/40"
        />
      </div>
    
    </div>

    <div className='flex justify-end items-end'>
         <Image
          src="/home/promo2.png"
          alt="Birthday Cake"
          width={500}
          height={400}
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

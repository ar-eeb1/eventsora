import AddHomeListing from '@/components/application/Website/AddHomeListing'
import React from 'react'
import Link from 'next/link'
import Hero from '@/components/application/Website/Hero'
import { Playfair_Display } from 'next/font/google'


const playfair = Playfair_Display({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin'],
})


const Home = () => {
  return (
    <div className='mt-8'>
      <Hero />
      <div className='md:mt-10 mt-5'>
        <div className='flex items-center justify-center'>
          <h1 className={`${playfair.className} lg:text-6xl md:text-6xl sm:text-5xl text-4xl text-pink-900 font-extrabold underline underline-offset-8 decoration-1 `}>Categories</h1>
        </div>
        <div className='flex items-center justify-center md:gap-10 gap-5 font-bold md:mt-10 mt-5 flex-wrap'>
          {/* <Link href={'/photographer'} className='flex flex-col items-center justify-center'>
            <lord-icon
              src="https://cdn.lordicon.com/wsaaegar.json"
              trigger="loop"
              delay="2000"
              colors="primary:#121331,secondary:#7A0E3A"
              style={{ width: 'clamp(70px, 10vw, 100px)', height: 'clamp(70px, 10vw, 100px)' }}
            >
            </lord-icon>
            <span className=' uppercase'>Photographer</span>
          </Link> */}

          {/* <Link href={'/caterer'} className='flex flex-col items-center justify-center'>
            <lord-icon
              src="https://cdn.lordicon.com/kixubvkn.json"
              trigger="loop"
              delay="2000"
              colors="primary:#121331,secondary:#7A0E3A"
              style={{ width: 'clamp(70px, 10vw, 100px)', height: 'clamp(70px, 10vw, 100px)' }}
            >
            </lord-icon>
            <span className=' uppercase'>Caterer</span>
          </Link> */}


          {/* <Link href={''} className='flex flex-col items-center justify-center'>
            <lord-icon
              trigger="loop"
              src="https://cdn.lordicon.com/kezeezyg.json"
              delay="2000"
              state="morph-open"
              colors="primary:#121331,secondary:#7A0E3A"
              style={{ width: 'clamp(70px, 10vw, 100px)', height: 'clamp(70px, 10vw, 100px)' }}
            >
            </lord-icon>
            <span className=' uppercase'>Gift Items</span>
          </Link> */}


          <Link href={'/entertainment'} className='flex flex-col items-center justify-center'>
            <lord-icon
              trigger="loop"
              src="https://cdn.lordicon.com/mtokncfo.json"
              delay="2000"
              colors="primary:#121331,secondary:#7A0E3A"
              style={{ width: 'clamp(70px, 10vw, 100px)', height: 'clamp(70px, 10vw, 100px)' }}
            >
            </lord-icon>
            <span className=' uppercase'>Entertainment</span>
          </Link>



          <Link href={'/venues'} className='flex flex-col items-center justify-center'>
            <lord-icon
              src="https://cdn.lordicon.com/gmzxduhd.json"
              trigger="loop"
              delay="2000"
              colors="primary:#121331,secondary:#7A0E3A"
              style={{ width: 'clamp(70px, 10vw, 100px)', height: 'clamp(70px, 10vw, 100px)' }}
            >
            </lord-icon>
            <span className=' uppercase'>Venues</span>
          </Link>



        </div>

      </div>
      <AddHomeListing />
    </div>
  )
}

export default Home

import AddHomeListing from '@/components/application/Website/AddHomeListing'
import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <div className=''>
      <div className='flex items-center justify-center gap-10 font-bold mt-10'>
        <Link href={''} className='flex flex-col items-center justify-center'>
          <lord-icon
            src="https://cdn.lordicon.com/wsaaegar.json"
            trigger="loop"
            delay="2000"
            colors="primary:#121331,secondary:#e8308c"
            style={{ width: 100, height: 100 }}
          >
          </lord-icon>
          <span className=' uppercase'>Photographer</span>
        </Link>


        <Link href={''} className='flex flex-col items-center justify-center'>
          <lord-icon
            src="https://cdn.lordicon.com/kixubvkn.json"
            trigger="loop"
            delay="2000"
            colors="primary:#121331,secondary:#e8308c"
            style={{ width: 100, height: 100 }}
          >
          </lord-icon>
          <span className=' uppercase'>Caterer</span>
        </Link>


        <Link href={''} className='flex flex-col items-center justify-center'>
          <lord-icon
            trigger="loop"
            src="https://cdn.lordicon.com/kezeezyg.json"
            delay="2000"
            state="morph-open"
            colors="primary:#121331,secondary:#e8308c"
            style={{ width: 100, height: 100 }}
          >
          </lord-icon>
          <span className=' uppercase'>Gift Items</span>
        </Link>


        <Link href={''} className='flex flex-col items-center justify-center'>
          <lord-icon
            trigger="loop"
            src="https://cdn.lordicon.com/mtokncfo.json"
            delay="2000"
            colors="primary:#121331,secondary:#e8308c"
            style={{ width: 100, height: 100 }}
          >
          </lord-icon>
          <span className=' uppercase'>Entertainment</span>
        </Link>



        <Link href={''} className='flex flex-col items-center justify-center'>
          <lord-icon
            src="https://cdn.lordicon.com/ohcuigqh.json"
            trigger="loop"
            delay="2000"
            colors="primary:#121331,secondary:#e8308c"
            style={{ width: 100, height: 100 }}
          >
          </lord-icon>
          <span className=' uppercase'>Venues</span>
        </Link>



      </div>
      <AddHomeListing />
    </div>
  )
}

export default Home

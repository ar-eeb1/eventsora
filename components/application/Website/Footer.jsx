
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/eventsoraWhite.png'
import React from 'react'
import { Email, Facebook, Instagram, MapOutlined, PhoneOutlined } from '@mui/icons-material'
import { WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/AdminPanelRoute'
import { USER_DASHBOARD, WEBSITE_CATEGORY } from '@/routes/WebsiteRoute'

const Footer = () => {
  return (
    <footer className='bg-pink-900 border-t w-full'>

      <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>
        <div className='lg:col-span-1 md:col-span-2 col-span-1'>
          <Link href={WEBSITE_HOME} className='transition-transform hover:scale-105 duration-300 '>
            <Image
              src={logo.src}
              width={380}
              height={146}
              alt='logo'
              className='lg:w-56 w-44'
            />
          </Link>
          <p className='text-white text-sm pt-5'>Welcome to the all in one Event Management Store - Your online shop partner</p>
        </div>

        <div>
          <h4 className='text-white text-sm md:text-xl md:font-bold uppercase mb-3 md:mb-5'>Categories</h4>
          <ul>
            <li className='md:mb-2 text-sm text-white'><Link href={`${WEBSITE_CATEGORY('venues')}`}>Venues </Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={`${WEBSITE_CATEGORY('catering')}`}> Food</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={`${WEBSITE_CATEGORY('photography')}`}>Photography</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={`${WEBSITE_CATEGORY('decor')}`}>Decor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className='text-white text-sm md:text-xl md:font-bold uppercase mb-3 md:mb-5'>Useful Links</h4>
          <ul>
            <li className='md:mb-2 text-sm text-white'><Link href={''}>Home</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={''}>Shop</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href='/about-us'>About</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={''}>Register</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={''}>Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className='text-white text-sm md:text-xl md:font-bold uppercase mb-3 md:mb-5'>Help center</h4>
          <ul>
            <li className='md:mb-2 text-sm text-white'><Link href={WEBSITE_REGISTER}>Register</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={WEBSITE_LOGIN}>Login</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href={USER_DASHBOARD}>My Account</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href='/privacy-policy'>Privacy Policy</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href='/terms-and-conditions'>Terms & Condition</Link></li>
          </ul>
        </div>

        <div>
          <h4 className='text-white text-sm md:text-xl md:font-bold uppercase mb-3 md:mb-5 gap1'>Contact</h4>
          <ul className=''>
            <li className='md:mb-2 text-sm text-white flex flex-row'><Link href='' ><MapOutlined />Karachi, Pakistan</Link></li>
            <li className='md:mb-2 text-sm text-white flex flex-row'><Link href='' ><PhoneOutlined />+92-317-1232544</Link></li>
            <li className='md:mb-2 text-sm text-white flex flex-row'><Link href='' ><Email />support@eventsora.com</Link></li>
            <ul className='flex gap-4 '>
              <li className='md:mb-2 text-sm text-white flex flex-row '><Link href=''><Instagram /></Link></li>
              <li className='md:mb-2 text-sm text-white flex flex-row '><Link href=''><Facebook /></Link></li>
            </ul>
          </ul>
        </div>


      </div>
      <div className='flex items-center justify-center text-white text-sm py-2 bg-orange-500/10'>
        &copy; All Rights Reserved
      </div>


    </footer>
  )
}

export default Footer

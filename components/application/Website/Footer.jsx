import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/eventsoraWhite.png'
import React from 'react'
import { Email, Facebook, Instagram, MapOutlined, PhoneOutlined } from '@mui/icons-material'
import { WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/AdminPanelRoute'
import { USER_DASHBOARD, WEBSITE_CATEGORY } from '@/routes/WebsiteRoute'
import { Pin } from 'lucide-react'
import { BsTiktok } from 'react-icons/bs'

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
            <li className='md:mb-2 text-sm text-white'><Link href='/about'>About</Link></li>
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
            <li className='md:mb-2 text-sm text-white'><Link href='/refund-policy'>Refund Policy</Link></li>
            <li className='md:mb-2 text-sm text-white'><Link href='/terms-and-conditions'>Terms & Condition</Link></li>
          </ul>
        </div>

        <div>
          <h4 className='text-white text-sm md:text-xl md:font-bold uppercase mb-3 md:mb-5 gap-2'>Contact</h4>
          <ul className=''>
            <li className='gap-2 md:mb-2 text-sm text-white flex flex-row'><Pin />R-324 Shop #04, Pakistan</li>
            <li className='gap-2 md:mb-2 text-sm text-white flex flex-row'><MapOutlined />Karachi, Pakistan</li>
            <li className='gap-2 md:mb-2 text-sm text-white flex flex-row'><PhoneOutlined />+92-370-0182844</li>
            <li className='gap-2 md:mb-2 text-sm text-white flex flex-row'><Email />admin@eventsora.com</li>
            <ul className='flex gap-4 '>
              <li className='md:mb-2 text-sm text-white flex flex-row '><Link target='_blank' href='https://www.instagram.com/eventsora.pk/'><Instagram /></Link></li>
              <li className='md:mb-2 text-sm text-white flex flex-row '><Link target='_blank' href='https://www.facebook.com/profile.php?id=61573845701383'><Facebook /></Link></li>
              <li className='md:mb-2 text-sm text-white flex flex-row '><Link target='_blank' href='https://www.tiktok.com/@eventsora'><BsTiktok /></Link></li>
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

'use client'
import React from 'react'
import ThemeSwitch from '../Website/ThemeSwitch'
import UserDropdown from '../Main/UserDropdown'
import logo from '@/public/assets/eventsora.png'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import Image from 'next/image'
import ProviderSearch from './ProviderSearch'
import ProviderMobileSearch from './ProviderMobileSearch'

const Topbar = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <div className='fixed border h-14 w-full top-0 left-0 z-30 md:pl-72 pe-8 px-5 flex items-center justify-between bg-white dark:bg-card  '>
      <div className='flex items-center md:hidden'>
        <Image className='w-auto h-20 object-contain' src={logo.src} alt='EventSora Logo' width={200} height={200} priority />
      </div>
      <div className='md:block hidden'>
        <ProviderSearch />
      </div>

      <div className='flex gap-5 items-center'>
        <ProviderMobileSearch />
        <UserDropdown />
        <ThemeSwitch />

        <Button onClick={toggleSidebar} className="ms-2 md:hidden " type="button" size="icon" >
          <Menu />
        </Button>
      </div>

    </div>
  )
}

export default Topbar
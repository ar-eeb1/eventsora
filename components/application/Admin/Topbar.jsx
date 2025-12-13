'use client'
import React from 'react'
import ThemeSwitch from '../Website/ThemeSwitch'
import UserDropdown from '../Main/UserDropdown'
import logo from '@/public/assets/eventsora.png'

import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import Image from 'next/image'

const Topbar = () => {
  const { toggleSidebar } = useSidebar()
  return (
    // <div className='fixed w-screen md:w-full lg:w-[85%] h-14 z-30 flex justify-between items-center bg-white dark:bg-card p-5 md:pr-5 lg:pr-20 '>
    <div className='fixed border h-14 w-full top-0 left-0 z-30 md:pl-72 pe-8 px-5 flex items-center justify-between bg-white dark:bg-card  '>
      <div className='flex items-center pt-2 md:hidden'>
        <Image className="h-[90px] w-auto " src={logo.src} alt="logo" width={220} height={50} />
      </div>

      <div className='md:block hidden'>SEARCH COMPONENT</div>
      <div className='flex gap-5 items-center'>
        <UserDropdown />
        <ThemeSwitch />

        {/* <Button onClick={toggleSidebar} className='cursor-pointer lg:hidden' type="button" size='icon'> */}
        <Button onClick={toggleSidebar} className="ms-2 md:hidden " type="button" size="icon" >
          <Menu />
        </Button>
      </div>

    </div>
  )
}

export default Topbar
'use client'
import React from 'react'
import ThemeSwitch from '../Website/ThemeSwitch'
import logo from '@/public/assets/eventsora.png'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import Image from 'next/image'
import ProviderSearch from './ProviderSearch'
import ProviderMobileSearch from './ProviderMobileSearch'
import ProviderDropDown from './ProviderDropdown'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import Pusher from 'pusher-js'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const Topbar = () => {
  const { toggleSidebar } = useSidebar()
  const { auth: user } = useSelector(state => state.authStore)
  const [hasUnread, setHasUnread] = useState(false)
  const pathname = usePathname()

  // Initial check for unread messages
  useEffect(() => {
    if (!user) return
    const checkUnread = async () => {
      try {
        const { data } = await axios.get('/api/message/conversation/get')
        if (data.success) {
          setHasUnread(data.data.some(c => !c.isRead))
        }
      } catch (err) {
        console.error('Failed to check unread messages:', err)
      }
    }
    checkUnread()
  }, [user])

  // Real-time notification with Pusher
  useEffect(() => {
    if (!user?._id) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })

    const channel = pusher.subscribe(`user-${user._id}`)
    channel.bind('conversation-update', (data) => {
      setHasUnread(true)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [user?._id])

  // Clear dot if we are on messages page
  useEffect(() => {
    if (pathname.includes('/provider/messages')) {
      setHasUnread(false)
    }
  }, [pathname])

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
        <Link href="/provider/messages" className="relative p-2 text-gray-500 hover:text-primary transition-colors">
          <Mail size={22} />
          {hasUnread && (
            <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
          )}
        </Link>
        <ProviderDropDown />
        <ThemeSwitch />

        <Button onClick={toggleSidebar} className="ms-2 md:hidden " type="button" size="icon" >
          <Menu />
        </Button>
      </div>

    </div>
  )
}

export default Topbar
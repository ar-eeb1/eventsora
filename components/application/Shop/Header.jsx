'use client'
import { WEBSITE_HOME, WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { joinSocketRooms, socket } from '@/lib/socket'
import axios from 'axios'
import logo from '@/public/assets/eventsora.png'
import Image from 'next/image'
import { CircleUserRound, ShoppingCart, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { SHOP_CART, USER_DASHBOARD, WEBSITE_MESSAGES } from '@/routes/WebsiteRoute'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import ShopCategories from './Categories'

import profileIcon from '@/public/assets/user.png'
import { CiMenuFries } from "react-icons/ci";

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Header = () => {
  const auth = useSelector(store => store.authStore.auth)
  const cartCount = useSelector(store => (store.bookingStore.productCart || []).reduce((count, item) => count + item.quantity, 0))
  const pathname = usePathname()
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  // Initial check for unread messages
  useEffect(() => {
    if (!auth) return
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
  }, [auth])

  // Real-time notification with Socket.IO
  useEffect(() => {
    if (!auth?._id) return

    const cleanupRooms = joinSocketRooms({ userId: auth._id })
    const handleConversationUpdate = () => {
      // If we are already on the messages page for this conversation, don't show dot?
      // Actually, always show it if it's a new message event
      setHasUnread(true)
    }
    socket.on('conversation-update', handleConversationUpdate)

    return () => {
      cleanupRooms()
      socket.off('conversation-update', handleConversationUpdate)
    }
  }, [auth?._id])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenu(prev => !prev)
  }, [])

  const closeMobileMenu = () => setIsMobileMenu(false)

  return (
    <div className='lg:px-12 px-4 bg-[#fce5f0] md:mx-5 rounded-b-2xl sticky top-0 z-50'>
      <div className='flex justify-between items-center  max-w-screen-2xl mx-auto'>

        {/* LOGO */}
        <Link href={WEBSITE_HOME}>
          <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-34 md:w-52' />
        </Link>

        <div className='flex items-center gap-3 md:gap-8'>

          {/* DESKTOP & MOBILE NAV */}
          <nav className={`
                        fixed inset-0 z-[60] bg-pink-100 transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:bg-transparent lg:translate-x-0
                        ${isMobileMenu ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
            {/* MOBILE MENU HEADER */}
            <div className='lg:hidden flex justify-between items-center px-6 border-b bg-pink-100'>
              <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-32' />
              <button onClick={toggleMobileMenu} className='text-pink-900 p-1 cursor-pointer'>
                <X size={28} />
              </button>
            </div>

            {/* NAV LINKS */}
            <ul className='flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 lg:p-0 lg:gap-10 h-screen bg-pink-900 text-white font-medium lg:h-auto lg:bg-transparent lg:text-pink-900'>
              <li className='hover:text-pink-600 lg:hover:text-pink-700 transition-colors' onClick={closeMobileMenu}>
                <Link href={WEBSITE_HOME}>Home</Link>
              </li>
              <li className='w-full lg:w-auto'>
                <ShopCategories onItemClick={closeMobileMenu} />
              </li>
              <li className='hover:text-pink-600 lg:hover:text-pink-700 transition-colors' onClick={closeMobileMenu}>
                <Link href={WEBSITE_HOME}>Cakes</Link>
              </li>
              <li className='hover:text-pink-600 lg:hover:text-pink-700 transition-colors' onClick={closeMobileMenu}>
                <Link href={WEBSITE_HOME}>Baskets</Link>
              </li>
              <li className='hover:text-pink-600 lg:hover:text-pink-700 transition-colors' onClick={closeMobileMenu}>
                <Link href={WEBSITE_HOME}>Cards</Link>
              </li>
            </ul>
          </nav>

          {/* BACKDROP FOR MOBILE */}
          {isMobileMenu && (
            <div
              className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
              onClick={toggleMobileMenu}
            />
          )}

          {/* RIGHT ACTIONS */}
          <div className='flex items-center gap-3 md:gap-6'>


            <Link href={SHOP_CART} aria-label={`Cart, ${cartCount} items`} title='Cart' className='relative p-1 text-pink-900'>
              <ShoppingCart size={23} aria-hidden='true' />
              {cartCount > 0 && (
                <span className='absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-pink-900 px-1 text-[10px] font-semibold text-white'>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href={WEBSITE_MESSAGES} onClick={() => setHasUnread(false)} className="p-1 relative">
              <ChatBubbleOutlineIcon className='text-pink-900 hover:text-pink-900/30' sx={{ fontSize: { xs: 22, md: 24 } }} />
              {hasUnread && !pathname.includes('/messages') && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-pink-900 animate-pulse" />
              )}
            </Link>


            {!auth ? (
              <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(pathname)}`}>
                <div className='flex items-center gap-2 bg-pink-900/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all'>
                  <CircleUserRound className='text-pink-900' size={20} />
                  <span className='text-xs font-bold text-pink-900 hidden sm:block'>LOGIN</span>
                </div>
              </Link>
            ) : (
              <Link href={USER_DASHBOARD}>
                <Avatar className='md:size-10 size-8 border border-black'>
                  <AvatarImage src={auth?.avatar?.url || profileIcon.src} />
                </Avatar>
              </Link>
            )}

            {/* MOBILE HAMBURGER */}
            <button
              type='button'
              className='lg:hidden p-1 text-pink-900 cursor-pointer'
              onClick={toggleMobileMenu}
            >
              <CiMenuFries size={26} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
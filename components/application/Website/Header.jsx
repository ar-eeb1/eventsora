'use client'
import { WEBSITE_HOME, WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Pusher from 'pusher-js'
import axios from 'axios'
import logo from '@/public/assets/eventsoraWhite.png'
import Image from 'next/image'
import Categories from './Categories'
import { CircleUserRound, SearchIcon, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { USER_DASHBOARD, WEBSITE_CATEGORY, WEBSITE_MESSAGES } from '@/routes/WebsiteRoute'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import Booking from './Booking'
import profileIcon from '@/public/assets/user.png'
import { CiMenuFries } from "react-icons/ci";
import Search from './Search'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Header = () => {
    const auth = useSelector(store => store.authStore.auth)
    const pathname = usePathname()
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
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

    // Real-time notification with Pusher
    useEffect(() => {
        if (!auth?._id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        })

        const channel = pusher.subscribe(`user-${auth._id}`)
        channel.bind('conversation-update', (data) => {
            // If we are already on the messages page for this conversation, don't show dot?
            // Actually, always show it if it's a new message event
            setHasUnread(true)
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }, [auth?._id])

    // Clear dot if we navigate to messages
    useEffect(() => {
        if (pathname.includes('/messages')) {
            setHasUnread(false)
        }
    }, [pathname])

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenu(prev => !prev)
    }, [])

    const closeMobileMenu = () => setIsMobileMenu(false)

    const toggleSearch = useCallback(() => {
        setShowSearch(prev => !prev)
    }, [])

    return (
        <div className='lg:px-12 px-4 bg-pink-900 md:mx-5 rounded-b-2xl sticky top-0 z-50'>
            <div className='flex justify-between items-center lg:py-5 py-4 max-w-screen-2xl mx-auto'>

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
                        <div className='lg:hidden flex justify-between items-center py-5 px-6 border-b bg-pink-900'>
                            <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-32' />
                            <button onClick={toggleMobileMenu} className='text-white p-1'>
                                <X size={28} />
                            </button>
                        </div>

                        {/* NAV LINKS */}
                        <ul className='flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 lg:p-0 lg:gap-10 text-gray-800 lg:text-white font-medium'>
                            <li className='hover:text-pink-500 lg:hover:text-pink-200 transition-colors' onClick={closeMobileMenu}>
                                <Link href={WEBSITE_HOME}>Home</Link>
                            </li>
                            <li className='w-full lg:w-auto hover:text-pink-500'>
                                <Categories />
                            </li>
                            <li className='hover:text-pink-500 lg:hover:text-pink-200 transition-colors' onClick={closeMobileMenu}>
                                <Link href={WEBSITE_CATEGORY('venues')}>Venues</Link>
                            </li>
                            <li className='hover:text-pink-500 lg:hover:text-pink-200 transition-colors' onClick={closeMobileMenu}>
                                <Link href={WEBSITE_CATEGORY('entertainment')}>Entertainment</Link>
                            </li>
                            <li className='opacity-50 line-through cursor-not-allowed'>
                                Shop
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
                        <button type='button' onClick={toggleSearch} className="p-1">
                            <SearchIcon className='hover:text-pink-100 cursor-pointer text-white md:size-6 size-5' />
                        </button>
                        
                        <Link href={WEBSITE_MESSAGES} className="p-1 relative">
                            <ChatBubbleOutlineIcon className='text-white' sx={{ fontSize: { xs: 22, md: 24 } }} />
                            {hasUnread && (
                                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-pink-900 animate-pulse" />
                            )}
                        </Link>

                        <Booking />

                        {!auth ? (
                            <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(pathname)}`}>
                                <div className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all'>
                                    <CircleUserRound className='text-white' size={20} />
                                    <span className='text-xs font-bold text-white hidden sm:block'>LOGIN</span>
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
                            className='lg:hidden p-1 text-white' 
                            onClick={toggleMobileMenu}
                        >
                            <CiMenuFries size={26} />
                        </button>
                    </div>
                </div>
            </div>
            <Search isShow={showSearch} onClose={() => setShowSearch(false)} />
        </div>
    )
}

export default Header
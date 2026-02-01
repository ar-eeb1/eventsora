'use client'
import { WEBSITE_HOME, WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React, { useState } from 'react'
import logo from '@/public/assets/eventsoraWhite.png'
import Image from 'next/image'
import Categories from './Categories'
import { CircleUserRound, SearchIcon, X } from 'lucide-react'
import Booking from './Booking'
import { useSelector } from 'react-redux'
import { USER_DASHBOARD, WEBSITE_CATEGORY, WEBSITE_MESSAGES } from '@/routes/WebsiteRoute'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import profileIcon from '@/public/assets/user.png'
import { CiMenuFries } from "react-icons/ci";
import Search from './Search'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
const Header = () => {
    const auth = useSelector(store => store.authStore.auth)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    return (
        <div className='border-b lg:px-12 px-4 bg-[#CE416F] mx-5 rounded-b-2xl sticky top-0 z-50'>
            <div className='flex justify-between items-center lg:py-5 py-4 max-w-screen-2xl mx-auto'>

                <Link href={WEBSITE_HOME}>
                    <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-52' />
                </Link>
                <div className='flex justify-between gap-20'>
                    <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 lg:p-0 lg:h-auto lg:bg-transparent bg-white fixed z-50 top-0 w-full h-screen transition-all duration-500 ease-in-out ${isMobileMenu ? 'right-0' : '-right-full'}`}>

                        {/* FOR MOBILE */}
                        <div className='lg:hidden bg-[#CE416F] flex justify-between items-center py-4 border-b border-gray-200 px-4 shadow-sm'>
                            <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-52' />
                            <button type='button' className='p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95' onClick={() => setIsMobileMenu(!isMobileMenu)}>
                                <X className='text-white ' size={25} />
                            </button>
                        </div>

                        <ul className='lg:flex lg:text-white text-black lg:justify-between lg:items-center lg:gap-10 lg:flex-row lg:px-0 px-6 flex flex-col items-center gap-5  lg:pt-1 pt-8'>
                            <li className='hover:font-semibold'>
                                <Link href={WEBSITE_HOME} className='block py-0'>
                                    Home
                                </Link>
                            </li>
                            <li className='hover:font-semibold '>
                                {/* <Link href={WEBSITE_HOME} className='block py-0'> */}
                                <Categories />
                                {/* </Link> */}
                            </li>
                            <li className='hover:font-semibold'>
                                <Link href={WEBSITE_CATEGORY('venues')} className='block py-0'>
                                    Venues
                                </Link>
                            </li>
                            <li className='hover:font-semibold'>
                                <Link href={WEBSITE_HOME} className='block py-0'>
                                    Caterers
                                </Link>
                            </li>
                            <li className='hover:font-semibold line-through cursor-none' title='Coming Soon'>
                                {/* <Link href={WEBSITE_HOME} className='block py-0'> */}
                                Shop
                                {/* </Link> */}
                            </li>

                        </ul>
                    </nav>
                    <div className='flex justify-between items-center gap-8'>
                        <button type='button' onClick={() => setShowSearch(!showSearch)}>
                            <SearchIcon className='hover:text-pink-100 cursor-pointer text-white' />
                        </button>
                        <Link href={WEBSITE_MESSAGES}>
                            <ChatBubbleOutlineIcon className='text-white' />
                        </Link>
                        {!auth
                            ?
                            <Link href={WEBSITE_LOGIN} className=' text-white'>
                                <div className='flex justify-center items-end gap-3 bg-white/40 px-2 py-1 rounded-2xl'>
                                    <CircleUserRound className='text-pink-200' size={25} />
                                    <span className='text-md text-white'>SIGNUP/LOGIN</span>
                                </div>
                            </Link>
                            :
                            <Link href={USER_DASHBOARD}>
                                <Avatar>
                                    <AvatarImage src={auth?.avatar?.url || profileIcon.src} />
                                </Avatar>
                            </Link>
                        }
                        <button type='button' className='cursor-pointer lg:hidden block' onClick={() => setIsMobileMenu(!isMobileMenu)}>
                            <CiMenuFries className='text-white ' size={25} />
                        </button>

                    </div>
                </div>
            </div>
            <Search isShow={showSearch} onClose={() => setShowSearch(false)} />
        </div>
    )
}

export default Header


// 'use client'
// import { WEBSITE_HOME, WEBSITE_LOGIN } from '@/routes/AdminPanelRoute'
// import Link from 'next/link'
// import React from 'react'
// import logo from '@/public/assets/eventsoraWhite.png'
// import Image from 'next/image'
// import Categories from './Categories'
// import { CircleUserRound, CrossIcon, Search, X } from 'lucide-react'
// import Booking from './Booking'
// import { useSelector } from 'react-redux'
// import { USER_DASHBOARD } from '@/routes/WebsiteRoute'
// import { Avatar, AvatarImage } from '@/components/ui/avatar'
// import profileIcon from '@/public/assets/user.png'
// import { CiMenuFries } from "react-icons/ci";


// const Header = () => {
//     const auth = useSelector(store => store.authStore.auth)

//     return (
//         <div className='border-b lg:px-12 px-4 bg-[#CE416F]  mx-5 rounded-b-2xl  '>
//             <div className='flex justify-between items-center lg:py-5 py-3'>
//                 <Link href={WEBSITE_HOME}>
//                     <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-52'></Image>
//                 </Link>
//                 <div className='flex justify-between gap-20'>
//                     <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen left-0`}>

//                         {/* FOR MOBILE */}
//                         <div className='lg:hidden flex justify-between bg-gray-50 items-center py-3 px-3 border-b'>
//                             <Image src={logo.src} width={logo.width} height={logo.height} alt='Logo' className='w-52'></Image>
//                             <button type='button' className='cursor-pointer'>
//                                 <X className='text-white ' size={25} />
//                             </button>
//                         </div>

//                         <ul className='lg:flex justify-between items-center gap-5'>
//                             <li className='text-white  hover:font-semibold'>
//                                 <Link href={WEBSITE_HOME} className='block py-0'>
//                                     Home
//                                 </Link>
//                             </li>
//                             <li className='text-white  hover:font-semibold'>
//                                 {/* <Link href={WEBSITE_HOME} className='block py-0'> */}
//                                 <Categories />
//                                 {/* </Link> */}
//                             </li>
//                             <li className='text-white  hover:font-semibold'>
//                                 <Link href={WEBSITE_HOME} className='block py-0'>
//                                     Photographers
//                                 </Link>
//                             </li>
//                             <li className='text-white  hover:font-semibold'>
//                                 <Link href={WEBSITE_HOME} className='block py-0'>
//                                     Caterers
//                                 </Link>
//                             </li>
//                             <li className='text-white  hover:font-semibold line-through cursor-none' title='Coming Soon'>
//                                 {/* <Link href={WEBSITE_HOME} className='block py-0'> */}
//                                 Shop
//                                 {/* </Link> */}
//                             </li>

//                         </ul>
//                     </nav>
//                     <div className='flex justify-between items-center gap-8'>
//                         <button type='button'>
//                             <Search className='hover:text-pink-100 cursor-pointer text-white' />
//                         </button>

//                         <Booking />
//                         {!auth
//                             ?
//                             <Link href={WEBSITE_LOGIN} className=' text-white'>
//                                 <div className='flex justify-center items-end gap-3 bg-white/40 px-2 py-1 rounded-2xl'>
//                                     <CircleUserRound className='text-pink-200' size={25} />
//                                     <span className='text-md text-white'>SIGNUP/LOGIN</span>
//                                 </div>
//                             </Link>
//                             :
//                             <Link href={USER_DASHBOARD}>
//                                 <Avatar>
//                                     <AvatarImage src={auth?.avatar?.url || profileIcon.src} />
//                                 </Avatar>
//                             </Link>
//                         }
//                         <button type='button' className='cursor-pointer lg:hidden block'>
//                             <CiMenuFries className='text-white ' size={25} />
//                         </button>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Header

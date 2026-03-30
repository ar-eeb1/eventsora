// 'use client'
// import Link from 'next/link'
// import { Banknote, Calendar, CalendarCheck, List } from 'lucide-react';
// import React from 'react'
// import useFetch from '@/hooks/useFetch';
// import { PROVIDER_BOOKINGS_PENDING, PROVIDER_LISTING_SHOW } from '@/routes/ProviderPanelRoute';


// const CountOverview = () => {

//     const { data: countData } = useFetch('/api/provider/dashboard/count')

//     return (
//         <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-5 lg:gap-5">
//             <Link href={PROVIDER_BOOKINGS_PENDING}>
//                 <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-orange-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-orange-800'>
//                     <div>
//                         <h4 className='font-medium text-gray-500'>New Bookings</h4>
//                         <span className='text-xl font-bold'>{countData?.data?.pendingBookings || 0}</span>
//                     </div>
//                     <div>
//                         <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-orange-500 dark:bg-orange-800 text-white'><Banknote size={20} /></span>
//                     </div>
//                 </div>
//             </Link>
//             <Link href={PROVIDER_LISTING_SHOW}>
//                 <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-pink-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-pink-800'>
//                     <div>
//                         <h4 className='font-medium text-gray-500'>My Listings</h4>
//                         <span className='text-xl font-bold'>{countData?.data?.listing || 0}</span>
//                     </div>
//                     <div>
//                         <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-pink-500 dark:bg-pink-800 text-white'><List size={20} /></span>
//                     </div>
//                 </div>
//             </Link>
//             <Link href={''}>
//                 <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-rose-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-rose-800'>
//                     <div>
//                         <h4 className='font-medium text-gray-500'>Bookings</h4>
//                         <span className='text-xl font-bold'>{countData?.data?.bookings || 0}</span>
//                     </div>
//                     <div>
//                         <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-rose-500 dark:bg-rose-800 text-white'><Calendar size={20} /></span>
//                     </div>
//                 </div>
//             </Link>
//             <Link href={''}>
//                 <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-fuchsia-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-fuchsia-800'>
//                     <div>
//                         <h4 className='font-medium text-gray-500'>Today Booking</h4>
//                         <span className='text-xl font-bold'>{countData?.data?.todayBookings || 0}</span>
//                     </div>
//                     <div>
//                         <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-fuchsia-500 dark:bg-fuchsia-800 text-white'><CalendarCheck size={20} /></span>
//                     </div>
//                 </div>
//             </Link>
//             <Link href={''}>
//                 <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-purple-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-purple-800'>
//                     <div>
//                         <h4 className='font-medium text-gray-500'>Earnings</h4>
//                         <span className='text-xl font-bold'>{countData?.data?.earnings?.toLocaleString() || 0}</span>
//                     </div>
//                     <div>
//                         <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-purple-500 dark:bg-purple-800 text-white'><Banknote size={20} /></span>
//                     </div>
//                 </div>
//             </Link>

//         </div>
//     )
// }

// export default CountOverview

'use client'
import Link from 'next/link'
import { Banknote, Calendar, CalendarCheck, List } from 'lucide-react';
import React from 'react'
import useFetch from '@/hooks/useFetch';
import { PROVIDER_BOOKINGS_PENDING, PROVIDER_LISTING_SHOW } from '@/routes/ProviderPanelRoute';

const CountOverview = () => {

    const { data: countData } = useFetch('/api/provider/dashboard/count')

    const cardStyle = "group flex items-center justify-between p-4 rounded-xl border bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1";

    const titleStyle = "text-sm font-medium text-gray-500 dark:text-gray-400";
    const valueStyle = "text-2xl font-semibold text-gray-900 dark:text-white";

    const iconWrapper = "w-12 h-12 flex justify-center items-center rounded-full text-white shadow-md";

    return (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">

            {/* New Bookings */}
            <Link href={PROVIDER_BOOKINGS_PENDING}>
                <div className={`${cardStyle}`}>
                    <div>
                        <h4 className={titleStyle}>New Bookings</h4>
                        <span className={valueStyle}>{countData?.data?.pendingBookings || 0}</span>
                    </div>
                    <div className={`${iconWrapper} bg-linear-to-tr from-amber-400 to-orange-600`}>
                        <Banknote size={20} />
                    </div>
                </div>
            </Link>

            {/* Listings */}
            <Link href={PROVIDER_LISTING_SHOW}>
                <div className={cardStyle}>
                    <div>
                        <h4 className={titleStyle}>My Listings</h4>
                        <span className={valueStyle}>{countData?.data?.listing || 0}</span>
                    </div>
                    <div className={`${iconWrapper} bg-linear-to-tr from-pink-400 to-rose-500`}>
                        <List size={20} />
                    </div>
                </div>
            </Link>

            {/* Bookings */}
            <Link href={''}>
                <div className={cardStyle}>
                    <div>
                        <h4 className={titleStyle}>Bookings</h4>
                        <span className={valueStyle}>{countData?.data?.bookings || 0}</span>
                    </div>
                    <div className={`${iconWrapper} bg-linear-to-tr from-rose-400 to-red-500`}>
                        <Calendar size={20} />
                    </div>
                </div>
            </Link>

            {/* Today Booking */}
            <Link href={''}>
                <div className={cardStyle}>
                    <div>
                        <h4 className={titleStyle}>Today Booking</h4>
                        <span className={valueStyle}>{countData?.data?.todayBookings || 0}</span>
                    </div>
                    <div className={`${iconWrapper} bg-linear-to-tr from-fuchsia-500 to-purple-600`}>
                        <CalendarCheck size={20} />
                    </div>
                </div>
            </Link>

            {/* Earnings */}
            <Link href={''}>
                <div className={cardStyle}>
                    <div>
                        <h4 className={titleStyle}>Earnings</h4>
                        <span className={valueStyle}>
                            {countData?.data?.earnings?.toLocaleString() || 0}
                        </span>
                    </div>
                    <div className={`${iconWrapper} bg-linear-to-tr from-indigo-500 to-purple-700`}>
                        <Banknote size={20} />
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default CountOverview
// 'use client'
// import React from 'react'
// import useFetch from '@/hooks/useFetch'
// import { CalendarDays, TrendingUp, Clock } from 'lucide-react'
// import Link from 'next/link'
// import { PROVIDER_BOOKINGS_SHOW } from '@/routes/ProviderPanelRoute'

// const formatAmount = (amount) => {
//     if (!amount) return 'Rs 0'
//     if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(1)}M`
//     if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(0)}K`
//     return `Rs ${amount.toLocaleString()}`
// }

// const BookingStats = () => {
//     const { data: countData } = useFetch('/api/provider/dashboard/count')
//     const d = countData?.data

//     return (
//         <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-5 lg:gap-5 mt-5">
//             {/* Monthly Bookings */}
//             <Link href={PROVIDER_BOOKINGS_SHOW}>
//                 <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-sky-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-sky-600 hover:shadow-md transition-shadow'>
//                     <div>
//                         <h4 className='font-medium text-gray-500 text-sm'>Monthly Bookings</h4>
//                         <span className='text-2xl font-bold'>{d?.monthlyBookings || 0}</span>
//                         <p className='text-xs text-gray-400 mt-0.5'>
//                             <span className='text-green-600 font-semibold'>{d?.monthlyConfirmed || 0} confirmed</span>
//                         </p>
//                     </div>
//                     <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-sky-500 dark:bg-sky-700 text-white shrink-0'>
//                         <CalendarDays size={20} />
//                     </span>
//                 </div>
//             </Link>

//             {/* Total Revenue (Advance Received) */}
//             <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-emerald-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-emerald-600'>
//                 <div>
//                     <h4 className='font-medium text-gray-500 text-sm'>Total Revenue</h4>
//                     <span className='text-2xl font-bold'>{formatAmount(d?.totalAdvance)}</span>
//                     <p className='text-xs text-gray-400 mt-0.5'>Advance received</p>
//                 </div>
//                 <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-emerald-500 dark:bg-emerald-700 text-white shrink-0'>
//                     <TrendingUp size={20} />
//                 </span>
//             </div>

//             {/* Pending Payments (Remaining Balance) */}
//             <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-amber-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-amber-600'>
//                 <div>
//                     <h4 className='font-medium text-gray-500 text-sm'>Pending Payments</h4>
//                     <span className='text-2xl font-bold'>{formatAmount(d?.pendingPayments)}</span>
//                     <p className='text-xs text-gray-400 mt-0.5'>Remaining balance</p>
//                 </div>
//                 <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-amber-500 dark:bg-amber-700 text-white shrink-0'>
//                     <Clock size={20} />
//                 </span>
//             </div>
//         </div>
//     )
// }

// export default BookingStats

'use client'
import React from 'react'
import useFetch from '@/hooks/useFetch'
import { CalendarDays, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { PROVIDER_BOOKINGS_SHOW } from '@/routes/ProviderPanelRoute'

const formatAmount = (amount) => {
    if (!amount) return 'Rs 0'
    if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(0)}K`
    return `Rs ${amount.toLocaleString()}`
}

const BookingStats = () => {
    const { data: countData } = useFetch('/api/provider/dashboard/count')
    const d = countData?.data

    const cardStyle = "group flex items-center justify-between p-5 rounded-xl border bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1";

    const titleStyle = "text-sm font-medium text-gray-500 dark:text-gray-400";
    const valueStyle = "text-2xl font-semibold text-gray-900 dark:text-white";
    const subText = "text-xs text-gray-400 mt-1";

    const iconWrapper = "w-12 h-12 flex justify-center items-center rounded-full text-white shadow-md shrink-0";

    return (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-2">

            {/* Monthly Bookings */}
            <Link href={PROVIDER_BOOKINGS_SHOW}>
                <div className={cardStyle}>
                    <div>
                        <h4 className={titleStyle}>Monthly Bookings</h4>
                        <span className={valueStyle}>{d?.monthlyBookings || 0}</span>
                        <p className={subText}>
                            <span className='text-emerald-500 font-medium'>
                                {d?.monthlyConfirmed || 0} confirmed
                            </span>
                        </p>
                    </div>
                    <div className={`${iconWrapper} bg-gradient-to-tr from-sky-400 to-blue-600`}>
                        <CalendarDays size={20} />
                    </div>
                </div>
            </Link>

            {/* Total Revenue */}
            <div className={cardStyle}>
                <div>
                    <h4 className={titleStyle}>Total Revenue</h4>
                    <span className={valueStyle}>{formatAmount(d?.totalAdvance)}</span>
                    <p className={subText}>Advance received</p>
                </div>
                <div className={`${iconWrapper} bg-gradient-to-tr from-emerald-400 to-green-600`}>
                    <TrendingUp size={20} />
                </div>
            </div>

            {/* Pending Payments */}
            <div className={cardStyle}>
                <div>
                    <h4 className={titleStyle}>Pending Payments</h4>
                    <span className={valueStyle}>{formatAmount(d?.pendingPayments)}</span>
                    <p className={subText}>Remaining balance</p>
                </div>
                <div className={`${iconWrapper} bg-gradient-to-tr from-amber-400 to-orange-600`}>
                    <Clock size={20} />
                </div>
            </div>

        </div>
    )
}

export default BookingStats
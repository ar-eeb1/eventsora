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

    return (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-5 lg:gap-5 mt-5">
            {/* Monthly Bookings */}
            <Link href={PROVIDER_BOOKINGS_SHOW}>
                <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-sky-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-sky-600 hover:shadow-md transition-shadow'>
                    <div>
                        <h4 className='font-medium text-gray-500 text-sm'>Monthly Bookings</h4>
                        <span className='text-2xl font-bold'>{d?.monthlyBookings || 0}</span>
                        <p className='text-xs text-gray-400 mt-0.5'>
                            <span className='text-green-600 font-semibold'>{d?.monthlyConfirmed || 0} confirmed</span>
                        </p>
                    </div>
                    <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-sky-500 dark:bg-sky-700 text-white shrink-0'>
                        <CalendarDays size={20} />
                    </span>
                </div>
            </Link>

            {/* Total Revenue (Advance Received) */}
            <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-emerald-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-emerald-600'>
                <div>
                    <h4 className='font-medium text-gray-500 text-sm'>Total Revenue</h4>
                    <span className='text-2xl font-bold'>{formatAmount(d?.totalAdvance)}</span>
                    <p className='text-xs text-gray-400 mt-0.5'>Advance received</p>
                </div>
                <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-emerald-500 dark:bg-emerald-700 text-white shrink-0'>
                    <TrendingUp size={20} />
                </span>
            </div>

            {/* Pending Payments (Remaining Balance) */}
            <div className='flex items-center justify-between p-4 rounded-lg border shadow border-l-4 border-l-amber-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-amber-600'>
                <div>
                    <h4 className='font-medium text-gray-500 text-sm'>Pending Payments</h4>
                    <span className='text-2xl font-bold'>{formatAmount(d?.pendingPayments)}</span>
                    <p className='text-xs text-gray-400 mt-0.5'>Remaining balance</p>
                </div>
                <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-amber-500 dark:bg-amber-700 text-white shrink-0'>
                    <Clock size={20} />
                </span>
            </div>
        </div>
    )
}

export default BookingStats

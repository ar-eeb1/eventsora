'use client'
import Link from 'next/link'
import { Banknote, Calendar, CalendarCheck, List, Loader2 } from 'lucide-react';
import React from 'react'
import useFetch from '@/hooks/useFetch';
import { PROVIDER_BOOKINGS_PENDING, PROVIDER_LISTING_SHOW } from '@/routes/ProviderPanelRoute';

const CountOverview = () => {
    const { data: countData, loading } = useFetch('/api/provider/dashboard/count')

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
                        <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : countData?.data?.pendingBookings || 0}</span>
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
                        <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : countData?.data?.listing || 0}</span>
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
                        <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : countData?.data?.bookings || 0}</span>
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
                        <span className={valueStyle}>{loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : countData?.data?.todayBookings || 0}</span>
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
                            {loading ? <Loader2 className='animate-spin w-6 h-6 inline' /> : countData?.data?.earnings?.toLocaleString() || 0}
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
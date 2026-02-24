'use client'
import Link from 'next/link'
import { Banknote, Calendar, CalendarCheck, List } from 'lucide-react';
import React from 'react'
import useFetch from '@/hooks/useFetch';
import { ADMIN_LISTING_SHOW } from '@/routes/AdminPanelRoute';


const CountOverview = () => {

    const { data: countData } = useFetch('/api/admin/dashboard/count')

    return (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:gap-10 gap-5 mt-4 lg:gap-5">
            <Link href={ADMIN_LISTING_SHOW}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-pink-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-pink-800'>
                    <div>
                        <h4 className='font-medium text-gray-500'>All Listings</h4>
                        <span className='text-xl font-bold'>{countData?.data?.listing || 0}</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-pink-500 dark:bg-pink-800 text-white'><List size={20} /></span>
                    </div>
                </div>
            </Link>
            <Link href={''}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-rose-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-rose-800'>
                    <div>
                        <h4 className='font-medium text-gray-500'>All Bookings</h4>
                        <span className='text-xl font-bold'>{countData?.data?.bookings || 0}</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-rose-500 dark:bg-rose-800 text-white'><Calendar size={20} /></span>
                    </div>
                </div>
            </Link>
            <Link href={''}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-fuchsia-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-fuchsia-800'>
                    <div>
                        <h4 className='font-medium text-gray-500'>Today Booking</h4>
                        <span className='text-xl font-bold'>10</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-fuchsia-500 dark:bg-fuchsia-800 text-white'><CalendarCheck size={20} /></span>
                    </div>
                </div>
            </Link>
            {/* <Link href={''}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-purple-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-purple-800'>
                    <div>
                        <h4 className='font-medium text-gray-500'>Earnings</h4>
                        <span className='text-xl font-bold'>10</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-purple-500 dark:bg-purple-800 text-white'><Banknote size={20} /></span>
                    </div>
                </div>
            </Link> */}
        </div>
    )
}

export default CountOverview
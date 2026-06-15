'use client'
import Link from 'next/link'
import { Banknote, Calendar, CalendarCheck, Earth, Landmark, List, MenuIcon, Plus, User } from 'lucide-react';
import React from 'react'
import useFetch from '@/hooks/useFetch';
import { MASTER_CATEGORY_ADD, MASTER_CITY_ADD, MASTER_COUNTRY_ADD, MASTER_LOCALITY_ADD, MASTER_LOCALITY_SHOW, MASTER_STATE_ADD, MASTER_SUB_CATEGORY_ADD, MASTER_SUBLOCALITY_ADD, MASTER_USER_SHOW } from '@/routes/MasterPanelRoute';
import { LocationCity } from '@mui/icons-material';


const CountOverview = () => {

    const { data: countData } = useFetch('/api/master/dashboard/count')

    return (
        <div className='mt-4'>
            <h1 className='bg-pink-200 p-3 rounded-md dark:bg-pink-900'>Summary</h1>
            <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-5 sm:gap-10 gap-5 mt-4'>
                <Link href={MASTER_CATEGORY_ADD}>
                    <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-pink-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-pink-800'>
                        <div>
                            <h4 className='font-medium text-gray-500'>Total Categories</h4>
                            <span className='text-xl font-bold'>{countData?.data?.categories || 0}</span>
                        </div>
                        <div>
                            <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-pink-500 dark:bg-pink-800 text-white'><List size={20} /></span>
                        </div>
                    </div>
                </Link>
                <Link href={MASTER_SUB_CATEGORY_ADD}>
                    <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-purple-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-purple-800'>
                        <div>
                            <h4 className='font-medium text-gray-500'>Total Subcategories</h4>
                            <span className='text-xl font-bold'>{countData?.data?.subcategories || 0}</span>
                        </div>
                        <div>
                            <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-purple-500 dark:bg-purple-800 text-white'><Banknote size={20} /></span>
                        </div>
                    </div>
                </Link>
                <Link href={''}>
                    <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-rose-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-rose-800'>
                        <div>
                            <h4 className='font-medium text-gray-500'>Total Listings</h4>
                            <span className='text-xl font-bold'>{countData?.data?.listing || 0}</span>
                        </div>
                        <div>
                            <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-rose-500 dark:bg-rose-800 text-white'><MenuIcon size={20} /></span>
                        </div>
                    </div>
                </Link>
                <Link href={MASTER_USER_SHOW}>
                    <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-fuchsia-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-fuchsia-800'>
                        <div>
                            <h4 className='font-medium text-gray-500'>Total Users</h4>
                            <span className='text-xl font-bold'>{countData?.data?.users || 0}</span>
                        </div>
                        <div>
                            <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-fuchsia-500 dark:bg-fuchsia-800 text-white'><User size={20} /></span>
                        </div>
                    </div>
                </Link>
                <Link href={MASTER_USER_SHOW}>
                    <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-fuchsia-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-fuchsia-800'>
                        <div>
                            <h4 className='font-medium text-gray-500'>Total Provider</h4>
                            <span className='text-xl font-bold'>{countData?.data?.provider || 0}</span>
                        </div>
                        <div>
                            <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-fuchsia-500 dark:bg-fuchsia-800 text-white'><User size={20} /></span>
                        </div>
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default CountOverview
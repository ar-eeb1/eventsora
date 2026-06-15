'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import UserPanelLayout from '@/components/application/Website/UserPanelLayout'
import useFetch from '@/hooks/useFetch'
import { USER_DASHBOARD, WEBSITE, WEBSITE_BOOKING_DETAILS, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import { ShoppingCart } from '@mui/icons-material'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const breadCrumbData = [
    { href: WEBSITE, label: 'Home' },
    { href: '', label: 'My Account' },
]
const MyAccount = () => {
    const { data: dashboardData } = useFetch('/api/website/dashboard')
    const booking = useSelector(store => store.bookingStore)


    return (
        <div className=''>
            <div className='pl-10 pt-10'>
                <BreadCrumb breadCrumbData={breadCrumbData} />
            </div>
            <UserPanelLayout>
                <div className='shadow rounded mb-5'>
                    <div className='p-5 text-xl font-semibold border'>
                        Dashboard
                    </div>
                    <div className='p-5'>
                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-10'>

                            <div className='flex items-center justify-between gap-5 border rounded p-3'>
                                <div className=''>
                                    <h4 className='font-semibold text-lg mb-1'>Total Bookings</h4>
                                    <span className='font-semibold text-gray-500'>{dashboardData?.data?.totalBookings || 0}</span>
                                </div>
                                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                                    <Calendar className='text-white' size={25} />
                                </div>
                            </div>

                            <div className='flex items-center justify-between gap-5 border rounded p-3'>
                                <div className=''>
                                    <h4 className='font-semibold text-lg mb-1'>Bookings in Cart</h4>
                                    <span className='font-semibold text-gray-500'>{booking.count}</span>
                                </div>
                                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                                    <ShoppingCart className='text-white' size={25} />
                                </div>
                            </div>
                        </div>

                        <div className='mt-5'>
                            <h4 className='text-lg font-semibold mb-3'>Recent Bookings</h4>

                            <div className='overflow-auto'>

                                <table className='w-full'>
                                    <thead>
                                        <tr>
                                            <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>
                                                Sr.No
                                            </th>
                                            <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>
                                                Booking ID
                                            </th>
                                            <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>
                                                Amount
                                            </th>
                                            <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dashboardData && dashboardData?.data?.recentBookings?.map((booking, i) => (
                                            <tr className='' key={booking._id}>
                                                <td className='text-start text-sm text-gray-500 p-2 font-bold'>{i + 1}</td>
                                                <td className='text-start text-sm text-gray-500 p-2 font-bold'><Link className='underline hover:text-pink-500 underline-offset-2' href={WEBSITE_BOOKING_DETAILS(booking?._id)}>
                                                    {booking?.booking_id || 'Link'}
                                                </Link></td>
                                                <td className='text-start text-sm text-gray-500 p-2 font-bold'>{booking?.totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</td>
                                                <td className='text-start text-sm text-gray-500 p-2 font-bold'>{booking?.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </UserPanelLayout>
        </div>
    )
}

export default MyAccount

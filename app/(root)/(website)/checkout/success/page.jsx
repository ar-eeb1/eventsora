'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight, Home, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import { USER_BOOKINGS, WEBSITE_BOOKINGS, WEBSITE_BOOKING_DETAILS } from '@/routes/WebsiteRoute'
import BreadCrumb from '@/components/application/BreadCrumb'

const breadCrumbData = [
    { href: WEBSITE_HOME, label: 'Home' },
    { href: '', label: 'Booking Success' },
]

const SuccessPage = () => {
    const searchParams = useSearchParams()
    const [bookingIds, setBookingIds] = useState([])

    useEffect(() => {
        const ids = searchParams.get('ids')
        if (ids) {
            setBookingIds(ids.split(','))
        }
    }, [searchParams])

    return (
        <div className='lg:px-32 px-4 mt-10 mb-20'>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <div className='max-w-2xl mx-auto mt-12 text-center'>
                <div className='flex justify-center mb-6'>
                    <div className='bg-green-100 p-4 rounded-full'>
                        <CheckCircle2 className='w-16 h-16 text-green-600' />
                    </div>
                </div>

                <h1 className='text-4xl font-bold text-gray-900 mb-4'>Booking Placed Successfully!</h1>
                <p className='text-lg text-gray-600 mb-10'>
                    Your order has been split by provider to ensure better coordination.
                    You will receive separate updates for each booking.
                </p>

                <div className='space-y-4 mb-12'>
                    <h2 className='text-xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-6'>
                        <Package className='w-5 h-5 text-pink-500' />
                        Your Booking IDs
                    </h2>

                    <div className='grid gap-4'>
                        {bookingIds.map((id, index) => (
                            <Link
                                key={id}
                                href={WEBSITE_BOOKING_DETAILS(id)}
                                className='flex items-center justify-between p-5 bg-pink-50 rounded-xl border border-pink-100 hover:border-pink-300 transition-all group'
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-pink-600 border border-pink-100'>
                                        {index + 1}
                                    </div>
                                    <div className='text-left'>
                                        <div className='text-sm text-pink-600 font-medium'>Booking ID</div>
                                        <div className='text-lg font-bold text-gray-900'>{id}</div>
                                    </div>
                                </div>
                                <ArrowRight className='w-5 h-5 text-pink-400 group-hover:translate-x-1 transition-transform' />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='flex flex-wrap justify-center gap-4'>
                    <Button asChild size='lg' className='rounded-full px-8'>
                        <Link href={USER_BOOKINGS} className='flex items-center gap-2'>
                            <Calendar className='w-5 h-5' />
                            View All Bookings
                        </Link>
                    </Button>
                    <Button variant='outline' asChild size='lg' className='rounded-full px-8'>
                        <Link href={WEBSITE_HOME} className='flex items-center gap-2'>
                            <Home className='w-5 h-5' />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SuccessPage

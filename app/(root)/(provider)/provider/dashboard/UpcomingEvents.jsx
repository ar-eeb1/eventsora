'use client'
import React from 'react'
import useFetch from '@/hooks/useFetch'
import { CalendarClock } from 'lucide-react'
import Link from 'next/link'
import { PROVIDER_BOOKINGS_DETAILS } from '@/routes/ProviderPanelRoute'
import StatusBadge from '@/components/application/StatusBadge'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr)
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
    return diff
}

const UpcomingEvents = () => {
    const { data, loading } = useFetch('/api/provider/dashboard/upcoming')
    const events = data?.data || []

    return (
        <Card className='mt-5 p-4 rounded-md'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                    <CalendarClock className='w-5 h-5 text-primary' />
                    {/* <span className='font-bold text-gray-900 dark:text-white text-lg'></span> */}
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Upcoming Events</h2>

                </div>
                <span className='text-xs text-gray-400'>Next scheduled events</span>
            </div>

            {loading ? (
                <div className='text-center py-6 text-gray-400 text-sm'>Loading...</div>
            ) : events.length === 0 ? (
                <div className='text-center py-8 text-gray-400 text-sm'>No upcoming events.</div>
            ) : (
                <div className='grid lg:grid-cols-1 grid-cols-1 gap-4'>
                    {events.map((evt) => {
                        const days = getDaysRemaining(evt.earliestDate)
                        const remaining = (evt.totalAmount || 0) - (evt.receivedAmount || 0)

                        return (
                            <Link key={evt._id} href={PROVIDER_BOOKINGS_DETAILS(evt.booking_id)} className='group'>
                                <div className='flex items-center gap-4 p-3 rounded-lg border bg-white dark:bg-card dark:border-gray-800 hover:border-pink-300 hover:shadow-md transition-all'>
                                    {/* Image Thumbnail */}
                                    <div className='relative w-16 h-16 rounded overflow-hidden border shrink-0 bg-gray-50'>
                                        <Image
                                            src={evt.mediaUrl || '/placeholder-image.png'}
                                            fill
                                            alt={evt.listingName || 'event'}
                                            className='object-cover'
                                        />
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        {/* Client + event */}
                                        <div className='flex items-center gap-2 mb-0.5'>
                                            <span className='font-semibold text-gray-900 dark:text-white truncate text-sm'>{evt.name}</span>
                                            <StatusBadge status={evt.bookingStatus} type='booking' />
                                        </div>
                                        <p className='text-[11px] text-gray-500 truncate'>
                                            {evt.eventType && <span className='text-pink-600 font-medium'>{evt.eventType}</span>}
                                            {evt.listingName && <span> · {evt.listingName}</span>}
                                        </p>
                                        <p className='text-[10px] text-gray-400 mt-0.5'>{evt.earliestDate}</p>
                                    </div>

                                    <div className='text-right shrink-0 border-l pl-3 ml-1'>
                                        {days !== null && (
                                            <div className={`text-xs font-bold mb-1 ${days <= 3 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-sky-600'}`}>
                                                {days === 0 ? 'Today' : `${days} days`}
                                            </div>
                                        )}
                                        <div className='text-[10px] text-gray-400 leading-none'>Remaining</div>
                                        <div className={`text-xs font-bold ${remaining > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            {remaining > 0 ? `Rs ${remaining.toLocaleString()}` : 'Paid'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </Card>
    )
}

export default UpcomingEvents

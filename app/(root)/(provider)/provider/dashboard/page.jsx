import React from 'react'
import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookingOverview } from './BookingOverview'
import { BookingStatus } from './BookingStatus'
import LatestBooking from './LatestBooking'
import LatestReview from './LatestReview'
import { PROVIDER_BOOKINGS_SHOW } from '@/routes/ProviderPanelRoute'
import ProviderCalendar from '@/components/application/ProviderCalendar'
import BookingStats from './BookingStats'
import UpcomingEvents from './UpcomingEvents'

const ProviderDashboard = () => {
  return (
    <div className='pt-5'>
      <CountOverview />
      <BookingStats />
      <QuickAdd />

      {/* <div className='mt-10 grid lg:grid-cols-12 grid-cols-1 gap-10 items-start'>
        <div className='lg:col-span-8'> */}
      <ProviderCalendar />
      <UpcomingEvents />
      {/* </div>
        <div className='lg:col-span-4'>
          <div className='flex items-center justify-between mb-4'>
            <span className='font-bold text-gray-900 dark:text-white'>Featured Listing</span>
            <span className='text-xs text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded font-bold uppercase'>Random</span>
          </div>
          <RandomListing />
        </div>
      </div> */}

      <div className='mt-10 flex lg:flex-nowrap flex-wrap gap-10'>
        <Card className='rounded lg:w-[70%] w-full p-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-2 '>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Bookings Overview</span>
              <Button type='button'>
                <Link href={PROVIDER_BOOKINGS_SHOW}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BookingOverview />
          </CardContent>

        </Card>
        <Card className='rounded lg:w-[30%] w-full p-0 '>
          <CardHeader className='py-3 border-b [.border-b]:pb-2'>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Booking Status</span>
              <Button type='button'>
                <Link href={PROVIDER_BOOKINGS_SHOW}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className={' w-full h-full'}>
            <BookingStatus />
          </CardContent>

        </Card>
      </div>

      <div className='mt-10 flex lg:flex-nowrap flex-wrap gap-10'>
        <Card className='rounded lg:w-[70%] w-full p-0 gap-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-2 '>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Latest Bookings</span>
              <Button type='button'>
                <Link href={PROVIDER_BOOKINGS_SHOW}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='lg:h-[350px] overflow-auto'>
            <LatestBooking />
          </CardContent>

        </Card>
        <Card className='rounded lg:w-[30%] w-full p-0 gap-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-2'>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Latest Reviews</span>
              <Button type='button'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='lg:h-[350px] overflow-auto w-full'>
            <LatestReview />
          </CardContent>

        </Card>
      </div>
    </div>
  )
}

export default ProviderDashboard

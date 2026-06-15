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
    <div className=''>
      <div className="space-y-8 mt-4">

        {/* Count Overview */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
              Count Overview
            </h2>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
          </div>
          <CountOverview />
        </section>

        {/* Booking Stats */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
              Booking Stats
            </h2>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
          </div>
          <BookingStats />
        </section>

        {/* Quick Add */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
              Quick Actions
            </h2>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
          </div>
          <QuickAdd />
        </section>

      </div>

      {/* Calendar Component */}
      <ProviderCalendar />

      {/* upcoming events */}
      <UpcomingEvents />

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

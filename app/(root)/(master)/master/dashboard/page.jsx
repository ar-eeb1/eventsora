import React from 'react'
import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookingStatus } from './BookingStatus'
import { BookingOverview } from './BookingOverview'
import LatestBooking from './LatestBooking'
import LatestReview from './LatestReview'

const ProviderDashboard = () => {
  return (
    <div className='pt-5'>
      <CountOverview />
      <QuickAdd />

      <div className='mt-10 flex lg:flex-nowrap flex-wrap gap-10'>
        <Card className='rounded lg:w-[70%] w-full p-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-2 '>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Total Bookings</span>
              <Button type='button'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BookingOverview />
          </CardContent>

        </Card>
        <Card className='rounded lg:w-[30%] w-full p-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-2'>
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Booking Status</span>
              <Button type='button'>
                <Link href={''}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                <Link href={''}>View All</Link>
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

'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import Loading from '@/components/application/Loading'
import UserPanelLayout from '@/components/application/Website/UserPanelLayout'
import useFetch from '@/hooks/useFetch'
import { USER_DASHBOARD, WEBSITE, WEBSITE_BOOKING_DETAILS } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import React from 'react'

const breadCrumbData = [
  { href: WEBSITE, label: 'Home' },
  { href: USER_DASHBOARD, label: 'My Account' },
  { href: '', label: 'Bookings' },
]
const MyBookings = () => {
  const { data: bookingData, loading } = useFetch('/api/website/user-booking')

  return (
    <div className=''>
      <div className='pl-10 pt-10'>
        <BreadCrumb breadCrumbData={breadCrumbData} />
      </div>
      <UserPanelLayout>
        <div className='shadow rounded mb-5'>
          <div className='p-5 text-xl font-semibold border'>
            Bookings
          </div>
          <div className='p-5'>
            {loading ?
              <div className='text-center pt-5'>
                <Loading />
              </div>
              :
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
                    {bookingData && bookingData?.data?.map((booking, i) => (
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
            }

          </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default MyBookings

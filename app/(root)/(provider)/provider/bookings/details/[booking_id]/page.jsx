'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, ShoppingBag, User, Mail, Phone, FileText, Clock, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showToast } from '@/lib/showToast'
import BreadCrumb from '@/components/application/BreadCrumb'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import { PROVIDER_DASHBOARD } from '@/routes/ProviderPanelRoute'
import Select from '@/components/application/Main/Select'
import { bookingStatus } from '@/lib/utils'
import StatusBadge from '@/components/application/StatusBadge'


const breadCrumbData = [
  { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
  { href: '', label: 'Booking Details' },
]

const BookingDetails = () => {
  const { booking_id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)



  const [statusOptions, setStatusOptions] = useState([])

  useEffect(() => {
    setStatusOptions(bookingStatus.map(s => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s,
      // Disable 'confirmed' if payment is not paid
      disabled: s === 'confirmed' && booking?.status !== 'paid'
    })))
  }, [booking?.status])


  const handleStatusUpdate = async (type, newValue) => {
    if (newValue === 'confirmed' && booking.status !== 'paid') {
      showToast('error', 'Cannot confirm booking until payment is paid.')
      return
    }


    try {
      const endpoint = type === 'booking'
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/provider/bookings/status`
        : null;

      if (!endpoint) return;

      const { data } = await axios.put(endpoint, {
        bookingId: booking._id,
        bookingStatus: newValue
      })

      if (data.success) {
        showToast('success', data.message)
        // Refresh booking data
        setBooking(prev => ({ ...prev, bookingStatus: newValue }))
      } else {
        showToast('error', data.message)
      }
    } catch (error) {
      console.error(error)
      showToast('error', 'Failed to update status')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const id = Array.isArray(booking_id) ? booking_id[0] : booking_id
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/booking-details/${id}`)
        if (data.success) {
          setBooking(data.data)
        } else {
          showToast('error', data.message)
        }
      } catch (error) {
        console.error(error)
        showToast('error', 'Failed to fetch booking details')
      } finally {
        setLoading(false)
      }
    }

    if (booking_id) {
      fetchBooking()
    }
  }, [booking_id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Booking Not Found</h1>
        <Button asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="mx-auto mt-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
          <p className="text-gray-500 text-sm">
            Placed on {formatDate(booking.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-5">

          {/* LEFT COLUMN — Booking Summary + Items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Booking Summary Card */}
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between text-pink-700">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Booking Summary
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Show both statuses if they differ */}
                    {booking.bookingStatus && (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                          Payment: <StatusBadge status={booking.status} type="payment" />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                          Booking: <StatusBadge status={booking.bookingStatus} type="booking" />
                        </div>
                      </div>

                    )}
                  </div>
                </CardTitle>
                <CardDescription className="flex flex-col gap-1 mt-1">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Order ID: <span className="font-semibold text-gray-800">{booking.booking_id || booking._id}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {formatDate(booking.updatedAt)}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {booking.listings.map((item, index) => (
                    <div key={index} className="flex gap-4 py-4 border-b last:border-0">
                      <Link
                        href={WEBSITE_LISTING_DETAILS(item.listingId?.slug || item.slug)}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={item.media || '/placeholder-image.png'}
                          fill
                          alt={item.name}
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          href={`/listing/${item.listingId?.slug || item.slug}`}
                          className="hover:text-pink-600 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        </Link>
                        {item.variantTitle && (
                          <p className="text-sm text-gray-500">{item.variantTitle}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-md text-primary">
                          <Calendar className="w-6 h-6" />
                          <span>
                            Booking Date :
                          </span>
                          {item.bookingDate.join(', ')}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            {item.quantity} × {item.price.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                          </span>
                          <span className="font-bold text-pink-600">
                            {(item.price * item.quantity).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="px-6 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900">Total Amount</span>
                  <span className="font-extrabold text-2xl text-pink-600">
                    {booking.totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Customer Note */}
            {booking.note && (
              <Card className="border-yellow-100 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-700">
                    <FileText className="w-4 h-4" />
                    Customer Note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{booking.note}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN — Customer Info */}
          <div className="space-y-6">
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-pink-700">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
                    <p className="text-sm font-semibold text-gray-800">{booking.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <a
                      href={`mailto:${booking.email}`}
                      className="text-sm font-medium text-pink-600 hover:underline break-all"
                    >
                      {booking.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <a
                      href={`tel:${booking.phone}`}
                      className="text-sm font-medium text-pink-600 hover:underline"
                    >
                      {booking.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Status Overview */}
            <Card className="border-pink-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-pink-700">Manage Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Payment Status</label>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md border text-sm">
                    <StatusBadge status={booking.status} type="payment" />
                  </div>

                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Booking Status</label>
                  <Select
                    options={statusOptions}
                    selected={booking.bookingStatus}
                    setSelected={(val) => handleStatusUpdate('booking', val)}
                    placeholder="Update Booking"
                  />
                  {booking.status !== 'paid' && (
                    <p className="text-[10px] text-red-500 font-medium leading-tight">
                      * Payment must be paid before you can confirm the booking.
                    </p>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        <div className="mt-12 text-center px-5 flex justify-center gap-4">
          <Button variant="outline" asChild className="rounded-full px-8">
            <a href={PROVIDER_DASHBOARD}>Back to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails
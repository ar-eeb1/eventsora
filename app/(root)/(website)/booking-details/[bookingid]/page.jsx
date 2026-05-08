'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle2, Copy, Landmark, User, Hash, Banknote, Calendar, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showToast } from '@/lib/showToast'
import BreadCrumb from '@/components/application/BreadCrumb'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import StatusBadge from '@/components/application/StatusBadge'


const breadCrumbData = [
  { href: WEBSITE_HOME, label: 'Home' },
  { href: '', label: 'Booking Details' },
]

const BookingDetails = () => {
  const { bookingid } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const totalReceived = booking ? (booking.receivedAmount || 0) : 0
  const remainingBalance = booking ? (booking.totalAmount - totalReceived) : 0
  const advanceAmount = booking ? (booking.advance || Math.round(booking.totalAmount * 0.2)) : 0



  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/booking-details/${bookingid}`)
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

    if (bookingid) {
      fetchBooking()
    }
  }, [bookingid])

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    showToast('success', `${label} copied to clipboard`)
  }

  const bankDetails = [
    { label: 'BANK', value: 'United Bank Limited', icon: <Landmark className="w-5 h-5 text-pink-500" /> },
    { label: 'A/C', value: '337815072', icon: <Hash className="w-5 h-5 text-pink-500" />, copyable: true },
    { label: 'IBAN', value: 'PK19UNIL0109000337815072', icon: <Landmark className="w-5 h-5 text-pink-500" />, copyable: true },
    { label: 'TITLE', value: 'Areeb Amir', icon: <User className="w-5 h-5 text-pink-500" /> },
  ]

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
    <div className="lg:px-32 px-4 mt-10 mb-20">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="lg:max-w-8xl mx-auto mt-10">
        <div className="text-center mb-10">

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {booking.paymentStatus === 'paid' ? 'Payment Received!' : 'Booking Placed Successfully!'}
          </h1>
          <p className="text-gray-600 italic">
            {booking.paymentStatus === 'paid'
              ? 'Thank you for your payment. Your booking is being processed.'
              : 'Please pay 20% advance to confirm your booking.'}
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Order Summary (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-pink-100 pb-5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between text-pink-700">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Booking Summary
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                      Payment: <StatusBadge status={booking.paymentStatus} type="payment" />
                    </div>
                    {booking.bookingStatus && (
                      <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                        Booking: <StatusBadge status={booking.bookingStatus} type="booking" />
                      </div>
                    )}
                  </div>

                </CardTitle>
                <CardDescription>Booking ID: <span className="font-bold text-gray-900">{booking.booking_id || booking._id}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.listings.map((item, index) => (
                    <div key={index} className="flex gap-4 py-4 border-b last:border-0">
                      {/* {`/listing/${item.listingId?.slug || item.slug}`}  */}
                      <Link href={`${WEBSITE_LISTING_DETAILS(item.listingId?.slug || item.slug)}`} className="relative w-24 h-24 rounded-lg overflow-hidden border shrink-0 hover:opacity-80 transition-opacity">
                        <Image
                          src={item.mediaUrl || '/placeholder-image.png'}
                          fill
                          alt={item.name}
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link href={`/listing/${item.listingId?.slug || item.slug}`} className="hover:text-pink-600 transition-colors">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        </Link>
                        {item.variantTitle && (
                          <p className="text-sm text-gray-500">{item.variantTitle}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {item.bookingDate.join(', ')}
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-semibold block text-gray-700">Event Type</span>
                            {booking.eventType || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold block text-gray-700">Time Slot</span>
                            {booking.timeSlot || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold block text-gray-700">Guests</span>
                            {booking.guestCount || 'N/A'}
                          </div>
                          <div>
                            <span className="font-semibold block text-gray-700">Payment</span>
                            {booking.paymentMethod || 'N/A'}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <div className="flex flex-col items-end">
                            {item.discount > 0 && (
                              <>
                                <span className="text-xs line-through text-gray-400">
                                  {((item.variantPrice || item.price) * item.quantity).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                                </span>
                                <span className="text-xs text-green-600">
                                  Discount: {item.discount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                                </span>
                              </>
                            )}
                            <span className="font-bold text-pink-600">
                              {(item.price * item.quantity).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                            </span>
                          </div>
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
                
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-600">Amount Received</span>
                  <span className="font-semibold text-green-600">
                    {totalReceived.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="font-bold text-gray-700">Remaining Balance</span>
                  <span className={`font-bold ${remainingBalance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {remainingBalance <= 0 ? 'Fully Paid' : remainingBalance.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Instructions Card moved under Booking Summary for better flow on mobile */}
            <Card className="border-yellow-100 bg-yellow-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-2 rounded-full shrink-0">
                    <Banknote className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">What to do next?</h4>
                    <ul className="text-sm text-yellow-800 space-y-2 list-disc pl-4">
                      <li>Pay <strong>20% advance amount</strong> to confirm your booking.</li>
                      <li>Total Booking Amount: <strong>{booking.totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</strong></li>
                      <li>Advance Payable: <strong>{advanceAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</strong></li>
                      <li>Transfer the advance to the bank account mentioned.</li>
                      <li>Take a screenshot of the successful transaction.</li>
                      <li>
                        Share the screenshot along with your Booking ID (
                        <strong>{booking.booking_id || booking._id.slice(-8).toUpperCase()}</strong>
                        ) on our WhatsApp or email.
                      </li>
                      <li>Remaining amount can be paid later before the event.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Bank Info & Contact Details (Sticky Sidebar) */}
          <div className="lg:col-span-1 border-0">
            <div className="sticky top-5 space-y-5">
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-6 h-6 text-pink-500" />
                  Contact Details
                </CardTitle>
                <CardDescription>Your Information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Name</span>
                  <span className="font-semibold text-gray-800">{booking.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                  <span className="font-semibold text-gray-800">{booking.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">Phone</span>
                  <span className="font-semibold text-gray-800">{booking.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Landmark className="w-6 h-6 text-pink-500" />
                  Bank Information
                </CardTitle>
                <CardDescription>Direct Bank Transfer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bankDetails.map((detail, index) => (
                  <div key={index} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{detail.label}</span>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        {detail.icon}
                        <span className="font-semibold text-gray-800 break-all text-sm">{detail.value}</span>
                      </div>
                      {detail.copyable && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-pink-500 shrink-0"
                          onClick={() => copyToClipboard(detail.value, detail.label)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild className="rounded-full px-8">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails

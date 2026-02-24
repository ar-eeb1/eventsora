'use client'
import BreadCrumb from '@/components/application/BreadCrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import { Calendar, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'
import useFetch from '@/hooks/useFetch'
import { clearBooking, syncVerifiedBookings } from '@/store/reducer/bookingReducer'
import Image from 'next/image'
import { WEBSITE_BOOKING_DETAILS, WEBSITE_BOOKINGS, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import ButtonLoading from '@/components/application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import Loading from '@/components/application/Loading'


const breadCrumbData = [
  { href: WEBSITE_HOME, label: 'Home' },
  { href: '', label: 'Checkout' },
]

const CheckoutPage = () => {
  const auth = useSelector((store) => store.authStore.auth)
  const booking = useSelector((store) => store.bookingStore)
  const router = useRouter()
  const { data: getVerifiedBookingData } = useFetch('/api/website/booking-verficiation', 'POST', { data: booking.listings })

  const dispatch = useDispatch()

  const [isSynced, setIsSynced] = useState(false);
  const [serverTotalAmount, setServerTotalAmount] = useState(0);
  const [placingBooking, setPlacingBooking] = useState(false)
  const [savingBooking, setSavingBooking] = useState(false)

  useEffect(() => {
    if (getVerifiedBookingData && getVerifiedBookingData.success && !isSynced) {
      const { listings, totalAmount } = getVerifiedBookingData.data
      dispatch(syncVerifiedBookings(listings))
      setServerTotalAmount(totalAmount)
      setIsSynced(true)
    }
  }, [getVerifiedBookingData, isSynced])


  // FORMSCHEMA
  const bookingFormSchema = zSchema.pick({
    name: true,
    email: true,
    phone: true,
    note: true,
    userId: true,
  })

  const bookingForm = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      note: '',
      userId: auth?._id,
    }
  })

  const getBookingId = async (amount) => {
    try {
      const { data: bookingIdData } = await axios.post('/api/website/get-booking-id', { amount })
      if (!bookingIdData.success) {
        throw new Error(bookingIdData.message)
      }
      return { success: true, booking_id: bookingIdData.data }

    } catch (error) {
      return { success: false, message: error.message }
    }
  }


  const placeBooking = async (formData) => {
    setPlacingBooking(true)
    setSavingBooking(true)
    try {
      const payload = {
        ...formData,
        listings: booking.listings.map(item => ({
          listingId: item.listingId,
          variantId: item.variantId,
          quantity: item.quantity,
          bookingDate: item.bookingDate
        }))
      }

      const { data: orderResponse } = await axios.post('/api/website/payment/save-booking', payload)

      if (orderResponse.success) {
        showToast('success', orderResponse.message)
        dispatch(clearBooking())
        bookingForm.reset()

        if (Array.isArray(orderResponse.data) && orderResponse.data.length > 0) {
          const ids = orderResponse.data.map(b => b.booking_id).join(',')
          router.push(`/checkout/success?ids=${ids}`)
        } else {
          router.push(WEBSITE_BOOKING_DETAILS(orderResponse.data._id))
        }
      } else {
        showToast('error', orderResponse.message)
      }
    } catch (error) {
      console.error(error);
      showToast('error', error.response?.data?.message || error.message || 'Something went wrong')
    } finally {
      setPlacingBooking(false)
      setSavingBooking(false)
    }
  }



  // Empty State Component
  const EmptyState = () => (
    <div className='flex justify-center items-center py-20 flex-col gap-5'>
      <div className='w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center'>
        <ProductionQuantityLimitsIcon size={64} className='text-pink-400 ' />
      </div>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>No bookings found</h1>
        <p className='text-pink-600 mb-6'>Start exploring and add items to your booking list</p>
        <Button size='lg' asChild>
          <Link href={WEBSITE_HOME}>
            Browse Listings
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className='lg:px-32 px-4 mt-10 mb-20'>
      {savingBooking &&
        <div className='h-screen w-screen fixed top-0 left-0 z-50 bg-black/40'>
          <div className='h-screen flex justify-center items-center flex-row'>
            {/* <Image src={Loading.src} alt='loading' width={80} height={80} /> */}
            <Loading />
            <div className="mt-50 flex gap-1 text-3xl text-pink-400 kapakana-regular italic font-bold">
              Booking
              <span className="inline-block animate-bounce [animation-delay:0ms]">.</span>
              <span className="inline-block animate-bounce [animation-delay:150ms]">.</span>
              <span className="inline-block animate-bounce [animation-delay:300ms]">.</span>
            </div>
          </div>
        </div>
      }
      <BreadCrumb breadCrumbData={breadCrumbData} />

      {booking.count === 0 ? (
        <EmptyState />
      ) : (
        <div className='py-5'>
          <div className='flex lg:flex-row flex-col gap-6'>

            {/* Details Table */}
            <div className='lg:w-[60%] w-full  rounded bg-pink-50 p-5 sticky top-5'>
              <div className='flex font-semibold gap-2 '>
                <Calendar />
                <h4 className='text-lg font-semibold mb-5'>Booking Details</h4>
              </div>


              <div className='mt-5 b'>

                <Form {...bookingForm}>
                  <form className='grid grid-cols-2 gap-5' onSubmit={bookingForm.handleSubmit(placeBooking)}>

                    <div className='mb-3'>
                      <FormField
                        control={bookingForm.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Full Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      >

                      </FormField>
                    </div>

                    <div className='mb-3'>
                      <FormField
                        control={bookingForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Enter your email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>


                    <div className='mb-3'>
                      <FormField
                        control={bookingForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Enter your phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>

                    <div className='mb-3 col-span-2'>
                      <FormField
                        control={bookingForm.control}
                        name='note'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea {...field} placeholder="Enter booking Note" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>

                    <div className='mb-3 text-end col-span-2'>
                      <ButtonLoading type='submit' text='Place Booking' loading={placingBooking} className='bg-pink-400 rounded-full px-5' />
                    </div>
                  </form>
                </Form>

              </div>
            </div>

            {/* Booking Card */}
            <div className='lg:w-[40%] w-full'>
              <div className=' rounded bg-pink-50 p-5 sticky top-5'>
                <div className='flex items-center justify-between'>
                  <div className=''>
                    <h4 className='text-lg font-semibold mb-5'>Booking Summary</h4>
                  </div>
                  <div>
                    <Link href={WEBSITE_BOOKINGS}>
                      <span className='text-lg font-medium text-pink-600 flex items-center gap-1 mb-4 underline'>
                        BOOKING DETAILS
                      </span>
                    </Link>
                  </div>
                </div>
                <div>

                  <table className='w-full'>
                    <tbody>
                      {booking.listings.map((listing) => (
                        <tr key={`${listing.listingId}-${listing.variantId}`} className='border-b last:border-0'>
                          <td className='py-3'>
                            <div className='flex items-center gap-4'>
                              <div className='relative w-12 h-12 rounded overflow-hidden border'>
                                <Image
                                  src={listing.thumbnail?.secure_url || listing.media}
                                  fill
                                  alt={listing.listingName}
                                  className='object-cover'
                                />
                              </div>
                              <div className='flex flex-col'>
                                <Link href={WEBSITE_LISTING_DETAILS(listing?.slug)} className='font-semibold line-clamp-2 hover:text-pink-600 transition-colors mb-1'>{listing.listingName}</Link>
                                {listing.variantTitle && (
                                  <span className='text-xs text-gray-500 rounded-full bg-white w-fit px-4'>{listing.variantTitle}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className='py-3 text-end '>
                            <div className='text-sm font-semibold gap-2 flex justify-end'>
                              <div>
                                {(listing.variantPrice || listing.startingPrice || 0).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                              </div>
                              x
                              <div>
                                {(listing.quantity || 1)}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>


                  <table className='w-full mt-4 border-t'>
                    <tbody>
                      <tr>
                        <td className='font-bold py-4'>Total Amount</td>
                        <td className='text-end py-4'>
                          <span className='font-bold text-lg text-pink-600'>
                            {serverTotalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage

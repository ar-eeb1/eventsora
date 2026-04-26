'use client'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import { WEBSITE_BOOKINGS, WEBSITE_LISTING, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import { BiMinus, BiPlus } from 'react-icons/bi'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import img from '@/public/assets/img-placeholder.png'
import { IoStar, IoClose, IoAdd, IoRemove, IoLocationOutline } from 'react-icons/io5'
import { decode, encode } from 'entities'
import { BsFillPeopleFill } from 'react-icons/bs'
import Link from 'next/link'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import UserCalendar from '@/components/application/Website/UserCalendar'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { pricingType } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { addIntoBooking } from '@/store/reducer/bookingReducer'
import { set } from 'mongoose'
import { Button } from '@/components/ui/button'
import { is } from 'zod/v4/locales'
import Loading from '@/components/application/Loading'
import ListingDetailsSkeleton from '@/components/application/Website/ListingDetailsSkeleton'
import ListingReview from '@/components/application/Website/ListingReview'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { url } from 'zod'
import PortfolioMedia from '@/components/application/Website/PortfolioMedia'
import { marked } from 'marked'


const ListingDetails = ({ listing, variants, startingPrice, capacity, reviewCount }) => {
    // DISPATCH 
    const dispatch = useDispatch()
    const [isListingLoading, setIsListingLoading] = useState(false)


    const searchParams = useSearchParams()
    const serviceCode = searchParams.get('serviceCode')

    // Find active variant based on serviceCode
    const activeVariant = variants.find(v => v.serviceCode?.trim() === serviceCode?.trim())

    const [isLoading, setIsLoading] = useState(false)
    const breadCrumbData = [
        { href: WEBSITE_HOME, label: 'Home' },
        { href: WEBSITE_LISTING, label: `All Listings` },
        { href: '', label: `${listing.name}` },
    ]

    const [activeThumb, setActiveThumb] = useState()
    useEffect(() => {
        setActiveThumb(listing?.media[0]?.secure_url)
    }, [listing])

    // MODAL STATE
    const [showModal, setShowModal] = useState(false)
    const [zoom, setZoom] = useState(1)

    // Reset zoom when modal opens/closes
    useEffect(() => {
        if (!showModal) setZoom(1)
    }, [showModal])

    const handleZoomIn = (e) => {
        e.stopPropagation()
        setZoom(prev => Math.min(prev + 0.5, 3)) // Max zoom 3x
    }

    const handleZoomOut = (e) => {
        e.stopPropagation()
        setZoom(prev => Math.max(prev - 0.5, 1)) // Min zoom 1x
    }

    const router = useRouter()
    useEffect(() => {
        if (variants && variants.length > 0 && !activeVariant) {
            const firstVariant = variants[0]
            if (firstVariant?.serviceCode) {
                router.replace(`${WEBSITE_LISTING_DETAILS(listing.slug)}?serviceCode=${firstVariant.serviceCode}`)
            }
        }
    }, [activeVariant, variants, listing.slug, router])


    // Booking handle
    const [isAddedIntoBooking, setIsAddedIntoBooking] = useState(false)
    const [selectedDates, setSelectedDates] = useState([])
    const [selectedDatePrices, setSelectedDatePrices] = useState({})
    const bookingStore = useSelector(store => store.bookingStore)
    const { auth } = useSelector(store => store.authStore || {})

    useEffect(() => {
        const existingListing = bookingStore.listings?.findIndex((bookListing) => {
            const isSameListing = bookListing.listingId === listing._id && bookListing.variantId === activeVariant?._id

            if (!isSameListing) return false

            // Compare dates arrays
            const existingDates = [...(bookListing.bookingDate || [])].sort()
            const currentDates = [...selectedDates].sort()

            return JSON.stringify(existingDates) === JSON.stringify(currentDates)
        })

        setIsAddedIntoBooking(existingListing > -1)

        setIsListingLoading(false)
    }, [bookingStore, listing, activeVariant, selectedDates])

    const handleDateSelect = (dates, datePrices = {}) => {
        setSelectedDates(dates)
        setSelectedDatePrices(datePrices)
    }

    const handleAddToBooking = () => {
        const variantPrice = activeVariant?.startingPrice || listing?.startingPrice || 0
        const quantity = qty || activeVariant?.minPersons || 1
        const variantTotal = activeVariant ? (variantPrice * quantity) : (listing?.startingPrice || 0)

        // Sum calendar prices for selected dates (per-unit for variable pricing, total for fixed)
        const calendarPricePerUnit = selectedDates.reduce((sum, dateKey) => {
            const price = selectedDatePrices[dateKey]
            return sum + (price != null ? Number(price) : 0)
        }, 0)

        const isVariablePricing = (pt) => pt === 'per_person' || pt === 'per_hour' || pt === 'per_day'
        const calendarPriceTotal = calendarPricePerUnit > 0 && isVariablePricing(activeVariant?.pricingType)
            ? calendarPricePerUnit * quantity
            : calendarPricePerUnit

        // Use calendar price when available and lower than variant; otherwise use variant price
        const hasCalendarPrice = calendarPriceTotal > 0
        const actualTotal = hasCalendarPrice ? calendarPriceTotal : variantTotal
        const discount = hasCalendarPrice && calendarPriceTotal < variantTotal
            ? variantTotal - calendarPriceTotal
            : 0
        const unitPrice = quantity > 0 ? actualTotal / quantity : variantPrice

        const bookingItem = {
            // relations
            listingId: listing._id,
            variantId: activeVariant?._id || null,
            url: listing.slug,

            // snapshot info
            listingName: listing.name,
            variantTitle: activeVariant?.title || null,
            variantPrice: activeVariant?.startingPrice ?? listing?.startingPrice ?? null,
            slug: listing.slug,

            // pricing snapshot
            startingPrice: listing?.startingPrice || null,
            price: unitPrice,
            calendarPrice: hasCalendarPrice ? calendarPriceTotal : null,
            discount: discount || null,
            pricingType: activeVariant?.pricingType || null,
            minPersons: activeVariant?.minPersons || null,
            quantity: quantity,
            // media
            thumbnail: listing.media?.[0],
            // booking meta
            bookingDate: selectedDates,
            status: "pending"

        }
        dispatch(addIntoBooking(bookingItem))
        setIsAddedIntoBooking(true)
        showToast('success', 'Added into booking successfully!')
    }

    const handleMessageProvider = async () => {
        if (!auth) {
            showToast('error', 'Please login to message the provider')
            return
        }

        setIsLoading(true)
        try {
            const receiverId = listing.userId?._id
            if (!receiverId) {
                showToast('error', 'Provider information not found')
                return
            }

            const { data } = await axios.post('/api/message/conversation/create', {
                receiverId: receiverId,
                listingId: listing._id
            })
            if (data.success) {
                router.push(`/user/messages/${data.data._id}`)
            } else {
                showToast('error', data.message || 'Failed to start chat')
            }
        } catch (error) {
            showToast('error', error.response?.data?.message || error.message || 'Failed to start chat')
        } finally {
            setIsLoading(false)
        }
    }


    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowModal(false)
        }
        if (showModal) window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [showModal])

    const handleWheel = (e) => {
        // Prevent page scrolling when modal is open
        e.stopPropagation()

        if (e.deltaY < 0) {
            setZoom(prev => Math.min(prev + 0.2, 5)) // Zoom In
        } else {
            setZoom(prev => Math.max(prev - 0.2, 1)) // Zoom Out
        }
    }

    // Initialize quantity based on active variant's minimum persons
    const [qty, setQty] = useState(activeVariant?.minPersons || 1)
    const increment = () => {
        setQty(prev => prev + 1)
    }

    const decrement = () => {
        const minPersons = activeVariant?.minPersons || 1
        setQty(prev => Math.max(prev - 1, minPersons))
    }

    // Update quantity when active variant changes
    useEffect(() => {
        if (activeVariant?.pricingType === 'per_person' || activeVariant?.pricingType === 'per_hour' || activeVariant?.pricingType === 'per_day') {
            setQty(activeVariant?.minPersons || 1)
        }
    }, [activeVariant])




    return (
        <div className='lg:px-32 px-4 mt-10'>
            {
                isListingLoading && <ListingDetailsSkeleton />
            }

            {/* Modal Overlay */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                    onWheel={handleWheel}
                >
                    {/* Controls */}
                    <div
                        className="absolute top-5 right-5 flex gap-4 text-white z-[101]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 rounded-full transition-colors"><IoRemove size={30} /></button>
                        <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 rounded-full transition-colors"><IoAdd size={30} /></button>
                        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><IoClose size={30} /></button>
                    </div>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
                    >
                        <div
                            className="relative transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
                            style={{ transform: `scale(${zoom})` }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={activeThumb || img.src}
                                width={1200}
                                height={1200}
                                alt='listing full view'
                                className='object-contain max-h-[90vh] max-w-[90vw] rounded-md shadow-2xl'
                            />
                        </div>
                    </div>
                </div>
            )}

            <BreadCrumb breadCrumbData={breadCrumbData} />

            <div className='md:flex justify-between items-start lg:gap-10 gap-5 mb-20'>
                <div className='md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0'>
                    <div className='xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]'>
                        <div className="relative group cursor-pointer" onClick={() => setShowModal(true)}>
                            <Image
                                src={activeThumb || img.src}
                                width={650}
                                height={650}
                                alt='listing'
                                className='border rounded-md max-w-full transition-opacity group-hover:opacity-95'
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                                <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">Click to Zoom</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-150'>
                        {listing?.media?.map((thumb) => (
                            <Image
                                key={thumb._id}
                                src={thumb?.secure_url || img.src}
                                width={100}
                                height={100}
                                alt="listing thumbnail"
                                className={`md:max-w-full max-w-16 rounded-md cursor-pointer ${thumb.secure_url === activeThumb ? 'border-2 border-primary' : 'border'}`}
                                onClick={() => setActiveThumb(thumb.secure_url)}
                            />
                        ))}
                    </div>
                </div>

                <div className='md:w-1/2 md:mt-0 mt-5'>
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h1 className='text-3xl font-semibold'>{listing.name}</h1>
                        <div className="flex gap-2">
                            {listing?.tags?.map((tag) => {
                                const labels = {
                                    eventsora_choice: 'Eventsora Choice',
                                    managed_by_eventsora: 'Managed by Eventsora',
                                    top_rated: 'Top Rated'
                                }
                                const styles = {
                                    eventsora_choice: 'bg-amber-100 text-amber-700 border-amber-200',
                                    managed_by_eventsora: 'bg-blue-100 text-blue-700 border-blue-200',
                                    top_rated: 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                }
                                return (
                                    <span
                                        key={tag}
                                        className={`text-[12px] font-bold px-3 py-1 rounded-full border shadow-sm ${styles[tag] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                                    >
                                        {labels[tag] || tag.replace(/_/g, ' ')}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                    <div className='flex items-center gap-1 mb-5 '>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IoStar className='text-yellow-500' key={i} />
                        ))}
                        <span>({reviewCount} Reviews)</span>
                    </div>

                    <div className='flex items-center gap-1 mb-5 text-gray-600 font-medium capitalize'>
                        <IoLocationOutline className='text-pink-600' size={20} />
                        <span>{listing?.city?.city}, {listing?.locality?.locality}</span>
                    </div>
                    <div className='flex items-center gap-2 mb-3 lg:text-4xl md:text-2xl text-xl'>
                        <h2 className='font-bold'>Starting Price :</h2>
                        <span>{listing?.startingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                    </div>

                    <div className='line-clamp-3' dangerouslySetInnerHTML={{ __html: marked.parse(decode(listing?.description || ''), { breaks: true }) }}>
                    </div>


                    {
                        listing?.capacity?.length > 0 &&
                        <div className='flex items-center pt-3 gap-2 font-semibold'><BsFillPeopleFill size={20} className='text-pink-700' aria-hidden="true" />{listing?.capacity} Guests</div>
                    }
                    {variants.length > 0 &&
                        <div className='flex gap-5 mt-5 flex-wrap'>
                            {variants.map((v) => (
                                <Link
                                    onClick={() => setIsListingLoading(true)}
                                    key={v._id}
                                    replace
                                    className={`uppercase py-1 px-3 rounded-full text-sm cursor-pointer hover:bg-primary hover:text-white ${v.serviceCode?.trim() === serviceCode?.trim() ? 'bg-primary text-white' : 'bg-white'}`}
                                    href={`${WEBSITE_LISTING_DETAILS(listing.slug)}?serviceCode=${v.serviceCode}`}
                                >
                                    {v.title}
                                </Link>
                            ))}
                        </div>
                    }

                    {/* Points Display */}
                    {activeVariant && activeVariant.points && activeVariant.points.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                What&apos;s Included
                            </h3>
                            <ul className="grid sm:grid-cols-2 gap-2">
                                {activeVariant.points.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="capitalize text-sm">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* PRICING TYPE & STARTING PRICE */}
                    {
                        activeVariant &&
                        <div className='mt-5 gap-2'>
                            <div className='flex gap-2'>
                                <p className='font-bold uppercase'>Prices are calculated as:</p>
                                <span className='uppercase'>
                                    {activeVariant?.pricingType.replace('_', ' ')}
                                </span>
                            </div>
                            <div className='flex items-center gap-2 mb-3 text-3xl'>
                                <span>{activeVariant?.startingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                            </div>
                        </div>
                    }
                    {
                        (activeVariant?.pricingType === 'per_person' || activeVariant?.pricingType === 'per_hour' || activeVariant?.pricingType === 'per_day') &&
                        (<div>
                            <p className='font-bold mb-2'>
                                {activeVariant?.pricingType === 'per_person' ? 'Number of Persons' : 'Quantity'}
                                {activeVariant?.minPersons && <span className='text-sm font-normal text-gray-600'> (Minimum: {activeVariant.minPersons})</span>}
                            </p>
                            <div className='flex items-center h-10 border w-fit rounded-full'>
                                <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer disabled:bg-gray-500`' disabled={qty <= (activeVariant?.minPersons || 1)} onClick={decrement}>
                                    <BiMinus />
                                </button>
                                <input type="text" value={qty} className='w-14 text-center border-none outline-offset-0' readOnly />
                                <button type='button' className={`h-full w-10 flex justify-center items-center cursor-pointer`} onClick={increment}>
                                    <BiPlus />
                                </button>
                            </div>
                        </div>)
                    }

                    <div className='gap-4 flex flex-col md:mt-10 mt-5 md:block '>
                        {!auth ? (
                            <Button asChild className='w-full rounded-full py-6 text-md text-white'>
                                <Link href={`${WEBSITE_LOGIN}?callback=${encodeURIComponent(`${WEBSITE_LISTING_DETAILS(listing.slug)}?serviceCode=${activeVariant?.serviceCode || ''}`)}`}>
                                    Login to Message & Book
                                </Link>
                            </Button>
                        ) : listing.inquirePrice ? (
                            <ButtonLoading
                                type='button'
                                onClick={handleMessageProvider}
                                loading={isLoading}
                                text={`Message ${listing.name}`}
                                className='w-full rounded-full py-6 text-md text-white'
                            />
                        ) : (
                            <>
                                {!isAddedIntoBooking ?
                                    <ButtonLoading
                                        type='button'
                                        text={selectedDates.length === 0 ? 'Select Dates' : 'Add into Booking'}
                                        onClick={handleAddToBooking}
                                        className='md:w-1/2 rounded-full py-6 text-md text-white'
                                        disabled={selectedDates.length === 0}
                                    />
                                    :
                                    <Button type='button' className='md:w-1/2 rounded-full py-6 text-md text-white'>
                                        <Link href={WEBSITE_BOOKINGS}>
                                            View My Bookings
                                        </Link>
                                    </Button>
                                }
                                <ButtonLoading
                                    type='button'
                                    onClick={handleMessageProvider}
                                    loading={isLoading}
                                    text='Message Provider'
                                    className='md:w-1/2 rounded-full py-6 text-md text-black bg-white cursor-pointer'
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className='mb-5 calendar'>
                <div className="flex flex-col items-center justify-center md:my-10 my-5 space-y-2">
                    <div className="h-1 w-20 bg-primary rounded-full mb-5"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
                        Availability for <span className="text-primary">&quot;{listing.name}&quot;</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-lg">
                        Check availability and pricing for your desired dates below.
                    </p>
                </div>

                <UserCalendar
                    listingId={listing._id}
                    variantId={activeVariant?._id}
                    onDateSelect={handleDateSelect}
                    selectedDates={selectedDates}
                />
            </div>


            {/* LISTING DETAILS */}
            <Card className={'mb-10 p-4'}>
                <CardHeader className={'font-semibold text-2xl border-b border-pink-400 p-0 m-0 [.border-b]:pb-0'}>
                    <h2>Description</h2>
                </CardHeader>
                <div dangerouslySetInnerHTML={{ __html: marked.parse(decode(listing?.description || ''), { breaks: true }) }}></div>
            </Card>
            {/* PORTFOLIO */}
            <Card className={'mb-10 p-4'}>
                <CardHeader className={'font-semibold text-2xl border-b border-pink-400 p-0 m-0 [.border-b]:pb-0'}>
                    <h2>Portfolio</h2>
                </CardHeader>
                <CardContent>
                    <PortfolioMedia userId={listing?.userId?._id || listing?.userId} />
                </CardContent>
            </Card>
            {/* <Card className={'mb-10 p-4'}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.569993409171!2d67.050618!3d24.946714699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb340813dc70c37%3A0xe503df5734802d4a!2sNorth%20Marriage%20Garden!5e0!3m2!1sen!2s!4v1772465330808!5m2!1sen!2s"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="North Marriage Garden Location"
                />
            </Card> */}

            <ListingReview listingId={listing._id} />
        </div >
    )
}

export default ListingDetails

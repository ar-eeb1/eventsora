'use client'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import { WEBSITE_LISTING, WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import img from '@/public/assets/img-placeholder.png'
import { IoStar } from 'react-icons/io5'
import { decode } from 'entities'
import { BsFillPeopleFill } from 'react-icons/bs'
import Link from 'next/link'
import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import AvailabilityCalendar from '@/components/application/Website/AvailabilityCalendar'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { showToast } from '@/lib/showToast'


const ListingDetails = ({ listing, variants, startingPrice, capacity, reviewCount }) => {
    const searchParams = useSearchParams()
    const serviceCode = searchParams.get('serviceCode')

    // Find active variant based on serviceCode
    const activeVariant = variants.find(v => v.serviceCode === serviceCode)

    const [isloading, setIsLoading] = useState(false)
    const breadCrumbData = [
        { href: WEBSITE_HOME, label: 'Home' },
        { href: WEBSITE_LISTING, label: `All Listings` },
        { href: '', label: `${listing.name}` },
    ]

    const [activeThumb, setActiveThumb] = useState()
    useEffect(() => {
        setActiveThumb(listing?.media[0]?.secure_url)
    }, [listing])

    const router = useRouter()
    useEffect(() => {
        if (variants && variants.length > 0 && !activeVariant) {
            const firstVariant = variants[0]
            router.replace(`${WEBSITE_LISTING_DETAILS(listing.slug)}?serviceCode=${firstVariant.serviceCode}`)
        }
    }, [activeVariant, variants, listing.slug, router])

    const handleDateSelect = (selectedDates) => {
        // Handle booking logic here
    }

    const handleMessageProvider = async () => {

        setIsLoading(true)
        try {
            const receiverId = listing.userId?._id
            const { data } = await axios.post('/api/message/conversation/create', {
                receiverId: receiverId,
                listingId: listing._id
            })
            if (data.success) {
                router.push(`/user/messages/${data.data._id}`)
            }
        } catch (error) {
            showToast('error', error.response?.data?.message || 'Failed to start chat')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className='lg:px-32 px-4 mt-10'>
            <BreadCrumb breadCrumbData={breadCrumbData} />

            <div className='md:flex justify-between items-start lg:gap-10 gap-5 mb-20'>
                <div className='md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0'>
                    <div className='xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]'>
                        <Image
                            src={activeThumb || img.src}
                            width={650}
                            height={650}
                            alt='listing'
                            className='border rounded-md max-w-full'
                        />
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
                    <h1 className='text-3xl font-semibold mb-2'>{listing.name}</h1>
                    <div className='flex items-center gap-1 mb-5 '>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IoStar className='text-yellow-500' key={i} />
                        ))}
                        <span>({reviewCount} Reviews)</span>
                    </div>
                    <div className='flex items-center gap-2 mb-3 text-3xl'>
                        <h2 className='font-bold'>Starting Price :</h2>
                        <span>{listing?.startingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                    </div>

                    <div className='line-clamp-3' dangerouslySetInnerHTML={{ __html: decode(listing?.description) }}>
                    </div>
                    {
                        listing?.capacity?.length > 0 &&
                        <div className='flex items-center pt-3 gap-2 font-semibold'><BsFillPeopleFill size={20} className='text-pink-700' aria-hidden="true" />{listing?.capacity} Guests</div>
                    }
                    {variants.length > 0 &&
                        <div className='flex gap-5 mt-5 flex-wrap'>
                            {variants.map((v) => (
                                <Link key={v._id} className={`uppercase py-1 px-3 rounded-full text-sm cursor-pointer hover:bg-primary hover:text-white ${v.serviceCode === serviceCode ? 'bg-primary text-white' : 'bg-white'}`} href={`${WEBSITE_LISTING_DETAILS(listing.slug)}?serviceCode=${v.serviceCode}`}>{v.title}</Link>
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

                    <div className='gap-3 flex mt-10'>
                        <ButtonLoading type='button' text='Book Now' className={'w-1/2 rounded-full py-6 text-md text-white'} />
                        <ButtonLoading
                            type='button'
                            onClick={handleMessageProvider}
                            loading={isloading} // Check state name casing (isloading vs isLoading)
                            text='Message Provider'
                            className='w-1/2 rounded-full text-md text-black bg-white cursor-pointer'
                        />
                    </div>
                </div>
            </div>

            <div className='mb-5'>
                <div className="flex flex-col items-center justify-center my-10 space-y-2">
                    <div className="h-1 w-20 bg-primary rounded-full mb-5"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
                        Availability for <span className="text-primary">&quot;{listing.name}&quot;</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-lg">
                        Check availability and pricing for your desired dates below.
                    </p>
                </div>

                <AvailabilityCalendar
                    listingId={listing._id}
                    variantId={activeVariant?._id}
                    onDateSelect={handleDateSelect}
                />
            </div>
        </div>
    )
}

export default ListingDetails

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

const ListingDetails = ({ listing, variants, startingPrice, capacity, reviewCount }) => {
    console.log('variant', variants.title);
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

    const handleDateSelect = (selectedDates) => {
        console.log('Selected dates:', selectedDates)
        // Handle booking logic here
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
                        {/* <span>{variant?.startingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span> */}
                    </div>

                    <div className='line-clamp-3' dangerouslySetInnerHTML={{ __html: decode(listing?.description) }}>
                    </div>

                    <div className='flex items-center pt-3 gap-2 font-semibold'><BsFillPeopleFill size={20} className='text-pink-700' aria-hidden="true" />{listing?.capacity} Guests</div>
                    {variants.length > 0 &&
                        <div className='flex gap-5 mt-5'>
                            {variants.map((v) => (
                                <Link key={v._id} className={`uppercase bg-white py-1 px-3 rounded-full text-sm cursor-pointer hover:bg-primary hover:text-white ${v.title === v.title ? 'bg-primary' : ''}`} href={`${WEBSITE_LISTING_DETAILS(listing.slug)}?serviceCode=${v.serviceCode}`}>{v.title}</Link>
                            ))}
                        </div>
                    }

                    <div className='gap-3 flex mt-10'>
                        <ButtonLoading type='button' text='Book Now' className={'w-1/2 rounded-full py-6 text-md text-white'} />
                        <button type='button' className='w-1/2 rounded-full text-md text-black bg-white cursor-pointer'>Message Provider</button>
                    </div>
                </div>
            </div>

            <div>
                <div className='text-center'>
                    <h1>Select date for booking</h1>
                </div>
                <AvailabilityCalendar
                    listingId={listing._id}
                    onDateSelect={handleDateSelect}
                />
            </div>
        </div>
    )
}

export default ListingDetails

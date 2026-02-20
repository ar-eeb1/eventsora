import Image from 'next/image'
import img from '@/public/assets/img-placeholder.png'
import React from 'react'
import { BsFillPeopleFill } from "react-icons/bs"
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { WEBSITE_LISTING_DETAILS } from '@/routes/WebsiteRoute'

const ListingBox = ({ listing }) => {    
    const imageUrl = listing?.media?.[0]?.secure_url || img.src
    const imageAlt = listing?.name || 'listing'
    const capacity = listing?.capacity
    const startingPrice = listing?.startingPrice?.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }) || '0'
    const location = [listing?.city?.city, listing?.locality?.locality]
        .filter(Boolean)
        .join(' , ')

    return (
        <Link href={WEBSITE_LISTING_DETAILS(listing.slug)} className='bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden '>
            {/* Image Container */}
            <div className='relative w-full h-48 overflow-hidden'>
                <Image
                    src={imageUrl}
                    fill
                    alt={imageAlt}
                    className='object-cover hover:scale-105 transition-transform duration-300'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content */}
            <div className='px-4 pt-4 pb-3 space-y-3'>
                {/* Title */}
                <h2 className='font-semibold text-lg text-gray-900 line-clamp-2 max-h-14'>
                    {listing?.name || 'Untitled Listing'}
                </h2>

                {/* Capacity */}
                {capacity &&
                    <div className='flex items-center gap-2 text-gray-600'>
                        <BsFillPeopleFill className='text-pink-700' aria-hidden="true" />
                        <span className='text-sm font-medium'>
                            {capacity} {capacity === 1 ? 'Guest' : 'Guests'}
                        </span>
                    </div>
                }

                {/* Price */}
                <div className='space-y-1'>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Starting Price</p>
                    <p className='text-xl font-bold text-gray-900'>
                        {startingPrice}
                    </p>
                </div>

                {/* Location */}
                {location && (
                    <div className='flex items-center justify-between pt-2 border-t'>
                        <div className='flex items-center gap-1.5 text-gray-600 border-gray-100 '>
                            <MapPin size={14} className='text-gray-400 shrink-0' aria-hidden="true" />
                            <p className='text-sm truncate'>{location}</p>
                        </div>
                        <div className=' text-xs text-pink-800 bg-pink-200 px-3 py-0.5 uppercase rounded-full'>
                            Book Now
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default ListingBox
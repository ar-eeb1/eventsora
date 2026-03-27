import Image from 'next/image'
import img from '@/public/assets/img-placeholder.png'
import React from 'react'
import { BsFillPeopleFill } from "react-icons/bs"
import { MapPin, Users } from 'lucide-react'
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
        <Link href={WEBSITE_LISTING_DETAILS(listing.slug)} className='bg-white rounded-md shadow-sm transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:shadow-2xl'>
            {/* Image Container */}
            <div className='relative w-full h-48 overflow-hidden rounded-md shadow-xl'>
                <Image
                    src={imageUrl}
                    fill
                    alt={imageAlt}
                    className='object-cover hover:scale-105 transition-transform duration-300'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {capacity &&
                    <div className='flex items-center gap-2 text-gray-600 absolute right-2 top-2 bg-[#F8E7E6] px-2 rounded-full py-1'>
                        <Users size={15} className='text-pink-700' aria-hidden="true" />
                        <span className='text-xs font-medium'>
                            {capacity} {capacity === 1 ? 'Guest' : 'Guests'}
                        </span>
                    </div>
                }

            </div>

            {/* Content */}
            <div className='px-4 pt-4 pb-3 space-y-3'>
                {/* Title */}
                <h2 className='font-semibold text-lg text-gray-900  max-h-14 line-clamp-1'>
                    {listing?.name || 'Untitled Listing'}
                </h2>

                {/* Price */}
                <div className='space-y-1'>
                    <p className='text-xs tracking-wide'>Starting Price</p>
                    <p className='text-xl font-bold text-pink-900'>
                        {startingPrice}
                    </p>
                </div>

                {/* Location */}
                {location && (
                    <div className='flex items-center justify-between '>
                        <div className='flex items-center gap-1.5 text-gray-600 border-gray-100 '>
                            <MapPin size={14} className='text-gray-400 shrink-0' aria-hidden="true" />
                            <p className='text-xs truncate'>{location}</p>
                        </div>
                    </div>
                )}
                <div className='font-sans font-bold text-xs text-white bg-pink-800 px-3 py-2 flex items-center justify-center rounded-lg'>
                    Book Now
                </div>
            </div>
        </Link>
    )
}

export default ListingBox
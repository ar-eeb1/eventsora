import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ListingBox from './ListingBox'
import axios from 'axios'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin'],
})

import HorizontalScrollContainer from './HorizontalScrollContainer'

const AddHomeListing = async () => {

    const { data: listingData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/getListing?category=venues`)
    const { data: carData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/getListing?category=services`)

    if (!listingData) return <div>No Listing Found</div>
    return (
        <section className='xl:px-16 lg:px-10 md:px-6 px-6'>
            <div className='my-5'>
                <div className='flex justify-between items-center mb-2'>
                    <h2 className={`lg:text-4xl md:text-4xl text-3xl font-bold text-pink-900 ${playfair.className}`}>Venues</h2>
                    <Link href='' className='flex items-center gap-2 underline underline-offset-4 lg:text-lg text-sm hover:translate-x-2 transition-all'>
                        View All
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <HorizontalScrollContainer>

                    {!listingData.success && (
                        <div>
                            <span className="text-lg font-semibold text-gray-700">
                                No Listing Found
                            </span>
                        </div>
                    )}

                    {listingData.success &&
                        listingData.data.map((list) => (
                            <div key={list._id} className="shrink-0 w-72 grid">
                                <ListingBox listing={list} />
                            </div>
                        ))
                    }

                </HorizontalScrollContainer>
            </div>

            {/* CARS */}
            <div className='my-5'>
                <div className='flex justify-between items-center md:mb-2 md:mt-20 mt-10'>
                    <h2 className={`lg:text-4xl md:text-4xl text-3xl font-bold text-pink-900 ${playfair.className}`}>Cars & Caterers</h2>
                    <Link href='' className='flex items-center gap-2 underline underline-offset-4 lg:text-lg text-sm hover:translate-x-2 transition-all'>
                        View All
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <HorizontalScrollContainer>

                    {!carData.success && (
                        <div>
                            <span className="text-lg font-semibold text-gray-700">
                                No Listing Found
                            </span>
                        </div>
                    )}

                    {carData.success &&
                        carData.data.map((cars) => (
                            <div key={cars._id} className="shrink-0 w-72 grid">
                                <ListingBox listing={cars} />
                            </div>
                        ))
                    }

                </HorizontalScrollContainer>
            </div>
        </section>
    )
}

export default AddHomeListing
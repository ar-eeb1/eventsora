import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ListingBox from './ListingBox'

const AddHomeListing = async () => {

    const { data: listingData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/getListing?category=venues`)
    const { data: carData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/getListing?category=services`)

    if (!listingData) return <div>No Listing Found</div>
    return (
        <section className='lg:px-20 md:px-16 px-6'>

            <div className='my-5'>
                <div className='flex justify-between items-center mb-2'>
                    <h2 className='lg:text-2xl sm:text-lg font-bold'>Venues</h2>
                    <Link href='' className='flex items-center gap-2 underline underline-offset-4 lg:text-lg text-sm hover:translate-x-2 transition-all'>
                        View All
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {!listingData.success && (
                        <div className=''>
                            <span className='text-lg font-semibold text-gray-700'>No Listing Found</span>
                        </div>
                    )}
                    {listingData.success &&
                        listingData.data.map((list) => (
                            <ListingBox key={list._id} listing={list} />
                        ))}
                </div>
            </div>

            <div className='my-5'>
                <div className='flex justify-between items-center mb-2'>
                    <h2 className='lg:text-2xl sm:text-lg font-bold'>Cars</h2>
                    <Link href='' className='flex items-center gap-2 underline underline-offset-4 lg:text-lg text-sm hover:translate-x-2 transition-all'>
                        View All
                        <ArrowRight size={20} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {!carData.success &&
                        <div className=''>
                            <span className='text-lg font-semibold text-gray-700'>No Listing Found</span>
                        </div>
                    }
                    {carData.success && carData.data.map((cars) => (
                        <ListingBox key={cars._id} listing={cars} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AddHomeListing
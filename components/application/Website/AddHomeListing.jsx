import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ListingBox from './ListingBox'
import { connectDB } from '@/lib/databaseConnection'
import ListingModel from '@/models/Listing.model'
import CategoryModel from '@/models/Category.model'
import { Playfair_Display } from 'next/font/google'
import MediaModel from '@/models/Media.model'
import LocalityModel from '@/models/Locality.model'
import HorizontalScrollContainer from './HorizontalScrollContainer'

const playfair = Playfair_Display({
    weight: ['400', '700'],
    display: 'swap',
    subsets: ['latin'],
})



const AddHomeListing = async () => {
    await connectDB()

    const getListingsByCategory = async (slug) => {
        try {
            const category = await CategoryModel.findOne({
                slug: slug.toLowerCase(),
                deletedAt: null,
            }).select('_id');

            if (!category) return { success: false, data: [] }

            const listings = await ListingModel.find({
                category: category._id,
                deletedAt: null,
                status: 'approved',
            })
                .sort({ createdAt: -1 })
                .populate('media', '_id secure_url')
                .populate('category', '_id category slug')
                .populate('city', '_id city')
                .populate('locality', '_id locality')
                .limit(20)
                .lean();

            return { success: true, data: listings }
        } catch (error) {
            console.error(`Error fetching listings for ${slug}:`, error)
            return { success: false, data: [] }
        }
    }

    const listingData = await getListingsByCategory('venues')
    const carData = await getListingsByCategory('services')

    if (!listingData?.data?.length && !carData?.data?.length) return null

    return (
        <section className='xl:px-16 lg:px-10 md:px-6 px-6'>
            <div className='my-5'>
                <div className='flex justify-between items-center mb-2'>
                    <h2 className={`lg:text-4xl md:text-4xl text-3xl font-bold text-pink-900 ${playfair.className}`}>Venues</h2>
                    <Link href={`/venues`} className='flex items-center gap-2 underline underline-offset-4 lg:text-lg text-sm hover:translate-x-2 transition-all'>
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
                    <h2 className={`lg:text-4xl md:text-4xl text-3xl font-bold text-pink-900 ${playfair.className}`}>Services</h2>
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
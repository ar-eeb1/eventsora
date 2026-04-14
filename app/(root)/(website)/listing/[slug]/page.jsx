import React from 'react'
import ListingDetails from './ListingDetails'
import { connectDB } from '@/lib/databaseConnection'
import ListingModel from '@/models/Listing.model'
import ListingVariantModel from '@/models/ListingVariant.model'
import reviewModel from '@/models/Review.model'

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const formattedName = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return {
        title: formattedName,
        description: `Find ${formattedName} on Eventsora, Book now`,
        images: [
            {
                url: '/assets/page.png',
                width: 1200,
                height: 630,
                alt: 'Eventsora',
            },
        ],
    };
}


const ListingPage = async ({ params, searchParams }) => {
    const { slug } = await params
    const { capacity, startingPrice } = await searchParams

    await connectDB()

    const filter = {
        deletedAt: null,
        status: 'approved',
        slug: slug
    }

    try {
        // GET LISTING
        const getListing = await ListingModel.findOne(filter)
            .populate('media', 'secure_url')
            .populate('userId', 'name email profileImage')
            .populate('city', 'city')
            .populate('locality', 'locality')
            .lean()

        if (!getListing) {
            return (
                <div className='flex justify-center items-center py-10 h-75'>
                    <h1 className='text-4xl font-semibold'>
                        Data not found
                    </h1>
                </div>
            )
        }

        // GET LISTING VARIANT
        const variantFilter = {
            listingId: getListing._id,
            deletedAt: null,
        }

        if (capacity) variantFilter.capacity = capacity
        if (startingPrice) variantFilter.startingPrice = startingPrice

        const variant = await ListingVariantModel.find(variantFilter).populate('media', 'secure_url').lean()
        const getPrice = await ListingVariantModel.distinct('startingPrice', { listingId: getListing._id })
        const getCapacity = await ListingVariantModel.distinct('capacity', { listingId: getListing._id })
        const review = await reviewModel.countDocuments({ listing: getListing._id })

        return (
            <ListingDetails
                listing={getListing}
                variants={variant}
                startingPrice={getPrice}
                capacity={getCapacity}
                reviewCount={review}
            />
        )
    } catch (error) {
        console.error("Listing Page Error:", error)
        return (
            <div className='flex justify-center items-center py-10 h-75'>
                <h1 className='text-4xl font-semibold text-red-500'>
                    Something went wrong
                </h1>
            </div>
        )
    }
}

export default ListingPage

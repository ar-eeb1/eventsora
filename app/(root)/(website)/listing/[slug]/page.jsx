import React from 'react'
import ListingDetails from './ListingDetails'
import { connectDB } from '@/lib/databaseConnection'
import ListingModel from '@/models/Listing.model'
import ListingVariantModel from '@/models/ListingVariant.model'
import reviewModel from '@/models/Review.model'
import MediaModel from '@/models/Media.model'
import UserModel from '@/models/User.model'
import CityModel from '@/models/City.model'
import LocalityModel from '@/models/Locality.model'

const DEFAULT_OG_IMAGE =
    'https://res.cloudinary.com/dliahmplq/image/upload/v1776787244/Untitled_design_1_qfvqha.png'

function stripForMeta(text) {
    if (!text) return ''
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function getOgImageUrl(secureUrl) {
    if (!secureUrl) return null
    if (secureUrl.includes('/upload/')) {
        return secureUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_jpg/')
    }
    return secureUrl
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const formattedName = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

    const pageUrl = `https://www.eventsora.com/listing/${slug}`

    const fallback = {
        title: formattedName,
        description: `Find ${formattedName} on Eventsora. Book now.`,
        openGraph: {
            title: formattedName,
            description: `Find ${formattedName} on Eventsora. Book now.`,
            url: pageUrl,
            siteName: 'Eventsora',
            type: 'website',
            images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Eventsora' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: formattedName,
            description: `Find ${formattedName} on Eventsora. Book now.`,
            images: [DEFAULT_OG_IMAGE],
        },
    }

    try {
        await connectDB()

        const listing = await ListingModel.findOne({
            deletedAt: null,
            status: 'approved',
            slug,
        })
            .populate('media', 'secure_url')
            .populate('city', 'city')
            .select('name description media city')
            .lean()

        if (!listing) return fallback

        const cityName = listing.city?.city
        const description = stripForMeta(listing.description)
        const metaDescription = description
            ? description.slice(0, 160)
            : `Book ${listing.name}${cityName ? ` in ${cityName}` : ''} on Eventsora.`

        const ogImages = (listing.media || [])
            .slice(0, 3)
            .map(m => getOgImageUrl(m.secure_url))
            .filter(Boolean)
            .map((url, i) => ({
                url,
                width: 1200,
                height: 630,
                alt: i === 0 ? listing.name : `${listing.name} - photo ${i + 1}`,
            }))

        if (ogImages.length === 0) {
            ogImages.push({ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: listing.name })
        }

        return {
            title: listing.name,
            description: metaDescription,
            openGraph: {
                title: listing.name,
                description: metaDescription,
                url: pageUrl,
                siteName: 'Eventsora',
                type: 'website',
                images: ogImages,
            },
            twitter: {
                card: 'summary_large_image',
                title: listing.name,
                description: metaDescription,
                images: ogImages.map(img => img.url),
            },
        }
    } catch (error) {
        console.error('Listing metadata error:', error)
        return fallback
    }
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
                listing={JSON.parse(JSON.stringify(getListing))}
                variants={JSON.parse(JSON.stringify(variant))}
                startingPrice={JSON.parse(JSON.stringify(getPrice))}
                capacity={JSON.parse(JSON.stringify(getCapacity))}
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

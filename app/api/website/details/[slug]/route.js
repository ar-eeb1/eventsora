import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";
import { MediaModel } from "@/models/Media.model";
import reviewModel from "@/models/Review.model";
import UserModel from "@/models/user.Model.js";

export async function GET(request, { params }) {
    try {
        await connectDB()
        const getParams = await params
        const slug = getParams.slug
        const searchParams = request.nextUrl.searchParams
        const capacity = searchParams.get('capacity')
        const startingPrice = searchParams.get('startingPrice')


        const filter = {
            deletedAt: null
        }

        if (!slug) {
            return response(false, 404, 'Listing Not Found')
        }
        filter.slug = slug

        // GET LISTING
        const getListing = await ListingModel.findOne(filter)
            .populate('media', 'secure_url')
            .populate('userId', 'name email profileImage')
            .lean()
        if (!getListing) {
            return response(false, 404, 'Listing Not Found')
        }

        // GET LISTING VARIANT
        const variantFilter = {
            listingId: getListing._id,
            deletedAt: null,
            // status: 'approved'
        }


        if (capacity) {
            variantFilter.capacity = capacity
        }

        if (startingPrice) {
            variantFilter.startingPrice = startingPrice
        }

        const variant = await ListingVariantModel.find(variantFilter).populate('media', 'secure_url').lean()
        // if (!variant) {
        //     return response(false, 404, 'Variant Not Found')
        // }

        const getPrice = await ListingVariantModel.distinct('startingPrice', { listingId: getListing._id })
        const getCapacity = await ListingVariantModel.distinct('capacity', { listingId: getListing._id })

        // REVIEW 
        const review = await reviewModel.countDocuments({ listing: getListing._id })
        const listingData = {
            listing: getListing,
            variant: variant,
            startingPrice: getPrice,
            capacity: getCapacity,
            reviewCount: review
        }

        return response(true, 200, 'Listing Data Found', listingData)

    } catch (error) {
        return catchError(error)
    }
}
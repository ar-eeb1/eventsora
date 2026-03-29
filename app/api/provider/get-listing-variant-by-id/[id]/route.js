import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";
import { isValidObjectId } from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const url = new URL(request.url)

        const listingId = url.searchParams.get('listingId')
        if (!listingId) {
            return response(false, 400, 'Listing ID is required')
        }

        if (!isValidObjectId(listingId)) {
            return response(false, 400, 'Invalid listing ID')
        }

        // Verify the listing exists and belongs to the provider
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const listing = await ListingModel.findOne({
            _id: listingId,
            userId: userObjectId,
            deletedAt: null
        }).lean()

        if (!listing) {
            return response(false, 404, 'Listing not found')
        }

        // Get all variants for this listing
        const variants = await ListingVariantModel.find({
            listingId: listingId,
            deletedAt: null
        })
        .sort({ createdAt: -1 })
        .lean()

        return response(true, 200, 'Listing variants found', variants)
    } catch (error) {
        return catchError(error)
    }
}
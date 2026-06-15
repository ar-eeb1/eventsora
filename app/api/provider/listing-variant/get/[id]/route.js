import mongoose from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 403, 'Invalid object id')
        }

        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        filter.userId = userObjectId;
        filter._id = id;
        const getListingVariant = await ListingVariantModel.findOne(filter).populate('media', '_id secure_url').lean();
        if (!getListingVariant) {
            return response(false, 404, 'Listing variant not found')
        }

        return response(true, 200, 'Listing variant Found', getListingVariant)
    } catch (error) {
        return catchError(error)
    }
}
import mongoose, { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import ListingModel from "@/models/Listing.model";

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
        const getListing = await ListingModel.findOne(filter).populate('media', '_id secure_url').lean();
        if (!getListing) {
            return response(false, 404, 'Listing not found')
        }

        return response(true, 200, 'Listing Found', getListing)
    } catch (error) {
        return catchError(error)
    }
}
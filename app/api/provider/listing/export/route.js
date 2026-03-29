import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ListingModel from "@/models/Listing.model";
import { isValidObjectId } from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const filter = {
            deletedAt: null,
            userId: userObjectId
        }
        const getListing = await ListingModel.find(filter).select('-media -description').sort({ createdAt: -1 }).lean()
        if (!getListing) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getListing)
    } catch (error) {
        return catchError(error)
    }
}
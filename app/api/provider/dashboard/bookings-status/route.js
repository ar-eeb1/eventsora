import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);

        // Find all listings owned by this provider
        const providerListings = await ListingModel.find({ userId: userObjectId }).select('_id').lean();
        const listingIds = providerListings.map(l => l._id);

        const bookingsStatus = await bookingModel.aggregate([
            {
                $match: {
                    'listings.listingId': { $in: listingIds },
                    deletedAt: null
                }
            },
            {
                $group: {
                    _id: '$bookingStatus',
                    count: { $sum: 1 },
                }
            },
            {
                $sort: { count: 1 }
            }
        ])


        return response(true, 200, 'Bookings Count', bookingsStatus)
    } catch (error) {
        return catchError(error);
    }
}

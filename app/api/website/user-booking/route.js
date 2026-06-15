import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";
import ListingVariantModel from "@/models/ListingVariant.model";

export async function GET() {
    try {
        await connectDB()

        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')     
        }

        const userId = auth.userId

        const bookings = await bookingModel.find({ user: userId }).populate('listings.listingId', 'slug').lean();

        return response(true, 200, 'Bookings info fetched', bookings)

    } catch (error) {
        return catchError(error)
    }

}
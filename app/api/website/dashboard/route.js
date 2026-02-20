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

        // get recent bookings
        const recentBookings = await bookingModel.find({ user: userId }).populate('listings.listingId', 'slug').limit(10).lean();

        // get total bookings count
        const totalBookings = await bookingModel.countDocuments({ user: userId })
        if (!totalBookings) {
            return response(false, 404, 'total bookings not found', message)
        }
        return response(true, 200, 'Bookings history fetched', { recentBookings, totalBookings })

    } catch (error) {
        return catchError(error)
    }

}
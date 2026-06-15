import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();
        const bookingsStatus = await bookingModel.aggregate([
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
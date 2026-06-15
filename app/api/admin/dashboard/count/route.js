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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [listing, bookings, todayBookings] = await Promise.all([
            ListingModel.countDocuments({ deletedAt: null }),
            bookingModel.countDocuments({ deletedAt: null }),
            bookingModel.countDocuments({
                deletedAt: null,
                createdAt: { $gte: today }
            })
        ])

        return response(true, 200, 'Dashboard Count', { listing, bookings, todayBookings })
    } catch (error) {
        return catchError(error);
    }
}
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
        const monthlyBookingRevenue = await bookingModel.aggregate([
            {
                $match: {
                    status: { $in: ['pending', 'confirmed', 'paid', 'partially-paid'] }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ])


        return response(true, 200, 'Sales Count', monthlyBookingRevenue)
    } catch (error) {
        return catchError(error);
    }
}
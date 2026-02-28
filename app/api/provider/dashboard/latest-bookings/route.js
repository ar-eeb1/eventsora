import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";

export async function GET() {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const latestBookings = await bookingModel.find({
            providerId: auth.userId,
            deletedAt: null
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()

        return response(true, 200, 'Fetched latest bookings', latestBookings)

    } catch (error) {
        return catchError(error)
    }
}
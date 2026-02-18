import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";


export async function GET(request, { params }) {
    try {
        await connectDB();
        const { bookingid } = await params;

        if (!bookingid) {
            return response(false, 400, "Booking ID is required");
        }

        const booking = await BookingModel.findById(bookingid).populate('listings.listingId', 'slug').lean();

        if (!booking) {
            return response(false, 404, "Booking not found");
        }

        return response(true, 200, "Booking details fetched successfully", booking);

    } catch (error) {
        return catchError(error);
    }
}

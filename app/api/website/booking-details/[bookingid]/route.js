import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";
import mongoose from "mongoose";


export async function GET(request, { params }) {
    try {
        await connectDB();
        const { bookingid } = await params;

        if (!bookingid) {
            return response(false, 400, "Booking ID is required");
        }

        let query = {};
        if (mongoose.Types.ObjectId.isValid(bookingid)) {
            query = { _id: bookingid };
        } else {
            query = { booking_id: bookingid };
        }

        const booking = await BookingModel.findOne(query).populate('listings.listingId', 'slug').lean();

        if (!booking) {
            return response(false, 404, "Booking not found");
        }

        return response(true, 200, "Booking details fetched successfully", booking);

    } catch (error) {
        return catchError(error);
    }
}

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BookingModel from "@/models/Booking.model";
import MediaModel from "@/models/Media.model";
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

        const booking = await BookingModel.findOne(query)
            .populate('listings.listingId', 'slug media')
            .lean();

        if (!booking) {
            return response(false, 404, "Booking not found");
        }

        // Attach first media URL to each listing item for display
        for (const item of booking.listings) {
            const mediaIds = item.listingId?.media || []
            if (mediaIds.length) {
                const firstMedia = await MediaModel.findById(mediaIds[0]).select('secure_url').lean()
                item.mediaUrl = firstMedia?.secure_url || null
            } else {
                item.mediaUrl = null
            }
        }

        return response(true, 200, "Booking details fetched successfully", booking);

    } catch (error) {
        return catchError(error);
    }
}

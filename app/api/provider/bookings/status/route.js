import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { bookingStatus } from "@/lib/utils";
import BookingModel from "@/models/Booking.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();
        const { bookingId, bookingStatus: newBookingStatus } = await request.json();

        if (!bookingId || !newBookingStatus) {
            return response(false, 400, 'Booking ID and booking status are required.');
        }

        if (!bookingStatus.includes(newBookingStatus)) {
            return response(false, 400, 'Invalid status.');
        }

        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            return response(false, 404, 'Booking not found.');
        }

        // Logic: If trying to confirm booking, check if payment is already paid
        if (newBookingStatus === 'confirmed' && booking.paymentStatus !== 'paid') {
            return response(false, 400, 'Cannot confirm booking until payment is paid.');
        }


        booking.bookingStatus = newBookingStatus;
        await booking.save();

        return response(true, 200, 'Booking status updated successfully.');
    } catch (error) {
        return catchError(error);
    }
}

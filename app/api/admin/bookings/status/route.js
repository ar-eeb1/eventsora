import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { paymentStatus } from "@/lib/utils";
import BookingModel from "@/models/Booking.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();
        const { bookingId, status, type } = await request.json();

        if (!bookingId || !status) {
            return response(false, 400, 'Booking ID and status are required.');
        }

        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            return response(false, 404, 'Booking not found.');
        }

        if (!paymentStatus.includes(status)) {
            return response(false, 400, 'Invalid payment status.');
        }

        booking.paymentStatus = status;
        await booking.save();

        return response(true, 200, "Payment status updated successfully.");
    } catch (error) {
        return catchError(error);
    }
}

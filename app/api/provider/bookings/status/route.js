import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { bookingStatus } from "@/lib/utils";
import BookingModel from "@/models/Booking.model";
import CalendarModel from "@/models/Calendar.model";

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

        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const booking = await BookingModel.findOne({ _id: bookingId, providerId: userObjectId });
        if (!booking) {
            return response(false, 404, 'Booking not found or access denied.');
        }

        // Logic: If trying to confirm booking, check if payment is already paid or partially-paid
        if (newBookingStatus === 'confirmed' && !['paid', 'partially-paid'].includes(booking.paymentStatus)) {
            return response(false, 400, 'Cannot confirm booking until payment is received (Full or Partial).');
        }

        booking.bookingStatus = newBookingStatus;
        await booking.save();

        // When confirmed or awaiting-payment, mark all booked dates in the Calendar as 'booked'
        if (['confirmed', 'awaiting-payment'].includes(newBookingStatus)) {
            const calendarUpserts = [];

            for (const item of booking.listings) {
                for (const rawDate of (item.bookingDate || [])) {
                    // Normalize to midnight UTC
                    const date = new Date(rawDate);
                    date.setUTCHours(0, 0, 0, 0);

                    const filter = {
                        listingId: item.listingId,
                        variantId: item.variantId || null,
                        date,
                        deletedAt: null,
                    };

                    const update = {
                        dateStatus: 'booked',
                        listingId: item.listingId,
                        variantId: item.variantId || null,
                        date,
                    };

                    calendarUpserts.push(
                        CalendarModel.findOneAndUpdate(filter, update, {
                            upsert: true,
                            new: true,
                            setDefaultsOnInsert: true,
                        })
                    );
                }
            }

            await Promise.all(calendarUpserts);
        }

        return response(true, 200, 'Booking status updated successfully.');
    } catch (error) {
        return catchError(error);
    }
}


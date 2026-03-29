import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BookingModel from "@/models/Booking.model";
import CalendarModel from "@/models/Calendar.model";
import crypto from 'crypto';
import { isAuthenticated } from "@/lib/authentication";
import ListingModel from "@/models/Listing.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['provider'])
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const payload = await request.json()
        const {
            name, email, phone, eventType, timeSlot, guestCount,
            totalAmount, advance, paymentMethod, bookingStatus, bookingSource, listings
        } = payload

        if (!listings || listings.length === 0) {
            return response(false, 400, 'No valid listings found in your booking.')
        }

        // Verify all listings belong to this provider
        const listingIds = listings.map(l => l.listingId);
        const ownedListingsCount = await ListingModel.countDocuments({
            _id: { $in: listingIds },
            userId: auth.userId
        });

        if (ownedListingsCount !== new Set(listingIds.map(id => id.toString())).size) {
            return response(false, 403, 'One or more listings do not belong to you or do not exist.');
        }

        const booking_id = 'BK-' + crypto.randomBytes(4).toString('hex').toUpperCase();

        const newBooking = await BookingModel.create({
            user: auth.userId, // We can use provider's own user ID or a placeholder if client is not registered
            name,
            email,
            phone,
            eventType,
            timeSlot,
            guestCount,
            advance: Number(advance) || 0,
            receivedAmount: Number(advance) || 0,
            paymentMethod,
            bookingStatus,
            bookingSource: 'manual',
            totalAmount: Number(totalAmount) || 0,
            booking_id,
            providerId: auth.userId,
            listings
        });

        // Sync with Calendar if booking Status is not cancelled
        if (bookingStatus !== 'cancelled') {
            try {
                const calendarPromises = listings.flatMap(item => {
                    if (item.bookingDate && item.bookingDate.length > 0) {
                        return item.bookingDate.map(bDate => {
                            const filter = {
                                listingId: item.listingId,
                                variantId: item.variantId || null,
                                date: new Date(bDate)
                            };
                            return CalendarModel.findOneAndUpdate(
                                filter,
                                { $set: { dateStatus: 'booked' } },
                                { upsert: true, new: true, setDefaultsOnInsert: true }
                            );
                        });
                    }
                    return [];
                });
                await Promise.all(calendarPromises);
            } catch (calendarError) {
                console.error('Calendar sync error:', calendarError);
            }
        }

        return response(true, 201, 'Manual Booking created successfully!', newBooking)

    } catch (error) {
        return catchError(error)
    }
}

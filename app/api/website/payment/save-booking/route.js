import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import z from "zod";
import { getVerifiedBookingData } from "@/lib/bookingVerification";
import BookingModel from "@/models/Booking.model";
import crypto from 'crypto';
import { bookingNotification } from "@/email/bookingNotification";
import { ownerBookingNotification } from "@/email/ownerBookingNotification";
import { sendMail } from "@/lib/sendMail";

export async function POST(request) {
    try {
        await connectDB()

        const payload = await request.json()

        const bookingSchema = zSchema.pick({
            name: true,
            email: true,
            phone: true,
            note: true,
            userId: true,
        }).extend({
            listings: z.array(z.object({
                listingId: z.string().length(24, 'Invalid Listing id format'),
                variantId: z.string().length(24, 'Invalid Variant id format').nullable().optional(),
                quantity: z.number().min(1),
                bookingDate: z.array(z.string()).min(1)
            }))
        })

        const validate = bookingSchema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing Fields', { error: validate.error })
        }
        const { name, email, phone, note, userId, listings: rawListings } = validate.data

        // Server-side verification of listings and price
        const { listings: verifiedListings } = await getVerifiedBookingData(rawListings)

        if (verifiedListings.length === 0) {
            return response(false, 400, 'No valid listings found in your booking.')
        }

        // Group listings by ownerId
        const groupedByProvider = verifiedListings.reduce((groups, item) => {
            const providerId = item.ownerId.toString();
            if (!groups[providerId]) {
                groups[providerId] = [];
            }
            groups[providerId].push(item);
            return groups;
        }, {});

        const createdBookings = [];
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eventsora.com';

        // For each provider group, create a separate booking
        for (const [providerId, providerListings] of Object.entries(groupedByProvider)) {
            const booking_id = 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();

            // Calculate total for this provider's items
            const providerTotalWithQuantities = providerListings.reduce((total, item) => {
                const price = item.variantPrice || item.startingPrice || 0;
                const quantity = item.variantTitle === null ? 1 : (item.quantity || 1);
                return total + (price * quantity);
            }, 0);

            const newBooking = await BookingModel.create({
                user: userId,
                name,
                email,
                phone,
                note,
                totalAmount: providerTotalWithQuantities,
                booking_id,
                providerId: providerId,
                listings: providerListings.map(item => ({
                    listingId: item.listingId,
                    variantId: item.variantId,
                    name: item.name,
                    variantTitle: item.variantTitle,
                    price: item.variantPrice || item.startingPrice,
                    quantity: item.quantity,
                    bookingDate: item.bookingDate,
                    media: item.media,
                    slug: item.slug
                }))
            });

            createdBookings.push(newBooking);

            // Send Email to this Provider
            try {
                // We'll pick the first listing's owner info for the email
                const firstItem = providerListings[0];
                if (firstItem.ownerEmail) {
                    const ownerMailData = {
                        ownerName: firstItem.ownerName || 'Vendor',
                        booking_id: newBooking.booking_id,
                        customerName: name,
                        customerPhone: phone,
                        vendorDashboardUrl: `${baseUrl}/vendor/bookings`,
                        // We can list all items for this provider in this booking
                        listings: providerListings.map(item => ({
                            listingName: item.listingName,
                            variantTitle: item.variantTitle,
                            quantity: item.quantity,
                            bookingDates: item.bookingDate.join(', ')
                        }))
                    }

                    await sendMail(
                        `New Booking Received: ${providerListings.length} item(s)`,
                        firstItem.ownerEmail,
                        ownerBookingNotification(ownerMailData)
                    )
                }
            } catch (emailError) {
                console.error('Provider email error:', emailError);
            }
        }

        // Send Email to Customer (listing all new booking IDs)
        try {
            const bookingIdsStr = createdBookings.map(b => b.booking_id).join(', ');
            // If multiple bookings, we might want to send a combined email or separate ones.
            // For now, let's send one email per booking to the customer as well, or a summarized one.
            // The existing template takes one booking_id. Let's send one email per booking for simplicity and "differently" requirement.

            for (const b of createdBookings) {
                const mailData = {
                    booking_id: b.booking_id,
                    bookingUrl: `${baseUrl}/booking-details/${b._id}`
                }
                await sendMail(`Your booking ${b.booking_id} has been placed successfully`, email, bookingNotification(mailData))
            }
        } catch (error) {
            console.error('Customer email block error:', error)
        }

        return response(true, 201, 'Booking(s) placed successfully!', createdBookings)

    } catch (error) {
        return catchError(error)
    }
}
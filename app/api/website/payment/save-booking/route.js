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
        const { listings: verifiedListings, totalAmount } = await getVerifiedBookingData(rawListings)

        if (verifiedListings.length === 0) {
            return response(false, 400, 'No valid listings found in your booking.')
        }

        const booking_id = 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();

        // Create the booking record
        const newBooking = await BookingModel.create({
            user: userId,
            name,
            email,
            phone,
            note,
            totalAmount,
            booking_id,
            listings: verifiedListings.map(item => ({
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
        })


        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eventsora.com';
            const mailData = {
                booking_id: newBooking.booking_id,
                bookingUrl: `${baseUrl}/booking-details/${newBooking._id}`
            }

            await sendMail('Your booking has been placed successfully', email, bookingNotification(mailData))

            // Send Email to Listing Owners
            for (const item of verifiedListings) {
                if (item.ownerEmail) {
                    const ownerMailData = {
                        ownerName: item.ownerName || 'Vendor',
                        booking_id: newBooking.booking_id,
                        listingName: item.listingName,
                        variantTitle: item.variantTitle,
                        quantity: item.quantity,
                        bookingDates: item.bookingDate.join(', '),
                        customerName: name,
                        customerPhone: phone,
                        vendorDashboardUrl: `${baseUrl}/vendor/bookings`
                    }

                    await sendMail(
                        `New Booking Received: ${item.listingName}`,
                        item.ownerEmail,
                        ownerBookingNotification(ownerMailData)
                    )
                }
            }
        } catch (error) {
            console.error('Email block error:', error)
        }

        return response(true, 201, 'Booking placed successfully!', newBooking)

    } catch (error) {
        return catchError(error)
    }
}
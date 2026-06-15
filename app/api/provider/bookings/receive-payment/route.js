import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BookingModel from "@/models/Booking.model";
import { isAuthenticated } from "@/lib/authentication";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['provider'])
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const payload = await request.json()
        const { bookingId, amount, paymentMethod, note } = payload

        if (!bookingId || !amount) {
            return response(false, 400, 'Missing required fields.')
        }

        const userObjectId = new mongoose.Types.ObjectId(auth.userId);
        const booking = await BookingModel.findOne({ _id: bookingId, providerId: userObjectId })
        if (!booking) {
            return response(false, 404, 'Booking not found or access denied.')
        }

        // Logic to update receivedAmount and potentially paymentStatus
        const newReceivedAmount = (booking.receivedAmount || 0) + Number(amount)
        const totalAmount = booking.totalAmount || 0

        booking.receivedAmount = newReceivedAmount
        
        if (newReceivedAmount >= totalAmount) {
            booking.paymentStatus = 'paid'
        } else if (newReceivedAmount > 0) {
            booking.paymentStatus = 'partially-paid'
        }

        // Optionally store payment history/notes
        if (note) {
            booking.note = booking.note ? `${booking.note}\n[Payment Note]: ${note}` : `[Payment Note]: ${note}`
        }

        await booking.save()

        return response(true, 200, 'Payment received successfully!', booking)

    } catch (error) {
        return catchError(error)
    }
}

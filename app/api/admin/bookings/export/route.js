import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()

        const matchQuery = {
            deletedAt: null,
        }

        const aggregatePipeline = [
            { $match: matchQuery },

            {
                $project: {
                    _id: { $toString: "$_id" },
                    booking_id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    totalAmount: 1,
                    paymentStatus: 1,
                    bookingStatus: 1,
                    createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } }
                }
            },
            { $sort: { createdAt: -1 } }
        ]

        const getBookings = await bookingModel.aggregate(aggregatePipeline)

        if (!getBookings || getBookings.length === 0) {
            return response(false, 404, 'Empty collection')
        }

        return response(true, 200, 'Data Found', getBookings)
    } catch (error) {
        return catchError(error)
    }
}
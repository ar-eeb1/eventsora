import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        await connectDB();
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const [listing, bookings, todayBookings, earningsData, monthlyData, paymentData] = await Promise.all([
            ListingModel.countDocuments({ deletedAt: null, userId: userObjectId }),

            bookingModel.countDocuments({ providerId: userObjectId, deletedAt: null }),

            bookingModel.countDocuments({
                providerId: userObjectId,
                createdAt: { $gte: today },
                deletedAt: null
            }),

            // Total earnings (paid bookings)
            bookingModel.aggregate([
                { $match: { providerId: userObjectId, paymentStatus: 'paid', deletedAt: null } },
                { $group: { _id: null, totalEarnings: { $sum: '$totalAmount' } } }
            ]),

            // Monthly bookings: total + confirmed
            bookingModel.aggregate([
                {
                    $match: {
                        providerId: userObjectId,
                        createdAt: { $gte: monthStart },
                        deletedAt: null
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        confirmed: {
                            $sum: { $cond: [{ $eq: ['$bookingStatus', 'confirmed'] }, 1, 0] }
                        }
                    }
                }
            ]),

            // Payment stats: total advance received + total remaining balance
            bookingModel.aggregate([
                { $match: { providerId: userObjectId, deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        totalAdvance: { $sum: '$advance' },
                        totalReceived: { $sum: '$receivedAmount' },
                        totalCharges: { $sum: '$totalAmount' }
                    }
                }
            ])
        ]);

        const earnings = earningsData[0]?.totalEarnings || 0;
        const monthlyBookings = monthlyData[0]?.total || 0;
        const monthlyConfirmed = monthlyData[0]?.confirmed || 0;
        const totalAdvance = paymentData[0]?.totalAdvance || 0;
        const totalReceived = paymentData[0]?.totalReceived || 0;
        const totalCharges = paymentData[0]?.totalCharges || 0;
        const pendingPayments = totalCharges - totalReceived;

        return response(true, 200, 'Dashboard Count', {
            listing,
            bookings,
            todayBookings,
            earnings,
            monthlyBookings,
            monthlyConfirmed,
            totalAdvance,
            pendingPayments
        });
    } catch (error) {
        return catchError(error);
    }
}


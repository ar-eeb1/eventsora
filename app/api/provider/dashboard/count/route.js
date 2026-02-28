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

        // Find all listings owned by this provider
        const providerListings = await ListingModel.find({ userId: userObjectId }).select('_id').lean();
        const listingIds = providerListings.map(l => l._id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [listing, bookings, todayBookings, earningsData] = await Promise.all([
            ListingModel.countDocuments({ deletedAt: null, userId: auth.userId }),
            bookingModel.countDocuments({ 'listings.listingId': { $in: listingIds }, deletedAt: null }),
            bookingModel.countDocuments({
                'listings.listingId': { $in: listingIds },
                createdAt: { $gte: today },
                deletedAt: null
            }),
            bookingModel.aggregate([
                {
                    $match: {
                        'listings.listingId': { $in: listingIds },
                        paymentStatus: 'paid',
                        deletedAt: null
                    }
                },
                {
                    $addFields: {
                        providerItems: {
                            $filter: {
                                input: "$listings",
                                as: "item",
                                cond: { $in: ["$$item.listingId", listingIds] }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalEarnings: {
                            $sum: {
                                $reduce: {
                                    input: "$providerItems",
                                    initialValue: 0,
                                    in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.quantity"] }] }
                                }
                            }
                        }
                    }
                }
            ])
        ])

        const earnings = earningsData.length > 0 ? earningsData[0].totalEarnings : 0;

        return response(true, 200, 'Dashboard Count', { listing, bookings, todayBookings, earnings })
    } catch (error) {
        return catchError(error);
    }
}
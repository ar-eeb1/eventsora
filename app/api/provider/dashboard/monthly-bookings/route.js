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

        const monthlyBookingRevenue = await bookingModel.aggregate([
            {
                $match: {
                    'listings.listingId': { $in: listingIds },
                    paymentStatus: { $in: ['pending', 'paid', 'partially-paid'] },
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
                $addFields: {
                    providerSubtotal: {
                        $reduce: {
                            input: "$providerItems",
                            initialValue: 0,
                            in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.quantity"] }] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    totalRevenue: { $sum: '$providerSubtotal' }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ])


        return response(true, 200, 'Sales Count', monthlyBookingRevenue)
    } catch (error) {
        return catchError(error);
    }
}

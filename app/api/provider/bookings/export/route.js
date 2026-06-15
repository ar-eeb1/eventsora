import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import bookingModel from "@/models/Booking.model";
import ListingModel from "@/models/Listing.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }

        await connectDB()
        const userObjectId = new mongoose.Types.ObjectId(auth.userId);

        // Find all listings owned by this provider
        const providerListings = await ListingModel.find({ userId: userObjectId }).select('_id').lean();
        const listingIds = providerListings.map(l => l._id);

        const matchQuery = {
            deletedAt: null,
            'listings.listingId': { $in: listingIds }
        }

        const aggregatePipeline = [
            { $match: matchQuery },
            {
                $addFields: {
                    // Filter listings to only include this provider's listings
                    providerListings: {
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
                    // Calculate subtotal for these specific listings
                    subtotal: {
                        $reduce: {
                            input: "$providerListings",
                            initialValue: 0,
                            in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.quantity"] }] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: { $toString: "$_id" },
                    booking_id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    subtotal: 1,
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
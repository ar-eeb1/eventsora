import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import reviewModel from "@/models/Review.model";
import ListingModel from "@/models/Listing.model";
import mongoose from "mongoose";

export async function GET() {
    try {
        const auth = await isAuthenticated('provider')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        await connectDB()

        const providerId = new mongoose.Types.ObjectId(auth.userId);

        const latestReviews = await reviewModel.aggregate([
            {
                $match: { deletedAt: null }
            },
            {
                $lookup: {
                    from: "listings",
                    localField: "listing",
                    foreignField: "_id",
                    as: "listingDetails"
                }
            },
            {
                $unwind: "$listingDetails"
            },
            {
                $match: { "listingDetails.userId": providerId }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    review: 1,
                    title: 1,
                    createdAt: 1,
                    listing: "$listingDetails.name",
                    slug: "$listingDetails.slug",
                    reviewer: "$userDetails.name"
                }
            }
        ]);

        return response(true, 200, 'Reviews Fetched', latestReviews)
    } catch (error) {
        return catchError(error)
    }
}
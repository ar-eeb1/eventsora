import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import reviewModel from "@/models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB()
        const searchParams = request.nextUrl.searchParams

        const listingId = searchParams.get('listingId')
        if (!listingId) {
            return response(false, 400, 'Listing ID is required')
        }

        const page = parseInt(searchParams.get('page')) || 0
        const limit = 2
        const skip = page * limit

        let matchQuery = {
            deletedAt: null,
            listing: new mongoose.Types.ObjectId(listingId)
        }

        // aggregation pipeline to fetch reviews with user details and pagination
        const aggregation = [
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit + 1
            },
            {
                $project: {
                    _id: 1,
                    reviewedBy: '$userData.name',
                    avatar: '$userData.avatar',
                    rating: 1,
                    title: 1,
                    review: 1,
                    createdAt: 1
                }
            }
        ]

        const reviews = await reviewModel.aggregate(aggregation)
        const totalReviews = await reviewModel.countDocuments(matchQuery)

        // CHECK MORE DATA
        let nextpage = null
        if (reviews.length > limit) {
            nextpage = page + 1
            reviews.pop()
        }

        return response(true, 200, 'Review data', { reviews, nextpage, totalReviews })

    } catch (error) {
        return catchError(error)
    }
}
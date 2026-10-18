import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import reviewModel from "@/models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB()
        const searchParams = request.nextUrl.searchParams

        const target = [
            ['listing', searchParams.get('listingId')],
            ['product', searchParams.get('productId')],
        ].filter(([, value]) => value)
        if (target.length !== 1 || !mongoose.isValidObjectId(target[0][1])) return response(false, 400, 'Exactly one valid review target is required')

        const rawPage = searchParams.get('page') || '0'
        const page = Number(rawPage)
        if (!Number.isSafeInteger(page) || page < 0) return response(false, 400, 'Page must be a non-negative integer')
        const limit = 2
        const skip = page * limit

        const matchQuery = {
            deletedAt: null,
            [target[0][0]]: new mongoose.Types.ObjectId(target[0][1])
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
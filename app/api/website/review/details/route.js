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
            return response(false, 404, 'listing is missing')
        }

        const reviews = await reviewModel.aggregate([
            { $match: { listing: new mongoose.Types.ObjectId(listingId), deletedAt: null } },
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ])
        // total reviews
        const totalReview = reviews.reduce((sum, r) => sum + r.count, 0)

        //average rating
        const averageRating = totalReview > 0
            ? (reviews.reduce((sum, r) => sum + r._id * r.count, 0) / totalReview).toFixed(1)
            : 0.0

        const rating = reviews.reduce((acc, r) => {
            acc[r._id] = r.count
            return acc
        },{})

        const percentage = reviews.reduce((acc, r) => {
            acc[r._id] = (r.count / totalReview) * 100
            return acc
        },{})

        return response(true, 200, 'reviews fetched successfully', { totalReview, averageRating, rating, percentage })

    } catch (error) {
        return catchError(error)
    }
}
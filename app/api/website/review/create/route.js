import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import reviewModel from "@/models/Review.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated(['provider', 'user'])
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            listing: true,
            userId: true,
            rating: true,
            title: true,
            review: true,
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing field', validate.error)
        }

        const { listing, userId, rating, title, review } = validate.data


        // const existingReview = await reviewModel.findOne({ listing, user: userId })
        // if (existingReview) {
        //     return response(false, 409, 'You have already reviewed this listing')
        // }

        const newReview = new reviewModel({
            listing: listing,
            user: userId,
            rating: rating,
            title: title,
            review: review
        })

        await newReview.save()

        return response(true, 200, 'Review submitted successfully')

    } catch (error) {
        return catchError(error)
    }
}